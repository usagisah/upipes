import { setTimeout } from "timers/promises"
import { of } from "../of/of.js"
import { fromAll } from "./fromAll.js"

describe("fromAll", () => {
  test("base", async () => {
    const v1 = 1
    const v2 = { a: 2 }
    const v3 = [3]
    const v4 = () => 4
    const v5 = of([], 5)
    const v6 = () => Promise.resolve(6)
    const v7 = Promise.resolve(7)
    const o = fromAll([], [v1, v2, v3, v4, v5, v6, v7])

    const sub = vi.fn()
    o.subscribe(sub)
    await setTimeout(10)
    o.close()

    expect(sub).toHaveBeenNthCalledWith(1, 1)
    expect(sub).toHaveBeenNthCalledWith(2, { a: 2 })
    expect(sub).toHaveBeenNthCalledWith(3, 3)
    expect(sub).toHaveBeenNthCalledWith(4, 4)
    expect(sub).toHaveBeenNthCalledWith(5, 5)
    expect(sub).toHaveBeenNthCalledWith(6, 6)
    expect(sub).toHaveBeenNthCalledWith(7, 7)
    expect(o.closed()).toBeTruthy()
  })

  test("custom unWrapper", () => {
    const o = fromAll([], [new Set([3, 3]), 4], {
      factory({ value, observable, done, unWrapper }) {
        if (value instanceof Set) value.forEach(observable.next), done()
        else unWrapper()
      }
    })
    const sub = vi.fn()
    o.subscribe(sub)

    expect(sub).toHaveBeenNthCalledWith(1, 3)
    expect(sub).toHaveBeenNthCalledWith(2, 4)
  })

  test("interrupt", () => {
    const v1 = 1
    const v2 = { a: 2 }
    const v3 = [3]
    const o = fromAll([], [v1, v2, v3], {
      factory({ observable, unWrapper }) {
        unWrapper()
        observable.close()
      }
    })

    const sub = vi.fn()
    o.subscribe(sub)
    o.close()
    expect(sub).toBeCalledTimes(1)
    expect(sub).toHaveBeenLastCalledWith(1)
  })
})
