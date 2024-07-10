<script setup>
import Calendar from "@/components/calendar/Calendar.vue";
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
import ReviewCarousel from "@/components/reviews/ReviewCarousel.vue";
</script>

<template>
  <div class="flex flex-col items-center">
    <header>
      <NavBar />
    </header>
    <Calendar />

    <div class="mt-8 mb-8"><p class="text-2xl font-semibold">인기 리뷰</p></div>
    <ReviewCarousel />
  </div>
</template>

<style scoped></style>
