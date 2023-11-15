import { createObservable } from "../../observable/createObservable/createObservable.js"
import { catchError } from "./catchError.js"

describe("catchError", () => {
  test("fail -> success", () => {
    const fn = vi.fn(v => v + 1)
    const o = createObservable([
      ({ value, status }) => {
        if (status !== "close") throw value
      },
      catchError(fn)
    ])

    o.call(1)
    expect(o.getValue()).toBe(2)

    o.close()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test("不处理fail以外的状态", () => {
    const o = createObservable([({ value }, next) => next(value), catchError(v => v * 10)])
    o.call(1)
    expect(o.getValue()).toBe(1)
  })
})
