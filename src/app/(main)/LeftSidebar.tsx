"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { formatNumber } from "@/lib/utils";
import { UserData } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { HTTPError } from "ky";
import { useSession } from "./SessionProvider";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

import { CiGrid41, CiBookmark } from "react-icons/ci";
import { LuCompass } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BsBoxFill } from "react-icons/bs";
import { BiStoreAlt } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { Film } from "lucide-react";
import { MdVerified } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

export const sidebarLinks = [
  {
    icon: <CiGrid41 className="h-7 w-7" />,
    route: "/",
    label: "Feed",
  },
  {
    icon: <LuCompass className="h-7 w-7" />,
    route: "/discover",
    label: "Discover",
  },
  {
    icon: <HiOutlineUserGroup className="h-7 w-7" />,
    route: "/friends",
    label: "Friends",
  },
  {
    icon: <BsBoxFill className="h-7 w-7" />,
    route: "/communities",
    label: "Communitiy",
  },
  {
    icon: <CiBookmark className="h-7 w-7" />,
    route: "/bookmarks",
    label: "Bookmarks",
  },
  {
    icon: <Film className="h-7 w-7" />,
    route: "/videos",
    label: "Videos",
  },
  {
    icon: <BiStoreAlt className="h-7 w-7" />,
    route: "/marketplace",
    label: "Marketplace",
  },
  {
    icon: <IoSettingsOutline className="h-7 w-7" />,
    route: "/settings",
    label: "Settings",
  },
];

const UserCard = () => {
  const { user } = useSession();

  const { data } = useQuery({
    queryKey: ["user-data", user.username],
    queryFn: () =>
      kyInstance.get(`/api/users/username/${user.username}`).json<UserData>(),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  return (
    <div className="mb-6 hidden h-32 w-full max-w-[240px] flex-col justify-center rounded-lg bg-gray-200 p-4 dark:bg-[#101012] xl:flex">
      <Link href={`/users/${user.username}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={user.avatarUrl || avatarPlaceholder}
              alt="User Avatar"
              className="h-12 w-12 rounded-full"
              width={48}
              height={48}
            />
            <div className="ml-4 flex flex-col">
              <p className="flex items-center font-semibold text-foreground">
                {user.displayName}
                {data?.verified && (
                  <MdVerified className="ml-1 inline-block h-4 w-4 align-middle text-primary" />
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-primary/60">@{user.username}</p>
            </div>
          </div>
        </div>
      </Link>

      {!!data ? (
        <div className="mt-2 flex justify-between">
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-foreground">
              {formatNumber(data?._count.followers!)}
            </p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-foreground">
              {formatNumber(data?._count.following!)}
            </p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold text-foreground">
              {formatNumber(data?._count.posts!)}
            </p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex justify-between">
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">
              <Skeleton className="size-8 rounded-sm" />
            </div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">
              <Skeleton className="size-8 rounded-sm" />
            </div>
            <div className="text-xs text-gray-500">Following</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-lg font-bold text-foreground">
              <Skeleton className="size-8 rounded-sm" />
            </div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
        </div>
      )}
    </div>
  );
};

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 z-20 flex h-screen w-full max-w-64 flex-col justify-between overflow-auto border-r bg-card px-4 pb-5 pt-24 dark:border-r-[#1F1F22] dark:bg-[#121417] max-xl:w-20 max-xl:px-2 max-md:hidden">
      <UserCard />

      <div className="flex w-full flex-1 flex-col gap-2">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`relative flex w-full max-w-[230px] items-center gap-3 rounded-md py-3 pl-4 pr-6 transition-colors duration-200 ease-in-out ${isActive ? "text-primary xl:bg-primary/90 xl:text-white" : "text-foreground xl:hover:bg-primary/10"} max-xl:justify-center`}
            >
              <span className="flex-shrink-0">{link.icon}</span>

              <p className="max-xl:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
