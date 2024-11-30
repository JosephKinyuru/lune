import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { RepliesPage, getReplyDataInclude } from "@/lib/types";
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
    
    const replies = await prisma.reply.findMany({
      where: { postId },
      include: getReplyDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor = replies.length > pageSize ? replies[0].id : null;

    const data: RepliesPage = {
      replies: replies.length > pageSize ? replies.slice(1) : replies,
      previousCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
