<script setup>
import BackButton from "@/components/common/BackButton.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import { createReview, uploadImages } from "@/api/review.js";
import { getPlans } from "@/api/user";
import ButtonClose from "../common/ButtonClose.vue";

const review = ref({ comment: [] });

const router = useRouter();

const fileInput = ref(null);
const images = ref([]);
const imageUrls = ref([]);
const planList = ref([]);
const selectedPlanId = ref(null);

const getPlanListFunc = async () => {
  planList.value = await getPlans();
};

const createReviewFunc = async () => {
  const { title, content } = review.value;

  createReview(selectedPlanId.value, title, content).then((response) => {
    const reviewId = response.data.review_id;
    const formData = new FormData();

    for (let image of images.value) {
      formData.append("review_images", image);
    }
    uploadImages(reviewId, formData).then(() => router.push({ name: "reviewList" }));
  });
};

const goBeforePage = () => {
  router.go(-1);
};

const saveImage = (e) => {
  const files = e.target.files;

  if (!files.length) {
    return;
  }

  for (let file of files) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileUrl = e.target.result;
      if (fileUrl && fileUrl.startsWith("data:image/")) {
        images.value.push(file);
        imageUrls.value.push(e.target.result);
      }
    };

    reader.readAsDataURL(file);
  }
  fileInput.value.value = "";
};

const deleteImage = (idx) => {
  images.value.splice(idx, 1);
  imageUrls.value.splice(idx, 1);
};

getPlanListFunc();
</script>

<template>
  <BackButton text="여행 리뷰 게시판" />
  <div class="flex mx-4 bg-gray-300 justify-center">
    <!-- 리뷰 공간 -->
    <div class="flex flex-col w-dvw h-dvh my-5 mx-4 bg-white">
      <div class="flex flex-row justify-end mx-4 mt-2">
        <p>플랜 선택 ></p>
        <!-- 플랜 선택 버튼 -->
        <select v-model="selectedPlanId">
          <option v-for="plan in planList" :key="plan.plan_id" :value="plan.plan_id">
            {{ plan.title }}
          </option>
        </select>
      </div>

      <!-- 제목 -->
      <div class="flex flex-row items-center mt-5 ml-3">
        <p>제목 :</p>
        <input type="text" class="text-center text-base font-bold ml-2" v-model="review.title" />
      </div>

      <div>
        <!-- 이미지 -->
        <template v-if="imageUrls.length">
          <carousel :items-to-show="1">
            <slide v-for="imageUrl in imageUrls" :key="imageUrl">
              <img :src="imageUrl" class="w-1/2" />
            </slide>
            <template #addons>
              <navigation />
              <pagination />
            </template>
          </carousel>
        </template>

        <!-- 내용 -->

        <p class="text-sm mx-5">본문</p>
        <div class="flex items-center mt-2 ml-3 text-sm font-semibold mb-1">
          <textarea class="text-sm font-bold mx-2 w-full border h-32" v-model="review.content"></textarea>
        </div>
      </div>

      <div class="flex flex-row">
        <!-- 구분선 -->
        <hr class="flex-1 h-1 mx-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
      </div>
      <div class="flex flex-row items-center px-5">
        <!-- 이미지 추가 버튼 -->
        <div class="file-box">
          <label for="file"><img src="@/assets/add-image.png" class="w-[3rem] h-[3rem]" /></label>
          <input type="file" ref="fileInput" multiple id="file" class="absolute w-0 h-0" @change="saveImage" />
        </div>
        <!-- 이미지 공간 -->
        <carousel :items-to-show="3" class="w-52">
          <slide v-for="(imageUrl, idx) in imageUrls" :key="imageUrl">
            <div class="relative">
              <button class="absolute top-0 right-0" @click="deleteImage(idx)">
                <ButtonClose />
              </button>
              <img :src="imageUrl" class="w-16 h-16" />
            </div>
          </slide>
          <template #addons>
            <!-- <navigation /> -->
            <pagination />
          </template>
        </carousel>
      </div>
      <div class="flex flex-row">
        <!-- 게시글 수정 완료 -->
        <button
          class="flex-1 h-6 text-sm bg-sky-500 hover:bg-blue-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline mx-5 my-4"
          @click="createReviewFunc"
        >
          작성 완료
        </button>
        <!-- 취소 -->
        <button
          class="flex-1 h-6 text-sm bg-sky-500 hover:bg-blue-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline mx-5 my-4"
          @click="goBeforePage"
        >
          이전으로
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
