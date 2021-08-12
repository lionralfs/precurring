import precurring from '.';

precurring({
  fn: () => fetch('/'),
  interval: 1000,
  onError: (reason) => console.log(reason),
  onSuccess: (val) => console.log(val),
});
