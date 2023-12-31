import { interval } from "./interval.js"

describe("interval", () => {
  test("base with default value", () => {
    vi.useFakeTimers()
    const sub = vi.fn()
    const ob = interval([], 100)
    ob.subscribe(sub)
    vi.advanceTimersByTime(200)
    ob.close()

    expect(sub).toHaveBeenNthCalledWith(1, 0)
    expect(sub).toHaveBeenNthCalledWith(2, 1)
    expect(ob.closed()).toBeTruthy()
  })

  test("custom value", () => {
    vi.useFakeTimers()
    const sub = vi.fn()
    const value = "interval"
    const ob = interval([], 1000, value)
    ob.subscribe(sub)
    vi.advanceTimersByTime(2000)
    ob.close()

    expect(sub).toHaveBeenNthCalledWith(1, value)
    expect(sub).toHaveBeenNthCalledWith(2, value)
  })

  test("function value", () => {
    vi.useFakeTimers()
    const value = "interval"
    const fParam = vi.fn(() => value)
    const ob = interval([], 1000, fParam)

    const sub = vi.fn()
    ob.subscribe(sub)
    vi.advanceTimersByTime(2000)
    ob.close()

    expect(fParam).toHaveBeenNthCalledWith(1, 0)
    expect(fParam).toHaveBeenNthCalledWith(2, 1)

    expect(sub).toHaveBeenNthCalledWith(1, value)
    expect(sub).toHaveBeenNthCalledWith(2, value)
  })
})
