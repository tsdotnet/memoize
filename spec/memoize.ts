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
	expect(list.hasCached(i)).toBeTrue();
	for(const n of list)
	{
		if(!expect(i).toBeLessThan(MAX)) return;
		expect(n).toBe(i);
		expect(list.hasCached(i)).toBeTrue();
		i++;
		expect(list.hasCached(i)).toBeTrue();
	}
	expect(i).toBe(MAX);

	for(i = 0; i<MAX; i++)
	{
		expect(list.get(i)).toBe(i);
	}
	expect(list.get(MAX)).toBeUndefined();
}


describe('Memoized', () => {
	it('should contain the expected values.', () => {
		const list = memoize(source());
		let i = 0;
		expect(list.hasCached(i)).toBeFalse();
		for(const n of list)
		{
			if(!expect(i).toBeLessThan(MAX)) return;
			expect(n).toBe(i);
			expect(list.hasCached(i)).toBeTrue();
			i++;
			expect(list.hasCached(i)).toBeFalse();
		}
		expect(i).toBe(MAX);

		checkFullyCached(list);
	});

	it('should with multiple iterators.', () => {
		const list = memoize(source());
		const iterator = list[Symbol.iterator]();
		let i = 0;
		expect(list.hasCached(i)).toBeFalse();
		expect(iterator.next().value).toBe(0);
		for(const n of list)
		{
			if(!expect(i).toBeLessThan(MAX)) return;
			expect(n).toBe(i);
			if(i%2)
			{
				expect(list.hasCached(i)).toBeTrue();
			}
			else
			{
				expect(list.hasCached(i)).toBeFalse();
				const next = iterator.next();
				if(!next.done) expect(iterator.next().value).toBe(i + 1);
			}
			i++;
			expect(list.hasCached(i)).toBeFalse();
		}
		expect(i).toBe(MAX);

		checkFullyCached(list);
	});

	it('should allow for random access.', () => {
		let list = memoize(source());
		expect(list.get(MAX + 10)).toBeUndefined();
		expect(list.hasCached(MAX)).toBeFalse();
		expect(list.hasCached(MAX - 1)).toBeTrue();
		list = memoize(source());
		const r = 5;
		expect(list.get(r)).not.toBeUndefined();
		expect(list.hasCached(r)).toBeTrue();
		expect(list.hasCached(r + 1)).toBeFalse();
		expect(list.hasCached(r - 1)).toBeTrue();
	});
});
