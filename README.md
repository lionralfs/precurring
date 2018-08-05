# Go on

[![size](https://img.badgesize.io/https://unpkg.com/go-on/dist/go-on.js)](https://unpkg.com/go-on/dist/go-on.js)
[![npm](https://img.shields.io/npm/v/go-on.svg)](https://www.npmjs.com/package/go-on)
[![Build Status](https://travis-ci.com/lionralfs/go-on.svg?branch=master)](https://travis-ci.com/lionralfs/go-on)

## Installation

```sh
npm install --save go-on
```

## Usage

### Pinging a server

```js
import make from 'go-on';

const ping = make({
  fn: () => fetch('/ping'),
  interval: 5000, // fetch every 5 sec
  timeout: 20000, // wait 20 sec max
  onSuccess: console.log,
  onError: console.error
});

ping.start();
```

## License

[MIT](LICENSE) © Lion Ralfs
