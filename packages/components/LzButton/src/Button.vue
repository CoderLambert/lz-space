<template>
  <button class="button lz-button" @click="increase">
    <slot>Lz按钮</slot>
  </button>

  {{ count }}
</template>
<script lang="ts" setup>
import { ref } from "vue";
defineOptions({ name: "LzButton" });
const count = ref(0);

function increase() {
  count.value++;
}
</script>

<style scoped>
.button {
  background-color: #0a0a23;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 15px;
  min-height: 30px;
  min-width: 120px;
}

.button:hover {
  background-color: #002ead;
  transition: 0.7s;
}

.button:focus {
  outline-color: transparent;
  outline-style: solid;
  box-shadow: 0 0 0 4px #5a01a7;
}

.button:active {
  background-color: #ffbf00;
}
</style>
