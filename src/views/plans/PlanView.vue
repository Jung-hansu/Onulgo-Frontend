<script setup>
import { RouterView } from "vue-router";
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
</script>

<template>
  <div class="flex flex-col items-center">
    <header>
      <NavBar />
    </header>
    <RouterView />
  </div>
</template>

<style scoped></style>
