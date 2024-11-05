import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";
import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function Page() {
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

        <div className="mx-auto mt-6 grid w-[280px] gap-10 sm:w-[350px] md:mt-0 xl:w-[400px]">
          <div className="grid gap-2 text-center">
            <h1 className="mt-4 text-3xl font-bold lg:text-4xl">
              Trouble logging in?
            </h1>
            <p className="text-muted-foreground lg:text-lg">
              Enter your email and we&apos;ll send you a link to get back into
              your account.
            </p>
          </div>
          <div className="grid gap-4">
            <ForgotPasswordForm />

            <div className="mb-4 mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary underline">
                Sign Up
              </Link>
            </div>
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
