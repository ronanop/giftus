import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, getSession } from "@/lib/auth";
import { updateUserProfile } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2),
});

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = schema.parse(await req.json());
    const user = await updateUserProfile(session.id, body);
    await createSession(user);
    return NextResponse.json({ user });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Could not update profile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
