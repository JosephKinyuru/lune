import loginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import VerifyAccountForm from "./VerifyAccountForm";
import { isAfter } from "date-fns";
import NotFoundSVG from "@/components/NotFoundSVG";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {

  const token = (await searchParams).token;
  const email = (await searchParams).email;

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

  if (!tokenRecord) {
    redirect("/forgot-password");
    return;
  }

  if (isAfter(new Date(), new Date(tokenRecord.tokenExpiresAt))) {
    return (
      <main className="flex h-screen items-center justify-center bg-white">
        <div className="container mx-auto flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="flex w-full justify-center text-black lg:h-auto lg:w-1/2">
            <NotFoundSVG />
          </div>

          <div className="w-full text-center lg:w-1/2 lg:text-left">
            <h1 className="mb-4 text-6xl font-bold text-red-600">403</h1>
            <h2 className="mb-4 text-3xl text-red-600/60">Expired Token</h2>
            <p className="mb-8 text-gray-600">
              Something went wrong with your reset request.{" "}
            </p>
            <Link href="/sign-up">
              <Button
                className="mb-6 w-[30%] bg-red-400 text-black"
                variant={"secondary"}
              >
                Back to sign-up
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full md:grid md:min-h-screen md:grid-cols-2 lg:min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full bg-muted md:hidden">
          <Image
            src={loginImage}
            alt="Image"
            className="h-[20vh] w-full object-cover dark:brightness-[0.8]"
            priority={true}
          />
        </div>

        <div className="mx-auto mt-6 grid w-[280px] gap-6 sm:w-[340px] md:mt-0 xl:w-[400px]">
          <div className="grid gap-1 text-center">
            <h1 className="text-3xl font-bold xl:text-4xl">
              We sent you a code
            </h1>
            <div className="mt-6">
              <p className="text-muted-foreground xl:text-lg">
                Enter it below to reset password for
              </p>
              <p className="text-muted-foreground xl:text-lg">{email}</p>
            </div>
          </div>
          <div className="mb-10 grid gap-4">
            <VerifyAccountForm token={token} email={email} />
            <Link
              href="/forgot-password"
              className="mt-12 block text-center text-primary/80 hover:underline"
            >
              Didn&apos;t receive email ?
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden bg-muted md:block">
        <Image
          src={loginImage}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.6]"
          priority={true}
        />
      </div>
    </main>
  );
}
