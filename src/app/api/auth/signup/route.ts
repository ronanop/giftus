import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { createUser } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await createUser(body);
    await createSession(user);
    return NextResponse.json({ user });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not create account";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
