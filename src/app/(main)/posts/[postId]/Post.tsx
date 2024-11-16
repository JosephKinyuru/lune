"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import { MdVerified } from "react-icons/md";
import CommentDialog from "@/components/comments/CommentDialog";
import Comments from "@/components/comments/Comments";
import {
  BookmarkButton,
  CommentButton,
  LikeButton,
  LinkButton,
  PostMoreButton,
  PostMoreButtonOwner,
  RepostButton,
} from "@/components/posts/buttons";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  const [showCommentDialog, setShowCommentDialog] = useState(false);

  return (
    <>
      <article className="group/post space-y-3 border-b border-t bg-card p-5 dark:border-b-[#1F1F22] dark:border-t-[#1F1F22] dark:bg-black">
        <div className="flex justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <UserTooltip user={post.user}>
              <Link href={`/users/${post.user.username}`}>
                <UserAvatar avatar_url={post.user.avatar_url} />
              </Link>
            </UserTooltip>
            <div>
              <UserTooltip user={post.user}>
                <Link
                  href={`/users/${post.user.username}`}
                  className="block font-medium hover:underline"
                >
                  {post.user.displayName}
                  {/* {data?.verified && ( */}
                  <MdVerified className="ml-1 inline-block h-4 w-4 align-middle text-primary" />
                  {/* )} */}
                </Link>
              </UserTooltip>
              <p
                className="block text-sm text-muted-foreground hover:underline"
                suppressHydrationWarning
              >
                {formatRelativeDate(post.createdAt)}
              </p>
            </div>
          </div>

          {post.user.id === user.id ? (
            <PostMoreButtonOwner post={post} className="" />
          ) : (
            <PostMoreButton post={post} className="" />
          )}
          
        </div>
        <Linkify>
          <div className="select-text whitespace-pre-line break-words">
            {post.content}
          </div>
        </Linkify>
        {!!post.attachments.length && (
          <MediaPreviews attachments={post.attachments} />
        )}
        <hr className="text-muted-foreground" />
        <div className="flex justify-between gap-5">
          <div className="flex items-center gap-5">
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post._count.likes,
                isLikedByUser: post.likes.some(
                  (like) => like.userId === user.id,
                ),
              }}
            />

            <CommentButton
              post={post}
              onClick={() => setShowCommentDialog(true)}
            />
            <CommentDialog
              post={post}
              open={showCommentDialog}
              onOpenChange={setShowCommentDialog}
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
          <div className="flex items-center gap-5">
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
        <Comments post={post} />
      </article>
      {/* <div className="p-5">
        <Comments post={post} />
      </div> */}
    </>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}