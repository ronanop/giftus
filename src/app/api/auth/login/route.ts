import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { verifyUser } from "@/lib/store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const user = await verifyUser(body.email, body.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await createSession(user);
    return NextResponse.json({ user });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not sign in";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
