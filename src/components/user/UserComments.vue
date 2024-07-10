<script setup>
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
import MyCommentList from "@/components/user/items/MyCommentList.vue";
import UserMenu from "@/components/user/UserMenu.vue";
</script>

<template>
  <NavBar />
  <UserMenu />
  <div>
    <p class="text-3xl text-center font-semibold">내 댓글 목록</p>
    <MyCommentList />
  </div>
</template>

<style scoped></style>
