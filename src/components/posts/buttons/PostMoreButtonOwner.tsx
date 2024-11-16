import { PostData } from "@/lib/types";
import { MoreHorizontal, Trash2, Flag } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import DeletePostDialog from "../DeletePostDialog";
import { cn } from "@/lib/utils";

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
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className={className}>
            <div className="group relative flex size-8 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
              <MoreHorizontal
                className={cn(
                  "size-5 group-hover:text-primary",
                  showDeleteDialog ? "text-primary" : "text-muted-foreground",
                )}
              />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={0}
          className="w-40 border-black bg-white dark:border-gray-50 dark:bg-black xl:w-52"
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
