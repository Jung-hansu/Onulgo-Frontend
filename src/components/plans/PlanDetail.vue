<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import ButtonA from "@/components/common/ButtonA.vue";
import ButtonBack from "@/components/common/ButtonBack.vue";
import axios from "axios";

const accessToken = useCookies().cookies.get("access_token");
const authHeader = accessToken ? { headers: { Authorization: "Bearer " + accessToken } } : {};

const route = useRoute();
const router = useRouter();
const planId = route.params.plan_id;
const plan = ref({});
const accommodations = ref([]);
const attractions = ref([]);
const inputCls = "border-b border-gray-200 w-full lg:w-[40vw]";

const dateFormat = (date) => {
  date = new Date(date);
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() < 9 ? "0" : "") +
    (date.getMonth() + 1) +
    "-" +
    (date.getDate() < 10 ? "0" : "") +
    date.getDate()
  );
};

const deletePlan = () => {
  if (confirm("정말 일정을 삭제하시겠습니까?")) {
    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/plans/${planId}`, authHeader).then(() => router.push({ name: "planList" }));
  }
};

const modifyPlan = () => {
  sessionStorage.setItem("plan", JSON.stringify(plan.value));
  router.replace({ name: "planModify" });
};

onMounted(() => {
  axios.get(`${import.meta.env.VITE_BACKEND_URL}/plans/${planId}`, authHeader).then(({ data }) => {
    const recievedAttrs = JSON.parse(data.attractions);

    plan.value = data;
    if (recievedAttrs) {
      accommodations.value = recievedAttrs[0];
      attractions.value = recievedAttrs.splice(1);
    }
  });
});
</script>

<template>
  <div class="container lg:w-[50vw]">
    <div class="flex flex-col m-5">
      <h1 class="font-black">
        <ButtonBack class="w-[1.5rem]" />
        여행 정보 입니다.
      </h1>
      <div class="my-5">
        <label for="title"></label>
        <input
          :class="inputCls"
          id="title"
          type="text"
          v-model="plan.title"
          :value="plan.title"
          placeholder="여행 이름"
          readonly
        />
      </div>
      <div class="my-5">
        <label for="desc"></label>
        <input
          :class="inputCls"
          id="desc"
          type="text"
          v-model="plan.desc"
          :value="plan.desc"
          placeholder="여행 소개"
          readonly
        />
      </div>
      <div class="flex flex-col items-center my-5">
        <div class="border px-5 py-2.5 mb-3 text-center w-[80vw] lg:w-2/3">
          <p class="inline-block">{{ dateFormat(plan.start_date) }}</p>
          ~
          <p class="inline-block">{{ dateFormat(plan.end_date) }}</p>
        </div>
      </div>
      <div class="my-5">
        <label for="accommodations"></label>
        <input :class="inputCls" id="accommodations" type="text" placeholder="숙박 시설" readonly />
        <div class="bg-green-100 mt-2 py-1">
          <div v-if="!accommodations.length" class="text-gray-400 p-1">숙소가 없습니다</div>
          <template v-for="(accommodation, idx) in accommodations" :key="accommodation.id">
            <div class="grid grid-cols-4 p-2 hover:shadow-inner border m-1 bg-white">
              <div>{{ idx + 1 }}일차</div>
              <div class="font-black">{{ accommodation.name }}</div>
              <div class="text-xs col-span-2">
                {{ accommodation.newAddressList.newAddress[0].fullAddressRoad }}
              </div>
              <div></div>
            </div>
          </template>
        </div>
      </div>
      <div class="my-5">
        <label for="attractions"></label>
        <input :class="inputCls" id="attractions" type="text" placeholder="여행 경유지" readonly />
        <div v-for="(attrs, idx) in attractions" class="ms-5 mt-5">
          <input :class="inputCls" id="attractions" type="text" :placeholder="`${idx + 1}일차`" readonly />
          <div class="bg-green-100 mt-2 py-1">
            <div v-if="!attrs.length" class="text-gray-400 p-1">일정이 없습니다</div>
            <template v-for="attr in attrs" :key="attr.id">
              <div class="grid grid-cols-3 p-2 hover:shadow-inner border m-1 bg-white">
                <div class="font-black">{{ attr.name }}</div>
                <div class="text-xs col-span-2">
                  {{ attr.newAddressList.newAddress[0].fullAddressRoad }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="my-5">
        <label for="participants"></label>
        <input :class="inputCls" id="participants" type="text" placeholder="참가 인원" readonly />
        <div class="relative bg-green-100 mt-2 p-2 h-[20vh]">
          <div class="max-h-[16vh]">
            <template v-for="joinUser in plan.join_users" :key="joinUser.user_id">
              <div class="relative flex items-center grid grid-cols-2 bg-white my-2 h-8">
                <span>
                  {{ joinUser.email }}
                </span>
                <span>
                  {{ joinUser.name }}
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-around grid grid-cols-2 px-2">
      <ButtonA class="w-9/10" value="삭제하기" @click="deletePlan" />
      <ButtonA class="w-9/10" value="수정하기" @click="modifyPlan" />
    </div>
  </div>
</template>

<style scoped></style>
