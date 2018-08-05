# Go on

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
