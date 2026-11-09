import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getRegistryById, updateRegistry } from "@/lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const registry = await getRegistryById(id);
  if (!registry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ registry });
}

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  story: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  photos: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().url(),
        caption: z.string().optional(),
      }),
    )
    .optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  upiId: z.string().optional(),
  upiName: z.string().optional(),
  isPublic: z.boolean().optional(),
  occasion: z
    .enum([
      "baby_shower",
      "wedding",
      "housewarming",
      "anniversary",
      "birthday",
    ])
    .optional(),
});

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
    const body = patchSchema.parse(await req.json());
    const registry = await updateRegistry(id, session.id, body);
    if (!registry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ registry });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
