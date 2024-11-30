import { PostData } from "@/lib/types";
import { useState } from "react";
import { Input } from "../ui/input";
import { useSubmitReplyMutation } from "./mutations";
import LoadingButton from "../LoadingButton";

interface ReplyDialogInputProps {
  className? : string;
  post: PostData;
}

export default function ReplyDialogInput({ post, className }: ReplyDialogInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitReplyMutation(post.id);

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
    <form className={`flex flex-col gap-4 ${className}`} onSubmit={onSubmit}>
      <Input
        placeholder="Post your reply..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        className="flex-grow border-0 bg-transparent text-xl outline-none placeholder:text-gray-500 focus:ring-0"
      />
      <div className="flex justify-end border-t dark:border-t-[#1F1F22] pt-4">
        <LoadingButton
          type="submit"
          loading={mutation.isPending}
          disabled={!input.trim() || mutation.isPending}
          className="rounded-full bg-blue-500 px-6 py-2 font-bold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Reply
        </LoadingButton>
      </div>
    </form>
  );
}
