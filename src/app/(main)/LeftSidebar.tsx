"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { CiGrid41, CiBookmark, CiUser, CiMail } from "react-icons/ci";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BiStoreAlt } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import {
  Check,
  CircleEllipsis,
  Film,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
  UserIcon,
} from "lucide-react";
import { GoBell } from "react-icons/go";
import { PiCompassLight } from "react-icons/pi";

import logo from "../favicon.ico";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import kyInstance from "@/lib/ky";
import { MessageCountInfo, NotificationCountInfo } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { useSession } from "./SessionProvider";
import { useTheme } from "next-themes";
import { logout } from "../(auth)/actions";
import { MdVerified } from "react-icons/md";
import PostButton from "./PostButton";

interface initialDataProps {
  unreadNotificationsCount: NotificationCountInfo;
  unreadMessagesCount: MessageCountInfo;
}

export const moreSidebarLinks = [
  {
    icon: <Film className="size-5 xl:size-6" />,
    route: "/videos",
    label: "Videos",
  },
  {
    icon: <BiStoreAlt className="size-5 xl:size-6" />,
    route: "/marketplace",
    label: "Marketplace",
  },
  {
    icon: <IoSettingsOutline className="size-5 xl:size-6" />,
    route: "/settings",
    label: "Settings",
  },
];

