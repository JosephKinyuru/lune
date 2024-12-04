"use client";

import { Banner } from "@/components";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";

interface UsersLikesProps {
  userId: string;
}

export default function UserLikes({ userId }: UsersLikesProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-liked-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/liked-posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return (
      <div className="mx-2">
        <PostsLoadingSkeleton />
      </div>
    );
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="mt-8 text-center text-muted-foreground">
        You haven&apos;t liked anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="mt-8 text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-0"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <Banner
        info={"Your likes are private. Only you can see them."}
        icon={<Lock className="h-5 w-5" />}
      />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
