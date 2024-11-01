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
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
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
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.repost.upsert({
        where: {
          userId_postId: {
            userId: loggedInUser.id,
            postId,
          },
        },
        create: {
          userId: loggedInUser.id,
          postId,
        },
        update: {},
      }),
      ...(loggedInUser.id !== post.userId
        ? [
            prisma.notification.create({
              data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
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
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        userId: true,
      },
    });

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.repost.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: post.userId,
          postId,
          type: "REPOST",
        },
      }),
    ]);

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
