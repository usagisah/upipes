import { Func } from "../lib/type.js"

export type PipeContextStatus = "success" | "error" | "close"
export type PipeContext<T = any> = {
  readonly status: PipeContextStatus
  readonly value: T
}

// 优先级，从上到下
export type PipeNextOptions = {
  forceClose?: boolean
  skip?: boolean
  loop?: boolean
}
export type PipeBuiltinContext<T = any> = { throwError: boolean; close: any; done: PipeConfigFinalize; raw: { type: PipeContextStatus; value: T } }
export type PipeNext = (value?: any, options?: PipeNextOptions) => void

export type PipeFactory<T = any> = (context: PipeContext<T>, resolve: PipeNext, reject: PipeNext) => any
export type PF<T = any> = PipeFactory<T>

export type PipeConfigFinalize = Func<[status: PipeContextStatus, value: any], unknown>
export type PipeConfig = {
  throwError?: boolean
  finalize?: PipeConfigFinalize
}

export interface Pipes<T = any> {
  next: (value?: T) => Pipes<T>
  error: (error?: any) => Pipes<T>
  close: (value?: T) => Pipes<T>
  closed: () => boolean
  value: () => T
  resolve: () => Promise<T>
  readonly __upipes_pipes__: boolean
}
