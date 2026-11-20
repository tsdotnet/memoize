/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
export declare class Memoized<T> implements Iterable<T>, Iterator<T> {
    private _iterator;
    private readonly _cached;
    constructor(source: Iterable<T>);
    hasCached(index: number): boolean;
    ensure(index: number): boolean;
    get(index: number): T | undefined;
    tryGet(index: number, out: (e: T) => void): boolean;
    [Symbol.iterator](): Iterator<T>;
    next(): IteratorResult<T>;
}
export default function memoize<T>(source: Iterable<T>): Memoized<T>;
