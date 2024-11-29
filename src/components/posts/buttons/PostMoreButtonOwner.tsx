import { useState } from "react";
import { cn } from "@/lib/utils";
import { PostData } from "@/lib/types";
import { MoreHorizontal, Trash2 } from "lucide-react";
import DeletePostDialog from "../DeletePostDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostMoreButtonProps {
  post: PostData;
  className?: string;
}

export default function PostMoreButton({
  post,
  className,
}: PostMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className={className}>
                  <div className="group relative flex size-8 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
                    <MoreHorizontal
                      className={cn(
                        "size-5 group-hover:text-primary",
                        showDeleteDialog
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              className="rounded-[5px] bg-[#607d8b] text-[#fafafa]"
              side="bottom"
            >
              <p className="text-[0.8rem] font-semibold tracking-tight">More</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent
          sideOffset={0}
          className="w-40 border-gray-800 bg-white dark:border-[#1F1F22] dark:bg-black xl:w-52"
        >
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
