import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const scopes = ["profile", "email"];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);
  
  (await cookies()).set("google_oauth_state", state, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  });

  (await cookies()).set("google_code_verifier", codeVerifier, {
    secure: true,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  });

  return Response.redirect(url);
}
