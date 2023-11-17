import { of } from "./of.js"

describe("of", () => {
  test("base", () => {
    const ob = of([], 2, 3)
    ob.next(1)

    const sub = vi.fn()
    ob.subscribe(sub)

    expect(sub).toHaveBeenNthCalledWith(1, 1)
    expect(sub).toHaveBeenNthCalledWith(2, 2)
    expect(sub).toHaveBeenNthCalledWith(3, 3)
    expect(ob.closed()).toBeTruthy()
  })
})
