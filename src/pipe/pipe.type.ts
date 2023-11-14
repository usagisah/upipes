export type PipeContextStatus = "success" | "fail" | "close"
export type PipeContext = {
  readonly status: PipeContextStatus
  readonly value: any
}

export type PipeNextOptions = {
  skip?: boolean
  loop?: boolean
}
export type PipeNext = (value?: any, options?: PipeNextOptions) => void

export type Pipe = (context: PipeContext, next: PipeNext) => any

export type PipeFactory = {
  (value?: any): void
  closed: () => boolean
  close: (fn?: () => any) => void
}
