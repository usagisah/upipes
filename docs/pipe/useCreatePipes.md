# 完整的使用

前边两页可以封装出`upipes`所有的其他功能

这里我们来写个简单表单校验



### 1 封装一些简化操作的管道函数

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



### 2 封装校验用的管道函数

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
```



### 3 封装校验函数 &&  4 使用

```js
//校验函数
const pCheck = createPipes([pipeCheckName, pipeCheckAge, catchError()])

export function checkForm(config) {
  return !!pCheck.next(config).value()
}

console.log(checkForm({ name: "11", age: 18 })) //true
console.log(checkForm({ name: 0, age: 18 }))    //false
console.log(checkForm({ name: "11", age: -1 })) //true
```



这只是一个小 `demo`，看似代码挺多的，实际上第1步用到的内部会直接提供不需要自己封装，第4步是用户用的，真正需要编写的部分是 3,4

通过 `upipes` 的编排，会强制把每一步操作（这里指校验每一项）约束在管道函数内进行，然后通过传值进行迭代调用。和常规的写法相比，默认就得到了很好的 **代码拆分**效果，这样对于后续的功能扩展和维护，我们实际关注点就聚焦到了每个细小的功能点上

- 新增功能 === 新增一个管道函数

- 删除功能 === 删除一个管道函数

- 查找问题 === 根据功能直接定位函数

  

接下来可以看看内部提供的一些，高级封装和封装好的操作符，等大概清楚了提供的哪些功能，我们来用它们进行组合，写一个难度高的