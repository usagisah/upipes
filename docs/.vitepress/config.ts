import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "upipes",
  description: "一个用于组织多个函数执行的流式处理器",

  markdown: {
    lineNumbers: true
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "快速开始", link: "/quickStart" }
    ],

    sidebar: [
      { text: "简介", link: "/introduction" },
      { text: "快速开始", link: "/quickStart" },
      { text: "创造的原因和理念", link: "/reason" },
      {
        text: "管道流-pipe",
        items: [
          { text: "创建 createPipes", link: "/pipe/createPipes" },
          { text: "管道函数 pf", link: "/pipe/pf" },
          { text: "完整的使用", link: "/pipe/useCreatePipes" }
        ]
      },
      {
        text: "观察者-observable",
        items: [
          { text: "createObservable", link: "observable/createObservable" },
          { text: "createListener", link: "observable/createListener" }
        ]
      },
      {
        text: "创建者-builder",
        items: [
          { text: "of", link: "builder/of" },
          { text: "defer", link: "builder/defer" },
          { text: "interval", link: "builder/interval" },
          { text: "fromAll", link: "builder/fromAll" },
          { text: "mergeAll", link: "builder/mergeAll" }
        ]
      },
      {
        text: "操作符-operators",
        items: [
          { text: "catchError", link: "/operators/catchError" },
          { text: "map", link: "/operators/map" },
          { text: "finalize", link: "/operators/finalize" },
          { text: "buffer", link: "/operators/buffer" },
          { text: "tap", link: "/operators/tap" },
          { text: "filter", link: "/operators/filter" },
          { text: "take", link: "/operators/take" },
          { text: "retry", link: "/operators/retry" },
          { text: "debounce", link: "/operators/debounce" },
          { text: "throttle", link: "/operators/throttle" },
          { text: "mergeMap", link: "/operators/mergeMap" },
          { text: "timeoutMap", link: "/operators/timeoutMap" },
          { text: "delay", link: "/operators/delay" },
          { text: "empty", link: "/operators/empty" }
        ]
      }
      // {
      //   text: "实战 demo",
      //   items: [{ text: "接口请求" }, { text: "集成 vue" }, { text: "集成 react" }]
      // },
      // {
      //   text: "Examples",
      //   items: [
      //     { text: "Markdown Examples", link: "/markdown-examples" },
      //     { text: "Runtime API Examples", link: "/api-examples" }
      //   ]
      // }
    ],

    // socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],

    footer: {
      message: "豫ICP备2023024975号-1"
    }
  }
})
