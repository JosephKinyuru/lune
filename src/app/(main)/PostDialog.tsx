import PostEditor from "@/components/posts/editor/PostEditor";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostDialog = ({ open, onOpenChange }: PostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-full w-screen bg-card dark:border-2 dark:border-[#1F1F22] dark:bg-black sm:h-60 sm:w-[740px] md:overflow-auto">
        <DialogTitle className="sr-only">Post Editor</DialogTitle>
        <div className="h-full overflow-y-auto">
          <PostEditor className="h-full max-w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
