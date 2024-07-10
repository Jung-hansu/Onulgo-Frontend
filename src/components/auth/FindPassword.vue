<script setup>
import { ref } from "vue";
import { findPassword } from "@/api/auth";

const name = ref("");
const email = ref("");
const password = ref(null);

const find = async () => {
  password.value = await findPassword(name.value, email.value);
  if (password.value === null) {
    password.value = "일치하는 비밀번호가 없습니다.";
    return;
  }
};
</script>

<template>
  <div class="flex flex-col mt-32 mx-14">
    <div class="mb-16"><p class="text-center text-3xl font-bold">비밀번호 찾기</p></div>
    <div>
      <input
        type="text"
        placeholder="  이름"
        class="w-full h-10 border border-sky-300 rounded my-4 mb-8"
        v-model="name"
      />
    </div>
    <div>
      <input
        type="text"
        placeholder="  이메일"
        class="w-full h-10 border border-sky-300 rounded my-4 mb-2"
        v-model="email"
      />
    </div>
    <span>
      <RouterLink to="/find/email" class="text-xs font-bold cursor-pointer"
        >이메일을 잊어버리셨나요?</RouterLink
      ></span
    >
    <div class="text-right mb-8">
      <button
        class="w-24 h-12 bg-cyan-300 rounded text-base font-semibold hover:bg-cyan-400"
        @click="find"
      >
        찾기
      </button>
    </div>
    <span
      class="flex flex-col text-center bg-gray-200 h-40 justify-center rounded"
      :class="{ hidden: password === null }"
    >
      <p class="text-lg font-bold">{{ password }}</p>
    </span>
  </div>
</template>

<style scoped></style>
