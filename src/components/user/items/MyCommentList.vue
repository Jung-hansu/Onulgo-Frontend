<script setup>
import { ref } from "vue";
import { getComments } from "@/api/user.js";
import { useRouter } from "vue-router";

const router = useRouter();

const commentList = ref([]);

const getCommentList = async () => {
  commentList.value = await getComments();
};

getCommentList();
</script>

<template>
  <div class="flex flex-col mx-10">
    <p v-if="commentList.length === 0" class="text-center font-semibold mt-10 text-xl">
      작성한 댓글이 존재하지 않습니다.
    </p>
    <template v-for="comment in commentList" :key="comment.comment_id">
      <div class="flex flex-col items-center shadow-lg bg-sky-200 rounded font-semibold my-4">
        <div>
          {{ comment.content }}
        </div>

        <!-- <p>{{ comment.is_public }}</p>
        <p>{{ comment.join_users }}</p> -->
        <div class="flex flex-row w-full justify-around">
          <button @click="router.push({ name: 'reviewDetail', params: { review_id: comment.review_id } })"
            class="bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4">
            리뷰 보기
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
