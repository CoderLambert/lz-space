<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import Readme from '../assets/README.md?raw'
import Test from './Test.md'
import Shiki from '@shikijs/markdown-it'
import 'github-markdown-css'
// 注册Readme组件
const markdownItOptions = {
  html: true,
  linkify: true,
  typographer: true
}

const content = ref('')
const markdownIt = new MarkdownIt(markdownItOptions)
const md = computed(() => markdownIt.render(content.value))

onMounted(async () => {
  markdownIt.use(
    await Shiki({
      themes: {
        light: 'vitesse-light',
        dark: 'github-dark'
      }
    })
  )
  content.value = Readme
})
</script>

<template>
  <main>
    <textarea v-model="content" class="text-input"> </textarea>
    <div class="markdown-box">
      <!-- <div class="md-raw" :v-pre="md"></div> -->
      <div class="md-preview">
        <div class="md-preview-box" v-html="md"></div>
      </div>
    </div>
  </main>

  <Test name="lambert" />
</template>

<style lang="less" scoped>
main {
  display: flex;
  width: 100%;
  height: 100vh;
  gap: 20px;
  > .text-input {
    width: 40%;
    &::focus {
      outline: none;
    }
  }

  > .markdown-box {
    flex: 1 0 0;
  }
}
</style>
