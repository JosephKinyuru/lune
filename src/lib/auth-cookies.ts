import "server-only";
import { SESSION_COOKIE_NAME } from "./session";
import Cookies from "js-cookie";

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  Cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  Cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
