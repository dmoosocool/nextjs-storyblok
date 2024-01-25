import { revalidateTag } from "next/cache";
import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  draftMode().enable();

  // fix storyblok iframe can not get cookie
  // https://github.com/vercel/next.js/issues/49927#issuecomment-1870190882
  const draft = cookies().get("__prerender_bypass");
  cookies().set("__prerender_bypass", draft?.value ?? "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  revalidateTag("home");
  return NextResponse.redirect(new URL("/", request.url));
}
