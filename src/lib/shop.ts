import { discountPercent, type Category, type Condition, type Product } from "@/content/products";

export type SortKey = "featured" | "price-asc" | "price-desc" | "discount";

export interface ShopFilters {
  category: Category | "all";
  brand: string;
  condition: Condition | "all";
  sort: SortKey;
  query: string;
}

export function filterProducts(all: readonly Product[], f: ShopFilters): Product[] {
  const words = f.query.toLowerCase().split(/\s+/).filter(Boolean);
  const out = all.filter((p) => {
    if (f.category !== "all" && p.category !== f.category) return false;
    if (f.brand !== "all" && p.brand !== f.brand) return false;
    if (f.condition !== "all" && p.condition !== f.condition) return false;
    if (words.length) {
      const hay = `${p.name} ${p.brand} ${p.storage ?? ""} ${p.ram ?? ""} ${p.condition} ${p.network ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    }
    return true;
  });
  const sorted = [...out];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      sorted.sort((a, b) => discountPercent(b) - discountPercent(a));
      break;
    default:
      sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
  return sorted;
}
