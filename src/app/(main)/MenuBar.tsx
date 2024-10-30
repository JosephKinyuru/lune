"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { LuCompass } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BsBoxFill } from "react-icons/bs";
import { CiGrid41 } from "react-icons/ci";
import { Film } from "lucide-react";

interface MenuBarProps {
  className?: string;
}

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
    icon: <Film className="h-7 w-7" />,
    route: "/videos",
    label: "Videos",
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
