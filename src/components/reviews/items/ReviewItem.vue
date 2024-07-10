<script setup>
import { ref } from "vue";
import { getReviewList } from "@/api/review.js";

import { useRouter } from "vue-router";

const router = useRouter();

const moveDetail = (review_id) => {
  router.push({
    name: "reviewDetail",
    params: {
      review_id,
    },
  });
};

const reviewList = ref([]);

async function getReviews() {
  reviewList.value = await getReviewList();

  console.log(reviewList.value);
}

getReviews();
</script>

<template>
  <div
    v-for="review in reviewList"
    :key="review.review_id"
    class="flex flex-row w-full my-2 shadow-lg h-40"
    @click="moveDetail(review.review_id)"
  >
    <!-- 이미지 -->
    <div class="w-1/2 self-center">
      <img src="@/assets/ssafy_logo.png" class="w-40 h-40 px-2 py-2" />
    </div>

    <!-- 내용 -->
    <div class="w-full flex flex-col">
      <!-- 제목 -->
      <div class="flex flex-row justify-center">
        <p class="font-semibold">{{ review.title }}</p>
      </div>
      <!-- 작성 시간   글쓴이-->
      <div class="flex flex-row justify-between text-sm mb-1 mx-2">
        <p>{{ review.reg_date }}</p>
        <p>{{ review.user_name }}</p>
      </div>
      <!-- 내용 -->
      <p class="font-semibold mb-4 h-full">{{ review.content }}</p>
      <!-- 조회수 좋아요 댓글 스크랩 수 -->
      <div class="flex flex-row justify-end items-center">
        <div class="flex flex-row items-center">
          <p class="text-sm">조회수</p>
          <p class="ml-1 mr-2">{{ review.view_count }}</p>
        </div>
        <div class="flex flex-row items-center">
          <img src="@/assets/like.png" class="w-4 h-4" v-if="review.is_like" />
          <img src="@/assets/non-like.png" v-else class="w-4 h-4" />
          <p class="ml-1 mr-2">{{ review.like_count }}</p>
        </div>

        <div class="flex flex-row items-center">
          <img src="@/assets/comment.png" class="w-4 h-4" />
          <p class="ml-1 mr-2">{{ review.comment_count }}</p>
        </div>
        <div class="flex flex-row items-center">
          <img src="@/assets/scrap.png" class="w-4 h-4" v-if="review.is_scrap" />
          <img src="@/assets/non-scrap.png" class="w-4 h-4" v-else />
          <p class="ml-1 mr-2">
            {{ review.scrap_count }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
