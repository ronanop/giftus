import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { deleteGiftItem, updateGiftItem } from "@/lib/store";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  price: z.number().nullable().optional(),
  storeName: z.string().optional(),
  productUrl: z.string().url().optional(),
  categoryId: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, itemId } = await params;
  try {
    const body = patchSchema.parse(await req.json());
    const item = await updateGiftItem(id, session.id, itemId, body);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not update gift";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, itemId } = await params;
  const ok = await deleteGiftItem(id, session.id, itemId);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
