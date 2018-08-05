# Precurring

[![size](https://img.badgesize.io/https://unpkg.com/precurring/dist/precurring.js)](https://unpkg.com/precurring/dist/precurring.js)
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

## Usage

### Pinging a server

```js
import make from 'precurring';

const ping = make({
  fn: () => fetch('/ping'),
  interval: 5000, // fetch every 5 sec
  timeout: 20000, // wait 20 sec max
  onSuccess: console.log,
  onError: console.error
});

ping.start();
```

### Stopping after X errors

```js
import make from 'precurring';

let counter = 0;

const instance = make({
  fn: myFunction, // make sure it returns a promise
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
