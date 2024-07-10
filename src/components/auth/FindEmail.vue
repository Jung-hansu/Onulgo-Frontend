<script setup>
import { ref } from "vue";
import { findEmail } from "@/api/auth.js";

const name = ref("");
const phoneNumber = ref("");
const email = ref(null);

const find = async () => {
  email.value = await findEmail(name.value, phoneNumber.value);
  if (email.value === null) {
    email.value = "일치하는 이메일이 없습니다.";
    return;
  }
};
</script>

<template>
  <div class="flex flex-col mt-32 mx-14">
    <div class="mb-16">
      <p class="text-center text-3xl font-bold">이메일 찾기</p>
    </div>
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
        placeholder="  전화번호"
        class="w-full h-10 border border-sky-300 rounded my-4 mb-2"
        v-model="phoneNumber"
      />
    </div>
    <span>
      <RouterLink to="password" class="text-xs font-bold cursor-pointer"
        >비밀번호을 잊어버리셨나요?</RouterLink
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
      :class="{ hidden: email === null }"
    >
      <p class="text-lg font-bold">{{ email }}</p>
    </span>
  </div>
</template>

<style scoped></style>
