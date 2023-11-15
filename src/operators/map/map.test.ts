import { nextValue, passError } from "../../lib/test.js"
import { createObservable } from "../../observable/createObservable/createObservable.js"
import { map } from "./map.js"

describe("map", () => {
  test("map", () => {
    const fn = vi.fn(v => v * 10)
    const o = createObservable([map(fn)])

    o.call(1)
    expect(o.getValue()).toBe(10)

    o.close()
    expect(fn).toHaveBeenCalledOnce()
  })

  test("不处理 success 以外的状态", () => {
    const fn = vi.fn(v => v * 10)
    const o = createObservable([passError(99), map(fn), nextValue()])

    o.call(1)
    expect(o.getValue()).toBe(99)

    o.close()
    expect(fn).not.toBeCalled()
  })
})
