import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  return (
    <div className="border-b dark:border-b-[#1F1F22]">
      <div className="group/comment flex gap-3 p-5">
        <span className="inline">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <UserAvatar avatar_url={comment.user.avatar_url} size={40} />
            </Link>
          </UserTooltip>
        </span>
        <div>
          <div className="flex items-center gap-1 text-sm">
            <UserTooltip user={comment.user}>
              <Link
                href={`/users/${comment.user.username}`}
                className="font-medium hover:underline"
              >
                {comment.user.displayName}
              </Link>
            </UserTooltip>
            <span className="text-muted-foreground">
              {formatRelativeDate(comment.createdAt)}
            </span>
          </div>
          <div>{comment.content}</div>
        </div>
        {comment.user.id === user.id && (
          <CommentMoreButton
            comment={comment}
            className="ms-auto"
          />
        )}
      </div>
    </div>
  );
}
