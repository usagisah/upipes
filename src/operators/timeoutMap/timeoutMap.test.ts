import { setTimeout } from "timers/promises"
import { testConsoleError } from "../../lib/test.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { timeoutMap } from "./timeoutMap.js"

describe("timeoutMap -- default params", () => {
  test("timeout", async () => {
    vi.useFakeTimers()

    const f = vi.fn(async v => {
      await setTimeout(6000)
      return v
    })
    const [err, errRestore] = testConsoleError(vi.fn())

    const o = createObservable([timeoutMap(f)])
    const sub = vi.fn()
    o.subscribe(sub)
    o.next(1)

    expect(f).toBeCalled()
    expect(f).toBeCalledWith(1)

    await vi.advanceTimersByTimeAsync(4000)
    expect(sub).not.toBeCalled()

    await vi.advanceTimersByTimeAsync(2000)
    expect(sub).not.toBeCalled()
    expect(err).not.toBeCalled()
    expect(o.closed()).toBeFalsy()

    errRestore()
  })

  test("not timeout", async () => {
    vi.useFakeTimers()

    const f = vi.fn(v => v)
    const [err, errRestore] = testConsoleError(vi.fn())

    const o = createObservable([timeoutMap(f)])
    const sub = vi.fn()
    o.subscribe(sub)
    o.next(1)

    await vi.advanceTimersByTimeAsync(6000)
    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toBeCalledWith(1)
    expect(err).not.toBeCalled()
    expect(o.closed()).toBeFalsy()

    errRestore()
  })
})
