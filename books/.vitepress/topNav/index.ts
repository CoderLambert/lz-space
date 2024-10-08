import { nodejsNavItem } from "../common/nodejsNavItem.ts";

export default [
  {
    text: "组件展示",
    items: [{ text: "按钮", link: "/components/button" }],
  },

  {
    text: "前端网聚",
    items: [
      { text: "前端综合", link: "/site/page" },
      { text: "HTML/CSS", link: "/site/html-css" },
      { text: "框架组件", link: "/site/framework" },
    ],
  },
  {
    text: "技术笔记",
    items: [{ text: "VitePress", link: "/note/vitePress" }],
  },
  ...nodejsNavItem,
  {
    text: "关于我们",
    link: "/about/page",
  },
  { text: "更新日志", link: "" },
];
