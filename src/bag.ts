import { picker } from './picker'

export function bag<T extends string>(map: Record<T, number>) {
    let remaining = { ...map }

    return {
        next(): T | undefined {
            const keys = Object.keys(remaining)
            if (keys.length === 0) remaining = { ...map }
            const picked = picker(remaining).one()
            if (picked) delete remaining[picked as T]
            return picked as T
        }
    }
}
