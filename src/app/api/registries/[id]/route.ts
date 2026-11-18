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

const imageUrlSchema = z
  .string()
  .min(1)
  .refine(
    (v) => v.startsWith("/") || /^https?:\/\//i.test(v),
    "Must be a URL or site path",
  );

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  story: z.string().optional(),
  coverImageUrl: imageUrlSchema.optional(),
  photos: z
    .array(
      z.object({
        id: z.string(),
        url: imageUrlSchema,
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
  theme: z
    .object({
      scriptLine: z.string().optional(),
      inviteLede: z.string().optional(),
      categoryHeading: z.string().optional(),
      categorySubheading: z.string().optional(),
      registryHeading: z.string().optional(),
      ctaLabel: z.string().optional(),
      storyHeading: z.string().optional(),
      cashGiftTitle: z.string().optional(),
      cashGiftDescription: z.string().optional(),
    })
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
