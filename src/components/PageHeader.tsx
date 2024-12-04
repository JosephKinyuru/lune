"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

      <h1 className={cn("text-2xl font-bold xs:text-xl", className)}>
        {title}
      </h1>
    </>
  );
};

export default PageHeader;
