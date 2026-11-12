import { NextResponse } from "next/server";
import { branchById } from "@/content/store";
import { requestSchema } from "@/lib/schemas";
import { requestSummary } from "@/lib/request";
import { sendStoreEmail } from "@/lib/email.server";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

/** "Tell us what you need" form. Emails the store when email is set up; always returns a WhatsApp link as well. */
export async function POST(req: Request) {
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message]));
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 400 });
  }
  const r = parsed.data;
  const branch = branchById(r.branch)!;
  const summary = requestSummary(r);
  const emailed = await sendStoreEmail(`Website request: ${r.needs.join(", ")} (${branch.city})`, summary, r.email || undefined);
  return NextResponse.json({ ok: true, emailed, whatsappUrl: whatsappLink(branch, summary) });
}
