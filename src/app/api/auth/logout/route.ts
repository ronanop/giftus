import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST(req: Request) {
  await destroySession();
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(new URL("/", origin), { status: 303 });
}
