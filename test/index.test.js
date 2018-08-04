import make from '../src';

jest.useFakeTimers();
const noop = () => {};
const flushPromises = () => new Promise(setImmediate);

describe('make()', () => {
  it('should be instantiable', () => {
    const instance = make({
      fn: noop,
      interval: 1000,
      onSuccess: noop,
      onError: noop
    });

    expect(instance).toMatchObject({
      start: expect.any(Function),
      stop: expect.any(Function)
    });
  });

  it('should run when start is called', async () => {
    const mockPromise = jest.fn(() => Promise.resolve('some-value'));
    const onSuccess = jest.fn();

    const instance = make({
      fn: mockPromise,
      interval: 1000,
      onSuccess: onSuccess,
      onError: noop
    });

    expect(onSuccess).not.toBeCalled();
    expect(mockPromise).not.toBeCalled();
    instance.start();
    await jest.runOnlyPendingTimers();
    expect(mockPromise).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(onSuccess).toBeCalledWith('some-value');
  });

  it('should call onError() when the promise rejects', async () => {
    const mockPromise = jest.fn(() => Promise.reject('some-reason'));
    const onError = jest.fn();

    const instance = make({
      fn: mockPromise,
      interval: 1000,
      onSuccess: noop,
      onError: onError
    });

    expect(onError).not.toBeCalled();
    expect(mockPromise).not.toBeCalled();
    instance.start();
    await jest.runOnlyPendingTimers();
    expect(mockPromise).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(onError).toBeCalledWith('some-reason');
  });

  it('should allow 2 instances', () => {
    // TODO
  });

  it('should call onError() with an error when the promise times out', async () => {
    const mockPromise = jest.fn(() => Promise.reject('some-reason'));
    const onError = jest.fn();

    const instance = make({
      fn: mockPromise,
      interval: 1000,
      timeout: 100,
      onSuccess: noop,
      onError: onError
    });

    expect(onError).not.toBeCalled();
    expect(mockPromise).not.toBeCalled();
    instance.start();
    await jest.advanceTimersByTime(200);
    expect(mockPromise).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(onError).toBeCalledWith(expect.any(Error));
  });

  it('should call onSuccess() twice when time passed interval twice', async () => {
    const mockPromise = jest.fn(() => Promise.resolve('some-value'));
    const onSuccess = jest.fn();

    const instance = make({
      fn: mockPromise,
      interval: 1000,
      onSuccess: onSuccess,
      onError: noop
    });

    expect(onSuccess).not.toBeCalled();
    expect(mockPromise).not.toBeCalled();
    instance.start();
    await jest.runOnlyPendingTimers();
    await flushPromises();
    await jest.runOnlyPendingTimers();
    await flushPromises();
    expect(mockPromise).toHaveBeenCalledTimes(2);
    expect(onSuccess).toBeCalledWith('some-value');
  });

  it('should stop when stop() is called and resume when start() is called again', async () => {
    const mockPromise = jest.fn(() => Promise.resolve('some-value'));
    const onSuccess = jest.fn();

    const instance = make({
      fn: mockPromise,
      interval: 1000,
      onSuccess: onSuccess,
      onError: noop
    });

    expect(onSuccess).not.toBeCalled();
    instance.start();
    await jest.runOnlyPendingTimers();
    await flushPromises();
    expect(onSuccess).toHaveBeenCalledTimes(1);
    await jest.runOnlyPendingTimers();
    await flushPromises();
    expect(onSuccess).toHaveBeenCalledTimes(2);
    instance.stop();
    await jest.runOnlyPendingTimers();
    await flushPromises();
    expect(onSuccess).toHaveBeenCalledTimes(2);
    instance.start();
    await jest.runOnlyPendingTimers();
    await flushPromises();
    expect(onSuccess).toHaveBeenCalledTimes(3);
  });
});
