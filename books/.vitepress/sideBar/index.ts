import { vitePress } from "./note/vitePress.ts";
import { nodejs } from "./note/nodejs.ts";
import { markdown } from "../topNav/markdown.ts";
import { vite } from "./note/vite.ts";
export const sideBar = {
  "/components": [{ text: "Button 按钮", link: "/components/button/" }],
  "/note/vitePress": vitePress,
  "/note/nodejs": nodejs,
  "/note/markdown": markdown,
  "/note/vite": vite,
};
