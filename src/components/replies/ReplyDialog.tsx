import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReplyDialogInput from "./ReplyDialogInput";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import UserAvatar from "../UserAvatar";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface ReplyDialogProps {
  post: PostData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReplyDialog = ({ post, open, onOpenChange }: ReplyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-screen w-screen max-w-full flex-col gap-2 bg-card p-4 dark:bg-black md:h-96 md:w-[640px] md:rounded-xl md:dark:border-2 md:dark:border-[#1F1F22] [&>button]:hidden">
        <DialogTitle className="sr-only">
          Replying to post by @{post.author.username}
        </DialogTitle>
        <DialogHeader className="mb-2 flex items-start justify-between max-md:mt-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-accent dark:hover:bg-gray-50/10"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="rounded-[5px] bg-gray-700 p-1 text-white"
                side="bottom"
                sideOffset={0}
              >
                <p className="text-xs font-semibold">Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogHeader>

        <div className="flex flex-col gap-3 p-1">
          <div className="flex gap-3">
            <UserAvatar avatar_url={post.author.avatar_url} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {post.author.displayName}
                </span>
                <span className="text-sm text-gray-400">
                  · {formatRelativeDate(post.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-300">
                {post.content.slice(0, 20)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="ml-[22px] h-16 w-[2px] self-stretch bg-[#1F1F22]" />
            <p className="mt-1 text-sm text-gray-400">
              Replying to{" "}
              <span className="text-primary/80">
                <Link href={`/users/${post.author.username}`}>
                  @{post.author.username}
                </Link>
              </span>
            </p>
          </div>

          <div>
            <ReplyDialogInput className="w-full" post={post} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
