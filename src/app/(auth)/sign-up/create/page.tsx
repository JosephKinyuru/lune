import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers"; 
import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import CreateAccountForm from "./CreateAccountForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NotFoundSVG from "@/components/NotFoundSVG";
import { Button } from "@/components/ui/button";

const generateSecret = (email: string): string => {
  return crypto
    .createHash("sha256")
    .update(email + process.env.SECRET_SALT)
    .digest("hex");
};

export const metadata: Metadata = {
  title: "Create Account",
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("createAccountJWTToken");

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

  try {
    // Decode the token to extract the email
    const decoded = jwt.decode(token?.value) as { email: string };

    if (!decoded || !decoded.email) {
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

    // Generate the secret using the decoded email
    const secret = generateSecret(decoded.email);

    // Verify the JWT using the generated secret
    jwt.verify(token.value, secret);

    // If token is valid, render the page
    return (
      <main className="w-full md:grid md:min-h-screen md:grid-cols-2 lg:min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-muted md:hidden">
            <Image
              src={signupImage}
              alt="Image"
              className="h-[20vh] w-full object-cover dark:brightness-[0.8]"
              priority={true}
            />
          </div>

          <div className="mx-auto mt-6 grid w-[280px] gap-6 sm:w-[350px] md:mt-0 xl:w-[400px]">
            <div className="space-y-1 text-center">
              <h1 className="text-3xl font-bold">Create your account</h1>
            </div>
            <div className="grid gap-4">
              <CreateAccountForm email={"jjajajaj"} />

              <Link
                href="/sign-up"
                className="block text-center text-primary/80 hover:underline"
              >
                Back to sign up <ArrowRight className="inline h-4 w-5" />
              </Link>

              <div className="mb-4 mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden bg-muted md:block">
          <Image
            src={signupImage}
            alt="Image"
            className="h-screen w-full object-cover dark:brightness-[0.6]"
            priority={true}
          />
        </div>
      </main>
    );
  } catch (error) {
    // If token is invalid or expired, redirect to sign up
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
              Something went wrong with your request.{" "}
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
}
