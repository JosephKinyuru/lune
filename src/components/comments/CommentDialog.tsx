import { Dialog, DialogContent } from "@/components/ui/dialog";
import CommentDialogInput from "./CommentDialogInput";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import UserAvatar from "../UserAvatar";
import { X } from "lucide-react";

interface CommentDialogProps {
  post: PostData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommentDialog = ({ post, open, onOpenChange }: CommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[600px] max-w-full bg-card p-4 dark:border-2 dark:border-[#1F1F22] dark:bg-black">
        <div className="p-4">
          <div className="flex gap-3">
            <UserAvatar avatar_url={post.user.avatar_url} />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold">{post.user.displayName}</span>
                <span className="text-sm text-muted-foreground">
                  · {formatRelativeDate(post.createdAt)}
                </span>
              </div>
              <p className="mt-1 ">{post.content.slice(0, 20)}</p>
            </div>
          </div>

          <CommentDialogInput className="mt-4" post={post} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
