import { createObservable } from "../../index.js"
import { delay } from "./delay.js"

describe("delay", () => {
  test("set timeout", async () => {
    vi.useFakeTimers()
    const o = createObservable([delay(1000)])
    const sub = vi.fn()
    o.then(sub)

    o.call("a")
    expect(sub).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(1000)
    expect(sub).toBeCalledTimes(1)
    expect(sub).toHaveBeenCalledWith("a")
  })

  test("set timeout fn", async () => {
    vi.useFakeTimers()
    let first = true
    const o = createObservable([delay(() => (first ? ((first = false), 1000) : 2000))])
    const sub = vi.fn()
    o.then(sub)
    ;["a", "b"].map(v => o.call(v))
    expect(sub).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(1000)
    expect(sub).toBeCalledTimes(1)
    expect(sub).toHaveBeenCalledWith("a")

    await vi.advanceTimersByTimeAsync(1000)
    expect(sub).toBeCalledTimes(2)
    expect(sub).toHaveBeenCalledWith("b")
  })
})
