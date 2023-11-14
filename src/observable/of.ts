import { Pipe } from "../pipe/pipe.type";
import { createObservable } from "./createObservable";

export function of(pipes: Pipe[], ...args: any[]) {
  const ob = createObservable(pipes)
  
}
