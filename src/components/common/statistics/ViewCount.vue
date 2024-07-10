<script setup>
const props = defineProps({ viewCount: Number });
</script>

<template>
  <div class="inline">조회수: {{ viewCount }}</div>
</template>

<style scoped></style>
