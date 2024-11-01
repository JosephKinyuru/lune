import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

export default function RightSidebar() {
  return (
    <div className="sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l bg-card px-8 pb-6 pt-28 dark:border-l-[#1F1F22] dark:bg-[#121417] max-2xl:hidden">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="flex flex-1 flex-col justify-start">
      <h3 className="text-xl font-medium leading-[140%]">
        Who to follow
      </h3>

      <div className="mt-7 flex w-[350px] flex-col gap-9">
        {usersToFollow.length > 0 ? (
          <>
            {usersToFollow.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3"
              >
                <UserTooltip user={user}>
                  <Link
                    href={`/users/${user.username}`}
                    className="flex items-center gap-3"
                  >
                    <UserAvatar
                      avatarUrl={user.avatarUrl}
                      className="flex-none"
                    />
                    <div>
                      <p className="line-clamp-1 break-all font-semibold hover:underline">
                        {user.displayName}
                      </p>
                      <p className="line-clamp-1 break-all text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                </UserTooltip>
                <FollowButton
                  userId={user.id}
                  initialState={{
                    followers: user._count.followers,
                    isFollowedByUser: user.followers.some(
                      ({ followerId }) => followerId === user.id,
                    ),
                  }}
                />
              </div>
            ))}
          </>
        ) : (
          <p className="text-lg font-normal leading-[140%] text-primary/60">
            No fellow users yet
          </p>
        )}
      </div>
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="flex flex-1 flex-col justify-start">
      <h3 className="text-xl font-medium leading-[140%]">
        Trending topics
      </h3>

      <div className="mt-7 flex w-[350px] flex-col gap-10">
        {trendingTopics.length > 0 ? (
          <>
            {trendingTopics.map(({ hashtag, count }) => {
              const title = hashtag.split("#")[1];

              return (
                <Link key={title} href={`/hashtag/${title}`} className="block">
                  <p
                    className="line-clamp-1 break-all font-semibold hover:underline"
                    title={hashtag}
                  >
                    {hashtag}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(count)} {count === 1 ? "post" : "posts"}
                  </p>
                </Link>
              );
            })}
          </>
        ) : (
          <p className="text-lg font-normal leading-[140%] text-primary/60">
            Come up with the next trend
          </p>
        )}
      </div>
    </div>
  );
}