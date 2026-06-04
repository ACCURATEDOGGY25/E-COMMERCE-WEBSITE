/** Keep in sync with backend/src/lib/demoCategoryGroups.ts */
export const CATEGORY_GROUPS: Record<string, string[]> = {
  electronics: ["electronics", "phones", "laptops", "audio"],
  fashion: ["fashion", "men", "women", "fashion-accessories", "fashion-shoes"],
  gaming: [
    "gaming",
    "gaming-accessories",
    "gaming-consoles",
    "pc-gaming",
    "video-games",
  ],
  home: ["home", "home-furniture", "home-kitchen"],
  sports: ["sports", "fitness", "outdoor"],
  beauty: ["beauty", "skincare", "makeup"],
  phones: ["phones", "electronics"],
  audio: ["audio", "electronics"],
  books: ["books"],
  toys: ["toys"],
};

export function categoryMatches(
  productCategorySlug: string | undefined,
  filterSlug: string
): boolean {
  if (!productCategorySlug) return false;
  if (productCategorySlug === filterSlug) return true;
  const group = CATEGORY_GROUPS[filterSlug];
  if (group) return group.includes(productCategorySlug);
  return false;
}

export function getCategoryDisplayName(slug: string): string {
  const names: Record<string, string> = {
    electronics: "Electronics",
    fashion: "Fashion",
    gaming: "Games & Gaming",
    phones: "Phones & Tablets",
    home: "Home & Living",
    beauty: "Beauty & Health",
    sports: "Sports & Outdoors",
    audio: "Audio & Headphones",
    books: "Books & Media",
    toys: "Toys & Kids",
    men: "Men's Fashion",
    women: "Women's Fashion",
  };
  return names[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
