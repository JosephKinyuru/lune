import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { RepostInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        reposts: {
          where: {
            authorId: loggedInUser.id,
          },
          select: {
            authorId: true,
          },
        },
        _count: {
          select: {
            reposts: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const data: RepostInfo = {
      reposts: post._count.reposts,
      isRepostedByUser: !!post.reposts.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        authorId: true,
        originId: true,
        content: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const existingRepost = await prisma.post.findFirst({
      where: {
        originId: postId,
        authorId: loggedInUser.id,
      },
    });

    if (existingRepost) {
      return Response.json(
        { error: "You have already reposted this post" },
        { status: 400 },
      );
    }

    await prisma.$transaction([
      prisma.post.create({
        data: {
          content: post.content,
          authorId: loggedInUser.id,
          originId: postId,
        },
      }),
      ...(loggedInUser.id !== post.authorId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.authorId,
                postId,
                type: "REPOST",
              },
            }),
          ]
        : []),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        authorId: true,
        originId: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.originId) {
      if (post.authorId !== loggedInUser.id) {
        return Response.json(
          { error: "Unauthorized to delete this repost" },
          { status: 401 },
        );
      }

      await prisma.$transaction([
        prisma.post.deleteMany({
          where: {
            authorId: loggedInUser.id,
            originId: postId,
          },
        }),
        prisma.notification.deleteMany({
          where: {
            issuerId: loggedInUser.id,
            recipientId: post.authorId,
            postId,
            type: "REPOST",
          },
        }),
      ]);
    } else {
      if (post.authorId !== loggedInUser.id) {
        return Response.json(
          { error: "Unauthorized to delete this post" },
          { status: 401 },
        );
      }
    }

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}