"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link as HLink } from "lucide-react";

interface LinkButtonProps {
  link: string;
}

export default function LinkButton({ link }: LinkButtonProps) {
  const [buttonText, setButtonText] = useState("Copy Link");

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(link);
        setButtonText("Link copied!");
        setTimeout(() => setButtonText("Copy Link"), 2500);
      }}
      className="flex items-center gap-[6px] hover:text-primary"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="group relative flex size-8 items-center justify-center 2xl:size-9">
              <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
              <HLink className="z-10 size-5 text-muted-foreground group-hover:text-primary 2xl:size-6" />
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="rounded-sm bg-accent-foreground dark:text-black"
            side="bottom"
          >
            <p className="text-[0.8rem] font-semibold tracking-tight">
              {buttonText}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </button>
  );
}
