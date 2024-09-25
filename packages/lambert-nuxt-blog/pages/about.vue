<script setup lang="ts">
const md = `
# Hello MDC
`;
</script>

<template>
  <MDC :value="md" tag="article" />
</template>
<!-- An error occurred after installation #183 -->
