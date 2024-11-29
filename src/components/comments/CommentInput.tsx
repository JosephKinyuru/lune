import { PostData } from "@/lib/types";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";
import LoadingButton from "../LoadingButton";
import UserAvatar from "../UserAvatar";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      },
    );
  }

  return (
    <form
      className="flex items-center gap-2 border-t pt-5 dark:border-t-[#1F1F22]"
      onSubmit={onSubmit}
    >
      <UserAvatar avatar_url={post.user.avatar_url} />
      <Input
        placeholder="Post your reply"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        className="text-md h-12 flex-grow border-0 bg-transparent outline-none focus:ring-0"
      />
      <LoadingButton
        type="submit"
        loading={mutation.isPending}
        disabled={!input.trim() || mutation.isPending}
        className="min-w-20"
      >
        Reply
      </LoadingButton>
    </form>
  );
}
