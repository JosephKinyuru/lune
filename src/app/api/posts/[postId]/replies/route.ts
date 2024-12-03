import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { PostsPage, getPostDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    const posts = await prisma.post.findMany({
      where: { parentId: postId },
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: pageSize + 1, 
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      posts.length > pageSize ? posts[posts.length - 1].id : null;

    const paginatedPosts = posts.length > pageSize ? posts.slice(0, -1) : posts;

    const data: PostsPage = {
      posts: paginatedPosts,
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
