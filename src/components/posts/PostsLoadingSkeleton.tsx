import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PostsLoadingSkeleton() {
  return (
    <div className="space-y-1">
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
}

function PostLoadingSkeleton() {
  return (
    <div className="w-full space-y-3 border-b bg-card py-6 shadow-sm dark:border-b-[#1F1F22] xxs:ml-2 dark:bg-black xs:px-10 sm:px-8 md:px-12 xl:px-20">
      <div className="flex flex-wrap gap-3">
        <div className="h-12 w-12 rounded-full">
          <Skeleton circle width={48} height={48} />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-56 rounded-xl">
            <Skeleton />
          </div>
          <div className="h-4 w-44 rounded-xl">
            <Skeleton />
          </div>
        </div>
      </div>
      <div className="ml-12 flex flex-col gap-3 p-4">
        <div className="space-y-2">
          <div className="h-4 w-[90%]">
            <Skeleton />
          </div>
          <div className="h-4 w-[70%]">
            <Skeleton />
          </div>
        </div>
        <div className="w-[90%] rounded-2xl">
          <Skeleton height={200} />
        </div>
        <div className="flex flex-row space-x-6">
          <div className="h-4 w-16">
            <Skeleton />
          </div>
          <div className="h-4 w-16">
            <Skeleton />
          </div>
          <div className="h-4 w-16">
            <Skeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
