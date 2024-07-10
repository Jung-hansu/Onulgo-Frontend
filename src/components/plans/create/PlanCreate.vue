<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import ButtonA from "@/components/common/ButtonA.vue";
import ButtonClose from "@/components/common/ButtonClose.vue";
import ButtonBack from "@/components/common/ButtonBack.vue";
import axios from "axios";

const accessToken = useCookies().cookies.get("access_token");
const authHeader = accessToken ? { headers: { Authorization: "Bearer " + accessToken } } : {};

const route = useRoute();
const router = useRouter();

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

const dateTimeFormat = (date) => {
  date = new Date(date);
  return (
    dateFormat(date) +
    " " +
    (date.getHours() < 10 ? "0" : "") +
    date.getHours() +
    ":" +
    (date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes() +
    ":" +
    (date.getSeconds() < 10 ? "0" : "") +
    date.getSeconds()
  );
};

const plan = ref({
  title: "",
  desc: "",
  is_public: "",
  view_count: "",
  scrap_count: "",
  like_count: "",
  start_date: route.query.start ? decodeURI(route.query.start) : dateFormat(new Date()),
  end_date: route.query.end ? decodeURI(route.query.end) : dateFormat(new Date()),
  join_users: [],
});
const planDayRange = computed(
  () => Math.ceil((new Date(plan.value.end_date) - new Date(plan.value.start_date)) / (1000 * 60 * 60 * 24)) + 1
);
const beforeRange = ref({ start: 0, end: 0 });
const addedUser = ref("");
const accommodations = ref([]);
const attractions = ref([]);
const inputCls = "border-b border-gray-200 w-full lg:w-[40vw]";

const addParticipant = () => {
  if (addedUser.value !== "") {
    axios
      .get(`http://localhost/users/find/${addedUser.value}`, authHeader)
      .then((response) => response.data)
      .then((user) => {
        console.log(user);
        if (user) {
          plan.value.join_users.push(user);
          addedUser.value = "";
        } else {
          alert("존재하지 않는 유저입니다.");
        }
      });
  }
};

const removeParticipant = (user) => {
  let idx = plan.value.join_users.indexOf(user);
  plan.value.join_users.splice(idx, 1);
};

const generateInviteLink = () => {
  navigator.clipboard.writeText("www.대충초대링크.com");
};

const update = () => {
  plan.value = JSON.parse(sessionStorage.getItem("plan"));
  if (sessionStorage.getItem("accommodations"))
    accommodations.value = JSON.parse(sessionStorage.getItem("accommodations"));
  if (sessionStorage.getItem("attractions")) attractions.value = JSON.parse(sessionStorage.getItem("attractions"));
};

const saveTmpAcc = (accs) => {
  if (accs) accommodations.value = accs;
  if (accommodations.value) sessionStorage.setItem("accommodations", JSON.stringify(accommodations.value));
};

const saveTmpAttr = (day, attrs) => {
  if (day && attrs) attractions.value[day - 1] = attrs;
  if (attractions.value) sessionStorage.setItem("attractions", JSON.stringify(attractions.value));
};

const saveTmpPlan = () => {
  sessionStorage.setItem("plan", JSON.stringify(plan.value));
  saveTmpAcc();
  saveTmpAttr();
};

const saveDateRange = async () => {
  plan.value.start_date = dateTimeFormat(plan.value.start_date);
  plan.value.end_date = dateTimeFormat(plan.value.end_date);
  attractions.value.unshift(accommodations.value);
  plan.value.attractions = JSON.stringify(attractions.value);
  return plan.value;
};

const savePlan = () => {
  if (!plan.value.title || !plan.value.desc) {
    return alert("여행 이름과 여행 소개를 모두 작성해 주세요.");
  }
  saveDateRange().then((finalPlan) => {
    axios.post("http://localhost/plans", finalPlan, authHeader).then((response) => {
      if (response.status === 201) {
        sessionStorage.removeItem("plan");
        sessionStorage.removeItem("attractions");
        sessionStorage.removeItem("accommodations");

        console.log("Plan was saved successful!");
        router.push({ name: "planList" });
      }
    });
  });
};

onMounted(() => {
  if (sessionStorage.getItem("plan")) {
    plan.value = JSON.parse(sessionStorage.getItem("plan"));
    if (plan.value.attractions) {
      console.log(plan.value.attractions);
      const recievedAttrs = JSON.parse(plan.value.attractions);

      accommodations.value = recievedAttrs[0];
      attractions.value = recievedAttrs.splice(1);
    }
  }
});

watch(
  () => planDayRange.value,
  (newVal, oldVal) => {
    console.log(oldVal + "->" + newVal);
    if (newVal < oldVal) {
      for (let i = newVal; i < oldVal; i++) {
        if (!attractions.value[attractions.value.length - 1]) {
          if (confirm("삭제되는 일정이 있습니다. 계속하시겠습니까?")) {
            break;
          } else {
            plan.value.start_date = beforeRange.value.start;
            plan.value.end_date = beforeRange.value.end;
          }
        }
      }
      attractions.value = attractions.value.slice(0, newVal);
      return;
    } else if (newVal > oldVal) {
      console.log("increase...");
      console.log(attractions.value);
      for (let i = oldVal; i < newVal; i++) {
        attractions.value.push([]);
      }
      console.log(attractions.value);
    }
  }
);

watch(
  () => plan.value.start_date,
  (newVal, oldVal) => (beforeRange.value.start = oldVal)
);

watch(
  () => plan.value.end_date,
  (newVal, oldVal) => (beforeRange.value.end = oldVal)
);
</script>

<template>
  <RouterView
    @submit="update"
    @submit-acc="saveTmpAcc"
    @submit-attr="saveTmpAttr"
    class="fixed border rounded-xl bg-gray-100 w-[85vw] max-h-[80vh] lg:w-[70vw] top-24 z-10 overflow-scroll"
  />
  <div class="container relative lg:w-[50vw] z-0">
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
        />
      </div>
      <div class="my-5">
        <label for="desc"></label>
        <input :class="inputCls" id="desc" type="text" v-model="plan.desc" :value="plan.desc" placeholder="여행 소개" />
      </div>
      <div class="flex flex-col items-center my-5">
        <RouterLink
          :to="{ name: 'planCreateDate' }"
          class="relative border px-5 py-2.5 mb-3 text-center w-[80vw] lg:w-2/3"
          @click="saveTmpPlan"
        >
          <div>
            <p class="inline-block">{{ dateFormat(plan.start_date) }}</p>
            ~
            <p class="inline-block">{{ dateFormat(plan.end_date) }}</p>
          </div>
          <img src="/src/assets/right-button.png" class="absolute top-4 right-2 w-4" />
        </RouterLink>
      </div>
      <div class="my-5">
        <RouterLink :to="{ name: 'planCreateAccommodation' }" @click="saveTmpPlan">
          <label for="accommodations"></label>
          <input :class="inputCls" id="accommodations" type="text" placeholder="숙박 시설 ▶" readonly />
          <div class="bg-green-100 mt-2 py-1">
            <template v-for="(accommodation, idx) in accommodations" :key="accommodation.id">
              <div class="grid grid-cols-4 p-2 hover:shadow-inner border m-1 bg-white">
                <div v-if="!accommodations" class="text-gray-400 p-1">숙소가 없습니다</div>
                <div>{{ idx + 1 }}일차</div>
                <div class="font-black">{{ accommodation.name }}</div>
                <div class="text-xs col-span-2">
                  {{ accommodation.newAddressList.newAddress[0].fullAddressRoad }}
                </div>
                <div></div>
              </div>
            </template>
          </div>
        </RouterLink>
      </div>
      <div class="my-5">
        <label for="attractions"></label>
        <input :class="inputCls" id="attractions" type="text" placeholder="여행 경유지" readonly />
        <div v-for="day in planDayRange" class="ms-5 mt-5">
          <RouterLink :to="{ name: 'planCreateAttraction', query: { day } }" @click="saveTmpPlan">
            <input :class="inputCls" id="attractions" type="text" :placeholder="`${day}일차 ▶`" readonly />
            <div class="bg-green-100 mt-2 py-1">
              <div v-if="!attractions || !attractions.length" class="text-gray-400 p-1">일정이 없습니다</div>
              <template v-else v-for="attraction in attractions[day - 1]" :key="attraction.id">
                <div class="grid grid-cols-3 p-2 hover:shadow-inner border m-1 bg-white">
                  <div class="font-black">{{ attraction.name }}</div>
                  <div class="text-xs col-span-2">
                    {{ attraction.newAddressList.newAddress[0].fullAddressRoad }}
                  </div>
                </div>
              </template>
            </div>
          </RouterLink>
        </div>
      </div>
      <div class="my-5">
        <label for="participants"></label>
        <input
          :class="inputCls"
          id="participants"
          type="text"
          placeholder="참가 인원"
          @keydown.enter="addParticipant"
          v-model="addedUser"
        />
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
                <ButtonClose class="absolute right-2" @click="removeParticipant(joinUser)" />
              </div>
            </template>
          </div>
          <ButtonA class="absolute bottom-2" value="초대하기" @click="addParticipant" />
          <ButtonA class="absolute bottom-2 right-2" value="초대 링크 생성" @click="generateInviteLink" />
        </div>
      </div>
      <div :class="inputCls">
        <input type="checkbox" id="is-public" v-model="plan.is_public" />
        <label for="is-public"> 공개 여부</label>
      </div>
    </div>

    <div class="flex justify-center px-2">
      <ButtonA class="w-full" value="일정 저장" @click="savePlan" />
    </div>
  </div>
</template>

<style scoped></style>
