"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostData } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitReply({
  post,
  content,
  mediaIds,
}: {
  post: PostData;
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated, mediaIds: mediaIdsValidated } =
    createPostSchema.parse({
      content,
      mediaIds,
    });

  const [newReply] = await prisma.$transaction([
    prisma.post.create({
      data: {
        content: contentValidated,
        parentId: post.id,
        authorId: user.id,
        attachments: {
          connect: mediaIdsValidated.map((id) => ({ id })),
        },
      },
      include: getPostDataInclude(user.id),
    }),
    ...(post.author.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.author.id,
              postId: post.id,
              type: "REPLY",
            },
          }),
        ]
      : []),
  ]);

  return newReply;
}