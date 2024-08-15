import topNav from "./topNav/index";
import { sideBar } from "./sideBar";
const config = {
  ignoreDeadLinks: true,
  description: "个人学习、分享、记录",
  markdown: {
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },

  themeConfig: {
    siteTitle: "lambert 的文档",
    nav: topNav,
    sidebar: sideBar,
    search: {
      provider: "local",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
};
export default config;
