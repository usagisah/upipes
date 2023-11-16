import { of } from "../../index.js"
import { passError } from "../../lib/test.js"
import { filter } from "./filter.js"

describe("filter", () => {
  test("filter value", () => {
    const o = of([filter(v => v > 2)], 1, 2, 3)
    const sub = vi.fn()
    o.then(sub)

    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toHaveBeenCalledWith(3)
  })

  test("only apply success", () => {
    const p = vi.fn(v => v > 2)
    const o = of([passError(99), filter(p)], 1, 2, 3)
    o.catch(() => null)

    expect(p).not.toBeCalled()
  })
})
