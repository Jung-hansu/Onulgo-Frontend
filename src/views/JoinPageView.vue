<script setup>
import { ref } from "vue";
import Confirm from "@/components/auth/signup/Confirm.vue";
import Input from "@/components/auth/signup/Input.vue";

const page = ref("confirm");

const changePage = function (pageName) {
  page.value = pageName;
};
</script>

<template>
  <div v-show="page === 'confirm'">
    <Confirm @change-page="changePage" />
  </div>
  <div v-show="page === 'input'">
    <Input @change-page="changePage" />
  </div>
</template>

<style scoped></style>
