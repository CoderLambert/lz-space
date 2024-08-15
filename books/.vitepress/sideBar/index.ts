import { vitePress } from "./note/vitePress.ts";
import { nodejs } from "./note/nodejs.ts";

export const sideBar = {
  "/components": [{ text: "Button 按钮", link: "/components/button/" }],
  "/note/vitePress": vitePress,
  "/note/nodejs": nodejs,
};
