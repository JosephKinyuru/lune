import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "../google/GoogleSignInButton";
import GithubSignInButton from "../github/GithubSignInButton";
import SignUpForm from "./ConfirmEmailForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5 sm:p-0">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="mt-12 w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Begin your journey on lune</h1>
            <p className="text-muted-foreground">
              The shift begins <span className="italic">here</span>.
            </p>
          </div>
          <div className="space-y-4">
            <GoogleSignInButton text="Sign up with Google" />

            <GithubSignInButton text="Sign up with Github" />

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-100 px-2 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                  Or sign up with your email
                </span>
              </div>
            </div>

            <SignUpForm />

            <Link
              href="/sign-in"
              className="mt-3 block text-center hover:underline"
            >
              Already have an account?{" "}
              <span className="text-primary/80">Log in</span>
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
