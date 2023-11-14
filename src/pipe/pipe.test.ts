import { setTimeout as timer } from "timers/promises"
import { definePipes } from "./pipe"

describe("基本调用", () => {
  test("正常一次", () => {
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

  test("异常一次", () => {
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

  test("多次调用，正常三次", () => {
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
        count === 1 ? expect(status).toBe("success") : expect(status).toBe("fail")
        next(value + 1)
      }
    ])

    fn(1)
    expect(count).toBe(2)
  })
})

describe("特殊属性", () => {
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
      function (ctx) {
        expect(() => ((ctx as any).value = 1)).toThrow()
        expect(() => ((ctx as any).status = 1)).toThrow()
      }
    ])

    fn(1)
  })

  test("loop", () => {
    let count = 0
    const fn = definePipes([
      function ({ value }, next) {
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
})

describe("关闭", () => {
  test("closed()", () => {
    const fn = definePipes([
      function (_, next) {
        next()
      }
    ])
    expect(fn.closed()).toBe(false)

    fn.close()
    expect(fn.closed()).toBe(true)
  })

  test("禁止正常调用", () => {
    const p1 = vi.fn()
    const fn = definePipes([ctx => p1(ctx)])

    fn.close()
    expect(() => fn()).toThrow()
    expect(p1).not.toHaveBeenLastCalledWith({ status: "close", value: undefined })
    expect(p1).toBeCalledTimes(1)
  })

  test("循环终止", async () => {
    let count = 0
    const fn = definePipes([
      (_, next) => {
        count++
        setTimeout(() => next(null, { loop: true }))
      }
    ])

    fn()
    fn.close()
    await timer(50)
    expect(count).toBe(2)
  })

  test("next 外置调用", () => {
    const origin = console.error
    const f = (console.error = vi.fn())

    let innerNext: any
    const fn = definePipes([
      (_, next) => {
        innerNext = next
        next()
      }
    ])
    fn()
    fn.close()
    innerNext()
    innerNext()

    expect(f).toHaveBeenCalledWith("管道流已经关闭, next 调用失败")
    expect(f).toHaveBeenCalledTimes(2)

    console.error = origin
  })
})
