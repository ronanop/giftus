import { NextResponse } from "next/server";
import { z } from "zod";
import { claimGift } from "@/lib/store";

const schema = z.object({
  slug: z.string(),
  itemId: z.string(),
  name: z.string().min(1),
  message: z.string().optional(),
  confirm: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const result = await claimGift(body);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not update gift";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
