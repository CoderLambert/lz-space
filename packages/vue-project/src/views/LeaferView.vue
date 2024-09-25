<template>
  <h1>leafer UI</h1>
</template>

<script setup lang="ts">
import { Leafer, Rect, PointerEvent } from 'leafer-ui'

const leafer = new Leafer({ view: window })

const rect = new Rect({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  fill: '#32cd79', // 背景色
  stroke: 'black', // 边框
  strokeWidth: 2, // 边框粗细
  draggable: true
})

leafer.add(rect)

function onEnter(e: PointerEvent) {
  ;(e.current as Rect).fill = '#42dd89'
}

function onLeave(e: PointerEvent) {
  ;(e.current as Rect).fill = '#32cd79'
}

rect.on(PointerEvent.ENTER, onEnter)
rect.on(PointerEvent.LEAVE, onLeave)
</script>

<style></style>
