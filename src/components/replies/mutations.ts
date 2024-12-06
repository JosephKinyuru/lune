import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitReply } from "./actions";
import { useToast } from "@/hooks/use-toast";

export function useSubmitReplyMutation(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReply,
    onSuccess: (newReply) => {
      const repliesKey: QueryKey = ["replies", postId];
      const replyInfoKey: QueryKey = ["reply-info", postId];

      if (queryClient.isFetching({ queryKey: repliesKey })) {
        queryClient.cancelQueries({ queryKey: repliesKey });
      }
      queryClient.setQueryData<InfiniteData<PostsPage>>(
        repliesKey,
        (oldData) => {
          if (!oldData) return;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  posts: [...page.posts, newReply],
                };
              }
              return page;
            }),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: replyInfoKey });

      toast({
        description: "Reply created successfully",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit reply. Please try again.",
      });
    },
  });
}
