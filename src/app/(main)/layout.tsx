import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import MenuBar from "./MenuBar";
import Navbar from "./Navbar";
import SessionProvider from "./SessionProvider";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/sign-in");

  return (
    <SessionProvider value={session}>
      <div className="">
        <Navbar />

        <div className="flex flex-grow">
          <LeftSidebar />
          <section className="flex min-h-screen flex-1 flex-col items-center px-6 pb-10 pt-28 max-md:pb-32 sm:px-10">
            <div className="w-full max-w-4xl">{children}</div>
          </section>
          <RightSidebar />
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-4 border-t bg-card p-3 md:hidden" />
      </div>
    </SessionProvider>
  );
}
