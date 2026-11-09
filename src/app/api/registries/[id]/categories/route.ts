import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { sanitizeProductImageUrl } from "@/lib/product-image";
import {
  addGiftCategory,
  deleteGiftCategory,
  updateGiftCategory,
} from "@/lib/store";

const createSchema = z.object({
  name: z.string().min(1).max(80),
  imageUrl: z.string().url().optional(),
});

const updateSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(80).optional(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

const deleteSchema = z.object({
  categoryId: z.string().min(1),
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
    const body = createSchema.parse(await req.json());
    const category = await addGiftCategory(id, session.id, {
      name: body.name,
      imageUrl: sanitizeProductImageUrl(body.imageUrl),
    });
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ category });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not add category";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = updateSchema.parse(await req.json());
    const category = await updateGiftCategory(id, session.id, body.categoryId, {
      name: body.name,
      imageUrl:
        body.imageUrl === null
          ? undefined
          : sanitizeProductImageUrl(body.imageUrl),
      sortOrder: body.sortOrder,
    });
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ category });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not update category";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = deleteSchema.parse(await req.json());
    const ok = await deleteGiftCategory(id, session.id, body.categoryId);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not delete category";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
