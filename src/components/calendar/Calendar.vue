<script setup>
import { DatePicker } from "v-calendar";
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import axios from "axios";
import ButtonA from "@/components/common/ButtonA.vue";

const router = useRouter();
const route = useRoute();
const props = defineProps({
  planDateRange: Object,
  modifying: Boolean,
  participants: Array,
});
const emit = defineEmits(["dateRangeSaveEvent", "dateRangeDuplicatedEvent"]);

const accessToken = useCookies().cookies.get("access_token");
const authHeader = accessToken ? { headers: { Authorization: "Bearer " + accessToken } } : {};

const color = ["red", "gray", "green", "yellow", "purple", "pink", "orange"];
const planId = route.params.plan_id;

const today = new Date();
const todayRange = {
  start: today,
  end: today,
};

const isDuplicated = ref(false);
const selectedDates = ref([]);
const datePicker = ref();
const dateRange = ref({
  start: today,
  end: today,
});

const goToday = () => {
  datePicker.value.move(today);
  datePicker.value.updateValue(todayRange);
};

const dateFormat = (date) => {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
};

const goCreatePlanView = () => {
  if (!isDuplicated.value || confirm("일정이 중복됩니다.\n진행하시겠습니까?")) {
    dateRange.value.start = encodeURI(dateFormat(dateRange.value.start));
    dateRange.value.end = encodeURI(dateFormat(dateRange.value.end));
    router.push({
      name: "planCreate",
      query: dateRange.value,
    });
  }
};

const selectDate = (plan) => {
  selectedDates.value.push({
    highlight: color[plan.plan_id % color.length],
    dates: [[plan.start_date, plan.end_date]],
    visibility: 'click',
    popover: {
      label: plan.title,
    },
  });
};

onMounted(() => {
  selectedDates.value = [];
  if (sessionStorage.getItem("plan")) {
    const plan = JSON.parse(sessionStorage.getItem("plan"));
    dateRange.value = {
      start: plan.start_date,
      end: plan.end_date,
    };
  }

  axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/plans`, authHeader).then(({ data }) => {
    for (let plan of data) {
      if (plan.plan_id == planId) {
        continue;
      }
      selectDate(plan);
    }
  });
});

watch(
  () => props.participants,
  () => {
    if (props.participants) {
      const participants = props.participants.map((p) => p.user_id).join(",");
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/users/plans/dates`, { params: { participants }, headers: authHeader.headers })
        .then(({ data }) => {
          const planSet = new Set();

          planSet.add(planId);
          for (let plan of data) {
            if (planSet.has(plan.plan_id)) {
              continue;
            }
            planSet.add(plan.plan_id);
            selectDate(plan);
          }
        });
    }
  }
);

watch(dateRange, () => {
  emit("dateRangeSaveEvent", dateRange.value);
  if (!selectedDates.value) {
    return;
  }

  for (let selectedDate of selectedDates.value) {
    if (
      new Date(selectedDate.dates[0][0]) <= dateRange.value.end &&
      new Date(selectedDate.dates[0][1]) >= dateRange.value.start
    ) {
      isDuplicated.value = true;
      emit("dateRangeDuplicatedEvent", true);
      return;
    }
  }
  isDuplicated.value = false;
  emit("dateRangeDuplicatedEvent", false);
});
</script>

<template>
  <div class="container flex flex-col w-96 justify-center items-center">
    <DatePicker
      v-model.range="dateRange"
      ref="datePicker"
      mode="dateTime"
      :attributes="selectedDates"
    />
    <div id="div-buttons">
      <ButtonA value="오늘" @click="goToday" />
      <ButtonA value="일정 생성" v-if="!modifying" @click="goCreatePlanView" />
    </div>
  </div>
</template>

<style scoped></style>
