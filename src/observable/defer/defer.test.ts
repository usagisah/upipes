import { defer } from "./defer.js"

describe("defer", () => {
  test("base", () => {
    const sub = vi.fn()
    const ob = defer([], 100)
    vi.useFakeTimers()
    ob.then(sub)

    vi.advanceTimersByTime(100)
    expect(sub).toBeCalled()
    expect(ob.closed()).toBe(true)
    vi.restoreAllMocks()
  })
})
