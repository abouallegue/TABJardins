import Link from 'next/link'

import { activeFilters, filterKeys, sortOptions, type SearchParams } from '@/lib/catalog'
import { plantAttributes } from '@/lib/plantAttributes'

type Props = { basePath: string; params: SearchParams; showPlantFilters: boolean; extraHidden?: Record<string, string> }

// Formulaire GET : les filtres fonctionnent sans JavaScript et donnent des URL partageables.
export function CatalogFilters({ basePath, params, showPlantFilters, extraHidden }: Props) {
  const active = activeFilters(params)
  const tri = typeof params.tri === 'string' ? params.tri : 'nom'
  const count = Object.values(active).reduce((n, v) => n + v.length, 0)

  return (
    <form action={basePath} className="space-y-6">
      {extraHidden &&
        Object.entries(extraHidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <label className="grid gap-1 text-sm font-semibold">
        Trier par
        <select name="tri" defaultValue={tri} className="field font-normal">
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      {showPlantFilters &&
        filterKeys.map((key) => (
          <details key={key} open={active[key].length > 0} className="border-t border-line pt-4">
            <summary className="cursor-pointer text-sm font-semibold">
              {plantAttributes[key].label}
              {active[key].length > 0 && <span className="ml-1 text-leaf">({active[key].length})</span>}
            </summary>
            <div className="mt-3 grid gap-1.5">
              {plantAttributes[key].options.map((o) => (
                <label key={o.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={key}
                    value={o.value}
                    defaultChecked={active[key].includes(o.value)}
                    className="h-4 w-4 accent-forest"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </details>
        ))}

      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <button className="btn-primary">Appliquer</button>
        {count > 0 && (
          <Link href={basePath} className="btn-outline">
            Effacer ({count})
          </Link>
        )}
      </div>
    </form>
  )
}
