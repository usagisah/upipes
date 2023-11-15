import { isFunction } from "../../lib/check.js"
import { Func } from "../../lib/type.js"
import { Pipe } from "../../pipe/pipe.type.js"
import { map } from "../map/map.js"

export function filter(fn: Func<[any], boolean>): Pipe {
  return map(isFunction(fn) ? fn : () => true)
}
