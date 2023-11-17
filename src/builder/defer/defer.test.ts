import { defer } from "./defer.js"

describe("defer", () => {
  test("base", () => {
    vi.useFakeTimers()
    const ob = defer([], 100)
    const sub = vi.fn()
    ob.subscribe(sub)

    vi.advanceTimersByTime(100)
    expect(sub).toHaveBeenCalledOnce()
    expect(ob.closed()).toBeTruthy()
  })
})
