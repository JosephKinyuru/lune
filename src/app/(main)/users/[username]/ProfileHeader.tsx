"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

const ProfileHeader = ({ displayName }: { displayName: string }) => {
  const router = useRouter();

  return (
    <>
      <button
        className="h-6 w-12 cursor-pointer"
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
