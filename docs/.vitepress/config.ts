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
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" }
    ],

    sidebar: [
      { text: "简介", link: "/introduction" },
      { text: "快速开始", link: "/quickStart" },
      {
        text: "管道流-pipe",
        items: [
          { text: "createPipes" },
        ]
      },
      { text: "功能选择清单" },
      {
        text: "观察者-observable",
        items: [{ text: "createObservable" }, { text: "createListener" }]
      },
      {
        text: "创建者-builder",
        items: [{ text: "defer" }, { text: "fromAll" }, { text: "interval" }, { text: "mergeAll" }]
      },
      {
        text: "操作符-operators",
        items: [
          { text: "buffer" }, 
          { text: "debounce" },
          { text: "empty.ts" },
          { text: "finalize" },
          { text: "mergeMap" },
          { text: "take" },
          { text: "throttle" },
          { text: "catchError" },
          { text: "delay" },
          { text: "filter" },
          { text: "map" },
          { text: "retry" },
          { text: "tap" }, 
          { text: "timeoutMap" }
        ]
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" }
        ]
      }
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],

    footer: {
      message: "Released under the MIT License."
    }
  }
})
