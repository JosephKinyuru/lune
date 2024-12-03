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

  const mutation = useMutation({
    mutationFn: submitReply,
    onSuccess: async (newReply) => {
      const queryKey: QueryKey = ["replies", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<PostsPage>>(queryKey, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
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
      });

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Reply created successfully",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit reply. Please try again.",
      });
    },
  });

  return mutation;
}
