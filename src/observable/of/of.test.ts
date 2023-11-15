import { of } from "./of.js"

describe("of", () => {
  test("base", () => {
    const ob = of([], 2)
    ob.call(1)

    const sub = vi.fn()
    ob.then(sub)

    expect(sub).toHaveBeenNthCalledWith(1, 1)
    expect(sub).toHaveBeenNthCalledWith(2, 2)
    expect(ob.closed()).toBe(true)
  })
}) 