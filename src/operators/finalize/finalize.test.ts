import { of } from "../../index.js"
import { passError } from "../../lib/test.js"
import { finalize } from "./finalize.js"

describe("finalize", () => {
  test("only apply on close", () => {
    const f = vi.fn()
    const o = of([finalize(f), passError(99)], 1, 2, 3)
    o.catch(() => null)

    expect(f).toHaveBeenCalledOnce()
  })
})
