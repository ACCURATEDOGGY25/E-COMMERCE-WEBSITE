import { prisma } from "./prisma.js";

type CatNode = {
  id: string;
  children?: CatNode[];
};

function collectIds(node: CatNode, ids: string[]): void {
  ids.push(node.id);
  for (const child of node.children ?? []) {
    collectIds(child, ids);
  }
}

/** All category IDs for a slug, including nested subcategories. */
export async function getCategoryDescendantIds(
  slugOrId: string
): Promise<string[]> {
  const root = await prisma.category.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
    include: {
      children: {
        include: {
          children: {
            include: { children: true },
          },
        },
      },
    },
  });
  if (!root) return [];
  const ids: string[] = [];
  collectIds(root as CatNode, ids);
  return ids;
}
