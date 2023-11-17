import { testConsoleError } from "../../lib/test.js"
import { defer } from "../defer/defer.js"
import { mergeAll } from "./mergeAll.js"

describe("mergeAll", () => {
  test("sequence", () => {
    vi.useFakeTimers()
    const o = mergeAll([], [defer([], 1000, 1), defer([], 2000, 2), 3])
    const sub = vi.fn()
    o.subscribe(sub)

    vi.advanceTimersByTime(3000)
    expect(sub).toHaveBeenNthCalledWith(1, 1)
    expect(sub).toHaveBeenNthCalledWith(2, 2)
    expect(sub).toHaveBeenNthCalledWith(3, 3)
    expect(sub).toHaveBeenCalledTimes(3)
    expect(o.closed()).toBeTruthy()
  })

  test("specify concurrently", () => {
    vi.useFakeTimers()
    const o = mergeAll([], [defer([], 1000, 1), defer([], 1000, 2), defer([], 2000)], 2)
    const sub = vi.fn()
    o.subscribe(sub)

    vi.advanceTimersByTime(1000)
    expect(sub).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(1000)
    expect(sub).toHaveBeenCalledTimes(2)
    expect(o.closed()).toBeTruthy()

    vi.restoreAllMocks()
  })

  test("interrupt", () => {
    const [err, errRestore] = testConsoleError(vi.fn())

    vi.useFakeTimers()
    const o = mergeAll([], [defer([], 1000, 1), defer([], 1000, 2), defer([], 2000)], 2)
    const sub = vi.fn()
    o.subscribe(sub)
    o.close()
    vi.advanceTimersByTime(2000)

    expect(sub).toHaveBeenCalledTimes(0)
    expect(o.closed()).toBeTruthy()
    expect(err).toBeCalledTimes(3)
    errRestore()
  })
})
