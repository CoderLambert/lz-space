// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // app: {
  //   head: {
  //     charset: "utf-8",
  //     viewport: "width=device-width, initial-scale=1",
  //   },
  // },

  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/mdc", "@nuxt/image", "@nuxtjs/tailwindcss"],
  mdc: {
    remarkPlugins: {
      emoji: {
        src: "remark-emoji",
      },
    },
  },
  image: {
    dir: "assets/images",
    format: ["webp"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
  },
});