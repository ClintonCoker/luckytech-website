import "server-only";
import { serverSecrets } from "@/lib/env";

/** Sends a plain-text email through Resend. Returns false (and sends nothing) when email isn't set up. */
export async function sendStoreEmail(subject: string, text: string, replyTo?: string): Promise<boolean> {
  const { resend, emailTo, emailFrom } = serverSecrets();
  if (!resend || !emailTo) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: emailFrom,
        to: emailTo.split(",").map((s) => s.trim()).filter(Boolean),
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
