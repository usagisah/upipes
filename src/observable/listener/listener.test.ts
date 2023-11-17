import { map } from "../../operators/map/map.js"
import { createListener } from "./listener.js"

describe("listener", () => {
  test("base", () => {
    const [fn] = createListener([map(v => v * 10)], v => v.toString())
    expect(fn(1)).resolves.toBe("10")
  })
})
