import type { Where } from 'payload'
import { getPayloadClient } from './payload'
import { plantAttributes, type PlantAttributeKey } from './plantAttributes'

export const PAGE_SIZE = 24

export const sortOptions = [
  { value: 'nom', label: 'Nom (A → Z)', sort: 'title' },
  { value: 'prix-asc', label: 'Prix croissant', sort: 'minPrice' },
  { value: 'prix-desc', label: 'Prix décroissant', sort: '-minPrice' },
  { value: 'nouveautes', label: 'Nouveautés', sort: '-createdAt' },
] as const

export type SearchParams = Record<string, string | string[] | undefined>

const asArray = (v: string | string[] | undefined): string[] => (v === undefined ? [] : Array.isArray(v) ? v : [v])

export const filterKeys = Object.keys(plantAttributes) as PlantAttributeKey[]

export const activeFilters = (params: SearchParams) =>
  Object.fromEntries(filterKeys.map((k) => [k, asArray(params[k])])) as Record<PlantAttributeKey, string[]>

type Options = { where?: Where; params: SearchParams; withPlantFilters?: boolean }

export async function findProducts({ where, params, withPlantFilters }: Options) {
  const payload = await getPayloadClient()
  const and: Where[] = where ? [where] : []

  if (withPlantFilters) {
    for (const [key, values] of Object.entries(activeFilters(params))) {
      if (values.length) and.push({ [`plant.${key}`]: { in: values } })
    }
  }

  const sortKey = asArray(params.tri)[0]
  const sort = sortOptions.find((o) => o.value === sortKey)?.sort ?? 'title'
  const page = Math.max(1, Number(asArray(params.page)[0]) || 1)

  return payload.find({
    collection: 'products',
    where: and.length ? { and } : undefined,
    sort,
    page,
    limit: PAGE_SIZE,
    depth: 1,
    overrideAccess: false,
  })
}
