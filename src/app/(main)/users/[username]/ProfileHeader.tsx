"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { MdVerified } from "react-icons/md";

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
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        {/* {data?.verified && ( */}
        <MdVerified className="ml-1 h-6 w-6 text-primary" />
        {/* )} */}
      </div>
    </>
  );
};

export default ProfileHeader;
