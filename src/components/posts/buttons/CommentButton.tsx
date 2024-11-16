import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostData } from "@/lib/types";
import { MessageCircle } from "lucide-react";

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

export default function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClick}
            className="flex items-center gap-[0.5px] text-muted-foreground hover:text-primary"
          >
            <div className="group relative flex size-8 xl:size-9 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
              <MessageCircle className="z-10 size-5 xl:size-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-sm font-medium tabular-nums">
              {post._count.comments}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="rounded-sm bg-accent-foreground dark:text-black"
          side="bottom"
        >
          <p className="text-[0.8rem] font-semibold tracking-tight">Comment</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
