import { PF, PipeContext, PipeNext } from "../index.js"
import { Func } from "./type.js"

export function nextSuccess(_value?: any): PF {
  return ({ value }, next) => {
    next(_value ?? value)
  }
}

export function nextError(_value?: any): PF {
  return ({ value, status }) => {
    if (status === "close") return
    throw _value ?? value
  }
}

export function applySuccess(fn: Func) {
  return (ctx: PipeContext, next: PipeNext) => {
    const { status, value } = ctx
    if (status === "error") throw value
    if (status === "close") return
    const res = fn(value)
    next(res ?? value)
  }
}

export function applyError(fn: Func) {
  return (ctx: PipeContext, next: PipeNext) => {
    const { status, value } = ctx
    if (status === "error") {
      const res = fn(value)
      throw res ?? value
    }
    next(value)
  }
}

export function silentConsoleError(fn: any = () => null) {
  const origin = console.error
  console.error = fn
  return function restore() {
    console.error = origin
  }
}
