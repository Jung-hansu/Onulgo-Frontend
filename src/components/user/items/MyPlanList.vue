<script setup>
import { ref } from "vue";
import { getPlans } from "@/api/user.js";

const planList = ref([]);

const getPlanList = async () => {
  planList.value = await getPlans();

  for (let i = 0; i < planList.value.length; i++) {
    planList.value[i].start_date = new Date(planList.value[i].start_date);
    planList.value[i].end_date = new Date(planList.value[i].end_date);
  }
};

getPlanList();
</script>

<template>
  <div class="flex flex-col mx-10">
    <p v-if="planList.length === 0" class="text-center font-semibold mt-10 text-xl">
      여행 일정이 존재하지 않습니다.
    </p>
    <template v-for="plan in planList" :key="plan.plan_id">
      <div class="flex flex-col shadow-lg bg-sky-200 rounded font-semibold my-4">
        <div class="flex flex-row justify-around my-1 mt-2">
          {{ plan.title }}
          <div>
            {{
              plan.start_date.getFullYear().toString().substring(2, 4) +
              "-" +
              (plan.start_date.getMonth() + 1).toString().padStart(2, "0") +
              "-" +
              plan.start_date.getDate()
            }}
            ~
            {{
              plan.end_date.getFullYear().toString().substring(2, 4) +
              "-" +
              (plan.end_date.getMonth() + 1).toString().padStart(2, "0") +
              "-" +
              plan.end_date.getDate()
            }}
          </div>
        </div>

        <div class="mx-7 my-1">
          <p>공개 여부 : {{ plan.is_public ? "공개" : "비공개" }}</p>
        </div>
        <div class="mx-7 my-1">{{ plan.desc }}</div>
        <div class="flex flex-row mx-7 my-1">
          인원 :
          <template v-for="(user, index) in plan.join_users" :key="user.email">
            <p> {{ user.name }}, </p>
          </template>
        </div>

        <div class="flex flex-row w-full justify-around text-center">
          <RouterLink :to="{
            name: 'planDetail',
            params: {
              plan_id: plan.plan_id,
            },
          }"
            class="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4">
            자세히 보기
          </RouterLink>
          <RouterLink :to="{ name: 'reviewCreate' }"
            class="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4">
            리뷰 작성하기
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
