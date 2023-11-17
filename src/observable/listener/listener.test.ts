import { createListener } from "./listener.js"

describe("listener", () => {
  test("", () => {
    createListener([], (v: number) => {})
  })
})
