import { definePipes } from "../pipe/pipe"
import { buffer } from "./buffer"

describe("operator buffer", () => {
  test("基本使用", () => {
    const p2 = vi.fn()
    const fn = definePipes([buffer(2), ctx => {
      p2(ctx)
    }])

    ;[1, 2, 3].forEach(fn)
    fn.close()
    expect(p2).toHaveBeenNthCalledWith(1, { status: "success", value: [1, 2] })
    expect(p2).toHaveBeenNthCalledWith(2, { status: "close", value: [3] })
  })
})
