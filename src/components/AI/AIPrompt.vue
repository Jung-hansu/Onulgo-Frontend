<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { FwbButton, FwbModal } from "flowbite-vue";
import { getPrompts, makeGeminiPlan } from "@/api/ai";

const promptList = ref([]);
const checkList = ref([]);
const router = useRouter();

const isShowModal = ref(false);

function closeModal() {
  for (let i = 0; i < promptList.value.length; i++) {
    promptList.value[i].isChecked = checkList.value[i];
    promptList.value[i].value = promptList.value[i].default_value;
  }

  isShowModal.value = false;
}

function showModal() {
  isShowModal.value = true;
}

async function getPromptList() {
  promptList.value = await getPrompts();
  checkList.value - new Array(promptList.value.length).fill(false);
  checkList.value[0] = true;
  checkList.value[1] = true;

  for (let i = 0; i < promptList.value.length; i++) {
    promptList.value[i].isChecked = checkList.value[i];
    promptList.value[i].value = promptList.value[i].default_value;
  }
}

const usePromptList = computed(() => {
  return promptList.value.filter((prompt) => prompt.isChecked);
});

async function makePlan() {
  const type = "json 형식으로 대답해줘";
  let question = "";
  const response =
    "형식은 다음과 같아\n" +
    "[{title: String, desc:String, plan_list: {" +
    "date : 'n일자'," +
    "accommodation : String," +
    "accommodation_latitude : double," +
    "accommodation_longitude : double," +
    "accommodation_full_address_road: String," +
    "attraction_list : [ { attraction : String, latitude: double, longitude: double, full_address_road: String]," +
    "}}]" +
    "\n" +
    "attraction은 최소 2개, 최대 4개입니다.\n" +
    "accommodation은 null이어선 안된다.\n" +
    "latitude는 반드시 소수점 15자리로 지정해서 줘야한다.\n" +
    "longitude는 반드시 소수점 15자리로 지정해서 줘야한다.\n";
  ("full_address_road에는 도로명 주소를 알려줘.\n");

  for (let i = 0; i < promptList.value.length; i++) {
    if (promptList.value[i].isChecked) {
      question +=
        promptList.value[i].item +
        "는 " +
        (promptList.value[i].value === null
          ? promptList.value[i].default_value
          : promptList.value[i].value) +
        "입니다. \n";
    }
  }

  question += "위의 정보를 바탕으로 여행 일정 추천해줘\n";

  const prompt = type + "\n" + response + "\n" + question;

  // console.log(prompt);

  const answer = await makeGeminiPlan(prompt);
  // console.log(answer);
  const plan = JSON.parse(answer)[0];
  // console.log(plan);
  plan.attractions = [];

  plan.attractions.push(
    await plan.plan_list.map((accommodation, index) => {
      return {
        id: index,
        name: accommodation.accommodation,
        noorLat: accommodation.accommodation_latitude,
        noorLon: accommodation.accommodation_longitude,
        newAddressList: {
          newAddress: [
            {
              fullAddressRoad: accommodation.accommodation_full_address_road,
            },
          ],
        },
      };
    })
  );

  // console.log(plan.attractions);

  await plan.plan_list.map((attraction_list) => {
    plan.attractions.push(
      attraction_list.attraction_list.map((attraction, index) => {
        return {
          id: index,
          name: attraction.attraction,
          noorLat: attraction.latitude,
          noorLon: attraction.longitude,
          newAddressList: {
            newAddress: [
              {
                fullAddressRoad: attraction.full_address_road,
              },
            ],
          },
        };
      })
    );
  });

  // console.log(plan.attractions);

  // sessionStorage.setItem

  console.log(plan);

  plan.join_users = [];
  plan.is_public = false;

  plan.start_date = new Date();
  plan.end_date = new Date();
  plan.end_date.setDate(plan.end_date.getDate() + plan.attractions[0].length - 1);

  console.log(plan.attractions);
  plan.attractions = JSON.stringify(plan.attractions);

  sessionStorage.setItem("plan", JSON.stringify(plan));

  console.log("nextRoute");
  router.push({ name: "aiPlan" });
}

getPromptList();
</script>

<template>
  <div class="container">
    <div class="flex flex-col items-center my-4 mt-0">
      <div class="w-full bg-sky-500 bg-opacity-5 flex flex-col items-center py-2 rounded">
        <img src="@/assets/gemini.png" class="h-40" />
        <p class="my-2 text-2xl text-center font-semibold">AI 여행 추천 서비스 With Gemini</p>
      </div>

      <fwb-button class="mt-8 mb-4" @click="showModal">프롬프트 선택</fwb-button>

      <div class="flex flex-col bg-gray-200 rounded">
        <template v-for="prompt in usePromptList">
          <div class="flex flex-row justify-center my-2 items-center">
            <span
              class="text-black font-bold py-2 rounded focus:outline-none focus:shadow-outline w-20 text-center mx-4"
            >
              {{ prompt.item }}
            </span>
            <input
              :type="prompt.type === 'varchar' ? 'text' : 'number'"
              :placeholder="prompt.item"
              v-model="prompt.value"
              class="w-60 h-10 border border-sky-300 rounded my-4 mr-4"
            />
          </div>
        </template>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4 mx-10"
          type="submit"
          @click="makePlan"
        >
          AI 일정 만들기
        </button>
      </div>
    </div>

    <div class="absolute top-10">
      <fwb-modal v-if="isShowModal" size="xs" @close="closeModal">
        <template #header>
          <div class="flex flex-col">
            <p class="text-lg">사용하실 프롬프트를 선택해주세요</p>
          </div>
        </template>
        <template #body>
          <div class="flex flex-row justify-center flex-wrap my-10">
            <template v-for="(prompt, index) in promptList" :key="prompt.prompt_id">
              <div class="flex flex-row justify-center my-2 items-center">
                <input
                  type="button"
                  class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24 text-center mx-2"
                  @click="checkList[index] = !checkList[index]"
                  :class="{ 'bg-blue-500': checkList[index], 'bg-gray-500': !checkList[index] }"
                  :value="prompt.item"
                  :disabled="index === 0 || index === 1"
                />
                <!-- <input type="checkbox" class="w-6 h-6"  /> -->
              </div>
            </template>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-col items-center justify-center my-10 pb-3">
            <fwb-button @click="closeModal" color="blue">
              <div class="w-[20rem]">적용</div></fwb-button
            >
          </div>
        </template>
      </fwb-modal>
    </div>
  </div>
</template>

<style scoped>
.border-b {
  font-weight: bold;
}

input[type="button"] {
  text-indent: 0rem;
}
</style>
