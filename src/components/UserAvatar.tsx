import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  avatar_url: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatar_url,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatar_url || avatarPlaceholder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
