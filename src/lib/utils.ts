import { type ClassValue, clsx } from "clsx";
import { format, formatDate, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

export function formatLongDate(date: Date): string {
  return format(date, "hh:mm a · MMM d, yyyy");
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function generateRandomToken(length: number) {
  const buf = await new Promise<Buffer>((resolve, reject) => {
    crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });

  return buf.toString("hex").slice(0, length);
}

export const generateOTP = (length: number): string => {
  const otp = Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
    "",
  );
  return otp;
};

export async function createTransaction<T extends typeof prisma>(
  cb: (trx: T) => Promise<void>,
) {
  // Prisma's transaction API using the `prisma` client
  await prisma.$transaction(async (trx) => {
    await cb(trx as T);
  });
}

export async function generateUniqueUsername(fullName: string) {
  const baseUsername = fullName.toLowerCase().replace(/\s+/g, "");

  const appendRandom = (username: string) => {
    const randomString = randomBytes(2).toString("hex");
    return `${username}${randomString}`;
  };

  let username = baseUsername;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      isUnique = true;
    } else {
      username = appendRandom(baseUsername);
    }
  }

  return username;
}

export async function copyToClipboard({
  link,
}: {
  link: string;
}): Promise<boolean> {
  try {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(link);
      return true; 
    } else {
      console.error("Clipboard API not supported on this browser.");
      return false; 
    }
  } catch (error) {
    console.error("Failed to copy: ", error);
    return false; 
  }
}
