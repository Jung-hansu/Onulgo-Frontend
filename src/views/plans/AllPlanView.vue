<script setup>
import NavBar from "@/components/layout/TheHeadingNavBar.vue";
import ViewCount from "@/components/common/statistics/ViewCount.vue";
import LikeCount from "@/components/common/statistics/LikeCount.vue";
import ScrapCount from "@/components/common/statistics/ScrapCount.vue";
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { ref, onMounted } from "vue";

const accessToken = useCookies().cookies.get("access_token");
const authHeader = accessToken ? { headers: { Authorization: "Bearer " + accessToken } } : {};

const planList = ref([]);

const dateFormat = (date) => {
  date = new Date(date);
  return (
    date.getFullYear() +
    "." +
    (date.getMonth() < 9 ? "0" : "") +
    (date.getMonth() + 1) +
    "." +
    (date.getDate() < 10 ? "0" : "") +
    date.getDate()
  );
};

onMounted(() => {
  sessionStorage.removeItem("plan");
  axios.get("http://localhost/plans", authHeader).then(({ data }) => {
    planList.value = [];
    for (let plan of data) {
      planList.value.push(plan);
    }
    planList.value.sort((date) => -new Date(date.start_date));
  });
});
</script>

<template>
  <div class="container">
    <header>
      <NavBar />
    </header>
    <div class="border p-3">
      <h1 class="font-black text-center text-3xl">일정 목록</h1>
      <template v-for="plan in planList" :key="plan.plan_id">
        <div v-if="plan.is_public" class="relative flex flex-col border rounded-lg bg-sky-100 my-5 p-3">
          <RouterLink :to="{ name: 'planDetail', params: { plan_id: plan.plan_id } }">
            <div class="grid grid-cols-2">
              <span>{{ plan.title }}</span>
              <span>{{ dateFormat(plan.start_date) }}~{{ dateFormat(plan.end_date) }}</span>
            </div>
            <div class="grid grid-cols-2">
              <span>목적지:</span>
              <span>인원:</span>
            </div>
            <div class="self-center">
              <img src="/src/assets/ssafy_logo.png" />
            </div>
            <div class="absolute bottom-0 right-2">
              <ViewCount :view-count="plan.view_count" />
              <LikeCount :like-count="plan.like_count" :is-checked="false" />
              <ScrapCount :scrap-count="plan.scrap_count" :is-checked="false" />
            </div>
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
