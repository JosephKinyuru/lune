import { Metadata } from "next";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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
      <main className="flex h-screen items-center justify-center p-5 sm:p-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Not Authorized</h1>
          <p className="text-xl text-red-400">
            Looks like you&apos;re not allowed to be on this page.
          </p>
          <Button asChild className="mt-6">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </div>
      </main>
    );
  }

  try {
    const decoded = jwt.decode(token.value) as { email: string };
    const secret = generateSecret(decoded.email);
    jwt.verify(token.value, secret);

    return (
      <main className="flex h-screen items-center justify-center p-5 sm:p-0">
        <div className="flex h-full max-h-[42rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="mt-20 w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
            <div className="space-y-2 text-center">
              <h1 className="text-center text-3xl font-bold">
                Reset your password
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Set a new password to get back into your account.
              </p>
            </div>
            <div className="space-y-4">
              <ResetPasswordForm email={decoded.email} />
            </div>
          </div>
          <Image
            src={loginImage}
            alt=""
            className="hidden w-1/2 object-cover md:block"
          />
        </div>
      </main>
    );
  } catch (error) {

    return (
      <main className="flex h-screen items-center justify-center p-5 sm:p-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Invalid Token</h1>
          <p className="text-xl text-red-400">
            Something went wrong with your reset request.
          </p>
          <Button asChild className="mt-6">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </div>
      </main>
    );
  }
}
