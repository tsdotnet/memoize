import { describe, it, expect } from 'vitest';
import memoize, {Memoized} from '../src/Memoized';

const MAX = 20;

function* source (): Iterable<number>
{
	for(let i = 0; i<MAX; i++)
	{
		yield  i;
	}
}

function checkFullyCached<T> (list: Memoized<number>): void
{
	let i = 0;
	expect(list.hasCached(i)).toBe(true);
	for(const n of list)
	{
		if(!expect(i).toBeLessThan(MAX)) return;
		expect(n).equal(i);
		expect(list.hasCached(i)).toBe(true);
		i++;
		if(i<MAX) expect(list.hasCached(i)).toBe(true);
	}
	expect(i).equal(MAX);

	for(i = 0; i<MAX; i++)
	{
		expect(list.get(i)).equal(i);
	}
	expect(list.get(MAX)).toBeUndefined();
}


describe('Memoized', () => {
	it('should contain the expected values.', () => {
		const list = memoize(source());
		let i = 0;
		expect(list.hasCached(i)).toBe(false);
		for(const n of list)
		{
			if(!expect(i).toBeLessThan(MAX)) return;
			expect(n).equal(i);
			expect(list.hasCached(i)).toBe(true);
			i++;
			expect(list.hasCached(i)).toBe(false);
		}
		expect(i).equal(MAX);

		checkFullyCached(list);
	});

	it('should work with multiple iterators.', () => {
		const list = memoize(source());
		const iterator = list[Symbol.iterator]();
		let i = 0;
		expect(list.hasCached(i)).toBe(false);
		for(const n of list)
		{
			if(!expect(i).toBeLessThan(MAX)) return;
			expect(list.hasCached(i)).toBe(true);
			expect(list.tryGet(i, v => expect(v).equal(i))).toBe(true);
			expect(n).equal(i);
			if(i%2) // 1 (odd)
			{
				expect(list.hasCached(i + 1)).toBe(false);
			}
			else // 0 (even)
			{
				let next = iterator.next();
				if(!next.done) expect(next.value).equal(i);
				next = iterator.next();
				if(!next.done) expect(next.value).equal(i + 1);
			}
			i++;
		}
		expect(i).equal(MAX);

		checkFullyCached(list);
	});

	it('should allow for random access.', () => {
		let list = memoize(source());
		expect(list.get(MAX + 10)).toBeUndefined();
		expect(list.hasCached(MAX)).toBe(false);
		expect(list.hasCached(MAX - 1)).toBe(true);
		list = memoize(source());
		const r = 5;
		expect(list.get(r)).not.toBeUndefined();
		expect(list.hasCached(r)).toBe(true);
		expect(list.hasCached(r + 1)).toBe(false);
		expect(list.hasCached(r - 1)).toBe(true);
	});
});
