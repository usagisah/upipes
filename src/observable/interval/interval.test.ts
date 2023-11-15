import { interval } from "./interval"

describe("interval", () => {
  test("base with default value", () => {
    vi.useFakeTimers()
    const sub = vi.fn()
    const ob = interval([], 10)
    ob.then(sub)
    vi.advanceTimersByTime(20)
    ob.close()

    expect(sub).toHaveBeenNthCalledWith(1, 0)
    expect(sub).toHaveBeenNthCalledWith(2, 1)
    vi.restoreAllMocks()
  })

  test("custom value", () => {
    vi.useFakeTimers()
    const sub = vi.fn()
    const value = "interval"
    const ob = interval([], 1000, value)
    ob.then(sub)
    vi.advanceTimersByTime(2000)
    ob.close()

    expect(sub).toHaveBeenNthCalledWith(1, value)
    expect(sub).toHaveBeenNthCalledWith(2, value)
    vi.restoreAllMocks()
  })


  test("function value", () => {
    vi.useFakeTimers()
    const value = "interval"
    const fParam = vi.fn(() => value)
    const ob = interval([], 1000, fParam)

    const sub = vi.fn()
    ob.then(sub)
    vi.advanceTimersByTime(2000)
    ob.close()

    expect(fParam).toHaveBeenNthCalledWith(1, 0)
    expect(fParam).toHaveBeenNthCalledWith(2, 1)

    expect(sub).toHaveBeenNthCalledWith(1, value)
    expect(sub).toHaveBeenNthCalledWith(2, value)

    vi.restoreAllMocks()
  })
})