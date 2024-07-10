<script setup>
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
import MyScrapReviewList from "@/components/user/items/MyScrapReviewList.vue";
import UserScrapMenu from "@/components/user/UserScrapMenu.vue";
</script>

<template>
  <NavBar />
  <UserScrapMenu />
  <div>
    <p class="text-3xl text-center font-semibold">스크랩 리뷰 목록</p>
    <MyScrapReviewList />
  </div>
</template>

<style scoped></style>
