import { Func } from "../../lib/type.js"
import { Pipes } from "../../pipe/pipe.type.js"

export type SubscribeConfigs = {
  once?: boolean
}
export type UnSubscribe = Func<[], void>
export type SubscribeNext<T> = Func<[T], any>
export type SubscribeError = Func<[any], any>
export type SubscribeClose<T> = Func<[T], any>
export type SubscribeOperates<T> = {
  next?: SubscribeNext<T>
  error?: SubscribeError
  close?: SubscribeClose<T>
}
export type SubscriberTypes = "next" | "error" | "close"

export interface Observable<T = any> extends Pipes<T> {
  subscribe: {
    <T = any>(next: Func<[T], any>, config?: SubscribeConfigs | undefined): UnSubscribe
    <T = any>(subscribeOperates: SubscribeOperates<T>, config?: SubscribeConfigs | undefined): UnSubscribe
  }
  readonly __upipes_Observable__: boolean
}
