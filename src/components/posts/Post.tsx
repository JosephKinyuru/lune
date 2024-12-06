"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { formatLongDate, formatRelativeDate, isInteractiveElement } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import { MdVerified } from "react-icons/md";
import ReplyDialog from "../replies/ReplyDialog";
import { useRouter } from "next/navigation";
import {
  BookmarkButton,
  ReplyButton,
  LikeButton,
  LinkButton,
  PostMoreButton,
  PostMoreButtonOwner,
  RepostButton,
} from "./buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MediaPreviews from "../media/MediaPreviews";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const router = useRouter();

  const [showReplyDialog, setShowReplyDialog] = useState(false);

  function handleNavigation(e: React.MouseEvent) {
    const target = e.target as HTMLElement;

    if (isInteractiveElement(target)) {
      return; 
    }

    router.push(`/posts/${post.id}`);
  }

  return (
    <div
      onClick={handleNavigation}
      className="block cursor-pointer focus:border-transparent focus:outline-none focus:ring-0"
    >
      <article className="group/post select-text border-b bg-card p-4 focus-visible:border-gray-200 focus-visible:ring-2 focus-visible:ring-gray-200 dark:border-[#1F1F22] dark:bg-black">
        <div className="flex gap-3">
          <UserTooltip user={post.author}>
            <Link
              href={`/users/${post.author.username}`}
              onClick={(e) => e.stopPropagation()}
            >
              <UserAvatar
                avatar_url={post.author.avatar_url}
                className="h-9 w-9 xxs:h-12 xxs:w-12"
              />
            </Link>
          </UserTooltip>

          <div className="flex-1">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <UserTooltip user={post.author}>
                  <Link
                    href={`/users/${post.author.username}`}
                    className="flex items-center gap-[2px] font-bold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.author.displayName}
                    {post.author.is_Verified && (
                      <MdVerified
                        className="-mb-1 h-4 w-4 text-primary"
                        aria-label="Verified"
                      />
                    )}
                  </Link>
                </UserTooltip>
                <UserTooltip user={post.author}>
                  <span className="text-muted-foreground">
                    @{post.author.username}
                  </span>
                </UserTooltip>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/posts/${post.id}`}
                        className="text-lg text-muted-foreground"
                        suppressHydrationWarning
                        onClick={(e) => e.stopPropagation()}
                      >
                        ·{" "}
                        <span className="text-sm hover:underline">
                          {formatRelativeDate(post.createdAt)}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      className="rounded-[5px] bg-[#607d8b] text-[#fafafa]"
                      side="bottom"
                    >
                      <p className="text-[0.8rem] font-semibold tracking-tight">
                        {formatLongDate(post.createdAt)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>
                {post.author.id === user.id ? (
                  <PostMoreButtonOwner post={post} />
                ) : (
                  <PostMoreButton post={post} />
                )}
              </div>
            </div>

            <Linkify>
              <div className="mt-[1px] whitespace-pre-line text-lg">
                {post.content}
              </div>
            </Linkify>

            {!!post.attachments.length && (
              <div className="mt-3">
                <MediaPreviews attachments={post.attachments} />
              </div>
            )}

            <div
              className="mt-2 flex justify-between gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="-ml-2 flex gap-5 xl:gap-8">
                <LikeButton
                  postId={post.id}
                  initialState={{
                    likes: post._count.likes,
                    isLikedByUser: post.likes.some(
                      (like) => like.userId === user.id,
                    ),
                  }}
                />
                <ReplyButton
                  postId={post.id}
                  initialState={{ replies: post._count.replies }}
                  onClick={() => setShowReplyDialog(true)}
                />
                <ReplyDialog
                  post={post}
                  open={showReplyDialog}
                  onOpenChange={setShowReplyDialog}
                />
                <RepostButton
                  postId={post.id}
                  initialState={{
                    reposts: post._count.reposts,
                    isRepostedByUser: post.reposts.some(
                      (repost) => repost.authorId === user.id,
                    ),
                  }}
                />
              </div>

              <div className="flex gap-5">
                <LinkButton
                  link={`${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.id}`}
                />
                <BookmarkButton
                  postId={post.id}
                  initialState={{
                    isBookmarkedByUser: post.bookmarks.some(
                      (bookmark) => bookmark.userId === user.id,
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
