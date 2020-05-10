/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * A class for caching iterated results.
 */
export declare class Memoized<T> implements Iterable<T>, Iterator<T> {
    private _iterator;
    private readonly _cached;
    /**
     * Constructs a Memoized<T> that caches the results of the source.
     * Providing a
     * @param {Iterable} source
     */
    constructor(source: Iterable<T>);
    /**
     * Returns true if the index is already cached.
     * @param {number} index The index to lookup.
     * @return {boolean} True if the index has cached value.
     */
    hasCached(index: number): boolean;
    /**
     * Ensures an index is cached (true) or returns false if the index exceeds the number items.
     * @param {number} index The index to ensure.
     * @return {boolean} True if the index was cached.
     */
    ensure(index: number): boolean;
    /**
     * Returns the item at the specified index or undefined if the index exceeds the number items.
     * @param {number} index
     * @return
     */
    get(index: number): T | undefined;
    /**
     * Returns true if the value was acquired and passed to the out delegate.
     * @param {number} index The index to lookup.
     * @param {(e: T) => void} out A delegate function to receive the value if available.
     * @return {boolean} True if the delegate was given a value.
     */
    tryGet(index: number, out: (e: T) => void): boolean;
    [Symbol.iterator](): Iterator<T>;
    /**
     * Calls next on the iterator and caches the result.
     * @return {IteratorResult} The result of the iterator.
     */
    next(): IteratorResult<T>;
}
/**
 * Returns a Memoized<T> for caching results of an iterable.
 * @param {Iterable} source
 * @return {Memoized}
 */
export default function memoize<T>(source: Iterable<T>): Memoized<T>;
