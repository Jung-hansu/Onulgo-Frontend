<script setup>
import { ref } from "vue";
import { getScrapReviews } from "@/api/user.js";

const reviewList = ref([]);

const getScrapReviewList = async () => {
  reviewList.value = await getScrapReviews();
};

getScrapReviewList();
</script>

<template>
  <div class="flex flex-col mx-10">
    <p v-if="reviewList.length === 0" class="text-center font-semibold mt-10 text-xl">
      작성한 리뷰가 존재하지 않습니다.
    </p>
    <template v-for="review in reviewList" :key="review.review_id">
      <div class="flex flex-col items-center shadow-lg bg-sky-200 rounded font-semibold my-4">
        <div>
          {{ review.title }}
        </div>
        <div class="text-right text-sm">
          {{ review.reg_date }}
        </div>
        <div>
          {{ review.content }}
        </div>

        <div class="flex flex-row w-full justify-around">
          <RouterLink
            :to="{ name: 'reviewDetail', params: { review_id: review.review_id } }"
            class="text-center bg-blue-500 w-36 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
          >
            자세히 보기
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