export default function LeftSidebar({
  unreadMessagesCount,
  unreadNotificationsCount,
}: initialDataProps) {
  const pathname = usePathname();

  const { data: unreadMessagesData } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: unreadMessagesCount,
    refetchInterval: 60 * 1000,
  });

  const { data: unreadNotificationsData } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: unreadNotificationsCount,
    refetchInterval: 60 * 1000,
  });

  const { user } = useSession();

  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();

  const sidebarLinks = [
    {
      icon: <CiGrid41 className="size-8 xl:size-9" />,
      route: "/",
      label: "Feed",
    },
    {
      icon: <PiCompassLight className="size-9 xl:size-10" />,
      route: "/search",
      label: "Discover",
    },
    {
      icon: <CiMail className="size-8 xl:size-9" />,
      route: "/messages",
      label: "Messages",
    },
    {
      icon: <GoBell className="size-8 xl:size-9" />,
      route: "/notifications",
      label: "Notifications",
    },
    {
      icon: <CiBookmark className="size-8 xl:size-9" />,
      route: "/bookmarks",
      label: "Bookmarks",
    },
    {
      icon: <CiUser className="size-8 xl:size-9" />,
      route: `/users/${user.username}`,
      label: "Profile",
    },
    {
      icon: <HiOutlineUserGroup className="size-8 xl:size-9" />,
      route: "/communities",
      label: "Communitiy",
    },
  ];

  return (
    <section className="sticky left-0 top-0 z-20 flex max-h-fit min-h-screen w-full max-w-72 flex-col border-r bg-card px-4 pb-5 pt-4 dark:border-r-[#1F1F22] dark:bg-black max-xl:w-20 max-xl:px-2 max-xs:hidden lg:pt-8">
      <div className="flex items-center gap-4 px-3 xl:ml-2">
        <Link href="/" className="flex items-center text-2xl font-bold">
          <Image src={logo.src} alt="logo" width={34} height={34} />
          <span className="ml-2 max-xl:hidden">lune</span>
        </Link>
      </div>

      <nav className="mt-10 px-2 max-xs:mt-16">
        <div className="flex w-full flex-col max-xs:gap-2">
          {sidebarLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`relative flex w-full max-w-[230px] items-center gap-3 rounded-full py-3 pl-4 pr-6 transition-colors duration-200 ease-in-out ${isActive ? "font-bold text-primary" : "text-foreground"} hover:bg-accent dark:hover:bg-gray-50/10 max-xl:justify-center`}
              >
                <span className="flex-shrink-0">{link.icon}</span>

                <p className="text-xl max-xl:hidden">{link.label}</p>

                {link.label === "Messages" &&
                  unreadMessagesData?.unreadCount > 0 && (
                    <span className="absolute -right-1 top-2 rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                      {unreadMessagesData.unreadCount > 9
                        ? "9+"
                        : unreadMessagesData.unreadCount}
                    </span>
                  )}
                {link.label === "Notifications" &&
                  unreadNotificationsData?.unreadCount > 0 && (
                    <span className="absolute -right-1 top-2 rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                      {unreadNotificationsData.unreadCount > 9
                        ? "9+"
                        : unreadNotificationsData.unreadCount}
                    </span>
                  )}
              </Link>
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative flex w-full max-w-[230px] items-center gap-3 rounded-full py-3 pl-4 pr-6 transition-colors duration-200 ease-in-out hover:bg-accent dark:hover:bg-gray-50/10 max-xl:justify-center">
                <span className="flex-shrink-0">
                  <CircleEllipsis className="size-9" />
                </span>
                <p className="text-xl max-xl:hidden">More</p>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 border-black bg-white dark:border-gray-50 dark:bg-black"
              side="top"
            >
              {moreSidebarLinks.map((link) => {
                return (
                  <DropdownMenuItem key={link.label}>
                    <Link
                      href={link.route}
                      className="flex w-full items-center gap-3 rounded-sm px-2 py-1"
                    >
                      <span>{link.icon}</span>

                      <p className="text-lg font-medium tracking-tight">
                        {link.label}
                      </p>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-12 max-xs:mt-16 max-xs:px-2 xl:px-2 2xl:mt-20">
          <PostButton />
        </div>

        <div className="mt-12 max-xs:mt-16 max-xs:px-2 xl:ml-2 xl:px-0 2xl:mt-24">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex size-10 items-center justify-center rounded-full bg-transparent transition-colors duration-300 hover:bg-accent dark:hover:bg-gray-50/15 lg:h-14 lg:justify-start xl:w-[100%]">
                <Image
                  src={user.avatar_url || avatarPlaceholder}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="rounded-full lg:mr-2 xl:ml-2 xl:size-12"
                />
                <div className="hidden text-left lg:block">
                  <p className="text-lg font-medium tracking-tight max-xl:hidden">
                    {user.displayName}
                    {/* {data?.verified && ( */}
                    <MdVerified className="ml-1 inline-block h-4 w-4 align-middle text-primary" />
                    {/* )} */}
                  </p>
                  <p className="text-md -mt-1 tracking-tighter text-muted-foreground max-xl:hidden">
                    @{user.username}
                  </p>
                </div>

                <div className="size-10 rounded-full bg-transparent max-xl:hidden lg:ml-10 lg:mr-2">
                  <div className="items-center justify-center text-2xl">
                    ...
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 border-black bg-white dark:border-gray-50 dark:bg-black"
              side="top"
            >
              <Link href={`/users/${user.username}`}>
                <DropdownMenuItem>
                  <UserIcon className="mr-2 size-4" />
                  <p className="text-lg tracking-tight">View profile</p>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Monitor className="mr-2 size-4" />
                  <p className="text-lg tracking-tight">Theme</p>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-44 border-black bg-white dark:border-gray-50 dark:bg-black">
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Monitor className="mr-2 size-4" />
                      <p className="text-md tracking-tight">System default</p>
                      {theme === "system" && <Check className="ms-2 size-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 size-4" />
                      <p className="text-md tracking-tight">Light</p>
                      {theme === "light" && <Check className="ms-2 size-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 size-4" />
                      <p className="text-md tracking-tight">Dark</p>
                      {theme === "dark" && <Check className="ms-2 size-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  queryClient.clear();
                  logout();
                }}
              >
                <LogOutIcon className="mr-2 size-4" />
                <p className="text-lg tracking-tight">
                  Log out @{user.username}
                </p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </section>
  );
}
