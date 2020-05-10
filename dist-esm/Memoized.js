/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * A class for caching iterated results.
 */
export class Memoized {
    /**
     * Constructs a Memoized<T> that caches the results of the source.
     * Providing a
     * @param {Iterable} source
     */
    constructor(source) {
        if (!source)
            throw new Error('\'source\' is null or undefined.');
        this._iterator = source[Symbol.iterator]();
        this._cached = [];
    }
    /**
     * Returns true if the index is already cached.
     * @param {number} index The index to lookup.
     * @return {boolean} True if the index has cached value.
     */
    hasCached(index) {
        return index < this._cached.length;
    }
    /**
     * Ensures an index is cached (true) or returns false if the index exceeds the number items.
     * @param {number} index The index to ensure.
     * @return {boolean} True if the index was cached.
     */
    ensure(index) {
        const c = this._cached;
        while (c.length <= index && !this.next().done) 
        // eslint-disable-next-line no-empty
        { }
        return index < c.length;
    }
    /**
     * Returns the item at the specified index or undefined if the index exceeds the number items.
     * @param {number} index
     * @return
     */
    get(index) {
        return this.ensure(index) ? this._cached[index] : undefined;
    }
    /**
     * Returns true if the value was acquired and passed to the out delegate.
     * @param {number} index The index to lookup.
     * @param {(e: T) => void} out A delegate function to receive the value if available.
     * @return {boolean} True if the delegate was given a value.
     */
    tryGet(index, out) {
        const ok = this.ensure(index);
        if (ok)
            out(this._cached[index]);
        return index < this._cached.length;
    }
    *[Symbol.iterator]() {
        const c = this._cached;
        let i = 0;
        do {
            for (; i < c.length; i++)
                yield c[i];
            const iterator = this._iterator;
            if (!iterator)
                break;
            const n = iterator.next();
            if (n.done)
                break;
            i++;
            yield n.value;
        } while (true);
    }
    /**
     * Calls next on the iterator and caches the result.
     * @return {IteratorResult} The result of the iterator.
     */
    next() {
        const e = this._iterator;
        if (!e)
            return { done: true, value: undefined };
        const next = e.next();
        if (next.done)
            this._iterator = null;
        else
            this._cached.push(next.value);
        return next;
    }
}
/**
 * Returns a Memoized<T> for caching results of an iterable.
 * @param {Iterable} source
 * @return {Memoized}
 */
export default function memoize(source) {
    return new Memoized(source);
}
//# sourceMappingURL=Memoized.js.map