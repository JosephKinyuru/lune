"use server";

import { isBefore } from "date-fns";
import prisma from "@/lib/prisma"; 
import jwt from "jsonwebtoken"; 
import crypto from "crypto";
import { cookies } from "next/headers";

const generateSecret = (email: string) => {
  return crypto
    .createHash("sha256")
    .update(email + process.env.SECRET_SALT) 
    .digest("hex");
};

export async function verifyEmail({
  otp,
  email,
  token,
}: {
  otp: string;
  email: string;
  token: string;
}) {

  const tokenRecord = await prisma.verifyEmailToken.findFirst({
    where: {
      email: email,
      token: token,
    },
  });

  // Check if the token record exists
  if (!tokenRecord) {
    return { success: false, error: "Invalid token" };
  }

  // Check if the OTP matches
  if (otp !== tokenRecord.otp) {
    return { success: false, error: "Invalid OTP" };
  }

  // Check if the OTP has expired
  const otpExpiresAt = new Date(tokenRecord.otpExpiresAt);
  if (isBefore(new Date(), otpExpiresAt)) {
    return { success: false, error: "OTP has expired" };
  }

  const secret = generateSecret(email);
  const jwtToken = jwt.sign({ email }, secret, { expiresIn: "15m" });

  (await cookies()).set({
    name: "createAccountJWTToken", 
    value: jwtToken, 
    httpOnly: true, 
    maxAge: 20 * 60, 
    path: "/", 
  });


  return { success: "OTP verified successfully!", error: null };
}
