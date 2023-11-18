import { isFunction, isPlainObject } from "../../lib/check.js"
import { CLOSE_ERROR } from "../../pipe/constants.js"
import { createPipes } from "../../pipe/pipe.js"
import { PF, PipeConfigs } from "../../pipe/pipe.type.js"
import { LinkedList } from "./LinkedList.js"
import { Observable, SubscribeConfigs, SubscribeNext, SubscribeOperates, SubscriberTypes, UnSubscribe } from "./Observable.type.js"
import { CashEmitter, EmitTypes } from "./cashEmitter.js"

export function createObservable<T = any>(pfs: PF[], provider?: ((o: Observable<T>) => any) | null, configs?: PipeConfigs): Observable<T> {
  const subscribers: Record<SubscriberTypes, LinkedList> = { next: new LinkedList(), error: new LinkedList(), close: new LinkedList() }
  const pipes = createPipes(
    [
      ...(pfs ?? []),
      function pipeDispatchSubscriber({ status, value }, next) {
        const type = status === "success" ? "next" : status
        const list = subscribers[type]
        if (status === "error" && list.size === 0) throw value
        if (!pipes.closed()) list.call(value)
        next(value)

        if (status === "close") {
          list.call(value)
          for (const type in subscribers) subscribers[type as SubscriberTypes].clear()
          emitter.clear()
          pendingResolveSize = 0
        }
      }
    ],
    configs
  )
  const { next, error, resolve, closed } = pipes
  const originMethods = { next, error, resolve } as const
  const emitter = new CashEmitter(originMethods)
  pipes.next = proxyMethod.bind(null, "next")
  pipes.error = proxyMethod.bind(null, "error")

  let pendingResolveSize = 0
  pipes.resolve = () => (pendingResolveSize++, originMethods.resolve())

  function proxyMethod(type: EmitTypes, value: any) {
    if (closed()) return console.error(CLOSE_ERROR), pipes
    if (subscribers[type].size > 0 || pendingResolveSize > 0) return originMethods[type](value)
    emitter.add({ type, value })
    return pipes
  }

  let first = true
  function subscribe<T = any>(next: SubscribeNext<T>, config?: SubscribeConfigs): UnSubscribe
  function subscribe<T = any>(subscribeOperates: SubscribeOperates<T>, config?: SubscribeConfigs): UnSubscribe
  function subscribe(operate: any, config?: SubscribeConfigs): UnSubscribe {
    if (closed()) return console.error(CLOSE_ERROR), function unSubscribe() {}

    const subscribeOperates: Record<SubscriberTypes, any> = {} as any
    if (isFunction(operate)) subscribeOperates.next = operate
    else if (isPlainObject(operate)) {
      if (isFunction(operate.next)) subscribeOperates.next = operate.next
      if (isFunction(operate.error)) subscribeOperates.error = operate.error
      if (isFunction(operate.close)) subscribeOperates.close = operate.close
    } else {
      throw "无效的订阅操作"
    }

    const { once = false } = isPlainObject(config) ? config : {}
    const unSubscribe = () => {
      for (const _type in subscribeOperates) {
        const type = _type as SubscriberTypes
        subscribers[type].remove(subscribeOperates[type])
      }
    }

    for (const _type in subscribeOperates) {
      const type = _type as SubscriberTypes
      const fn = subscribeOperates[type]
      const subscriber = function (value: any) {
        try {
          fn(value)
        } catch (e) {
          console.error(e)
        }
        if (once) unSubscribe()
      }
      subscribeOperates[type] = subscriber
      subscribers[type].add(subscriber)
    }

    emitter.emit()
    if (first) {
      first = false
      if (!isFunction(provider)) return unSubscribe
      try {
        provider(pipes as any)
      } catch (e) {
        console.error(e)
      }
    }

    return unSubscribe
  }

  Object.defineProperties(pipes, {
    subscribe: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: subscribe
    },
    __upipes_Observable__: {
      enumerable: true,
      get: () => true
    }
  })

  return pipes as any
}
