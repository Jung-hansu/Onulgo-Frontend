<script setup>
const props = defineProps({
  value: String,
  class: String,
  fontClass: String,
});
</script>

<template>
  <button
  class="text-gray-900 bg-cyan-300 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm mx-1 my-2 px-2 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
  :class="class"
  >
    <span :class="fontClass">{{ value }}</span>
  </button>
</template>

<style scoped></style>
