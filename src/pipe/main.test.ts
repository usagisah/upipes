import { definePipes } from "./main"
import { zip } from "./zip"

describe("pipes", () => {
  test("基本调用，正常，一次", () => {
    const f = vi.fn()
    const fn = definePipes([
      function ({ status, value }, next) {
        expect(status).toBe("success")
        expect(value).toBe(1)
        f()
        next(value + 1)
      },
      function ({ status, value }, next) {
        expect(status).toBe("success")
        expect(value).toBe(2)
        f()
        next(value + 1)
      }
    ])

    fn(1)
    expect(f).toHaveBeenCalledTimes(2)
  })

  test("基本调用，异常，一次", () => {
    const f = vi.fn()
    const fn = definePipes([
      function ({ status, value }, next) {
        expect(status).toBe("success")
        expect(value).toBe(1)
        f()
        throw value + 1
      },
      function ({ status, value }, next) {
        expect(status).toBe("fail")
        expect(value).toBe(2)
        f()
        next(value + 1)
      }
    ])

    fn(1)
    expect(f).toHaveBeenCalledTimes(2)
  })

  test("多次调用，正常，三次", () => {
    const f = vi.fn()
    const fn = definePipes([
      function ({ status, value }, next) {
        expect(status).toBe("success")
        expect(value).toBe(1)
        next(value + 1)
        next(value + 1)
        next(value + 1)
      },
      f
    ])

    fn(1)
    expect(f).toHaveBeenCalledTimes(3)
  })

  test("多次调用，正常混合异常", () => {
    let count = 0
    const fn = definePipes([
      function ({ status, value }, next) {
        expect(status).toBe("success")
        expect(value).toBe(1)
        next(value + 1)
        throw value + 1
      },
      function ({ status, value }, next) {
        count++
        count === 1
          ? expect(status).toBe("success")
          : expect(status).toBe("fail")
        next(value + 1)
      }
    ])

    fn(1)
    expect(count).toBe(2)
  })

  test("test skip", () => {
    const f = vi.fn()
    const fn = definePipes([
      function ({ status, value }, next) {
        expect(status).toBe("success")
        expect(value).toBe(1)
        next(value + 1, { skip: true })
        next(value + 1)
      },
      f
    ])

    fn(1)
    expect(f).toBeCalledTimes(1)
  })

  test("属性不可更改", () => {
    const fn = definePipes([
      function (ctx, next) {
        expect(() => ((ctx as any).value = 1)).toThrow()
        expect(() => ((ctx as any).status = 1)).toThrow()
      }
    ])

    fn(1)
  })

  test("test loop", () => {
    let count = 0
    const fn = definePipes([
      function ({ status, value }, next) {
        count++
        if (count === 1) {
          expect(value).toBe(1)
          next(2, { loop: true })
        } else if (count === 2) expect(value).toBe(2)
        else throw "循环不合法"
      }
    ])

    fn(1)
    expect(count).toBe(2)
  })

  test("zip", () => {
    let count = 0
    const fn = definePipes([
      zip(3),
      function ({ value }) {
        expect(value).toEqual([1, 2, 3])
        count++
      }
    ])
    fn(1)
    fn(2)
    fn(3)
    expect(count).toBe(1)
  })
})
