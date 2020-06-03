# `precurring` - Recurring Promises

[![npm](https://img.shields.io/npm/v/precurring.svg)](https://www.npmjs.com/package/precurring)
[![Build Status](https://travis-ci.com/lionralfs/precurring.svg?branch=master)](https://travis-ci.com/lionralfs/precurring)


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
// in JavaScript (ESModules):
import precurring from 'precurring';
// in Node.js (CommonJS):
const precurring = require('precurring');

// in TypeScript, do this:
import precurring = require('precurring');
// or, when esModuleInterop is set to true, you can do:
import precurring from 'precurring';

const ping = precurring({
  fn: () => fetch('/ping'),
  interval: 5000, // fetch every 5 sec
  timeout: 20000, // wait 20 sec max (optional)
  onSuccess: console.log,
  onError: console.error
});

ping.start();
```

### Stopping after X errors

```js
import precurring from 'precurring';

let counter = 0;

const instance = precurring({
  fn: myFunction, // make sure it returns something ".then-able"
  interval: 1000,
  onSuccess: console.log,
  onError: () => {
    if (++counter === 3) {
      instance.stop();
    }
  }
});

instance.start();
```

## License

[MIT](LICENSE) © Lion Ralfs
