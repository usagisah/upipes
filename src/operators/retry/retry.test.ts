import { of } from "../../index.js"
import { passError } from "../../lib/test.js"
import { retry } from "./retry.js"

describe("retry", () => {
  test("specify count", () => {
    const p1 = vi.fn((_, next) => next())
    of([p1, passError("retry"), retry(3)], 1).then(() => null)

    // 第1次进 + 3次重试 + 1次关闭
    expect(p1).toBeCalledTimes(5)
  })
})
