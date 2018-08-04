export default function make<K>(options: Options<K>): PollController;

type Fn<K> = () => Promise<K>;
type SuccessCallback<K> = (value: K) => any
type ErrorCallback<K> = (reason: K | Error) => any

type Options<K> = {
  fn: Fn<K>,
  timeout: number,
  interval?: number,
  onSuccess: SuccessCallback<K>,
  onError: ErrorCallback<K>
}

type PollController = {
  start: () => void;
  stop: () => void;
}
