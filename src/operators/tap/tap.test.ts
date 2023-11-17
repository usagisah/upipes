import { applySuccess } from "../../lib/test.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { tap } from "./tap.js"

test("tap", () => {
  const p2 = vi.fn(() => 100)
  const p3 = vi.fn()
  createObservable([tap(p2), applySuccess(p3)]).next(1).subscribe(() => {})

  expect(p2).toBeCalledWith({ status: "success", value: 1 })
  expect(p3).toBeCalledWith(1)
})
