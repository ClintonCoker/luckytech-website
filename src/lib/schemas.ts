import { z } from "zod";

const phone = z.string().trim().min(7, "Enter a phone number").max(20).regex(/^[+\d][\d\s-]{6,}$/, "Enter a valid phone number");

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone,
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
  fulfilment: z.enum(["pickup", "delivery"]),
  address: z.string().trim().max(240).optional(),
  note: z.string().trim().max(500).optional(),
});

export const cartLinesSchema = z.array(z.object({ slug: z.string().max(120), qty: z.number().int().min(1).max(20) })).min(1).max(50);

export const verifySchema = z.object({
  provider: z.enum(["paystack", "flutterwave"]),
  reference: z.string().trim().min(6).max(100),
  transactionId: z.string().trim().max(40).optional(),
  branch: z.enum(["owo", "akure"]),
  lines: cartLinesSchema,
  contact: contactSchema,
});

export const needOptions = [
  "Phone",
  "Tablet / iPad",
  "Charger or cable",
  "Power bank",
  "Pouch or case",
  "Screen guard",
  "Speaker or earbuds",
  "Smartwatch",
  "Original phone screen",
  "Phone repair",
  "Something else",
] as const;

export const requestSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone,
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
  branch: z.enum(["owo", "akure"]),
  needs: z.array(z.enum(needOptions)).min(1, "Pick at least one thing"),
  buyingFor: z.enum(["personal", "wholesale", "business"]),
  brandModel: z.string().trim().max(120).optional(),
  condition: z.enum(["any", "new", "uk-used"]),
  quantity: z.string().trim().max(20).optional(),
  budget: z.string().trim().max(60).optional(),
  payment: z.enum(["full", "pay-later", "not-sure"]),
  timeline: z.enum(["today", "this-week", "this-month", "just-asking"]),
  details: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000),
  /** Spam trap: real people leave this empty. */
  website: z.string().max(0).optional(),
});

export type RequestInput = z.infer<typeof requestSchema>;
