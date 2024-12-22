import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { MessageCountInfo } from "@/lib/types";

export async function GET() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const total_unread_count = await prisma.message.count({
      where: {
        chat: {
          participants: {
            some: { id: user.id }, 
          },
        },
        senderId: { not: user.id }, 
        read: false, 
      },
    });

    const data: MessageCountInfo = {
      unreadCount: total_unread_count,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
