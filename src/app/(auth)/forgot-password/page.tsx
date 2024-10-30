import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[42rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="mt-20 w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-2 text-center">
            <h1 className="text-center text-3xl font-bold">
              Trouble logging in?
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your email and we&apos;ll send you a link to get back into
              your account.
            </p>
          </div>
          <div className="space-y-4">
            <ForgotPasswordForm />

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                  Or
                </span>
              </div>
            </div>

            <Link href="/sign-up">
              <Button className="w-full" variant={"secondary"}>
                Create an account
              </Button>
            </Link>
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
}
