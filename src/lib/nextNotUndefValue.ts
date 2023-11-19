export const nextNotUndefValue = (next: any, v1: unknown, v2: unknown) => {
  v1 === undefined ? next(v2, { skip: true }) : next(v1)
}
