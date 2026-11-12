import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "lkt_admin";
const SESSION_HOURS = 12;

export const adminConfigured = () => (process.env.ADMIN_PASSWORD || "").length >= 8;

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || createHash("sha256").update(`lkt-session:${process.env.ADMIN_PASSWORD ?? ""}`).digest("hex");
}

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");

/** Compares passwords in constant time. */
export function passwordMatches(attempt: string): boolean {
  const real = process.env.ADMIN_PASSWORD || "";
  if (real.length < 8) return false;
  const a = createHash("sha256").update(attempt).digest();
  const b = createHash("sha256").update(real).digest();
  return timingSafeEqual(a, b);
}

export function makeSessionToken(now = Date.now()): string {
  const exp = String(now + SESSION_HOURS * 3600_000);
  return `${exp}.${sign(exp)}`;
}

export function sessionTokenValid(token: string | undefined, now = Date.now()): boolean {
  if (!token || !adminConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < now) return false;
  const expected = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function isAdmin(): Promise<boolean> {
  return sessionTokenValid((await cookies()).get(ADMIN_COOKIE)?.value);
}

/** Use at the top of every admin page and admin server action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startSession() {
  (await cookies()).set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}
