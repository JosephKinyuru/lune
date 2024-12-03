import kyInstance from "@/lib/ky";
import { PostsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "../InfiniteScrollContainer";
import Post from "../posts/Post";

interface RepliesProps {
  post: PostData;
}

export default function Replies({ post }: RepliesProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["replies", post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/${post.id}/replies`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const replies = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (status === "success" && !replies.length) {
    return (
      <p className="py-6 text-center text-muted-foreground">No replies yet.</p>
    );
  }

  if (status === "error") {
    return (
      <p className="py-6 text-center text-destructive">
        An error occurred while loading replies.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-0"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {replies.map((reply) => (
        <Post key={reply.id} post={reply} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
