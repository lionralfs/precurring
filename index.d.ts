/**
 * @typedef {Object} PrecurringController
 * @property {() => void} start Starts the interval
 * @property {() => void} stop Stops the interval
 */
/**
 * @template K
 * @typedef {Object} PrecurringOptions
 * @property {(...args: any[]) => Promise<K>} fn The function you want to repeatedly call, returning a Promise
 * @property {number} interval Time in ms representing the time span between the last Promise settling and the next one firing
 * @property {number} [timeout] The maximum amount of time in ms which the promise is allowed to take
 * @property {(value: K) => any} onSuccess The success callback
 * @property {(reason: K | Error) => any} onError The error callback
 */
/**
 * @function
 * @template K
 *
 * Creates a new instance
 * @param {PrecurringOptions<K>} options An options object
 *
 * @returns {PrecurringController}
 */
export default function _default<K>({ fn, interval, timeout, onSuccess, onError }: PrecurringOptions<K>): PrecurringController;
export type PrecurringController = {
    /**
     * Starts the interval
     */
    start: () => void;
    /**
     * Stops the interval
     */
    stop: () => void;
};
export type PrecurringOptions<K> = {
    /**
     * The function you want to repeatedly call, returning a Promise
     */
    fn: (...args: any[]) => Promise<K>;
    /**
     * Time in ms representing the time span between the last Promise settling and the next one firing
     */
    interval: number;
    /**
     * The maximum amount of time in ms which the promise is allowed to take
     */
    timeout?: number;
    /**
     * The success callback
     */
    onSuccess: (value: K) => any;
    /**
     * The error callback
     */
    onError: (reason: K | Error) => any;
};
