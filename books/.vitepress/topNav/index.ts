import { nodejsNavItem } from "../common/nodejsNavItem.ts";
import { viteNavItem } from "../common/viteNavItem.ts";
import { markdown } from "./markdown.ts";
import { gitNavItem } from "../common/gitNavItem.ts";
export default [
  {
    text: "组件展示",
    items: [{ text: "按钮", link: "/components/button" }],
  },

  {
    text: "技术笔记",
    items: [...markdown, { text: "VitePress", link: "/note/vitePress" }],
  },
  ...gitNavItem,
  ...nodejsNavItem,
  ...viteNavItem,
  // { text: "更新日志", link: "" },
];
