import { Metadata } from "next";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import NotFoundSVG from "@/components/NotFoundSVG";

export const metadata: Metadata = {
  title: "Forgot Password",
};

const generateSecret = (email: string): string => {
  return crypto
    .createHash("sha256")
    .update(email + process.env.SECRET_SALT)
    .digest("hex");
};

export default async function ResetPasswordPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("resetPasswordJWTToken");

  if (!token) {
    return (
      <main className="flex h-screen items-center justify-center bg-white">
        <div className="container mx-auto flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="flex w-full justify-center text-black lg:h-auto lg:w-1/2">
            <NotFoundSVG />
          </div>

          <div className="w-full text-center lg:w-1/2 lg:text-left">
            <h1 className="mb-4 text-6xl font-bold text-red-600">401</h1>
            <h2 className="mb-4 text-3xl text-red-600/60">Not Authorized</h2>
            <p className="mb-8 text-gray-600">
              Looks like you&apos;re not allowed to be on this page.
            </p>
            <Link href="/sign-in">
              <Button
                className="mb-6 w-[30%] bg-red-400 text-black"
                variant={"secondary"}
              >
                Back to sign-in
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  try {
    const decoded = jwt.decode(token.value) as { email: string };
    const secret = generateSecret(decoded.email);
    jwt.verify(token.value, secret);

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

          <div className="mx-auto mt-6 grid w-[280px] gap-6 sm:w-[350px] md:mt-0 xl:w-[400px]">
            <div className="grid gap-2 text-left">
              <h1 className="mt-4 text-3xl font-bold">Reset your password</h1>
              <p className="text-muted-foreground">
                Set a new password to get back into your account.
              </p>
            </div>
            <div className="mb-10 grid gap-4">
              <ResetPasswordForm email={decoded.email} />
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
  } catch (error) {

    return (
      <main className="flex h-screen items-center justify-center bg-white">
        <div className="container mx-auto flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <div className="flex w-full justify-center text-black lg:h-auto lg:w-1/2">
            <NotFoundSVG />
          </div>

          <div className="w-full text-center lg:w-1/2 lg:text-left">
            <h1 className="mb-4 text-6xl font-bold text-red-600">403</h1>
            <h2 className="mb-4 text-3xl text-red-600/60">Invalid Token</h2>
            <p className="mb-8 text-gray-600">
              Something went wrong with your reset request.{" "}
            </p>
            <Link href="/sign-in">
              <Button
                className="mb-6 w-[30%] bg-red-400 text-black"
                variant={"secondary"}
              >
                Back to sign-in
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
