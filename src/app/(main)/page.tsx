import PostEditor from "@/components/posts/editor/PostEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";
import RightSidebar from "./RightSidebar";

export default function Home() {
  return (
    <main className="flex w-full min-w-0">
      <div className="w-full min-w-0 space-y-5 border-l border-r dark:border-l-[#1F1F22] dark:border-r-[#1F1F22] lg:w-11/12 xl:w-10/12 2xl:w-[54rem]">
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you" className="text-lg px-8">
              For you
            </TabsTrigger>
            <TabsTrigger value="following" className="text-lg px-8">
              Following
            </TabsTrigger>
          </TabsList>
          <PostEditor />
          <TabsContent value="for-you" className="mt-0">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following" className="mt-0">
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
