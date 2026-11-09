import { NextResponse } from "next/server";
import { z } from "zod";
import { confirmContribution } from "@/lib/store";

const schema = z.object({
  slug: z.string(),
  fundId: z.string(),
  name: z.string().min(1),
  amount: z.number().positive(),
  message: z.string().optional(),
  confirm: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const result = await confirmContribution(body);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not confirm contribution";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
