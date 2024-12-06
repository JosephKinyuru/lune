import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    const count = await prisma.post.count({
      where: { parentId: postId },
    });

    return Response.json({ replies: count });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
