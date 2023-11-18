import { setTimeout } from "timers/promises"
import { nextError, nextSuccess } from "../../lib/test.js"
import { createObservable } from "../../observable/observable/createObservable.js"
import { createPipes } from "../../pipe/pipe.js"
import { map } from "./map.js"

describe("map", () => {
  test("process success", () => {
    const fn = vi.fn(v => v * 10)
    const o = createObservable([map(fn)]).next(1)
    o.subscribe(() => {})

    expect(o.value()).toBe(10)
    o.close()
    expect(fn).toHaveBeenCalledOnce()
  })

  test("catch promise error", async () => {
    const pf = vi.fn()
    createPipes([map(e => Promise.reject(e)), (ctx, next) => (pf(ctx), next())]).next(1)

    await setTimeout(10)
    expect(pf).toHaveBeenCalledOnce()
    expect(pf).toBeCalledWith({ status: "error", value: 1 })
  })

  test("不处理 success 以外的状态", () => {
    const fn = vi.fn(v => v * 10)
    const o = createObservable([nextError(99), map(fn), nextSuccess()]).next(1)
    o.subscribe(() => {})

    expect(o.value()).toBe(99)
    o.close()
    expect(fn).not.toBeCalled()
  })
})
