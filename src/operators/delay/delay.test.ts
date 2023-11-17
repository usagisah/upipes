import { createObservable } from "../../observable/observable/createObservable.js"
import { delay } from "./delay.js"

describe("delay", () => {
  test("set timeout", async () => {
    vi.useFakeTimers()
    const o = createObservable([delay(1000)])
    const sub = vi.fn()
    o.subscribe(sub)

    o.next("a")
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
    o.subscribe(sub)
    ;["a", "b"].map(o.next)
    expect(sub).toBeCalledTimes(0)

    await vi.advanceTimersByTimeAsync(1000)
    expect(sub).toBeCalledTimes(1)
    expect(sub).toHaveBeenCalledWith("a")

    await vi.advanceTimersByTimeAsync(1000)
    expect(sub).toBeCalledTimes(2)
    expect(sub).toHaveBeenCalledWith("b")
  })
})
