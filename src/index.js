// @ts-check

/**
 * Waits x milliseconds
 * @param {number} time Time to wait in ms
 * @returns {Promise<void>}
 */
function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Based on David Walsh's "JavaScript fetch with Timeout"
 * @see {@link https://davidwalsh.name/fetch-timeout}
 *
 * @param {() => Promise} fn
 * @param {number} [timeout]
 *
 * @returns {Promise}
 */
function callWithTimeout(fn, timeout) {
  let didTimeOut = false;

  return new Promise((resolve, reject) => {
    const timer =
      timeout &&
      setTimeout(() => {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, timeout);

    fn()
      .then((response) => {
        // Clear the timeout as cleanup
        clearTimeout(timer);
        if (!didTimeOut) {
          resolve(response);
        }
      })
      .catch((err) => {
        // Rejection already happened with setTimeout
        if (didTimeOut) return;
        // Reject with error
        reject(err);
      });
  });
}

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
 * @property {(reason: K | Error) => any} onError The error callback
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
export default function ({ fn, interval, timeout, onSuccess, onError }) {
  let running = false;
  return {
    start: () => {
      running = true;
      (function run() {
        if (!running) return;

        callWithTimeout(fn, timeout)
          .then((res) => {
            if (running) {
              onSuccess(res);
              wait(interval).then(run);
            }
          })
          .catch((err) => {
            if (running) {
              onError(err);
              wait(interval).then(run);
            }
          });
      })();
    },
    stop: () => {
      running = false;
    },
  };
}
