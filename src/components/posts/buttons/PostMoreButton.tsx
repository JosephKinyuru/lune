import { PostData } from "@/lib/types";
import { MoreHorizontal, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostMoreButtonProps {
  post: PostData;
  className?: string;
}

export default function PostMoreButton({
  post,
  className,
}: PostMoreButtonProps) {

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className={className}>
            <div className="group relative flex size-8 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
              <MoreHorizontal
                className={cn(
                  "size-5 text-muted-foreground group-hover:text-primary",
                )}
              />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={0}
          className="w-40 border-gray-800 bg-white dark:border-[#1F1F22] dark:bg-black xl:w-52"
        >
          <DropdownMenuItem onClick={() => {}}>
            <span className="flex items-center gap-3 text-destructive">
              <Flag className="size-4" />
              Report Post
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
