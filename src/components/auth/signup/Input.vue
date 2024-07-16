<script setup>
import axios from "axios";

import { useRouter } from "vue-router";
import { ref, watch } from "vue";

const router = useRouter();

const isValid = ref({
  email: true,
  email_duplicate: false,
  check_btn: false,
  password: true,
  address: true,
  phone_number: true,
});

const userInfo = ref({
  name: "",
  email: "",
  password: "",
  address: "",
  phone_number: "",
  password_check: "",
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

function join() {
  console.log("test");
  console.log(isValid.value.email);
  console.log(isValid.value.email_duplicate);
  console.log(isValid.value.password);
  console.log(isValid.value.address);
  console.log(isValid.value.phone_number);
  console.log(isValid.value.check_btn);

  console.log(
    isValid.value.email &&
    isValid.value.password &&
    isValid.value.address &&
    isValid.value.check_btn &&
    isValid.value.email_duplicate &&
    isValid.value.phone_number
  );

  if (
    isValid.value.email &&
    isValid.value.password &&
    isValid.value.address &&
    isValid.value.email_duplicate &&
    isValid.value.phone_number &&
    isValid.value.check_btn
  ) {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users`, userInfo.value)
      .then((res) => {
        console.log(res);
        router.replace("login");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function check() {
  //이메일이 유효한 경우에만 중복확인 요청 가능
  if (!isValid.value.email) {
    return;
  }

  isValid.value.check_btn = true;

  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/check/` + userInfo.value.email)
    .then((res) => {
      console.log(res.data);
      isValid.value.email_duplicate = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

//validate email
watch(
  () => userInfo.value.email,
  (email) => {
    isValid.value.check_btn = false;

    if (email.length === 0) {
      isValid.value.email = true;
      return;
    }

    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (email_regex.test(email)) {
      isValid.value.email = true;
    } else {
      isValid.value.email = false;
    }
  }
);

//validate password
watch(
  () => userInfo.value.password,
  (password) => {
    if (password.length === 0) {
      return (isValid.value.password = true);
    }
    if (password.length < 4 || password.length > 20) {
      isValid.value.password = false;
    } else {
      isValid.value.password = true;
    }
  }
);

const emit = defineEmits(["changePage"]);
const beforePage = () => {
  emit("changePage", "confirm");
};
</script>

<template>
  <div class="flex flex-row items-center">
    <img src="@/assets/back_button.png" @click="beforePage" class="mt-5 ml-5 cursor-pointer" />
    <h1 class="text-xl font-bold mt-5 ml-2">회원가입</h1>
  </div>
  <div class="text-center mt-10">
    ------------●-----------------------------------------------------------
  </div>

  <form v-on:submit.prevent="join">
    <div class="flex flex-col mx-10 my-20">
      <div class="flex flex-row my-4">
        <input type="text" placeholder="사용자 이름" class="w-3/4 h-10 border border-sky-300 rounded mr-4"
          v-model="userInfo.name" />
      </div>
      <div class="mt-2"></div>
      <!-- <div class="text-xs text-red-500 font-bold">사용할 수 없는 비밀번호입니다.</div> -->
      <!-- 사용자 이름 유효성 검사 -->
      <div class="flex flex-row my-4 mb-0">
        <input type="text" placeholder="이메일" class="w-3/4 h-10 border border-sky-300 rounded mr-4"
          v-model="userInfo.email" />
        <button class="w-1/5 h-10 bg-gray-400 rounded text-white text-sm hover:bg-gray-500" v-on:click="check"
          type="button">
          중복확인
        </button>
      </div>
      <div>
        <span class="text-xs text-green-600 font-bold"
          :class="{ hidden: !isValid.email || !isValid.email_duplicate || !isValid.check_btn }">사용 가능한 아이디입니다.</span>
        <span class="text-xs text-red-600 font-bold" :class="{ hidden: isValid.email }">유효하지 않은 아이디입니다.</span>
        <span class="text-xs text-red-600 font-bold"
          :class="{ hidden: !(isValid.check_btn && !isValid.email_duplicate) }">중복된 아이디입니다.</span>
        <span :class="{ invisible: true }">hidden</span>
      </div>

      <!-- 이메일 유효성 검사 -->
      <div class="flex">
        <input type="password" placeholder="비밀번호" class="w-full h-10 border border-sky-300 rounded my-4 mb-1"
          v-model="userInfo.password" />
      </div>
      <div class="text-xs text-red-500 font-bold" :class="{ invisible: isValid.password }">
        사용할 수 없는 비밀번호입니다.
      </div>
      <div>
        <input type="password" placeholder="비밀번호 확인" class="w-full h-10 border border-sky-300 rounded my-4 mb-1"
          v-model="userInfo.password_check" />
      </div>
      <div class="text-xs text-red-500 font-bold" :class="{
        invisible:
          userInfo.password_check.length === 0 || userInfo.password === userInfo.password_check,
      }">
        비밀번호가 일치하지 않습니다.
      </div>
      <div>
        <input type="text" placeholder="거주지 주소" class="w-full h-10 border border-sky-300 rounded my-4"
          v-model="userInfo.address" @click="execDaumPostcode" />
      </div>
      <div>
        <input type="text" placeholder="전화번호" class="w-full h-10 border border-sky-300 rounded my-4"
          v-model="userInfo.phone_number" />
      </div>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
        type="submit">
        회원가입
      </button>
    </div>
  </form>
</template>

<style scoped></style>
