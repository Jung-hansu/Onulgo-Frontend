<script setup>
const emit = defineEmits(["vClick"]);
const props = defineProps({
  imgSrc: String,
  imgClass: String,
  titleClass: String,
  contentClass: String,
  buttonClass: String,
  title: String,
  content: String,
  class: String,
  button: String,
  buttonFunc: Function,
});
</script>

<template>
  <div class="card">
    <a
      href="#"
      :class="class"
      class="flex flex-col justify-between block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
      <img v-if="imgSrc" :class="imgClass" class="self-center" :src="imgSrc" alt="" />
      <h5 v-if="title" :class="titleClass" class="font-bold tracking-tight text-gray-900">
        {{ title }}
      </h5>
      <p v-if="content" :class="contentClass" class="font-normal text-gray-700">
        {{ content }}
      </p>
      <button
        v-if="button"
        :class="buttonClass"
        class="text-gray-900 bg-cyan-300 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm mt-2 px-2 py-1.5"
        @click="$emit('vClick')">
        {{ button }}
      </button>
    </a>
  </div>
</template>

<style scoped></style>
