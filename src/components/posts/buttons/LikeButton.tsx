import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => mutate()}
            className={cn(
              "group flex items-center gap-[0.5px] text-muted-foreground",
              data.isLikedByUser ? "text-red-500" : "hover:text-red-500",
            )}
          >
            <div className="relative flex size-8 items-center justify-center 2xl:size-9">
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
              <Heart
                className={cn(
                  "z-10 size-5 text-muted-foreground group-hover:text-red-500 2xl:size-6",
                  data.isLikedByUser && "fill-red-500 text-red-500",
                )}
              />
            </div>

            {data.likes > 0 && (
              <span className="text-md font-medium tabular-nums">
                {formatNumber(data.likes)}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="rounded-[5px] bg-[#607d8b] text-[#fafafa]"
          side="bottom"
        >
          <p className="text-[0.8rem] font-semibold tracking-tight">Like</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
