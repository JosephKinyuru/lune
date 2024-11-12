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
        <TooltipContent className="rounded-md bg-card dark:bg-black p-4 text-black dark:text-white shadow-lg w-56">
          <div className="flex max-w-xs flex-col gap-3 break-words">
            {/* User Info */}
            <div className="flex items-center justify-between gap-4">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={48} avatar_url={user.avatar_url} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>

            <div>
              <Link
                href={`/users/${user.username}`}
                className="hover:underline"
              >
                <div className="flex items-center text-lg font-semibold">
                  {user.displayName}
                  {user.is_Verified && (
                    <MdVerified className="ml-1 h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="text-sm text-gray-400">@{user.username}</div>
              </Link>
            </div>

            {/* Bio */}
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 text-sm text-gray-300">
                  {user.bio}
                </div>
              </Linkify>
            )}

            {/* Followers & Following Count */}
            <div className="flex items-center gap-6 text-sm">
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
