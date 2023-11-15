import { setTimeout as timer } from "timers/promises"
import { definePipes } from "./pipe.js"

describe("正常调用", () => {
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
        else throw new Error("循环不合法")
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
    expect(p1).toHaveBeenLastCalledWith({ status: "close", value: undefined })
    expect(p1).toBeCalledTimes(1)
  })

  test("循环终止", async () => {
    const origin = console.error
    const error = (console.error = vi.fn())
    const p1 = vi.fn((_, next) => setTimeout(() => next(null, { loop: true })))
    const fn = definePipes([p1])

    fn()
    fn.close()
    await timer(50)

    expect(p1).toBeCalledTimes(2)
    expect(error).toBeCalled()

    console.error = origin
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

    expect(f).toHaveBeenCalledTimes(2)
    expect(f).toHaveBeenCalledWith("管道流已经关闭, next 调用失败")

    console.error = origin
  })
})

describe("其他用法", () => {
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

  test("多个异常传递", () => {
    const p3 = vi.fn()
    const fn = definePipes([
      () => {
        throw 1
      },
      () => {
        throw 2
      },
      ctx => p3(ctx)
    ])
    fn()
    expect(p3).toBeCalledWith({ status: "fail", value: 2 })
  })
})
