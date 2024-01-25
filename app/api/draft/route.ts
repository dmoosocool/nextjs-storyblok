import { revalidateTag } from "next/cache";
import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  draftMode().enable();
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
