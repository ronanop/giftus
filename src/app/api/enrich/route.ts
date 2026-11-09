import { NextResponse } from "next/server";
import { z } from "zod";
import { enrichProductUrl } from "@/lib/enrich";

const schema = z.object({
  url: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const product = await enrichProductUrl(body.url);
    return NextResponse.json({ product });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not read product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
