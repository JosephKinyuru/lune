"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { MdVerified } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProfileHeader = ({
  displayName,
  isVerified,
}: {
  displayName: string;
  isVerified: boolean;
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button
                className="h-12 w-12 cursor-pointer rounded-full hover:bg-accent dark:hover:bg-gray-50/10"
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeft className="h-6 w-full" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="rounded-[5px] bg-[#607d8b] text-[#fafafa]"
              side="bottom"
              sideOffset={0}
            >
              <p className="text-[0.8rem] font-semibold tracking-tight">Back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center">
        <h1 className="text-2xl font-bold">{displayName}</h1>
        {isVerified && (
          <MdVerified
            className="-mb-1 ml-1 h-5 w-5 text-primary"
            aria-label="Verified"
          />
        )}
      </div>
    </>
  );
};

export default ProfileHeader;
