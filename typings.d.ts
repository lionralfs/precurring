declare function make<K>(options: Options<K>): Controller;

declare module 'precurring' {
  export = make;
}

type Fn<K> = (...args: any[]) => Promise<K>;
type SuccessCallback<K> = (value: K) => any;
type ErrorCallback<K> = (reason: K | Error) => any;

type Options<K> = {
  fn: Fn<K>;
  timeout?: number;
  interval?: number;
  onSuccess: SuccessCallback<K>;
  onError: ErrorCallback<K>;
};

type Controller = {
  start: () => void;
  stop: () => void;
};
