export type NestedMap = { [key: string]: number | NestedMap }

export interface PickerInstance<T extends string> {
    luck(value: number): this
    one(): T | undefined
    take(n: number): T[]
}
