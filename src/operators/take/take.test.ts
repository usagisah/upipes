import { of } from "../../index.js"
import { silentConsoleError } from "../../lib/test.js"
import { take } from "./take.js"

describe("take", () => {
  test("specify count", () => {
    const errRestore = silentConsoleError()
    const o = of([take(1)], 1, 2, 3)
    const sub = vi.fn()
    o.then(sub)

    expect(sub).toHaveBeenCalledOnce()
    expect(sub).toBeCalledWith(1)
    expect(o.closed()).toBeTruthy()
    errRestore()
  })
})
