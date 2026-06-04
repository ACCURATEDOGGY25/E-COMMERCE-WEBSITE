/** Map parent category slugs to all demo product category slugs in that department. */
export const DEMO_CATEGORY_GROUPS: Record<string, string[]> = {
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
  phones: ["phones"],
  audio: ["audio"],
  books: ["books"],
  toys: ["toys"],
};

export function demoCategoryMatches(
  productCategorySlug: string,
  filterSlug: string
): boolean {
  if (productCategorySlug === filterSlug) return true;
  const group = DEMO_CATEGORY_GROUPS[filterSlug];
  if (group) return group.includes(productCategorySlug);
  return false;
}
