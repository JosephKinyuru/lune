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
      <div>
        <h1 className="align-middle text-2xl font-bold">{displayName}</h1>
        {/* {data?.verified && ( */}
        <MdVerified className="ml-1 inline-block h-8 w-8 align-middle text-primary" />
        {/* )} */}
      </div>
    </>
  );
};

export default ProfileHeader;
