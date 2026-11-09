import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadPublicImage } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadPublicImage({
      bytes,
      contentType: file.type || "image/jpeg",
      folder: `registries/${session.id}`,
    });
    return NextResponse.json(uploaded);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
