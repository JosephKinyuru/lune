import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import VerifyAccountForm from "./VerifyAccountForm";
import { isAfter } from "date-fns";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { token?: string; email?: string };
}) {
  const token = searchParams.token;
  const email = searchParams.email;

  if (!token || !email) {
    redirect("/forgot-password");
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    redirect("/sign-up");
    return;
  }

  const tokenRecord = await prisma.resetPasswordToken.findFirst({
    where: {
      token: String(token),
      userId: existingUser!.id,
    },
  });

  console.log("TokenRecccorrd:",tokenRecord)

  if (
    !tokenRecord ||
    isAfter(new Date(), new Date(tokenRecord.tokenExpiresAt))
  ) {
    redirect("/forgot-password");
    return;
  }

  return (
    <main className="flex h-screen items-center justify-center p-5 sm:p-0">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="mt-16 w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">We sent you a code</h1>
            <div className="mt-6">
              <p className="text-muted-foreground">
                Enter it below to reset password
              </p>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
          <div className="mt-16 space-y-28">
            <VerifyAccountForm token={token} email={email} />

            <Link
              href="/forgot-password"
              className="block text-center text-primary/80 hover:underline"
            >
              Didn&apos;t receive email ?
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
