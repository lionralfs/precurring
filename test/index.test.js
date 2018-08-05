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

  it('should allow 2 instances', async () => {
    const mockPromise1 = jest.fn(() => Promise.resolve('some-value'));
    const mockPromise2 = jest.fn(() => Promise.resolve('some-other-value'));
    const onSuccess1 = jest.fn();
    const onSuccess2 = jest.fn();

    const instance1 = make({
      fn: mockPromise1,
      interval: 1000,
      onSuccess: onSuccess1,
      onError: noop
    });

    const instance2 = make({
      fn: mockPromise2,
      interval: 1000,
      onSuccess: onSuccess2,
      onError: noop
    });

    instance1.start();
    await jest.runOnlyPendingTimers();
    await flushPromises();
    expect(mockPromise1).toHaveBeenCalledTimes(1);
    expect(mockPromise2).not.toBeCalled();
    expect(onSuccess1).toBeCalledWith('some-value');
    expect(onSuccess2).not.toBeCalled();

    instance2.start();
    await jest.runOnlyPendingTimers();
    await flushPromises();
    expect(mockPromise2).toHaveBeenCalledTimes(1);
    expect(onSuccess2).toBeCalledWith('some-other-value');

    // make sure the other has also been called
    expect(onSuccess1).toHaveBeenCalledTimes(2);
    expect(mockPromise1).toHaveBeenCalledTimes(2);
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
