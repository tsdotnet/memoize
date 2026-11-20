<a href="https://tsdotnet.github.io/memoize/"><img src="https://cdn.jsdelivr.net/gh/tsdotnet/memoize@master/assets/banner.svg" alt="@tsdotnet/memoize: Iterate once. Read again. Cache what any iterable yields."></a>

[![npm version](https://img.shields.io/npm/v/@tsdotnet/memoize.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/memoize)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/memoize/blob/master/LICENSE)

Cache the results of any iterable as they are read, so it can be replayed without recomputing.

## Install

```sh
npm install @tsdotnet/memoize
```

## Usage

```ts
import memoize from '@tsdotnet/memoize';

function* numbers() {
	for (let i = 1; i <= 3; i++) { console.log('compute', i); yield i; }
}

const seen = memoize(numbers());
[...seen]; // logs compute 1, 2, 3
[...seen]; // replays from the cache, logs nothing
seen.get(1); // 2
```

The source is read lazily, only as far as something asks. Several iterators can share one `Memoized`.

## Use it from

ESM (`import memoize from '@tsdotnet/memoize';`) or CommonJS (`const memoize = require('@tsdotnet/memoize').default;`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/memoize@1/dist/umd/memoize.min.js"></script>
<script>
  const memoize = tsdotnet.memoize.default;
</script>
```

</details>

## Docs

[tsdotnet.github.io/memoize](https://tsdotnet.github.io/memoize/)
