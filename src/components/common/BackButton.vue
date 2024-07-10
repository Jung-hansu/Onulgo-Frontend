<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const clickBackButton = () => {
  router.go(-1);
};

defineProps({
  text: String,
});
</script>

<template>
  <div class="flex flex-row items-center">
    <img
      src="@/assets/back_button.png"
      v-on:click="clickBackButton"
      class="mt-5 ml-5 cursor-pointer"
    />
    <h1 class="text-xl font-bold mt-5 ml-2">{{ text }}</h1>
  </div>
</template>

<style scoped></style>
