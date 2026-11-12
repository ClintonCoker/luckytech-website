import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth.server";
import { db, dbConfigured, dbSettings, PHOTO_BUCKET } from "@/lib/db.server";
import { slugify } from "@/lib/admin";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

/** Uploads one product photo (admin only). Photos are shrunk in the browser first. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (!dbConfigured()) return NextResponse.json({ error: "Database isn't set up yet." }, { status: 400 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No photo received." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Use a JPG, PNG or WebP photo." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Photo is too big (over 4 MB)." }, { status: 400 });
  const folder = slugify(String(form?.get("folder") ?? "")) || "uploads";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await db().storage.from(PHOTO_BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: `${dbSettings().url}/storage/v1/object/public/${PHOTO_BUCKET}/${path}` });
}
