<script setup>
import { ref } from "vue";
import { getPopularReviews } from "@/api/review.js";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
// import { useRouter } from "vue-router";

// const router = useRouter();
const reviewList = ref([]);

const getPopluarReviewList = async () => {
  getPopularReviews().then((data) => (reviewList.value = data));
};

getPopluarReviewList();
</script>

<template>
  <div>
    <div class="flex flex-row justify-center">
      <!-- 이미지 -->
      <carousel :items-to-show="1">
        <slide v-for="review in reviewList" :key="review.review_id">
          <img
            v-if="review.images && review.images.length"
            :src="review.images[0].url"
            class="w-1/4"
            @click="
              $router.push({ name: 'reviewDetail', params: { review_id: review.review_id } })
            " />
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </div>
  </div>
</template>

<style scoped></style>
