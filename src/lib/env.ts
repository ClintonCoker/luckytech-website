/** Server and public settings. See .env.example for what each one does. */

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export const publicKeys = {
  paystack: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  flutterwave: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
};

export function serverSecrets() {
  return {
    paystack: process.env.PAYSTACK_SECRET_KEY || "",
    flutterwave: process.env.FLUTTERWAVE_SECRET_KEY || "",
    resend: process.env.RESEND_API_KEY || "",
    emailTo: process.env.ORDER_EMAIL_TO || "",
    emailFrom: process.env.ORDER_EMAIL_FROM || "LuckyTech Website <onboarding@resend.dev>",
  };
}
