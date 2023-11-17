import { createObservable } from "../../observable/observable/createObservable.js"
import { throttle } from "./throttle.js"

describe("throttle", () => {
  test("set gap number", () => {
    const mock = vi.useFakeTimers()
    const o = createObservable([throttle(1000)])

    const sub = vi.fn()
    o.subscribe(sub)
    ;[1, 2, 3].map(o.next)

    mock.advanceTimersByTime(1500)
    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toHaveBeenCalledWith(1)
  })

  test("set gap fn", async () => {
    const mock = vi.useFakeTimers()
    const o = createObservable([throttle(v => 1000)])

    const sub = vi.fn()
    o.subscribe(sub)
    ;[1, 2, 3].map(o.next)

    mock.advanceTimersByTime(1500)
    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toHaveBeenCalledWith(1)
  })
})
