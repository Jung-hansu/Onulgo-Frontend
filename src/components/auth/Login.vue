<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import BackButton from "@/components/common/BackButton.vue";
import UserImage from "@/components/user/UserImage.vue";

import { login } from "@/api/auth.js";

const router = useRouter();
const email = ref("admin@gmail.com");
const password = ref("1111");

const routerRef = ref(router);

const isValid = ref({
  email: true,
  password: true,
});

//validate password
watch(
  () => password.value,
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

//validate email
watch(
  () => email.value,
  (email) => {
    if (email.length === 0) {
      return (isValid.value.email = true);
    }

    const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    if (email_regex.test(email)) {
      isValid.value.email = true;
    } else {
      isValid.value.email = false;
    }
  }
);
</script>

<template>
  <header><BackButton text="" /></header>
  <div>
    <div class="flex flex-col items-center">
      <UserImage :user="null" />

      <div class="text-center my-5">
        <h1 class="text-4xl font-bold my-5">오늘고</h1>
        <h1 class="text-2xl font-bold">여행 플랜 도우미 서비스</h1>
      </div>

      <form class="w-96 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-6">
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username"> 이메일 </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            id="username"
            type="text"
            v-model="email"
          />
          <p class="text-red-500 text-xs italic" :class="{ invisible: isValid.email }">
            이메일 형식이 잘못됐습니다.
          </p>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            비밀번호
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
            :class="{ 'border-red-500': !isValid.password }"
            id="password"
            type="password"
            v-model="password"
          />
          <p class="text-red-500 text-xs italic" :class="{ invisible: isValid.password }">
            비밀번호를 입력해주세요.
          </p>
        </div>
        <div class="flex items-center justify-end">
          <RouterLink
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="find"
          >
            비밀번호를 잊어버리셨나요?
          </RouterLink>
        </div>
        <div class="flex flex-col mt-5">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-5"
            type="button"
            v-on:click="login(routerRef, email, password)"
          >
            로그인
          </button>
          <RouterLink
            to="join"
            class="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            회원가입
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
