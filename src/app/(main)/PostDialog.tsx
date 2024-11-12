import PostEditor from "@/components/posts/editor/PostEditor";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostDialog = ({ open, onOpenChange }: PostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[600px] max-w-full bg-card p-4 dark:border-2 dark:border-[#1F1F22] dark:bg-black">
        <div className="p-4">
          <PostEditor />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
