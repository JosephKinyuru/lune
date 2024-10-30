"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchField() {
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
      <div className="relative w-[115%] max-w-md">
        <Input
          name="q"
          placeholder="Find friends, communities or posts here"
          className="w-full rounded-sm bg-gray-100 py-2 pl-10 pr-3 text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-[#101012]"
          autoComplete="off"
        />
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      </div>
    </form>
  );
}
