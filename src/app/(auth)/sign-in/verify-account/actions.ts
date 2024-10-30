"use server";

import { isAfter, isBefore } from "date-fns";
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

export async function verifyAccount({
  otp,
  token,
  email,
}: {
  otp: string;
  token: string;
  email: string;
}) {
  const tokenRecord = await prisma.resetPasswordToken.findFirst({
    where: {
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
  if (isAfter(new Date(), new Date(tokenRecord.otpExpiresAt))) {
    return { success: false, error: "OTP has expired" };
  }

  const secret = generateSecret(email);
  const jwtToken = jwt.sign({ email }, secret, { expiresIn: "15m" });

  (await cookies()).set({
    name: "resetPasswordJWTToken", 
    value: jwtToken, 
    httpOnly: true, 
    maxAge: 20 * 60, 
    path: "/", 
  });


  return { success: "OTP verified successfully!", error: null };
}
