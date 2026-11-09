import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { addCashFund } from "@/lib/store";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  goalAmount: z.number().positive(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = schema.parse(await req.json());
    const fund = await addCashFund(id, session.id, body);
    if (!fund) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ fund });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not add fund";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
