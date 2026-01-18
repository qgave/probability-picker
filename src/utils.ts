import type { NestedMap } from './types'

export const secureRandom = (): number => {
    const array = new Uint32Array(1)
    globalThis.crypto.getRandomValues(array)
    return array[0]! / 0x100000000
}

export const normalize = (map: NestedMap, luck: number): [string, number][] => {
    const valid: [string, number][] = []

    for (const [key, value] of Object.entries(map)) {
        const weight = typeof value === 'number' ? value : 1
        if (!Number.isNaN(weight) && weight > 0) {
            valid.push([key, Math.pow(weight, 1 / luck)])
        }
    }

    return valid
}

export const select = (items: [string, number][]): string => {
    const total = items.reduce((acc, [, v]) => acc + v, 0)
    let target = secureRandom() * total

    for (const [k, v] of items) {
        target -= v
        if (target <= 0) return k
    }

    return items[items.length - 1]![0]
}
