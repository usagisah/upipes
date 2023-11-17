import { of } from "../../builder/of/of.js"
import { nextError } from "../../lib/test.js"
import { finalize } from "./finalize.js"

describe("finalize", () => {
  test("only apply on close", () => {
    const f = vi.fn()
    const o = of([finalize(f), nextError(99)], 1, 2, 3)
    o.subscribe({ error: () => null })

    expect(f).toHaveBeenCalledOnce()
  })
})
