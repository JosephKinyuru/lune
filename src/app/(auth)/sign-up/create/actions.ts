"use server";

import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { rateLimitByKey } from "@/lib/limiter";
import { generateUniqueUsername } from "@/lib/utils";
import { lucia } from "@/auth";
import { cookies } from "next/headers";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { email, password, full_name, date_of_birth } =
      signUpSchema.parse(credentials);

    await rateLimitByKey({ key: email, limit: 1, window: 30000 });

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = crypto.randomUUID();

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email is already in use.",
      };
    }

    const username = await generateUniqueUsername(full_name);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: full_name,
          email,
          dateOfBirth: date_of_birth,
          passwordHash,
        },
      });
    });

   const session = await lucia.createSession(userId, {});
   const sessionCookie = lucia.createSessionCookie(session.id);
   (await cookies()).set(
     sessionCookie.name,
     sessionCookie.value,
     sessionCookie.attributes,
   );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
