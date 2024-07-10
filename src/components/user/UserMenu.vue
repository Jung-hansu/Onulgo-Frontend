<script setup>
import { useRoute } from "vue-router";
</script>

<template>
  <div class="flex flex-row justify-around mb-2 alin">
    <div
      class="flex flex-row justify-center w-20 h-10 items-center hover:bg-gray-200 rounded text-center"
    >
      <RouterLink
        :to="{ name: 'userPlan' }"
        class="font-semibold"
        :class="{
          'text-black': $route.name === 'userPlan',
          'text-gray-500': $route.name !== 'userPlan',
        }"
      >
        내 일정
      </RouterLink>
    </div>
    <div
      class="flex flex-row justify-center w-20 h-10 items-center hover:bg-gray-200 rounded text-center"
    >
      <RouterLink
        :to="{ name: 'userReview' }"
        class="font-semibold"
        :class="{
          'text-black': $route.name === 'userReview',
          'text-gray-500': $route.name !== 'userReview',
        }"
        >내 리뷰</RouterLink
      >
    </div>
    <div
      class="flex flex-row justify-center w-20 h-10 items-center hover:bg-gray-200 rounded text-center"
    >
      <RouterLink
        :to="{ name: 'userComment' }"
        class="font-semibold"
        :class="{
          'text-black': $route.name === 'userComment',
          'text-gray-500': $route.name !== 'userComment',
        }"
        >내 댓글</RouterLink
      >
    </div>
  </div>
</template>

<style scoped></style>
