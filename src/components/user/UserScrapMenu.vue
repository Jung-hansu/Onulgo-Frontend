<script setup>
import { useRoute } from "vue-router";
</script>

<template>
  <div class="flex flex-row justify-around mb-2 alin">
    <div
      class="flex flex-row justify-center h-10 items-center hover:bg-gray-200 rounded text-center"
    >
      <RouterLink
        :to="{ name: 'userScrapPlan' }"
        class="font-semibold"
        :class="{
          'text-black': $route.name === 'userScrapPlan',
          'text-gray-500': $route.name !== 'userScrapPlan',
        }"
      >
        스크랩 일정
      </RouterLink>
    </div>
    <div
      class="flex flex-row justify-center h-10 items-center hover:bg-gray-200 rounded text-center"
    >
      <RouterLink
        :to="{ name: 'userScrapReview' }"
        class="font-semibold"
        :class="{
          'text-black': $route.name === 'userScrapReview',
          'text-gray-500': $route.name !== 'userScrapReview',
        }"
        >스크랩 리뷰</RouterLink
      >
    </div>
  </div>
</template>

<style scoped></style>
