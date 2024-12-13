import { Metadata } from "next";
import Notifications from "./Notifications";
import PageHeader from "@/components/PageHeader";
import RightSidebar from "../RightSidebar";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-0 xs:border-l xs:border-r xs:dark:border-l-[#1F1F22] xs:dark:border-r-[#1F1F22] lg:w-11/12 xl:w-10/12 2xl:w-[54rem]">
        <div className="sticky z-20 flex h-16 items-center space-x-16 border-b px-4 backdrop-blur-sm dark:border-b-[#1F1F22]">
          <PageHeader title={"Notifications"} />
        </div>
        <Notifications />
      </div>

      <div className="hidden lg:mx-3 lg:block lg:w-1/3 xl:mx-5 2xl:mx-7 2xl:w-[28rem]">
        <RightSidebar />
      </div>
    </main>
  );
}
