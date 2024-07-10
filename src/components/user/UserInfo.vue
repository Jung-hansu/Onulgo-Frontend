<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import BackButton from "@/components/common/BackButton.vue";
import UserImage from "@/components/user/UserImage.vue";
import { getMyInfo, check } from "@/api/user.js";

import { FwbButton, FwbModal } from "flowbite-vue";

const isShowModal = ref(false);
const errorText = ref(null);
const router = useRouter();

const userInfo = ref({
  user_id: "",
  name: "",
  email: "",
  address: "",
  phone_number: "",
  reg_date: "",
});

const password = ref(null);

function closeModal() {
  password.value = null;
  errorText.value = null;
  isShowModal.value = false;
}

async function checkPassword() {
  console.log("Checking password");
  console.log(password.value);
  const isValidate = await check(password.value);
  console.log(isValidate);
  if (isValidate === true) {
    router.push("/user/modify");
    isShowModal.value = false;
  } else {
    errorText.value = "정보가 일치하지 않습니다.";
  }
}

function showModal() {
  isShowModal.value = true;
}

const getUserData = async () => {
  const userData = await getMyInfo();
  userInfo.value.name = userData.name;
  userInfo.value.email = userData.email;
  userInfo.value.address = userData.address;
  userInfo.value.phone_number = userData.phone_number;
  userInfo.value.reg_date = userData.reg_date;
};

getUserData();

const DateFormat = (reg_date) => {
  const date = new Date(reg_date);

  return date.getFullYear() + "년 " + (date.getMonth() + 1) + "월 " + date.getDate() + "일";
};
</script>

<template>
  <div>
    <BackButton text="사용자 정보 페이지"></BackButton>
  </div>

  <div class="flex flex-row justify-center mt-4">
    <UserImage></UserImage>
  </div>

  <div class="flex flex-row justify-center">
    <div
      class="text-center font-semibold flex flex-col mx-10 2xl:w-[60vw] xl:w-[60vw] lg:w-[60vw] md:w-[60vw] sm:w-[0vw] w-[70vw]"
    >
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-24">이름</div>
        <p class="flex flex-col justify-center w-full h-10 border border-sky-300 rounded my-4">
          {{ userInfo.name }}
        </p>
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-24">이메일</div>
        <p class="flex flex-col justify-center w-full h-10 border border-sky-300 rounded my-4">
          {{ userInfo.email }}
        </p>
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-24">거주지</div>
        <p class="flex flex-col justify-center w-full h-10 border border-sky-300 rounded my-4">
          {{ userInfo.address }}
        </p>
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-24">전화번호</div>
        <p class="flex flex-col justify-center w-full h-10 border border-sky-300 rounded my-4">
          {{ userInfo.phone_number }}
        </p>
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-24">가입일</div>
        <p class="flex flex-col justify-center w-full h-10 border border-sky-300 rounded my-4">
          {{ DateFormat(userInfo.reg_date) }}
        </p>
      </div>
      <fwb-button
        class="text-center hover:bg-blue-700 bg-blue-500 text-white font-bold my-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-6"
        @click="showModal"
      >
        내 정보 수정하기
      </fwb-button>
    </div>
  </div>
  <div v-if="isShowModal" class="background"></div>

  <fwb-modal v-if="isShowModal" size="xs" @close="closeModal">
    <template #header>
      <div class="flex items-center text-lg text-center">
        <p>비밀번호를 입력해주세요.</p>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col mx-8 my-4 border border-sky-300 rounded my-4">
        <input type="password" name="" v-model="password" placeholder="비밀번호" />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-center py-4">
        <fwb-button @click="checkPassword" color="blue"> 확인 </fwb-button>
      </div>
      <p class="text-center font-semibold text-lg" :class="{ hidden: errorText === null }">
        {{ errorText }}
      </p>
    </template>
  </fwb-modal>
</template>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
}
</style>
