"use server";

import { rateLimitByIp } from "@/lib/limiter";
import prisma from "@/lib/prisma";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";

export async function resetPassword(
  credentials: ResetPasswordValues,
): Promise<{ success?: string; message?: string }> {
  try {
    const { password, email } = resetPasswordSchema.parse(credentials);

    await rateLimitByIp({ key: "change-password", limit: 2, window: 30000 });

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.user.update({
      where: { email: email },
      data: {
        passwordHash,
      },
    });

    return { success: "Password has been successfully reset" };
  } catch (error) {
    console.error(error);
    return { message: "Something went wrong. Please try again." };
  }
}
