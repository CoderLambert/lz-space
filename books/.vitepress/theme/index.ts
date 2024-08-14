import Theme from "vitepress/theme";
import LzUI from "@lz-space/components";

export default {
  ...Theme,
  enhanceApp: async ({ app }) => {
    app.use(LzUI);
  },
};
