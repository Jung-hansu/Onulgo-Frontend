<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BackButton from "@/components/common/BackButton.vue";

const router = useRouter();
</script>

<template>
  <BackButton @click="router.push('/')" />
  <!-- RouterView로 Children 상속 -->
  <RouterView />
</template>

<style scoped></style>
