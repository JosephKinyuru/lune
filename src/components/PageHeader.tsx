"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PageHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <>
      <button
        className="h-12 w-12 cursor-pointer hover:bg-accent dark:hover:bg-gray-50/10 rounded-full"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowLeft className="h-6 w-full" />
      </button>
      <h1 className={cn("xs:text-xl text-2xl font-bold", className)}>{title}</h1>
    </>
  );
};

export default PageHeader;
