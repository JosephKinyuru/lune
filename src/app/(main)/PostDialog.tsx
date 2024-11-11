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
      <DialogContent className="w-[60%] h-68 bg-card dark:bg-black py-12">
        <PostEditor className="w-full h-full"/>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
