/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

// https://stackoverflow.com/questions/12766422/why-is-a-javascript-array-index-at-most-4294967294-but-not-4294967295
const MAX_ARRAY_LENGTH = 4294967295;

/**
 * A class for caching iterated results.
 */
export class Memoized<T>
implements Iterable<T>, Iterator<T>
{
	private _iterator: Iterator<T> | null;
	private readonly _cached: T[];

	/**
	 * Constructs a Memoized<T> that caches the results of the source.
	 * Providing a
	 * @param {Iterable} source
	 */
	constructor (source: Iterable<T>)
	{
		if(!source) throw new Error('\'source\' is null or undefined.');
		this._iterator = source[Symbol.iterator]();
		this._cached = [];
	}

	/**
	 * Returns true if the index is already cached.
	 * @param {number} index The index to lookup.
	 * @return {boolean} True if the index has cached value.
	 */
	hasCached (index: number): boolean
	{
		return index<this._cached.length && index<MAX_ARRAY_LENGTH;
	}

	/**
	 * Ensures an index is cached (true) or returns false if the index exceeds the number items.
	 * @param {number} index The index to ensure.
	 * @return {boolean} True if the index was cached.
	 */
	ensure (index: number): boolean
	{
		if(index>=MAX_ARRAY_LENGTH) return false;
		const c = this._cached;
		while(c.length<=index && !this.next().done)
		// eslint-disable-next-line no-empty
		{}
		return index<c.length;
	}

	/**
	 * Returns the item at the specified index or undefined if the index exceeds the number items.
	 * @param {number} index
	 * @return
	 */
	get (index: number): T | undefined
	{
		return this.ensure(index) ? this._cached[index] : undefined;
	}

	/**
	 * Returns true if the value was acquired and passed to the out delegate.
	 * @param {number} index The index to lookup.
	 * @param {(e: T) => void} out A delegate function to receive the value if available.
	 * @return {boolean} True if the delegate was given a value.
	 */
	tryGet (index: number, out: (e: T) => void): boolean
	{
		const ok = this.ensure(index);
		if(ok) out(this._cached[index]);
		return ok;
	}

	* [Symbol.iterator] (): Iterator<T>
	{
		const c = this._cached;
		let i = 0, done = false;

		do
		{
			// always pull from the cache as multiple iterators could be active.
			while(i<c.length) yield c[i++];
			if(!this._iterator || this.next().done) done = true;
		}
		while(!done || i<c.length);
	}

	/**
	 * Calls next on the iterator and caches the result.
	 * @return {IteratorResult} The result of the iterator.
	 */
	next (): IteratorResult<T>
	{
		const e = this._iterator;
		if(!e) return {done: true, value: undefined};
		const next = e.next();
		if(next.done) this._iterator = null;
		else this._cached.push(next.value);
		return next;
	}
}

/**
 * Returns a Memoized<T> for caching results of an iterable.
 * @param {Iterable} source
 * @return {Memoized}
 */
export default function memoize<T> (source: Iterable<T>): Memoized<T> {
	return new Memoized<T>(source);
}
