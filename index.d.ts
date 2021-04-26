/**
 * Creates a new instance
 * @param {object} options An options object
 * @param {() => Promise} options.fn A promise
 * @param {number} options.interval Time in ms representing the time span between the promise resolving and the next one firing
 * @param {number} options.timeout The maximum amount of time in ms which the promise is allowed to take
 * @param {(value: any) => any} options.onSuccess The success callback
 * @param {(reason: any) => any} options.onError The error callback
 *
 * @returns {{start: () => void, stop: () => void}}
 */
export default function _default({ fn, interval, timeout, onSuccess, onError }: {
    fn: () => Promise<any>;
    interval: number;
    timeout: number;
    onSuccess: (value: any) => any;
    onError: (reason: any) => any;
}): {
    start: () => void;
    stop: () => void;
};
