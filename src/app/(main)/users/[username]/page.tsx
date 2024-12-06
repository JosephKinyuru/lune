import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import { CalendarDays, Image as LucideImage } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RightSidebar from "../../RightSidebar";
import ProfileHeader from "./ProfileHeader";
import { UserLikes, UserMedia, UserPosts, UserReplies } from "./tabs";
import { MdVerified } from "react-icons/md";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const { username } = await params;
  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params }: PageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const { username } = await params;
  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-4 xs:border-l xs:border-r xs:dark:border-l-[#1F1F22] xs:dark:border-r-[#1F1F22] lg:w-11/12 xl:w-10/12 2xl:w-[54rem]">
        <div className="sticky z-20 flex h-16 items-center space-x-16 border-b px-4 backdrop-blur-sm dark:border-b-[#1F1F22]">
          <ProfileHeader
            displayName={user.displayName}
            isVerified={!!user.is_Verified}
          />
        </div>
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger
              value="posts"
              className="text-lg data-[state=active]:after:w-2/5"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="text-lg data-[state=active]:after:w-2/5"
            >
              Media
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="text-lg data-[state=active]:after:w-2/5"
            >
              Replies
            </TabsTrigger>
            {loggedInUser.id === user.id && (
              <TabsTrigger
                value="likes"
                className="text-lg data-[state=active]:after:w-2/5"
              >
                Likes
              </TabsTrigger>
            )}
          </TabsList>

          <div>
            <TabsContent value="posts" className="mt-0">
              <UserPosts userId={user.id} />
            </TabsContent>
            <TabsContent value="media" className="mt-0">
              <UserMedia userId={user.id} />
            </TabsContent>
            <TabsContent value="replies" className="mt-0">
              <UserReplies userId={user.id} />
            </TabsContent>
            {loggedInUser.id === user.id && (
              <TabsContent value="likes" className="mt-0">
                <UserLikes userId={user.id} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>

      <div className="hidden lg:mx-6 lg:block lg:w-1/3 xl:mx-6 2xl:mx-9 2xl:w-[28rem]">
        <RightSidebar />
      </div>
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="w-full select-text space-y-5 rounded-2xl border-b bg-card p-5 dark:border-b-[#1f1f22] dark:bg-black">
      <div className="relative">
        <div className="h-40 w-full rounded-sm bg-background dark:bg-[#333639]">
          {user.profile_banner_url ? (
            <img
              src={user.profile_banner_url}
              alt={`${user.displayName}'s banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <LucideImage className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="absolute -mt-12 ml-4 md:ml-6">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-background md:h-24 md:w-24 lg:h-28 lg:w-28">
            <UserAvatar
              avatar_url={user.avatar_url}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-12 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              {user.is_Verified && (
                <MdVerified
                  className="-mb-1 inline h-6 w-6 text-primary"
                  aria-label="Verified"
                />
              )}
            </div>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>

          <div className="me-auto space-y-1.5">
            <div>
              <CalendarDays className="inline size-4 text-muted-foreground" />{" "}
              Joined {formatDate(user.createdAt, "MMM d, yyyy")}
            </div>

            <div className="flex items-center gap-3">
              <FollowerCount userId={user.id} initialState={followerInfo} />
              <span>
                <span className="font-semibold">
                  {formatNumber(user._count.following)}
                </span>{" "}
                Following
              </span>
            </div>
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>

      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
