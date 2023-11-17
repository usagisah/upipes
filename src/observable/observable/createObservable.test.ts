import { nextSuccess, testConsoleError } from "../../lib/test.js"
import { createObservable } from "./createObservable.js"

describe("single param", () => {
  test("subscribe", () => {
    const o = createObservable([nextSuccess()])
    o.next(1)

    const sub = vi.fn()
    o.subscribe(sub)
    o.next(2)

    expect(sub).toHaveBeenCalledTimes(2)
    expect(sub).toHaveBeenNthCalledWith(1, 1)
    expect(sub).toHaveBeenNthCalledWith(2, 2)
  })

  test("unSubscribe", () => {
    const o = createObservable([nextSuccess()])
    const sub = vi.fn()
    o.subscribe(sub)()
    o.next(1)
    expect(sub).not.toBeCalled()
  })

  test("close", () => {
    const o = createObservable([nextSuccess()])
    o.next(1)

    const sub = vi.fn()
    o.subscribe(sub)
    o.close()
    expect(o.closed()).toBeTruthy()

    const [err, errRestore] = testConsoleError(vi.fn())
    o.next(1)
    expect(err).toBeCalled()
    errRestore()
  })

  test("once", () => {
    const o = createObservable([nextSuccess()])
    o.next(1)

    const sub = vi.fn()
    o.subscribe(sub, { once: true })
    o.next(2)
    expect(sub).toHaveBeenCalledOnce()
  })
})

describe("object param", () => {
  test("subscribe", () => {
    const o = createObservable([])
    const next = vi.fn()
    const error = vi.fn()
    const close = vi.fn()
    o.subscribe({ next, error, close })
    o.next(1).error(2).close(3)

    expect(next).toHaveBeenCalledOnce()
    expect(next).toBeCalledWith(1)
    expect(error).toHaveBeenCalledOnce()
    expect(error).toBeCalledWith(2)
    expect(close).toHaveBeenCalledOnce()
    expect(close).toBeCalledWith(3)
    expect(o.closed()).toBeTruthy()
  })

  test("unSubscribe", () => {
    const o = createObservable([])
    const next = vi.fn()
    const error = vi.fn()
    const close = vi.fn()
    o.subscribe({ next, error, close })()
    o.next(1).error(2).close(3)

    expect(next).not.toBeCalled()
    expect(error).not.toBeCalled()
    expect(close).not.toBeCalled()
  })

  test("once", () => {
    const o = createObservable([])
    const next = vi.fn()
    const error = vi.fn()
    const close = vi.fn()
    o.subscribe({ next, error, close }, { once: true })
    o.next(1).next(1).error(2).error(2).close(3)

    expect(next).toHaveBeenCalledOnce()
    expect(error).not.toBeCalled()
    expect(close).not.toBeCalled()
  })
})

describe("observable", () => {
  test("provider", () => {
    const afterClosed = vi.fn()
    const o = createObservable([], ob => {
      ob.next(1)
      ob.error(2)
      ob.close(3)
      afterClosed()
    })
    o.next(11).error(22)

    const next = vi.fn()
    const error = vi.fn()
    const close = vi.fn()
    o.subscribe({ next, error, close })

    expect(next).toHaveBeenCalledTimes(2)
    expect(next).toHaveBeenNthCalledWith(1, 11)
    expect(next).toHaveBeenNthCalledWith(2, 1)

    expect(error).toHaveBeenCalledTimes(2)
    expect(error).toHaveBeenNthCalledWith(1, 22)
    expect(error).toHaveBeenNthCalledWith(2, 2)

    expect(close).toHaveBeenCalledOnce()
    expect(close).toBeCalledWith(3)
    expect(afterClosed).toBeCalled()
    expect(o.closed()).toBeTruthy()
  })

  test("get value", () => {
    const o = createObservable([nextSuccess()])
    o.subscribe(v => v)

    o.next(1)
    expect(o.value()).toBe(1)

    o.next(2)
    expect(o.value()).toBe(2)

    o.close()
    expect(o.value()).toBeUndefined()
  })

  test("resolve value", () => {
    const o = createObservable([nextSuccess()])
    o.subscribe(v => v)

    expect(o.resolve()).resolves.toBe(1)
    o.next(1)

    expect(o.resolve()).resolves.toBe(2)
    o.next(2)

    expect(o.resolve()).resolves.toBeUndefined()
    o.close()
  })
})
