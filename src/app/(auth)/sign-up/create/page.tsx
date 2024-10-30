import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers"; 
import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import CreateAccountForm from "./CreateAccountForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

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
    // Use `redirect` for server-side navigation
    redirect("/sign-up");
  }

  try {
    // Decode the token to extract the email
    const decoded = jwt.decode(token?.value) as { email: string };

    if (!decoded || !decoded.email) {
      redirect("/sign-up");
    }

    // Generate the secret using the decoded email
    const secret = generateSecret(decoded.email);

    // Verify the JWT using the generated secret
    jwt.verify(token.value, secret);

    // If token is valid, render the page
    return (
      <main className="flex h-screen items-center justify-center p-5 sm:p-0">
        <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
          <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
            <div className="space-y-1 text-center">
              <h1 className="text-3xl font-bold">Create your account</h1>
            </div>
            <div className="space-y-12">
              <CreateAccountForm email={decoded.email} />

              <Link
                href="/sign-up"
                className="block text-center text-primary/80 hover:underline"
              >
                Back to sign up <ArrowRight className="inline h-4 w-5" />
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
  } catch (error) {
    // If token is invalid or expired, redirect to sign up
    redirect("/sign-up");
  }
}
