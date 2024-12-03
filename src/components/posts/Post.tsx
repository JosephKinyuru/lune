"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { formatLongDate, formatRelativeDate } from "@/lib/utils";
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

  return (
    <div
      onClick={() => router.push(`/posts/${post.id}`)}
      className="block cursor-pointer"
    >
      <article className="group/post select-text border-b border-t bg-card p-4 dark:border-[#1F1F22] dark:bg-black">
        <div className="flex gap-3">
          <UserTooltip user={post.user}>
            <Link
              href={`/users/${post.user.username}`}
              onClick={(e) => e.stopPropagation()}
            >
              <UserAvatar
                avatar_url={post.user.avatar_url}
                className="h-9 w-9 xxs:h-12 xxs:w-12"
              />
            </Link>
          </UserTooltip>

          <div className="flex-1">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <UserTooltip user={post.user}>
                  <Link
                    href={`/users/${post.user.username}`}
                    className="font-bold hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.user.displayName}
                  </Link>
                </UserTooltip>
                {post.user.is_Verified && (
                  <MdVerified className="h-4 w-4 text-primary" />
                )}
                <UserTooltip user={post.user}>
                  <span className="text-muted-foreground">
                    @{post.user.username}
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
                {post.user.id === user.id ? (
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
                  replies_Count={post._count.children}
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
                      (repost) => repost.userId === user.id,
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