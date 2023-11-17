import { createPipes } from "../../pipe/pipe.js"
import { buffer } from "./buffer.js"

describe("operator buffer", () => {
  test("基本使用", () => {
    const p2 = vi.fn()
    const pipes = createPipes([buffer(2), ctx => p2(ctx)])
    ;[1, 2, 3].forEach(pipes.next)
    pipes.close(4)
    expect(p2).toHaveBeenNthCalledWith(1, { status: "success", value: [1, 2] })
    expect(p2).toHaveBeenNthCalledWith(2, { status: "close", value: [3, 4] })
  })
})
