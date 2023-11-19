# 快速开始



## 下载依赖

```shell
pnpm add upipes
```





## 引用目录

<img src="/assets/importDir.jpg" style="height: 300px;!important" />

所有的导出文件都可以从根路径下的桶文件中直接获取

也可以为了更好的编译性能从对应的文件夹中获取

```js
//直接获取
import { createPipes } from "upipes"
//指定文件夹
import { createPipes } from "upipes/pipes"
```





## 让我们来写点 demo 感受一下



## pipe

建一个普通的订阅发布程序

```js
import { createPipes } from "upipes"

//创建管道流
//第一个参数用于放置操作符，第二个是可选的消费者，回调函数
const p = createPipes([], console.log)

//使用内部的方法，推送一个值给管道流执行
p.next("普通值")
p.error("异常")
p.close("结束流")
```





### observable

写一个只有当，只有有一个地方使用时，才会触发的函数

```js
import { createObservable } from "upipes"

const o = createObservable([], value => {
  console.log(value)
})

//只有当 subscribe 订阅数至少为 1 时才会触发
//期间产生的内容，可以根据配置决定，是否延迟触发还是丢弃
const unSubscribe = o.subscribe(fn)

//取消订阅后，将会等待下次订阅时，发送新的值
unSubscribe()
```





## listener

写一个防抖动的计数器事件

```js
import { createListener, createPipes, debounce, map } from "upipes"

let count = 0
const [click] = createListener(
  [debounce(1000)],
  () => count++
)
```

