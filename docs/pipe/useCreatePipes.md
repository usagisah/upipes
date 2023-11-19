# 完整的使用

前边两页可以封装出`upipes`所有的其他功能

这里我们来写个简单表单校验



封装一些简化操作的管道函数

```js
//只处理成功状态的值
export function map(fn) {
  return ({ status, value }, next) => {
    if (status) next(fn(value))
    else throw value
  }
}

//拦截异常，其他值不管
export function catchError() {
  return ({ status, value }, next) => {
    if (status === "error") return next(null)
    next(value)
  }
}
```



封装校验函数

```js
const pipeCheckName = map(config => {
  const { name } = config
  if (typeof name !== "string" || name.length === 0) throw null
  return config
})
const pipeCheckAge = map(config => {
  const { age } = config
  if (typeof age !== "number" || age <= 0) throw null
  return config
})

const pCheck = createPipes([pipeCheckName, pipeCheckAge, catchError()])

export function checkForm(config) {
  return !!pCheck.next(config).value()
}

console.log(checkForm({ name: "11", age: 18 })) //true
console.log(checkForm({ name: 0, age: 18 }))    //false
console.log(checkForm({ name: "11", age: -1 })) //true
```





这只是一个小 `demo`，等大概清楚了提供的哪些操作，我们来写个难度高的