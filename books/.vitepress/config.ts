import topNav from "./topNav/index";
import { sideBar } from "./sideBar";
const config = {
  // themeConfig: {
  //   sidebar,
  // },
  // Layout,
  base: "/lz-space/",

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
    nav: topNav,
    sidebar: sideBar,
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
  },
};
export default config;
