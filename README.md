```js
import make from 'poll';

const ping = make({
  fn: () => fetch('/ping'),
  interval: 5000, // fetch every 5 sec
  timeout: 20000, // don't wait for more than 20 sec
  onSuccess: console.log,
  onError: console.error
});
ping.start();
```

```js
let counter = 0;
const ping = make({
  fn: () => fetch('https://jsonplaceholder.typicode.com/todos/1'),
  interval: 5000, // fetch every 5 sec
  timeout: 20000, // don't wait for more than 20 sec
  onSuccess: () => {
    console.log(counter);
    if (++counter === 3) {
      ping.stop();

      console.log('10 sec timeout');
      setTimeout(ping.start, 10000);
    }
  },
  onError: console.error
});
ping.start();
```

```js
import make from 'poll';

const instance = make({
  fn: () => Promise.resolve(true),
  interval: 1000,
  onSuccess: console.log,
  onError: console.error
});

instance.start();
```
