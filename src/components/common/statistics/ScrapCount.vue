<script setup>
const props = defineProps({
  scrapCount: Number,
  isChecked: Boolean,
});

const imgSrc = `/src/assets/${props.isChecked ? "scrap" : "non-scrap"}.png`;
</script>

<template>
  <div class="inline">
    <img :src="imgSrc" alt="scrap" class="inline h-4 mx-1" />
    <span>{{ scrapCount }}</span>
  </div>
</template>

<style scoped></style>
