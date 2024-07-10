<script setup>
const props = defineProps({
  likeCount: Number,
  isChecked: Boolean,
});

const imgSrc = `/src/assets/${props.isChecked ? "like" : "non-like"}.png`
</script>

<template>
  <div class="inline">
    <img :src="imgSrc" alt="scrap" class="inline h-4 ms-2 me-1" />
    <span>{{ likeCount }}</span>
  </div>
</template>

<style scoped></style>
