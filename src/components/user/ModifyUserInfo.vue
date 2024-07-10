<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import BackButton from "@/components/common/BackButton.vue";
import UserImage from "@/components/user/UserImage.vue";

import { getMyInfo, updateUserInfo } from "@/api/user.js";

const router = useRouter();

const userInfo = ref({
  user_id: "",
  name: "",
  email: "",
  password: null,
  check_password: null,
  address: "",
  phone_number: "",
});

function execDaumPostcode() {
  new window.daum.Postcode({
    oncomplete: (data) => {
      if (userInfo.value.address !== "") {
        userInfo.value.address = "";
      }
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        userInfo.value.address = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        userInfo.value.address = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === "R") {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          userInfo.value.address += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== "" && data.apartment === "Y") {
          userInfo.value.address +=
            userInfo.value.address !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (userInfo.value.address !== "") {
          userInfo.value.address = `(${userInfo.value.address})`;
        }
      } else {
        userInfo.value.address = "";
      }
      // // 우편번호를 입력한다.
      // postcode = data.zonecode;
    },
  }).open();
}

const isValidPassword = computed(() => {
  return (
    userInfo.value.check_password === null ||
    userInfo.value.password === userInfo.value.check_password
  );
});

const getUserData = async () => {
  const userData = await getMyInfo();
  userInfo.value.user_id = userData.user_id;
  userInfo.value.name = userData.name;
  userInfo.value.email = userData.email;
  userInfo.value.address = userData.address;
  userInfo.value.phone_number = userData.phone_number;
};

const updateInfo = async () => {
  console;
  await updateUserInfo(userInfo.value);
  router.push("/user/info");
};

getUserData();
</script>

<template>
  <div>
    <BackButton text="사용자 정보 수정하기"></BackButton>
  </div>

  <div class="flex flex-row justify-center mt-4">
    <UserImage></UserImage>
  </div>

  <div class="flex flex-row justify-center">
    <div
      class="flex flex-col mx-10 text-center font-semibold flex flex-col mx-10 2xl:w-[60vw] xl:w-[60vw] lg:w-[60vw] md:w-[60vw] sm:w-[70vw] w-[70vw]"
    >
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-28">이름</div>
        <input
          type="text"
          class="text-center w-full h-10 border border-sky-300 rounded my-5"
          placeholder="사용자 이름"
          v-model="userInfo.name"
          readonly
        />
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-28">이메일</div>
        <input
          type="text"
          class="text-center w-full h-10 border border-sky-300 rounded my-5"
          placeholder="이메일"
          v-model="userInfo.email"
          readonly
        />
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-28">비밀번호</div>
        <input
          type="password"
          class="text-center w-full h-10 border border-sky-300 rounded my-5"
          placeholder="새 비밀번호"
          v-model="userInfo.password"
        />
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-28 mt-5">확인</div>
        <input
          type="password"
          class="text-center w-full h-10 border border-sky-300 rounded my-5 mb-0"
          placeholder="비밀번호 확인"
          v-model="userInfo.check_password"
        />
      </div>
      <p class="ml-20 text-red-500 text-sm" :class="{ invisible: isValidPassword }">
        비밀번호가 일치하지 않습니다.
      </p>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-28">거주지</div>
        <input
          type="text"
          class="text-center w-full h-10 border border-sky-300 rounded my-5"
          placeholder="거주지"
          v-model="userInfo.address"
          @click="execDaumPostcode"
        />
      </div>
      <div class="flex flex-row justify-start items-center">
        <div class="text-center w-28">전화번호</div>
        <input
          type="text"
          class="text-center w-full h-10 border border-sky-300 rounded my-5"
          placeholder="전화번호"
          v-model="userInfo.phone_number"
        />
      </div>
      <button
        class="text-center hover:bg-blue-700 bg-blue-500 text-white font-bold my-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-6"
        @click="updateInfo"
      >
        내 정보 수정하기
      </button>
    </div>
  </div>
</template>

<style scoped>
input {
  text-indent: 0rem;
}
</style>
