import { createObservable } from "../../index.js"
import { passValue } from "../../lib/test.js"
import { tap } from "./tap.js"

test("tap", () => {
  const p2 = vi.fn(() => 100)
  const p3 = vi.fn()
  const o = createObservable([passValue, tap(p2), ctx => p3(ctx.value)])
  o.call(1)

  expect(p2).toBeCalledWith({ status: "success", value: 1 })
  expect(p3).toBeCalledWith(1)
})
