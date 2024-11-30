import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface ReplyButtonProps {
  post: PostData;
  onClick: () => void;
}

export default function ReplyButton({ post, onClick }: ReplyButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClick}
            className="group flex items-center gap-[0.5px] text-muted-foreground hover:text-primary"
          >
            <div className="relative flex size-8 items-center justify-center 2xl:size-9">
              <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
              <MessageCircle className="z-10 size-5 text-muted-foreground group-hover:text-primary 2xl:size-6" />
            </div>
            {post._count.replies > 0 && (
              <span className="text-md font-medium tabular-nums">
                {formatNumber(post._count.replies)}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="rounded-[5px] bg-[#607d8b] text-[#fafafa]"
          side="bottom"
        >
          <p className="text-[0.8rem] font-semibold tracking-tight">Reply</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
