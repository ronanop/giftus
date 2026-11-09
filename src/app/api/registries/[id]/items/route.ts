import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { addGiftItem } from "@/lib/store";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().optional(),
  storeName: z.string().optional(),
  productUrl: z.string().url(),
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
    const item = await addGiftItem(id, session.id, body);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not add gift";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
