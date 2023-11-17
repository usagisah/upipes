import { of } from "../../builder/of/of.js"
import { nextError } from "../../lib/test.js"
import { retry } from "./retry.js"

describe("retry", () => {
  test("specify count", () => {
    const p1 = vi.fn((_, next) => next())
    const o = of([p1, nextError("retry"), retry(3)], 1)
    o.subscribe({ next: () => null })

    // 第1次进 + 3次重试 + 1次关闭
    expect(p1).toBeCalledTimes(5)
  })
})
