import { setTimeout } from "timers/promises"
import { applySuccess, silentConsoleError } from "../../lib/test.js"
import { createPipes } from "../../pipe.js"
import { filter } from "./filter.js"

describe("filter", () => {
  test("filter value", () => {
    const pf2 = vi.fn()
    createPipes([filter(v => v > 2), applySuccess(pf2)])
      .next(1)
      .next(3)

    expect(pf2).toHaveBeenCalledOnce()
    expect(pf2).toHaveBeenCalledWith(3)
  })

  test("only apply success", () => {
    const errRestore = silentConsoleError()

    const p = vi.fn(v => v > 2)
    createPipes([filter(p)]).error(99)
    createPipes([filter(p)])
      .close()
      .next(1)

    expect(p).not.toBeCalled()

    errRestore()
  })

  test("unWrapper promise", async () => {
    const pf2 = vi.fn()
    createPipes([filter(v => Promise.resolve(v)), pf2]).next(true).next(false)
    await setTimeout(5)
    expect(pf2).toHaveBeenCalledOnce()
  })
})
