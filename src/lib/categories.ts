import type { Category } from '@/payload-types'
import { getPayloadClient } from './payload'

export type CategoryNode = Category & { children: CategoryNode[] }

export const getCategoryTree = async (): Promise<CategoryNode[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'categories', limit: 500, depth: 0, sort: 'order' })
  const nodes = new Map<number, CategoryNode>(docs.map((c) => [c.id, { ...c, children: [] }]))
  const roots: CategoryNode[] = []
  for (const node of nodes.values()) {
    const parentId = typeof node.parent === 'object' ? node.parent?.id : node.parent
    const parent = parentId ? nodes.get(parentId) : undefined
    if (parent) parent.children.push(node)
    else roots.push(node)
  }
  return roots
}

export const descendantIds = (node: CategoryNode): number[] => [
  node.id,
  ...node.children.flatMap(descendantIds),
]

export const findByPath = (roots: CategoryNode[], path: string): CategoryNode | undefined => {
  for (const node of roots) {
    if (node.path === path) return node
    const found = findByPath(node.children, path)
    if (found) return found
  }
  return undefined
}

export const categoryHref = (category: Pick<Category, 'path'>) => `/categorie-produit/${category.path}`
