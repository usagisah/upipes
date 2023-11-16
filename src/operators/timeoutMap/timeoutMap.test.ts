import { setTimeout } from "timers/promises"
import { createObservable } from "../../index.js"
import { silentConsoleError } from "../../lib/test.js"
import { timeoutMap } from "./timeoutMap.js"

describe("timeoutMap -- default params", () => {
  test("timeout", async () => {
    vi.useFakeTimers()

    const f = vi.fn(async v => {
      await setTimeout(6000)
      return v
    })
    const err = vi.fn()
    const errRestore = silentConsoleError(err)

    const o = createObservable([timeoutMap(f)])
    const sub = vi.fn()
    o.then(sub)
    o.call(1)

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
    const err = vi.fn()
    const errRestore = silentConsoleError(err)

    const o = createObservable([timeoutMap(f)])
    const sub = vi.fn()
    o.then(sub)
    o.call(1)

    await vi.advanceTimersByTimeAsync(6000)
    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toBeCalledWith(1)
    expect(err).not.toBeCalled()
    expect(o.closed()).toBeFalsy()

    errRestore()
  })
})
