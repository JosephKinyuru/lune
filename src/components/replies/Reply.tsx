import { useSession } from "@/app/(main)/SessionProvider";
import { ReplyData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import ReplyMoreButton from "./ReplyMoreButton";

interface ReplyProps {
  reply: ReplyData;
}

export default function Reply({ reply }: ReplyProps) {
  const { user } = useSession();

  return (
    <div className="border-b dark:border-b-[#1F1F22]">
      <div className="group/reply flex gap-3 p-5">
        <span className="inline">
          <UserTooltip user={reply.user}>
            <Link href={`/users/${reply.user.username}`}>
              <UserAvatar avatar_url={reply.user.avatar_url} size={40} />
            </Link>
          </UserTooltip>
        </span>
        <div>
          <div className="flex items-center gap-1 text-sm">
            <UserTooltip user={reply.user}>
              <Link
                href={`/users/${reply.user.username}`}
                className="font-medium hover:underline"
              >
                {reply.user.displayName}
              </Link>
            </UserTooltip>
            <span className="text-muted-foreground">
              {formatRelativeDate(reply.createdAt)}
            </span>
          </div>
          <div>{reply.content}</div>
        </div>
        {reply.user.id === user.id && (
          <ReplyMoreButton
            reply={reply}
            className="ms-auto"
          />
        )}
      </div>
    </div>
  );
}
