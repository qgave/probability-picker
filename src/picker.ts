import type { NestedMap, PickerInstance } from './types'
import { normalize, select } from './utils'

class ProbabilityEngine<T extends string> implements PickerInstance<T> {
    private _luck = 1
    private _map: NestedMap

    constructor(map: NestedMap) {
        this._map = map
    }

    luck(value: number) {
        this._luck = value
        return this
    }

    one(): T | undefined {
        const entries = normalize(this._map, this._luck)
        if (entries.length === 0) return

        const key = select(entries)
        const value = this._map[key]

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return new ProbabilityEngine(value).luck(this._luck).one() as T
        }

        return key as T
    }

    take(n: number): T[] {
        const results: T[] = []
        for (let i = 0; i < n; i++) {
            const picked = this.one()
            if (picked) results.push(picked)
        }
        return results
    }
}

export function picker<T extends string>(map: Record<T, number | NestedMap>): PickerInstance<T> {
    if (!map || typeof map !== 'object') {
        return new ProbabilityEngine<T>({} as NestedMap)
    }
    return new ProbabilityEngine<T>(map as NestedMap)
}
