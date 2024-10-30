"use server";

import { VerifyEmail } from "@/emails/verify-email";
import prisma from "@/lib/prisma";
import { generateOTP, generateRandomToken } from "@/lib/utils";
import {
  confirmEmailSchema,
  ConfirmEmailValues,
 
} from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD);

const TOKEN_LENGTH = 32;
const TOKEN_TTL = 1000 * 60 * 60; // 1 hour

const OTP_LENGTH = 6;
const OTP_TTL = 1000 * 60 * 5; // 5 min

export async function confirmEmail(
  credentials: ConfirmEmailValues,
): Promise<{ error: string }> {
  try {
    const { email } = confirmEmailSchema.parse(credentials);

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
        error: "Email already in use.",
      };
    }

    const token = await generateRandomToken(TOKEN_LENGTH);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

    const otp = await generateOTP(OTP_LENGTH);
    const otpExpiresAt = new Date(Date.now() + OTP_TTL);

    await prisma.verifyEmailToken.create({
      data: {
        email: email,
        token: token,
        tokenExpiresAt: tokenExpiresAt,
        otp: otp,
        otpExpiresAt: otpExpiresAt,
      },
    });

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verify Your Email",
      react: VerifyEmail({ otp }),
    });

    return redirect(
      `/sign-up/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
    );
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
