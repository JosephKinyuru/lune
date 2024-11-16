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
        className="h-10 w-10 rounded-full bg-blue-400 px-2 text-center text-lg font-bold text-white hover:bg-blue-500 xl:h-14 xl:w-full xl:px-3"
        onClick={() => setShowDialog(true)}
      >
        <p className="max-xl:hidden">Post</p>
        <Plus className="hidden max-xl:block" size={36} />
      </Button>
      <PostDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
};

export default PostButton;
