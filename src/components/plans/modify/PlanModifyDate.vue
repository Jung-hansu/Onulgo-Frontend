<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Calendar from "@/components/calendar/Calendar.vue";
import ButtonA from "@/components/common/ButtonA.vue";
import ButtonBack from "@/components/common/ButtonBack.vue";

const router = useRouter();
const emit = defineEmits(["submit"]);

const plan = ref({});
const dateRange = ref({ start: 0, end: 0 });
const isDuplicated = ref(false);
const saveTmpPlan = () => sessionStorage.setItem("plan", JSON.stringify(plan.value));
const dateFormat = (date) => {
  date = new Date(date);
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() < 10 ? "0" : "") +
    (date.getMonth() + 1) +
    "-" +
    date.getDate()
  );
};

const saveTmpPlanDateRange = (range) => {
  dateRange.value = range;
};

const savePlanDateRange = () => {
  plan.value.start_date = dateRange.value.start;
  plan.value.end_date = dateRange.value.end;
  saveTmpPlan();
};

const setPlanDateDuplication = (flag) => {
  isDuplicated.value = flag;
};

const saveIfNotDuplicated = () => {
  if (!isDuplicated.value || confirm("일정이 중복됩니다.\n진행하시겠습니까?")) {
    savePlanDateRange();
    emit("submit");
    router.replace({ name: "planModify" });
  }
};

onMounted(() => {
  plan.value = JSON.parse(sessionStorage.getItem("plan"));
  dateRange.value.start = plan.value.start;
  dateRange.value.end = plan.value.end;
});
</script>

<template>
  <div class="container">
    <div class="flex flex-col m-5">
      <h1 class="font-black mx-5">
        <ButtonBack class="w-[1.5rem]" />
        날짜를 선택해주세요.
      </h1>
      <div class="border rounded-lg self-center px-5 py-2.5 my-3 w-[80vw] text-center">
        <p class="inline-block">{{ dateFormat(dateRange.start) }}</p>
        ~
        <p class="inline-block">{{ dateFormat(dateRange.end) }}</p>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <Calendar
        modifying
        :participants="plan.join_users"
        @date-range-save-event="saveTmpPlanDateRange"
        @date-range-duplicated-event="setPlanDateDuplication" />
      <ButtonA class="w-[40vw]" value="확인" @click="saveIfNotDuplicated" />
    </div>
  </div>
</template>

<style scoped></style>
