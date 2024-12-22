import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getMessageDataSelect, MessagesPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ chatId: string }>;
  },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: getMessageDataSelect(user.id),
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      messages.length > pageSize ? messages[messages.length - 1].id : null;

    const paginatedMessages = messages.length > pageSize ? messages.slice(0, -1) : messages;

    const data: MessagesPage = {
      messages: paginatedMessages,
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
