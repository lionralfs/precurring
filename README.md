# `precurring` - Recurring Promises

[![npm](https://img.shields.io/npm/v/precurring.svg)](https://www.npmjs.com/package/precurring)
![build status](https://github.com/lionralfs/precurring/actions/workflows/main.yml/badge.svg)

## Installation

```sh
npm install --save precurring
```

Alternatively, the UMD build is available on unpkg:

```html
<script src="https://unpkg.com/precurring/dist/precurring.umd.js"></script>
```

You can find the library on `window.precurring`.

## Examples

### Pinging a server

```js
import precurring from 'precurring';

const ping = precurring({
  fn: () => fetch('/ping'),
  interval: 5000, // fetch every 5 sec
  timeout: 20000, // wait 20 sec max (optional)
  onSuccess: console.log,
  onError: console.error,
});

ping.start();
```

### Stopping after X errors

```js
import precurring from 'precurring';

let counter = 0;

const instance = precurring({
  fn: myFunction,
  interval: 1000,
  onSuccess: console.log,
  onError: () => {
    if (++counter === 3) {
      instance.stop();
    }
  },
});

instance.start();
```

## Docs

### `precurring`

Takes an Object with all the properties listed below and returns an Object with `start` and `stop` methods.

- `start()` starts the interval of calling `fn` repeatedly.
- `stop()` stops it accordingly.

### `fn` (`(...args: any[]) => Promise<any>`)

A function returning a Promise. This is a wrapper function over your own logic, which you want to repeatedly call. The value it resolves to is passed to `onSuccess`. If it rejects, the error is passed to `onError`.

### `interval` (`number`)

A number in milliseconds between calls of `fn`. To be more precise, it is the time between the previous Promise settling, and `fn` being called again. Due to the library using `setTimeout`, this specified number is not 100% reliable, see [accuracy](#accuracy).

### `timeout` (`number` - optional)

A number in milliseconds after which to cancel `fn`. Note that this does not actually stop the execution of `fn` but instead ignores its return value after it times out. The `timeout` value is also subject to the [accuracy](#accuracy) issues.
Since this value is optional, the default behavior is to wait however long it takes for the Promise returned by `fn` to settle.

### `onSuccess` (`(val: any) => any`)

A callback function which is called with the value that `fn`'s Promise settles with.

### `onError` (`(error: any) => any`)

A callback function which is called with whatever `fn`'s Promise rejects with.

## <a id="accuracy"></a>Accuracy

Under the hood, `setTimeout` is used throughout this library. Because of how it is implemented, it does not guarantee the execution time of its callback function. Take this explainer from the [MDN docs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals#settimeout):

> **Note:** The specified amount of time (or the delay) is **not** the _guaranteed time_ to execution, but rather the _minimum time_ to execution. The callbacks you pass to these functions cannot run until the stack on the main thread is empty.

> As a consequence, code like `setTimeout(fn, 0)` will execute as soon as the stack is empty, **not** immediately. [...]

However, in most cases this is negligible. If you rely on a more accurate implementation, you should look for a different implementation/library.

## References

- David Walsh's [JavaScript fetch with Timeout](https://davidwalsh.name/fetch-timeout) which this library is based on

## License

[MIT](LICENSE) © Lion Ralfs
