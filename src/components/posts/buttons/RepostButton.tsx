import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { RepostInfo } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Repeat2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RepostButtonProps {
  postId: string;
  initialState: RepostInfo;
}

export default function RepostButton({
  postId,
  initialState,
}: RepostButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["repost-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/repost`).json<RepostInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isRepostedByUser
        ? kyInstance.delete(`/api/posts/${postId}/reposts`)
        : kyInstance.post(`/api/posts/${postId}/reposts`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<RepostInfo>(queryKey);

      queryClient.setQueryData<RepostInfo>(queryKey, () => ({
        reposts:
          (previousState?.reposts || 0) +
          (previousState?.isRepostedByUser ? -1 : 1),
        isReposted: !previousState?.isRepostedByUser,
        isRepostedByUser: !previousState?.isRepostedByUser,
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
              data.isRepostedByUser ? "text-primary" : "hover:text-primary",
            )}
          >
            <div className="relative flex size-8 items-center justify-center 2xl:size-9">
              <div className="absolute inset-0 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-30"></div>
              <Repeat2
                className={cn(
                  "z-10 size-6 text-muted-foreground group-hover:text-primary 2xl:size-7",
                  data.isRepostedByUser && "text-primary",
                )}
              />
            </div>

            {data.reposts > 0 && (
              <span className="text-md font-medium tabular-nums">
                {formatNumber(data.reposts)}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="rounded-[5px] bg-[#607d8b] text-[#fafafa]"
          side="bottom"
        >
          <p className="text-[0.8rem] font-semibold tracking-tight">Repost</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
