import PostEditor from "@/components/posts/editor/PostEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";
import RightSidebar from "./RightSidebar";
import { Metadata } from "next";

export default function Home() {
  return (
    <main className="flex w-full min-w-0">
      <div className="w-full min-w-0 space-y-5 xs:border-l xs:border-r xs:dark:border-l-[#1F1F22] xs:dark:border-r-[#1F1F22] lg:w-11/12 xl:w-10/12 2xl:w-[54rem]">
        <Tabs defaultValue="for-you">
          <TabsList className="sticky top-0 z-20 backdrop-blur-sm">
            <TabsTrigger value="for-you" className="py-4 text-xl">
              For you
            </TabsTrigger>
            <TabsTrigger value="following" className="py-4 text-xl">
              Following
            </TabsTrigger>
          </TabsList>
          <PostEditor className="mt-6 max-w-full border-b dark:border-b-[#1F1F22]" />
          <TabsContent
            value="for-you"
            className="mt-0 focus:border-transparent focus:outline-none focus:ring-0"
          >
            <ForYouFeed />
          </TabsContent>
          <TabsContent
            value="following"
            className="mt-0 focus:border-transparent focus:outline-none focus:ring-0"
          >
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden lg:mx-6 lg:block lg:w-1/3 xl:mx-6 2xl:mx-9 2xl:w-[28rem]">
        <RightSidebar />
      </div>
    </main>
  );
}
