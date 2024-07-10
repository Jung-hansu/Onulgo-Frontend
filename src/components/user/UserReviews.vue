<script setup>
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
import MyReviewList from "@/components/user/items/MyReviewList.vue";
import UserMenu from "@/components/user/UserMenu.vue";
</script>

<template>
  <NavBar />
  <UserMenu />
  <div>
    <p class="text-3xl text-center font-semibold">내 리뷰 목록</p>
    <MyReviewList />
  </div>
</template>

<style scoped></style>
