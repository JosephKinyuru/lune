"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getReplyDataInclude, PostData } from "@/lib/types";
import { createReplySchema } from "@/lib/validation";

export async function submitReply({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated } = createReplySchema.parse({ content });

  const [newReply] = await prisma.$transaction([
    prisma.reply.create({
      data: {
        content: contentValidated,
        postId: post.id,
        userId: user.id,
      },
      include: getReplyDataInclude(user.id),
    }),
    ...(post.user.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: "REPLY",
            },
          }),
        ]
      : []),
  ]);

  return newReply;
}

export async function deleteReply(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const reply = await prisma.reply.findUnique({
    where: { id },
  });

  if (!reply) throw new Error("Reply not found");

  if (reply.userId !== user.id) throw new Error("Unauthorized");

  const deletedReply = await prisma.reply.delete({
    where: { id },
    include: getReplyDataInclude(user.id),
  });

  return deletedReply;
}
