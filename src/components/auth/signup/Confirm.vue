<script setup>
import { ref } from "vue";
import BackButton from "@/components/common/BackButton.vue";

const isAllAgree = ref(false);

const isCollectAgree = ref(false);
const isServiceAgree = ref(false);
const isPrivacyAgree = ref(false);

const emit = defineEmits(["changePage"]);

function allAgree() {
  isCollectAgree.value = isAllAgree.value;
  isServiceAgree.value = isAllAgree.value;
  isPrivacyAgree.value = isAllAgree.value;
}

function checkAgree() {
  isAllAgree.value = isCollectAgree.value && isServiceAgree.value && isPrivacyAgree.value;
}

const nextPage = () => {
  emit("changePage", "input");
};
</script>

<template>
  <BackButton text="회원가입" />
  <div class="text-center mt-10">
    ●-----------------------------------------------------------------------
  </div>
  <div class="flex flex-col justify-center my-20">
    <div class="mx-4 my-40">
      <p class="text-xl font-bold my-5">
        안녕하세요<br />
        오늘고에 오신 것을 환영합니다.
      </p>
      <p class="text-base font-medium my-5">
        오늘고 서비스의 원활한 이용을 위해 <br />아래의 약관 동의가 필요합니다.
      </p>
    </div>

    <div class="flex flex-col items-start mx-4">
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          v-model="isAllAgree"
          id="agree-all"
          name="agree-all"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          v-on:change="allAgree"
        />
        <label for="agree-all" class="ms-1 text-sm text-lg text-gray-900 dark:text-gray-300"
          >약관 전체 동의</label
        >
      </div>
    </div>
    <hr class="border-gray-800 dark:border-white mx-4 my-2" />
    <div class="flex flex-col items-start mx-4 mb-4">
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          v-model="isPrivacyAgree"
          v-on:change="checkAgree"
          id="agree-personal-info1"
          name="agree-personal-info1"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="agree-personal-info1"
          class="ms-1 text-sm text-lg text-gray-900 dark:text-gray-300"
          >[필수] 개인정보 제3자 동의</label
        >
      </div>
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          v-model="isCollectAgree"
          v-on:change="checkAgree"
          id="agree-personal-info2"
          name="agree-personal-info2"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="agree-personal-info2"
          class="ms-1 text-sm text-lg text-gray-900 dark:text-gray-300"
          >[필수] 개인정보 수집 동의</label
        >
      </div>
      <div class="flex flex-row items-center">
        <input
          type="checkbox"
          v-model="isServiceAgree"
          v-on:change="checkAgree"
          id="agree-personal-info3"
          name="agree-personal-info3"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          for="agree-personal-info3"
          class="ms-1 text-sm text-lg text-gray-900 dark:text-gray-300"
          >[필수] 서비스 활용 동의</label
        >
      </div>
    </div>
    <button
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-6"
      :class="{ 'hover:bg-blue-700': isAllAgree, 'bg-gray-500': !isAllAgree }"
      type="button"
      :disabled="!isAllAgree"
      @click="nextPage"
    >
      다음으로
    </button>
  </div>
</template>

<style scoped></style>
