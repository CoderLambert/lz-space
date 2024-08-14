import { createApp } from "vue";
import App from "./App.vue";
import LzUI from "@lz-space/components";
// createApp(App).mount("#app");
const app = createApp(App);

app.use(LzUI);
app.mount("#app");
