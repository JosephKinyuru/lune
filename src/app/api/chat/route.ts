import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ participantId: string }>;
  },
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { participantId } = await params;

    const existingChat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            id: {
              in: [user.id, participantId],
            },
          },
        },
      },
    });

    if (existingChat) {
      return Response.json(existingChat, { status: 200 });
    }

    const newChat = await prisma.chat.create({
      data: {
        participants: {
          connect: [{ id: user.id }, { id: participantId }],
        },
      },
    });

    return Response.json(newChat, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingChatParticipantIds = await prisma.chat.findMany({
      where: {
        participants: {
          some: { id: user.id },
        },
      },
      select: {
        participants: {
          select: { id: true },
        },
      },
    });

    const excludedUserIds = [
      ...new Set(
        existingChatParticipantIds.flatMap((chat) =>
          chat.participants.map((p) => p.id),
        ),
      ),
      user.id,
    ];

    const availableUsers = await prisma.user.findMany({
      where: {
        id: {
          notIn: excludedUserIds,
        },
      },
      select: {
        id: true,
        username: true,
        avatar_url: true,
      },
    });

    return Response.json(availableUsers, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

