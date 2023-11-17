import { isFunction } from "../../lib/check.js"
import { map } from "../../operators/map/map.js"
import { createPipes } from "../../pipe/pipe.js"
import { PF, Pipes } from "../../pipe/pipe.type.js"

export type ProxyListener<T> = T & {
  readonly pipes: Pipes
  readonly __upipes_Listener__: boolean
}

export function createListener<T = any, R = any>(pfs: PF[], fn?: (...args: T[]) => R): [(...args: T[]) => Promise<R>, Pipes] {
  const _pfs = [...pfs]
  if (isFunction(fn)) _pfs.push(map(fn))
  const pipes = createPipes(_pfs)

  async function proxyMethod() {
    try {
      const res = pipes.resolve()
      pipes.next(arguments.length === 1 ? arguments[0] : arguments)
      return res
    } catch (e) {
      pipes.error(e)
    }
  }
  Object.defineProperties(proxyMethod, {
    pipes: {
      get: () => pipes,
      enumerable: true
    },
    __upipes_Listener__: {
      get: () => true,
      enumerable: true
    }
  })
  return [proxyMethod as any, pipes]
}

/* 
react
function useEvent(initValue) {
  const [value, setValue] = useState(initValue)
  const [fn] = useRef(createListener(map(setValue)).current
  return [fn, value]
}
const [fn, value] = useEvent(0)

vue
function useEvent(initValue) {
  const state = ref(initValue)
  const [fn] = useRef(createListener(map(v => state.value = v )).current
  return [fn, state]
}
const [fn, value] = useEvent(0)

事件
function useEvent(initValue, callback) {
  return createListener(map(callback))[0]
}
document.body.addEventListener("click", useEvent(0, console.log))
*/
