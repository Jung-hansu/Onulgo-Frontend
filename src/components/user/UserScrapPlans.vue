<script setup>
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
import MyScrapPlanList from "@/components/user/items/MyScrapPlanList.vue";
import UserScrapMenu from "@/components/user/UserScrapMenu.vue";
</script>

<template>
  <NavBar />
  <UserScrapMenu />
  <div>
    <p class="text-3xl text-center font-semibold">스크랩 일정 목록</p>
    <MyScrapPlanList />
  </div>
</template>

<style scoped></style>
