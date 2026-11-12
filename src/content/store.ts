/**
 * LuckyTech business details. Edit this file to change contact info,
 * branches, services or FAQs anywhere on the site.
 * Source: LuckyTech flyer and luckytechstore.com (November 2026).
 */

export interface Branch {
  id: "owo" | "akure";
  name: string;
  label: string;
  main: boolean;
  address: string[];
  city: string;
  state: string;
  /** Local phone numbers as written (0xxx). */
  phones: string[];
  /** WhatsApp number that receives this branch's orders (international format, digits only). */
  whatsapp: string;
  mapQuery: string;
}

export const store = {
  name: "LuckyTech",
  legalName: "LuckyTech Communications",
  monogram: "LKT",
  tagline: "Gadget solutions with peace of mind.",
  description:
    "Phones, gadgets and accessories in Owo and Akure, Ondo State. New and UK-used iPhone, Samsung, Redmi, Infinix, Tecno and Itel, original screens, repairs in under 45 minutes, wholesale and retail prices, and buy now, pay later.",
  currency: "NGN",
  locale: "en-NG",
  email: "", // Add the store email when available; the request form also emails here if set in env.
  socials: [] as { label: string; href: string }[],
};

export const branches: Branch[] = [
  {
    id: "owo",
    name: "Owo Main Store",
    label: "Owo (Main store)",
    main: true,
    address: ["No 12, Idimisas Street", "Adjacent Chicken Republic, Ijebu"],
    city: "Owo",
    state: "Ondo State",
    phones: ["07036391276", "09163502762"],
    whatsapp: "2347036391276",
    mapQuery: "12 Idimisas Street, Ijebu, Owo, Ondo State, Nigeria",
  },
  {
    id: "akure",
    name: "Akure Branch",
    label: "Akure",
    main: false,
    address: ["Down Floor, Olukayode House", "Oshinle Roundabout"],
    city: "Akure",
    state: "Ondo State",
    phones: ["07088565957"],
    whatsapp: "2347088565957",
    mapQuery: "Olukayode House, Oshinle Roundabout, Akure, Ondo State, Nigeria",
  },
];

export const mainBranch = branches.find((b) => b.main) ?? branches[0];
export const branchById = (id: string) => branches.find((b) => b.id === id);

export const services = [
  { id: "phones", title: "Phones, new and UK-used", body: "iPhone, Samsung, Redmi, Infinix, Tecno and Itel. Checked and tested before they leave the shop." },
  { id: "repair", title: "Repairs in under 45 minutes", body: "Wait and get your phone back fixed. Cracked screens, charging ports, batteries and more." },
  { id: "screens", need: "Original phone screen", title: "Original phone screens", body: "Genuine replacement screens, fitted in store or sold to technicians." },
  { id: "accessories", title: "Accessories and gadgets", body: "Chargers, cables, power banks, pouches, screen guards, earbuds, smartwatches and speakers (JBL, Zealot and more)." },
  { id: "wholesale", title: "Wholesale and retail prices", body: "Buying for your own shop? Ask for wholesale prices on phones and accessories." },
  { id: "paylater", title: "Buy now, pay later", body: "Take your phone home with a 30% down payment and spread the rest." },
] as const;

/** Accessory and gadget categories sold in store. Prices vary by model, so these go to the request form or WhatsApp. */
export const accessoryCategories = [
  { id: "chargers", need: "Charger or cable", title: "Chargers & cables", note: "Fast chargers, USB-C, Lightning, car chargers" },
  { id: "power-banks", need: "Power bank", title: "Power banks", note: "10,000 to 30,000 mAh, fast-charge" },
  { id: "pouches", need: "Pouch or case", title: "Pouches & cases", note: "Silicone, leather, rugged and clear cases" },
  { id: "screen-guards", need: "Screen guard", title: "Screen guards", note: "Tempered glass, privacy and full-glue" },
  { id: "audio", need: "Speaker or earbuds", title: "Speakers & earbuds", note: "JBL, Zealot, Oraimo and more" },
  { id: "watches", need: "Smartwatch", title: "Smartwatches", note: "Fitness bands and smartwatches" },
  { id: "screens", need: "Original phone screen", title: "Original screens", note: "For iPhone, Samsung, Tecno, Infinix and more" },
  { id: "other", need: "Something else", title: "Anything else", note: "Tell us what you need and we'll source it" },
] as const;

export const brands = ["Apple", "Samsung", "Redmi", "Infinix", "Tecno", "Itel", "JBL", "Zealot", "Oraimo"];

export const promises = [
  { value: "45 min", label: "Phone repairs, while you wait" },
  { value: "30%", label: "Down payment to take a phone home" },
  { value: "2", label: "Stores in Ondo State: Owo and Akure" },
  { value: "W & R", label: "Wholesale and retail prices" },
];

export const faqs = [
  {
    q: "How does buy now, pay later work?",
    a: "Pay 30% of the phone's price as a down payment and take it home. The balance is spread over agreed instalments. Send a request or message your nearest branch on WhatsApp to get started; we'll confirm the terms with you.",
  },
  {
    q: "Are UK-used phones tested?",
    a: "Yes. Every UK-used phone is checked (battery, screen, cameras, network and Face ID or fingerprint) before it's sold.",
  },
  {
    q: "How long does a repair take?",
    a: "Most repairs, like screens and charging ports, are done in under 45 minutes while you wait. We'll tell you the price and time before we start.",
  },
  {
    q: "Do you sell wholesale?",
    a: "Yes. We sell phones and accessories at wholesale and retail prices. Use the request form and choose “Wholesale”, or message us on WhatsApp.",
  },
  {
    q: "How do I pay?",
    a: "Pay online by card, bank transfer or USSD with Paystack or Flutterwave, or order on WhatsApp and pay at the store or on delivery where available.",
  },
  {
    q: "Do you deliver?",
    a: "Pick up at our Owo or Akure store, or ask for delivery. Delivery fees depend on your location and are confirmed on WhatsApp before dispatch.",
  },
];
