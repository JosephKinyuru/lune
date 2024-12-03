import { PostData } from "@/lib/types";
import { ClipboardEvent } from "react";
import { Input } from "../ui/input";
import { useSubmitReplyMutation } from "./mutations";
import LoadingButton from "../LoadingButton";
import UserAvatar from "../UserAvatar";
import useMediaUpload from "../posts/editor/useMediaUpload";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useSession } from "@/app/(main)/SessionProvider";
import { AddAttachmentsButton, AttachmentPreviews } from "../media";

interface ReplyInputProps {
  post: PostData;
}

export default function ReplyInput({ post }: ReplyInputProps) {
  const { user } = useSession();

  const mutation = useSubmitReplyMutation(post.id);

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Post your reply",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(
      {
        post,
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  }

  return (
    <div className="flex max-w-full items-center gap-1 sm:gap-2 border-t pt-5 dark:border-t-[#1F1F22]">
      <div className="flex flex-grow gap-5">
        <UserAvatar avatar_url={user.avatar_url} className="inline" />
        <div {...rootProps} className="flex-grow">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full overflow-hidden overflow-y-auto rounded-2xl px-5 py-3 text-lg",
              "whitespace-normal break-words",
              isDragActive && "outline-dashed",
            )}
            onPaste={onPaste}
          />

          <Input
            {...getInputProps()}
            className={cn("h-auto max-h-[5rem] w-full break-words")}
          />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="ml-auto flex items-center justify-end gap-2">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Reply
        </LoadingButton>
      </div>
    </div>
  );
}