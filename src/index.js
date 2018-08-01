// @ts-check

/**
 * Waits x milliseconds
 * @param {number} time Time to wait in ms
 * @returns {Promise<void>}
 */
function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

/**
 * Based on David Walsh's "JavaScript fetch with Timeout"
 * @see {@link https://davidwalsh.name/fetch-timeout}
 * @param {Promise} promise
 * @param {number} [timeout]
 */
function fetchWithTimeout(promise, timeout) {
  let didTimeOut = false;

  return new Promise((resolve, reject) => {
    const timer =
      timeout &&
      setTimeout(() => {
        didTimeOut = true;
        reject(new Error('Request timed out'));
      }, timeout);

    promise
      .then(response => {
        // Clear the timeout as cleanup
        clearTimeout(timer);
        if (!didTimeOut) {
          resolve(response);
        }
      })
      .catch(err => {
        // Rejection already happened with setTimeout
        if (didTimeOut) return;
        // Reject with error
        reject(err);
      });
  });
}

/**
 *
 * @param {Promise} promise A promise
 * @param {object} options An options object
 * @param {number} options.interval Time in ms representing the time span between the promise resolving and the next one firing
 * @param {number} options.timeout The maximum amount of time in ms which the promise is allowed to take
 * @param {(result: any) => any} options.onSuccess The success callback
 * @param {(reason: any) => any} options.onError The error callback
 */
export default function(promise, { interval, timeout, onSuccess, onError }) {
  let running = false;
  return {
    /**
     * Starts the interval
     */
    start: () => {
      running = true;
      (function run() {
        fetchWithTimeout(promise, timeout)
          .then(res => {
            if (running) {
              onSuccess(res);
              wait(interval).then(run);
            }
          })
          .catch(err => {
            if (running) {
              onError(err);
              wait(interval).then(run);
            }
          });
      })();
    },
    /**
     * Stops the interval
     */
    stop: () => {
      running = false;
    }
  };
}
