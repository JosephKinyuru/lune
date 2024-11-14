"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { HiOutlineUserGroup } from "react-icons/hi2";
import { CiGrid41, CiMail, CiSearch } from "react-icons/ci";
import { GoBell } from "react-icons/go";

interface MenuBarProps {
  className?: string;
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

export default function MenuBar({ className }: MenuBarProps) {
  const pathname = usePathname();

  return (
    <div className={className}>
      {sidebarLinks.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;

        return (
          <Button
            variant="ghost"
            className={`hover:none flex items-center justify-start gap-2 outline-none focus:outline-none ${isActive && "text-primary"}`}
            title={link.label}
            asChild
            key={link.label}
          >
            <Link href={link.route}>{link.icon}</Link>
          </Button>
        );
      })}
    </div>
  );
}
