<script setup>
import { ref } from "vue";

const props = defineProps({
  props: {
    isLogin: Boolean,
    width: Number,
    height: Number
  }
});
</script>

<template>
  <!-- 유저가 존재하는 경우 사용자 이미지 출력 -->
  <!-- <img :src="" /> -->
  <div class="user-image">
    <img :src="user === null ? '/src/assets/anonymous.png' : '/src/assets/ssafy_logo.png'" />
  </div>
</template>

<style scoped></style>
