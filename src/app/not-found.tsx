import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NotFoundSVG from "@/components/NotFoundSVG";

export const metadata: Metadata = {
  title: "404",
};

export default async function NotFound({ param }: { param?: string }) {
  return (
    <main className="flex h-screen items-center justify-center bg-white">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        {/* Left Section - Astronaut and Planet SVG */}
        <div className="flex w-full justify-center text-black lg:h-auto lg:w-1/2">
          <NotFoundSVG />
        </div>

        {/* Right Section - Text and Button */}
        <div className="w-full text-center lg:w-1/2 lg:text-left">
          <h1 className="mb-4 text-6xl font-bold text-black">404</h1>
          <h2 className="mb-4 text-3xl text-gray-700">
            UH OH! You&apos;re lost.
          </h2>
          <p className="mb-8 text-gray-600">
            The { param ? `${param}` : "page"} you are looking for does not exist. <br />
            Click the button below to go to back to home.
          </p>
          <Link href="/">
            <Button className="w-[30%]" variant={"secondary"}>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
