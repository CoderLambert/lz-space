import { App } from "vue";
import JsxButton from "./jsxButton";
import LzButton from "./LzButton";

export { JsxButton, LzButton };
export default {
  install(app: App) {
    app.component(JsxButton.name, JsxButton);
    app.component(LzButton.name, LzButton);
  },
};
