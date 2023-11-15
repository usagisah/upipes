import { lazyObservable } from "./lazyObservable"

describe("lazyObservable", () => {
  test("subscriber", () => {
    const ob = lazyObservable([], ob => {
      ob.call(2)
      ob.close()
    })
    ob.call(1)

    const sub = vi.fn()
    ob.then(sub)

    expect(sub).toHaveBeenNthCalledWith(1, 1)
    expect(sub).toHaveBeenNthCalledWith(2, 2)
    expect(ob.closed()).toBe(true)
  })
})