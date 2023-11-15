import { createObservable } from "./createObservable"

describe("createObservable-then", () => {
  test("base then", () => {
    const sub = vi.fn()
    const ob = createObservable()
    ob.then(sub)
    ob.call(10)

    expect(sub).toHaveBeenCalledWith(10)
    expect(sub).toHaveBeenCalledTimes(1)
  })

  test("unSubscribe", () => {
    const sub = vi.fn()
    const ob = createObservable()
    const unSub = ob.then(sub)
    unSub()
    ob.call(10)

    expect(sub).not.toBeCalled()
  })

  test("multiple", () => {
    const sub = vi.fn()
    const ob = createObservable()
    ob.then(sub)
    ob.then(sub)
    ob.call(10)

    expect(sub).toHaveBeenNthCalledWith(1, 10)
    expect(sub).toHaveBeenNthCalledWith(2, 10)
    expect(sub).toHaveBeenCalledTimes(2)
  })

  test("once", () => {
    const sub = vi.fn()
    const ob = createObservable()
    ob.then(sub, { once: true })
    ob.call(10)
    ob.call(10)

    expect(sub).toHaveBeenCalledTimes(1)
  })
})

describe("createObservable-catch", () => {
  const throwPipe = () => {
    throw "error"
  }

  test("base catch", () => {
    const sub = vi.fn()
    const ob = createObservable([throwPipe])
    ob.catch(sub)
    ob.call(10)

    expect(sub).toHaveBeenCalledWith("error")
    expect(sub).toHaveBeenCalledOnce()
  })

  test("unSubscribe", () => {
    const sub = vi.fn()
    const ob = createObservable([throwPipe])
    const unSub = ob.catch(sub)
    unSub()

    expect(() => ob.call(null)).toThrow()
    expect(sub).not.toBeCalled()
  })

  test("once", () => {
    const sub = vi.fn()
    const ob = createObservable([throwPipe])
    ob.catch(sub, { once: true })
    ob.call(10)

    expect(() => ob.call(10)).toThrow()
    expect(sub).toHaveBeenCalledTimes(1)
  })
})

describe("createObservable-finalize", () => {
  test("base finalize", () => {
    const sub = vi.fn()
    const ob = createObservable()
    ob.finalize(sub)
    ob.call(1)

    expect(sub).not.toHaveBeenCalled()
    expect(ob.closed()).toBe(false)
    ob.close(sub)

    expect(sub).toHaveBeenCalledTimes(2)
    expect(ob.closed()).toBe(true)
  })
})
