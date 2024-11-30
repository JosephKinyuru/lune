import kyInstance from "@/lib/ky";
import { RepliesPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Reply from "./Reply";

interface RepliesProps {
  post: PostData;
}

export default function Replies({ post }: RepliesProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["replies", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/replies`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<RepliesPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const replies = data?.pages.flatMap((page) => page.replies) || [];

  return (
    <div className="space-y-3">
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous replies
        </Button>
      )}
      {status === "pending" && (
        <div className="flex p-6 items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {status === "success" && !replies.length && (
        <p className="py-6 text-center text-muted-foreground">
          No replies yet.
        </p>
      )}
      {status === "error" && (
        <p className="py-6 text-center text-destructive">
          An error occurred while loading replies.
        </p>
      )}
      <div className="divide-y">
        {replies.map((reply) => (
          <Reply key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
}
