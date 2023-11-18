import { createObservable } from "../../observable/observable/createObservable.js"
import { catchError } from "./catchError.js"

describe("catchError", () => {
  test("fail -> success", () => {
    const fn = vi.fn(v => v)
    const o = createObservable([catchError(fn)]).error(99)
    o.subscribe(() => {})
    expect(o.value()).toBe(99)

    o.close()
    expect(fn).toHaveBeenCalledOnce()
  })

  test("不处理fail以外的状态", () => {
    const o = createObservable([catchError(v => v * 10)]).next(1)
    o.subscribe(() => {})
    expect(o.value()).toBe(1)
  })

  it("不传递 undefined 的结果", async () => {
    const fn = vi.fn()
    const o = createObservable([catchError(() => {}), fn]).error(99)
    o.subscribe(() => {})
    expect(fn).not.toBeCalled()
  })
})
