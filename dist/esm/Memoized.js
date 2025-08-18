/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
const MAX_ARRAY_LENGTH = 4294967295;
class Memoized {
    _iterator;
    _cached;
    constructor(source) {
        if (!source)
            throw new Error('\'source\' is null or undefined.');
        this._iterator = source[Symbol.iterator]();
        this._cached = [];
    }
    hasCached(index) {
        return index < this._cached.length && index < MAX_ARRAY_LENGTH;
    }
    ensure(index) {
        if (index >= MAX_ARRAY_LENGTH)
            return false;
        const c = this._cached;
        while (c.length <= index && !this.next().done) { }
        return index < c.length;
    }
    get(index) {
        return this.ensure(index) ? this._cached[index] : undefined;
    }
    tryGet(index, out) {
        const ok = this.ensure(index);
        if (ok)
            out(this._cached[index]);
        return ok;
    }
    *[Symbol.iterator]() {
        const c = this._cached;
        let i = 0, done = false;
        do {
            while (i < c.length)
                yield c[i++];
            if (!this._iterator || this.next().done)
                done = true;
        } while (!done || i < c.length);
    }
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
function memoize(source) {
    return new Memoized(source);
}

export { Memoized, memoize as default };
//# sourceMappingURL=Memoized.js.map
