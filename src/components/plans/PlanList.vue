<script setup>
import ViewCount from "@/components/common/statistics/ViewCount.vue";
import LikeCount from "@/components/common/statistics/LikeCount.vue";
import ScrapCount from "@/components/common/statistics/ScrapCount.vue";
import ButtonA from "@/components/common/ButtonA.vue";
import ButtonClose from "@/components//common/ButtonClose.vue";
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const accessToken = useCookies().cookies.get("access_token");
const authHeader = accessToken ? { headers: { Authorization: "Bearer " + accessToken } } : {};

const router = useRouter();
const planList = ref([]);

const writeReview = () => {
  console.log("리뷰 쓰러 가기...");
};

const createPlan = () => {
  router.push({ name: "planCreate" });
};

const deletePlan = (planId) => {
  if (confirm("정말 일정을 삭제하시겠습니까?")) {
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/plans/${planId}`, authHeader).then(loadPlans);
  }
};

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

const loadPlans = () => {
  axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/plans`, authHeader).then(({ data }) => {
    planList.value = [];
    for (let plan of data) {
      planList.value.push(plan);
    }
    planList.value.sort((date) => -new Date(date.start_date));
  });
};

onMounted(() => {
  sessionStorage.removeItem("plan");
  sessionStorage.removeItem("attractions");
  sessionStorage.removeItem("accommodations");
  loadPlans();
});
</script>

<template>
  <div class="container flex flex-col">
    <h1 class="font-black text-center text-3xl">내 일정</h1>
    <div class="px-3 h-[75vh] max-h-[75vh] overflow-auto">
      <template v-for="plan in planList" :key="plan.plan_id">
        <div
          class="relative flex flex-col border rounded-lg bg-sky-100 shadow-xl hover:shadow-inner my-5 px-3 py-6">
          <ButtonClose class="absolute top-1 right-2" @click.stop="deletePlan(plan.plan_id)" />
          <RouterLink :to="{ name: 'planDetail', params: { plan_id: plan.plan_id } }">
            <div class="grid grid-cols-2">
              <span class="font-black">{{ plan.title }}</span>
              <span>{{ dateFormat(plan.start_date) }}~{{ dateFormat(plan.end_date) }}</span>
            </div>
            <div class="grid grid-cols-2">
              <span>{{ plan.desc }}</span>
              <span>
                인원: 
                <template v-for="(user, idx) in plan.join_users" :key="user.user_id">
                  <span v-if="idx > 0">, </span>
                  {{ user.name }}
                </template>
              </span>
            </div>
            <div class="self-center">
              <RouterLink :to="{name: 'reviewCreate'}">
                <ButtonA value="리뷰 쓰러 가기" @click="writeReview" />
              </RouterLink>
            </div>
            <div class="absolute bottom-1 right-2">
              <ViewCount :view-count="plan.view_count" />
              <LikeCount :like-count="plan.like_count" :is-checked="false" />
              <ScrapCount :scrap-count="plan.scrap_count" :is-checked="false" />
            </div>
          </RouterLink>
        </div>
      </template>
    </div>
    <div class="self-center w-[60vw]">
      <RouterLink to="#" @click="createPlan">
        <ButtonA class="w-full h-[3.5rem]" font-class="text-xl" value="일정 만들기" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
