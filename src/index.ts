type ProbabilityMap = Record<string, number>
type Entry = [string, number]

function filterNumbers(entries: Entry[]) {
    return entries.filter(e => typeof e[1] === 'number' && !Number.isNaN(e[1]))
}

function sortEntries(entries: Entry[]) {
    return entries.sort((a, b) => a[1] - b[1])
}

function sumProbabilities(entries: Entry[]) {
    return entries.reduce((acc, e) => acc + e[1], 0)
}

function normalizeProbabilities(entries: Entry[], total: number) {
    return entries.map(([k, v]) => [k, Math.round((v / total) * 100)] as Entry)
}

function prepareEntries(entries: Entry[]) {
    const filtered = filterNumbers(entries)
    if (filtered.length === 0) return
    const sorted = sortEntries(filtered)
    const sum = sumProbabilities(sorted)
    if (sum === 0) return
    if (sum === 100) return sorted
    return normalizeProbabilities(sorted, sum)
}

function random(min: number, max: number) {
    return Math.random() * (max - min) + min
}

function chooseOne(entries: Entry[]) {
    const num = random(1, 100)
    let count = 0
    for (const entry of entries) {
        count += entry[1]
        if (num <= count) return entry[0]
    }
    return entries[entries.length - 1]![0]
}

function probabilityPicker(map: ProbabilityMap): string | null | undefined {
    if (!(map instanceof Object)) return null
    const entries = Object.entries(map) as Entry[]
    if (entries.length === 0) return undefined
    const first = entries[0]
    if (first && entries.length === 1) return first[0]
    const prepared = prepareEntries(entries)
    if (!prepared) return undefined
    return chooseOne(prepared)
}

export default probabilityPicker;