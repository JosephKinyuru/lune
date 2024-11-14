"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { HiOutlineUserGroup } from "react-icons/hi2";
import { CiGrid41, CiMail, CiSearch } from "react-icons/ci";
import { GoBell } from "react-icons/go";

import { MessageCountInfo, NotificationCountInfo } from "@/lib/types";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

interface MenuBarProps {
  className?: string;
  unreadNotificationsCount: NotificationCountInfo;
  unreadMessagesCount: MessageCountInfo;
}

export const sidebarLinks = [
  {
    icon: <CiGrid41 className="size-7" />,
    route: "/",
    label: "Feed",
  },
  {
    icon: <CiSearch className="size-7" />,
    route: "/discover",
    label: "Discover",
  },
  {
    icon: <HiOutlineUserGroup className="size-7" />,
    route: "/communities",
    label: "Community",
  },
  {
    icon: <GoBell className="size-7" />,
    route: "/notifications",
    label: "Notifications",
  },
  {
    icon: <CiMail className="size-7" />,
    route: "/messages",
    label: "Messages",
  },
];

export default function MenuBar({
  className,
  unreadMessagesCount,
  unreadNotificationsCount,
}: MenuBarProps) {
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

  return (
    <div className={className}>
      {sidebarLinks.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;

        return (
          <Button
            variant="ghost"
            className={`hover:none flex items-center justify-start gap-4 outline-none focus:outline-none ${isActive && "text-primary"} relative`}
            title={link.label}
            asChild
            key={link.label}
          >
            <div className="relative flex items-center">
              <Link href={link.route}>{link.icon}</Link>
              {link.label === "Messages" &&
                unreadMessagesData?.unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary"></span>
                )}
              {link.label === "Notifications" &&
                unreadNotificationsData?.unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary"></span>
                )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
