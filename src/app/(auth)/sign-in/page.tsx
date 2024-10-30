import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleSignInButton from "../google/GoogleSignInButton";
import GithubSignInButton from "../github/GithubSignInButton";
import LoginForm from "./SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5 sm:p-0">
      <div className="flex h-full max-h-[42rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-2 text-center">
            <h1 className="text-center text-3xl font-bold">Welcome back !</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to your account using one of the options below.
            </p>
          </div>
          <div className="space-y-4">
            <GoogleSignInButton text="Sign in with Google" />

            <GithubSignInButton text="Sign in with Github" />

            <LoginForm />

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
