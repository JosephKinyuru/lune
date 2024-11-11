"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import PostDialog from "./PostDialog";

const PostButton = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        className="h-12 w-12 rounded-full bg-blue-400 text-center text-lg font-bold text-white hover:bg-blue-500 lg:h-12 lg:w-full lg:px-3 xl:h-14"
        onClick={() => setShowDialog(true)}
      >
        <p className="max-xl:hidden">Post</p>
        <Plus className="hidden size-6 max-xl:block" />
      </Button>
      <PostDialog
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};

export default PostButton;
