import { setTimeout } from "timers/promises";
import { createObservable } from "../../index.js"
import { debounce } from "./debounce.js"

describe("debounce", () => {
  test("direct", async () => {
    const o = createObservable([debounce()])
    
    const sub = vi.fn()
    o.then(sub)
    ;[1, 2, 3].map(v => o.call(v))

    await setTimeout(0)
    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toHaveBeenCalledWith(3)
  })

  test("set gap number", () => {
    const mock = vi.useFakeTimers()
    const o = createObservable([debounce(1000)])
    
    const sub = vi.fn()
    o.then(sub)
    ;[1, 2, 3].map(v => o.call(v))

    mock.advanceTimersByTime(1500)
    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toHaveBeenCalledWith(3)
  })

  test("set gap fn", async () => {
    const mock = vi.useFakeTimers()
    const o = createObservable([debounce(v => 1000)])

    const sub = vi.fn()
    o.then(sub)
    ;[1, 2, 3].map(v => o.call(v))

    mock.advanceTimersByTime(1500)
    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toHaveBeenCalledWith(3)
  })
})
