import PostEditorModal from "@/components/posts/editor/PostEditor-Modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostDialog = ({ open, onOpenChange }: PostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-screen w-screen max-w-full flex-col gap-1 bg-card p-4 dark:bg-black md:h-auto md:min-h-64 md:w-[640px] md:rounded-xl md:dark:border-2 md:dark:border-[#1F1F22] [&>button]:hidden">
        <DialogTitle className="sr-only">
          What&apos;s happening? (Create your latest post)
        </DialogTitle>
        <DialogHeader className="mb-2 flex items-start justify-between">
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
        <div className="h-full overflow-y-auto py-6 md:px-0">
          <PostEditorModal className="h-full max-w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
