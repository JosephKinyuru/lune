"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
import FollowButton from "./FollowButton";
import FollowerCount from "./FollowerCount";
import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import { formatNumber } from "@/lib/utils";
import { MdVerified } from "react-icons/md";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="w-72 rounded-2xl bg-card p-4 text-black shadow-xl dark:border-2 dark:border-[#1F1F22] dark:bg-black dark:text-white">
          <div className="flex max-w-xs flex-col gap-3 break-words">
            <div className="flex items-center justify-between gap-4">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={56} avatar_url={user.avatar_url} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>

            <div>
              <Link href={`/users/${user.username}`}>
                <div className="flex items-center text-xl font-semibold hover:underline">
                  {user.displayName}
                  {user.is_Verified && (
                    <MdVerified
                      className="ml-1 h-5 w-5 text-primary"
                      aria-label="Verified"
                    />
                  )}
                </div>
                <div className="text-lg text-gray-400">@{user.username}</div>
              </Link>
            </div>

            {user.bio && (
              <Linkify>
                <div className="text-md line-clamp-4 text-gray-300">
                  {user.bio}
                </div>
              </Linkify>
            )}

            <div className="flex items-center gap-10 text-lg">
              <FollowerCount userId={user.id} initialState={followerState} />
              <span>
                <span className="font-semibold">
                  {formatNumber(user._count.following)}
                </span>{" "}
                Following
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
