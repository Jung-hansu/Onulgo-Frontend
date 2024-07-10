<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  class: String,
  toName: String,
});
const router = useRouter();

const goBack = () => {
  if (props.toName) router.push({ name: props.toName });
  else router.go(-1);
};
</script>

<template>
  <img src="/src/assets/back_button.png" :class="class" class="inline" @click="goBack" />
</template>

<style scoped></style>
