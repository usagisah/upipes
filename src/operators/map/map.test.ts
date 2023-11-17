import { nextError, nextSuccess } from "../../lib/test.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { map } from "./map.js"

describe("map", () => {
  test("map", () => {
    const fn = vi.fn(v => v * 10)
    const o = createObservable([map(fn)]).next(1)
    o.subscribe(() => {})

    expect(o.value()).toBe(10)
    o.close()
    expect(fn).toHaveBeenCalledOnce()
  })

  test("不处理 success 以外的状态", () => {
    const fn = vi.fn(v => v * 10)
    const o = createObservable([nextError(99), map(fn), nextSuccess()]).next(1)
    o.subscribe(() => {})

    expect(o.value()).toBe(99)
    o.close()
    expect(fn).not.toBeCalled()
  })
})
