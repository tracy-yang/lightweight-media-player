type Mutable<T> = {
    -readonly [K in keyof T]: Mutable<T[K]>;
}   

export const mutable = <T extends readonly any[] | Record<string, unknown>>(
    val: T
) => val as Mutable<typeof val>