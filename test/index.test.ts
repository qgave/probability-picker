import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest'
import { picker, bag, NestedMap } from '../src/index'

describe('Probability Picker', () => {
    describe('picker - validation', () => {
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

        it('should return undefined when map is empty', () => {
            const result = picker({}).one()
            expect(result, 'Empty map should result in undefined').toBeUndefined()
        })

        it('should handle invalid runtime inputs gracefully', () => {
            // @ts-expect-error
            expect(picker(null).one()).toBeUndefined()
            // @ts-expect-error
            expect(picker(undefined).one()).toBeUndefined()
        })

        it('should return the only option when map has one key', () => {
            const key = 'guaranteed'
            const result = picker({ [key]: 100 }).one()
            expect(result).toBe(key)
        })

        it('should ignore entries with zero or negative weights', () => {
            const result = picker({ a: 0, b: -5, c: 100 }).one()
            expect(result).toBe('c')
        })

        it('should select based on distribution when weights are mixed', () => {
            const weights = { common: 90, rare: 10 }
            randomSpy.mockReturnValue(0.01)

            expect(picker(weights).one()).toBe('common')
        })
    })

    describe('picker - features', () => {
        it('should return multiple values when take(n) is called', () => {
            const results = picker({ item: 100 }).take(3)
            expect(results).toHaveLength(3)
            expect(results.every(r => r === 'item')).toBe(true)
        })

        it('should return an empty array when take(0) is called', () => {
            const results = picker({ a: 100 }).take(0)
            expect(results).toEqual([])
        })

        it('should support deep selection in nested maps', () => {
            const map: Record<string, number | NestedMap> = {
                category: {
                    item: 100
                }
            }
            expect(picker(map).one()).toBe('item')
        })

        it('should favor rare items when luck is high', () => {
            const map = { rare: 1, common: 99 }
            const results = picker(map).luck(10).take(100)
            const rareCount = results.filter(r => r === 'rare').length

            expect(rareCount, 'High luck should trigger more rare drops').toBeGreaterThan(0)
        })
    })

    describe('bag - utility', () => {
        it('should not repeat values until the bag is empty', () => {
            const pack = bag({ a: 1, b: 1 })

            const first = pack.next()
            const second = pack.next()

            expect(first).toBeDefined()
            expect(second).toBeDefined()
            expect(first).not.toBe(second)
        })

        it('should refill automatically when exhausted', () => {
            const pack = bag({ a: 1 })

            expect(pack.next()).toBe('a')
            expect(pack.next()).toBe('a')
        })
    })
})
