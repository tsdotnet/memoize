import {expect} from 'chai';
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
	expect(list.hasCached(i)).to.be.true;
	for(const n of list)
	{
		if(!expect(i).to.be.lessThan(MAX)) return;
		expect(n).equal(i);
		expect(list.hasCached(i)).to.be.true;
		i++;
		if(i<MAX) expect(list.hasCached(i)).to.be.true;
	}
	expect(i).equal(MAX);

	for(i = 0; i<MAX; i++)
	{
		expect(list.get(i)).equal(i);
	}
	expect(list.get(MAX)).to.be.undefined;
}


describe('Memoized', () => {
	it('should contain the expected values.', () => {
		const list = memoize(source());
		let i = 0;
		expect(list.hasCached(i)).to.be.false;
		for(const n of list)
		{
			if(!expect(i).to.be.lessThan(MAX)) return;
			expect(n).equal(i);
			expect(list.hasCached(i)).to.be.true;
			i++;
			expect(list.hasCached(i)).to.be.false;
		}
		expect(i).equal(MAX);

		checkFullyCached(list);
	});

	it('should work with multiple iterators.', () => {
		const list = memoize(source());
		const iterator = list[Symbol.iterator]();
		let i = 0;
		expect(list.hasCached(i)).to.be.false;
		for(const n of list)
		{
			if(!expect(i).to.be.lessThan(MAX)) return;
			expect(list.hasCached(i)).to.be.true;
			expect(list.tryGet(i, v => expect(v).equal(i))).to.be.true;
			expect(n).equal(i);
			if(i%2) // 1 (odd)
			{
				expect(list.hasCached(i + 1)).to.be.false;
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
		expect(list.get(MAX + 10)).to.be.undefined;
		expect(list.hasCached(MAX)).to.be.false;
		expect(list.hasCached(MAX - 1)).to.be.true;
		list = memoize(source());
		const r = 5;
		expect(list.get(r)).not.to.be.undefined;
		expect(list.hasCached(r)).to.be.true;
		expect(list.hasCached(r + 1)).to.be.false;
		expect(list.hasCached(r - 1)).to.be.true;
	});
});
