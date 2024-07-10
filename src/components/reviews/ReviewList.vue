<script setup>
import ReviewItem from "@/components/reviews/items/ReviewItem.vue";
</script>

<template>
  <div class="mx-10 flex flex-row justify-between items-center mt-10">
    <p class="text-xl font-bold ml-2">여행 리뷰 게시판</p>

    <div class="flex flex-row">
      <img src="@/assets/search.png" class="w-8 h-8 mx-2" />
      <img src="@/assets/sort.png" class="w-8 h-8 mx-2" />
      <RouterLink :to="{ name: 'reviewCreate' }"
        ><img src="@/assets/post.png" class="w-8 h-8 mx-2"
      /></RouterLink>
    </div>
  </div>

  <div class="flex flex-col items-start justify-around mx-10 my-4">
    <ReviewItem />
  </div>
</template>

<style scoped></style>
