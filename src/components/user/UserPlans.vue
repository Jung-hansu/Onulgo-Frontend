<script setup>
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
import MyPlanList from "@/components/user/items/MyPlanList.vue";
import UserMenu from "@/components/user/UserMenu.vue";
</script>

<template>
  <NavBar />
  <UserMenu />
  <div>
    <p class="text-3xl text-center font-semibold">내 일정 목록</p>
    <MyPlanList />
  </div>
</template>

<style scoped></style>
