"use server";

import { rateLimitByKey } from "@/lib/limiter";
import prisma from "@/lib/prisma";
import { forgotSchema, ForgotValues } from "@/lib/validation";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { generateOTP, generateRandomToken } from "@/lib/utils";
import { Resend } from "resend";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD);

const TOKEN_LENGTH = 32;
const TOKEN_TTL = 1000 * 60 * 60; // 1 hour

const OTP_LENGTH = 6;
const OTP_TTL = 1000 * 60 * 5; // 5 min

export async function forgotPassword(
  credentials: ForgotValues,
): Promise<{ success?: string; error?: string }> {
  try {
    const { email } = forgotSchema.parse(credentials);

    await rateLimitByKey({ key: email, limit: 3, window: 10000 });

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      return { error: "No account exists with that email" };
    }

    const token = await generateRandomToken(TOKEN_LENGTH);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

    const otp = await generateOTP(OTP_LENGTH);
    const otpExpiresAt = new Date(Date.now() + OTP_TTL);

    await prisma.resetPasswordToken.deleteMany({
      where: { userId: existingUser.id },
    });
    
    await prisma.resetPasswordToken.create({
      data: {
        userId: existingUser.id,
        token: token,
        tokenExpiresAt: tokenExpiresAt,
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Reset Your Password",
      react: ResetPasswordEmail({ otp }),
    });

    return redirect(
      `/sign-in/verify-account?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
    );
    
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
