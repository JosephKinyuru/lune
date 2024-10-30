import { validateRequest } from "@/auth";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import MessagesButton from "./MessagesButton";
import Image from "next/image";
import logo from "../favicon.ico";

export default async function Navbar() {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  return (
    <header className="fixed top-0 z-30 w-full dark:border-b-[#1F1F22] bg-card dark:bg-[#121417]">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center text-2xl font-bold">
            <Image src={logo.src} alt="logo" height={30} width={30} />
            <span className="ml-2">lune</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:mr-16 md:block lg:mr-20 xl:mr-36">
            <SearchField />
          </div>

          <MessagesButton
            initialState={{ unreadCount: unreadMessagesCount }}
            showString={false}
          />
          <NotificationsButton
            initialState={{ unreadCount: unreadNotificationsCount }}
            showString={false}
          />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
