import loginImage from "@/assets/login-image.jpg";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "../google/GoogleSignInButton";
import GithubSignInButton from "../github/GithubSignInButton";
import SignInForm from "./SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
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

        <div className="mx-auto mt-6 grid w-[280px] gap-6 sm:w-[350px] md:mt-0 xl:w-[400px]">
          <div className="grid gap-2 text-left">
            <h1 className="mt-4 text-3xl font-bold">Log In</h1>
            <p className="text-muted-foreground">Welcome back !!</p>
          </div>
          <div className="grid gap-4">
            <GoogleSignInButton text="Log in with Google" />

            <GithubSignInButton text="Log in with Github" />

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

            <SignInForm />

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
