import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import MenuBar from "./MenuBar";
import SessionProvider from "./SessionProvider";
import LeftSidebar from "./LeftSidebar";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/sign-in");

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: session.user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(session.user.id))
      .total_unread_count,
  ]);

  return (
    <SessionProvider value={session}>
      <div className="min-h-screen overflow-clip bg-card dark:bg-black">
        <div className="flex justify-center md:mx-14 lg:mx-12 xl:mx-8 2xl:mx-24">
          <LeftSidebar
            unreadNotificationsCount={{
              unreadCount: unreadNotificationsCount,
            }}
            unreadMessagesCount={{ unreadCount: unreadMessagesCount }}
          />

          {children}
        </div>
      </div>
      <MenuBar
        className="sticky bottom-0 flex w-full justify-center gap-4 border-t bg-card p-3 xxxs:gap-1 xxs:gap-3 xs:hidden"
        unreadNotificationsCount={{
          unreadCount: unreadNotificationsCount,
        }}
        unreadMessagesCount={{ unreadCount: unreadMessagesCount }}
      />
    </SessionProvider>
  );
}
