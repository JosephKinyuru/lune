"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { Loader2 } from "lucide-react";
import { ClipboardEvent } from "react";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";
import useMediaUpload from "./useMediaUpload";
import { Input } from "@/components/ui/input";
import { AddAttachmentsButton, AttachmentPreviews } from "@/components/media";

export default function PostEditorModal({ className }: { className?: string }) {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();

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
        placeholder: "What's happening?",
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
    <div
      className={cn(
        "flex flex-col gap-5 bg-card p-5 shadow-sm dark:bg-black",
        className,
      )}
    >
      <div className="flex gap-5">
        <UserAvatar avatar_url={user.avatar_url} className="inline" />
        <div {...rootProps} className="w-[92%]">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full max-w-full overflow-y-auto overflow-x-hidden rounded-2xl bg-background px-5 py-3 text-lg",
              isDragActive && "outline-dashed",
            )}
            onPaste={onPaste}
          />
          <Input
            {...getInputProps()}
            className={cn(
              "h-auto max-h-[5rem] w-full max-w-full break-words break-all",
            )}
          />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
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
          Post
        </LoadingButton>
      </div>
    </div>
  );
}