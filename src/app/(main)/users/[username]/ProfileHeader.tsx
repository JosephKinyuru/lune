"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileHeader = ({ displayName }: { displayName: string }) => {
  const router = useRouter();

  return (
    <>
      <button
        className="h-12 w-12 cursor-pointer rounded-full hover:bg-accent dark:hover:bg-gray-50/10"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowLeft className="h-6 w-full" />
      </button>
      <h1 className="text-xl font-bold">{displayName}</h1>
    </>
  );
};

export default ProfileHeader;
