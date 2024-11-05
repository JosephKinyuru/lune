import PostEditor from "@/components/posts/editor/PostEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you" className="text-lg">
              For you
            </TabsTrigger>
            <TabsTrigger value="following" className="text-lg">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you" className="mt-6">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following" className="mt-6">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
