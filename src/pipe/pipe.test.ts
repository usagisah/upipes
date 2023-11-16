import { applyError, applySuccess, nextError, nextSuccess, silentConsoleError } from "../lib/test.js"
import { PF, createPipes } from "./pipe.js"

describe("success", () => {
  test("once", () => {
    const pf = vi.fn(v => v + 1)
    createPipes([applySuccess(pf)]).next(1)
    expect(pf).toHaveBeenCalledOnce()
  })

  test("multiple call", () => {
    const pf = vi.fn(v => v + 1)
    const pipes = createPipes([applySuccess(pf)])

    pipes.next(1).next(2)
    expect(pf).toHaveBeenCalledTimes(2)
  })

  test("get value", () => {
    const pipes = createPipes([])
    pipes.next(1).next(10)

    expect(pipes.value()).toBe(10)
  })

  test("resolve value", () => {
    const pipes = createPipes([])

    expect(pipes.resolve()).resolves.toBe(1)
    pipes.next(1)

    expect(pipes.resolve()).resolves.toBe(10)
    pipes.next(10)
  })
})

describe("error", () => {
  test("once", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)
    const pipes = createPipes([])

    pipes.error(99)
    expect(err).toHaveBeenCalledOnce()
    expect(err).toBeCalledWith(99)

    errRestore()
  })

  test("透传 error", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)

    const pf = vi.fn()
    const pipes = createPipes([applyError(pf), applyError(pf)])

    pipes.error(99)
    expect(pf).toHaveBeenCalledTimes(2)
    expect(err).toHaveBeenCalledOnce()
    expect(err).toBeCalledWith(99)

    errRestore()
  })

  test("get value", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)
    const pipes = createPipes([])

    pipes.error(99)
    expect(pipes.value()).toBe(99)

    errRestore()
  })

  test("resolve value", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)
    const pipes = createPipes([])

    expect(pipes.resolve()).resolves.toBe(99)
    pipes.error(99)

    errRestore()
  })
})

describe("关闭", () => {
  test("closed()", () => {
    const fn = createPipes([])

    expect(fn.closed()).toBe(false)
    fn.close()
    expect(fn.closed()).toBeTruthy()
  })

  test("禁止相关api调用", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)
    const pipes = createPipes([])

    pipes.close()
    pipes.next().next().error().error().close()
    expect(err).toHaveBeenCalledTimes(4)
    expect(pipes.closed()).toBeTruthy()

    errRestore()
  })

  test("最终值全是 undefined", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)

    const pipes = createPipes([])
    expect(pipes.resolve()).resolves.toBe(1)
    pipes.next(1).next(1).close()
    expect(pipes.closed()).toBeTruthy()
    expect(pipes.value()).toBeUndefined()
    expect(pipes.resolve()).resolves.toBeUndefined()

    const pipes1 = createPipes([])
    expect(pipes1.resolve()).resolves.toBeUndefined()
    try {
      pipes1.error()
    } catch {}
    try {
      pipes1.error()
    } catch {}
    pipes1.close()
    expect(pipes1.closed()).toBeTruthy()
    expect(pipes1.value()).toBeUndefined()
    expect(pipes1.resolve()).resolves.toBeUndefined()

    errRestore()
  })

  test("透传 && 管道内容", () => {
    const pf1 = vi.fn()
    const pf2 = vi.fn()
    const pipes = createPipes([ctx => pf1(ctx), ctx => pf2(ctx)])
    pipes.close("a")

    expect(pf1).toHaveBeenCalledOnce()
    expect(pf1).toBeCalledWith({ status: "close", value: "a" })
    expect(pf2).toHaveBeenCalledOnce()
    expect(pf2).toBeCalledWith({ status: "close", value: "a" })
  })

  test("自定义传递内容", () => {
    const pf2 = vi.fn()
    const pipes = createPipes([(ctx, next) => next(ctx.value + 1), ({ value }) => pf2(value)])
    pipes.close(10)

    expect(pf2).toHaveBeenCalledOnce()
    expect(pf2).toBeCalledWith(11)
  })

  test("同步 多次 next", () => {
    const pf2 = vi.fn()
    const pipes = createPipes([(_, next) => (next(1), next(2)), ({ value }) => pf2(value)])
    pipes.close(9)

    expect(pf2).toHaveBeenCalledOnce()
    expect(pf2).toBeCalledWith(2)
  })

  test("无视异步调用", () => {
    vi.useFakeTimers()
    const pf2 = vi.fn()
    const pipes = createPipes([(_, next) => setTimeout(() => next(10)), ({ value }) => pf2(value)])
    pipes.close()

    vi.advanceTimersByTime(1000)
    expect(pf2).toHaveBeenCalledOnce()
    expect(pf2).toBeCalledWith(undefined)
  })
})

describe("混合操作", () => {
  test("pipe-status success -> error", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)

    createPipes([nextError(99)]).next(1)
    expect(err).toBeCalled()

    errRestore()
  })

  test("pipe-status error -> success", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError(err)

    createPipes([nextSuccess(99)]).error(1)
    expect(err).not.toBeCalled()

    errRestore()
  })
})

describe("next 特殊属性", () => {
  test("skip", () => {
    const pf = vi.fn()
    createPipes([(_, next) => next(null, { skip: true }), pf])
      .next(1)
      .error(2)
    expect(pf).not.toBeCalled()
  })

  test("loop", () => {
    let first1 = true
    const pf1: PF = (_, next) => next(100, { loop: first1 ? ((first1 = false), true) : false })
    const pf11 = vi.fn()
    createPipes([(ctx, next) => (pf11(ctx), next(ctx.value)), pf1]).next(1)
    expect(pf11).toBeCalledTimes(2)
    expect(pf11).toBeCalledWith({ status: "success", value: 1 })

    let first2 = true
    const pf2: PF = (_, next) => next(100, { loop: first2 ? ((first2 = false), true) : false })
    const pf22 = vi.fn()
    createPipes([(ctx, next) => (pf22(ctx), next(ctx.value)), pf2]).error(1)
    expect(pf22).toBeCalledTimes(2)
    expect(pf22).toBeCalledWith({ status: "error", value: 1 })
  })

  test("forceClose", () => {
    const pf = vi.fn()
    const pipes = createPipes([(_, next) => next(null, { forceClose: true }), pf])
    pipes.next(1).error(2)
    expect(pf).toHaveBeenCalledOnce()
    expect(pipes.closed()).toBeTruthy()
  })
})

describe("other operate", () => {
  test("call multiple next", () => {
    const err = vi.fn()
    const errRestore = silentConsoleError()
    vi.useFakeTimers()

    const pf = vi.fn()
    const pipes = createPipes([
      (_, next) => {
        next()
        next()
        setTimeout(next, 1000)
      },
      pf
    ]).next()
    expect(pf).toHaveBeenCalledTimes(2)

    pipes.close()
    vi.advanceTimersByTime(1000)
    expect(pf).toHaveBeenCalledTimes(3)
    expect(err).not.toBeCalled()

    errRestore()
  })

  test("next 外置调用", () => {
    const pf = vi.fn()

    let innerNext: any
    createPipes([(_, next) => ((innerNext = next), next()), pf]).next()
    innerNext()
    innerNext()

    expect(pf).toHaveBeenCalledTimes(3)
  })
})
