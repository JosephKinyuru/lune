import { Metadata } from "next";
import RightSidebar from "../RightSidebar";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Settings",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-0 border-l border-r dark:border-l-[#1F1F22] dark:border-r-[#1F1F22] lg:w-11/12 xl:w-10/12 2xl:w-[54rem]">
        <div className="sticky z-20 flex h-16 items-center space-x-16 border-b px-4 backdrop-blur-sm dark:border-b-[#1F1F22]">
          <PageHeader title={"Settings"} />
        </div>
        Settings
        {/* TO DO MAKE SETTINGS */}
      </div>

      <div className="hidden lg:mx-6 lg:block lg:w-1/3 xl:mx-6 2xl:mx-9 2xl:w-[28rem]">
        <RightSidebar />
      </div>
    </main>
  );
}
