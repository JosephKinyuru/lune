import { github, lucia } from "@/auth";
import kyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const storedState = (await cookies()).get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await kyInstance
      .get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      .json<{
        id: string;
        login: string;
        avatar_url: string;
        email: string;
      }>();

    const existingUser = await prisma.user.findUnique({
      where: {
        githubId: githubUserResponse.id,
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = crypto.randomUUID();

    const username = slugify(githubUserResponse.login) + "-" + userId.slice(0, 4);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: githubUserResponse.login,
          googleId: githubUserResponse.id,
          avatar_url: githubUserResponse.avatar_url,
          email: githubUserResponse.email,
        },
      });
    });

   const session = await lucia.createSession(userId, {});
   const sessionCookie = lucia.createSessionCookie(session.id);
   (await cookies()).set(
     sessionCookie.name,
     sessionCookie.value,
     sessionCookie.attributes,
   );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
