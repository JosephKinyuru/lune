"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export default function SearchField({ className }: { className?: string }) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className={cn("relative w-full", className)}>
        <Input
          name="q"
          placeholder="Search"
          className="h-12 w-full rounded-full bg-gray-100 py-2 pl-10 pr-3 text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-[#202327]"
          autoComplete="off"
        />
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      </div>
    </form>
  );
}
