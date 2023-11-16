import { createObservable } from "../../index.js"
import { mergeMap } from "./mergeMap.js"

describe("mergeMap", () => {
  test("sequence", async () => {
    vi.useFakeTimers()
    const o = createObservable([
      mergeMap(v => {
        return new Promise<any>(async (resolve, reject) => {
          setTimeout(() => {
            resolve(v)
          }, v * 1000)
        })
      })
    ])

    const sub = vi.fn()
    o.then(sub)
    o.call(2)
    o.call(1)

    await vi.advanceTimersByTimeAsync(2000)
    expect(sub).toHaveBeenNthCalledWith(1, 2)
    expect(sub).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(1000)
    expect(sub).toHaveBeenNthCalledWith(2, 1)
    expect(sub).toHaveBeenCalledTimes(2)
  })

  test("multiple", async () => {
    vi.useFakeTimers()
    const o = createObservable([
      mergeMap(v => {
        return new Promise<any>(async (resolve, reject) => {
          setTimeout(() => {
            resolve(v)
          }, v * 1000)
        })
      }, 2)
    ])

    const sub = vi.fn()
    o.then(sub)
    o.call(2)
    o.call(1)

    await vi.advanceTimersByTimeAsync(2000)
    expect(sub).toHaveBeenNthCalledWith(1, 1)
    expect(sub).toHaveBeenNthCalledWith(2, 2)
    expect(sub).toHaveBeenCalledTimes(2)
  })
})
