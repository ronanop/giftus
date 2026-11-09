import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  createRegistry,
  listRegistriesForOwner,
  searchPublicRegistries,
} from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (q != null) {
    return NextResponse.json({ registries: await searchPublicRegistries(q) });
  }
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    registries: await listRegistriesForOwner(session.id),
  });
}

const createSchema = z.object({
  title: z.string().min(2),
  occasion: z.enum([
    "baby_shower",
    "wedding",
    "housewarming",
    "anniversary",
    "birthday",
  ]),
  story: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  upiId: z.string().optional(),
  upiName: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = createSchema.parse(await req.json());
    const registry = await createRegistry({ ownerId: session.id, ...body });
    return NextResponse.json({ registry });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not create registry";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
