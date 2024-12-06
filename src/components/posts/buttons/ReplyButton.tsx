import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { useQuery, useQueryClient, QueryKey } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface ReplyButtonProps {
  postId: string;
  initialState: { replies: number };
  onClick: () => void;
}

export default function ReplyButton({ postId, initialState, onClick }: ReplyButtonProps) {
  const queryKey: QueryKey = ["reply-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance
        .get(`/api/posts/${postId}/replies/count`)
        .json<{ replies: number }>(),
    staleTime: Infinity,
    initialData: initialState,
  });

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
            {data.replies > 0 && (
              <span className="text-md font-medium tabular-nums">
                {formatNumber(data.replies)}
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
