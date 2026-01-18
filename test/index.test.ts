import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest'
import pick from '../src/index'

describe('probabilityPicker', () => {
    let randomSpy: MockInstance

    beforeEach(() => {
        vi.restoreAllMocks()
        randomSpy = vi.spyOn(Math, 'random')

        if (typeof crypto !== 'undefined') {
            vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
                (arr as Uint32Array)[0] = Math.floor(Math.random() * 0x100000000)
                return arr
            })
        }
    })

    const forceRandom = (val: number) => {
        randomSpy.mockReturnValue(val)
    }

    it('handles invalid input safely', () => {
        expect(pick(null as any)).toBe(null)
        expect(pick(undefined as any)).toBe(null)
    })

    it('returns undefined for empty maps', () => {
        expect(pick({})).toBe(undefined)
    })

    it('returns the only available option', () => {
        expect(pick({ 'guaranteed-drop': 100 })).toBe('guaranteed-drop')
    })

    it('handles zero-sum maps', () => {
        expect(pick({ 'option-a': 0, 'option-b': 0 })).toBe(undefined)
    })

    it('selects based on weight distribution', () => {
        const lootTable = { common: 90, rare: 10 }

        forceRandom(0.0)
        expect(pick(lootTable)).toBe('rare')

        forceRandom(0.89)
        expect(pick(lootTable)).toBe('common')

        forceRandom(0.9)
        expect(pick(lootTable)).toBe('common')
    })

    it('normalizes weights automatically', () => {
        forceRandom(0.5)
        const result = pick({ 'low-weight': 1, 'another-low': 1 })
        expect(['low-weight', 'another-low']).toContain(result)
    })

    it('filters out invalid weights', () => {
        const mixedData = {
            valid: 50,
            invalid: 'string' as any,
            alsoValid: 50
        }
        forceRandom(0.5)
        const result = pick(mixedData)
        expect(['valid', 'alsoValid']).toContain(result)
    })

    describe('engine selection', () => {
        it('uses crypto when available', () => {
            const spy = vi.spyOn(crypto, 'getRandomValues')
            pick({ a: 50, b: 50 })
            expect(spy).toHaveBeenCalled()
        })

        it('falls back to Math.random when crypto is missing', () => {
            vi.stubGlobal('crypto', undefined)
            const spy = vi.spyOn(Math, 'random')

            pick({ a: 50, b: 50 })

            expect(spy).toHaveBeenCalled()
            vi.unstubAllGlobals()
        })
    })
})
