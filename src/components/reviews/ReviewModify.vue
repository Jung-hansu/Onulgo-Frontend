<script setup>
import BackButton from "@/components/common/BackButton.vue";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import { getReview, modifyReview, uploadImages, deleteImages } from "@/api/review.js";
import ButtonClose from "../common/ButtonClose.vue";

const review = ref({ comment: [] });

const route = useRoute();
const router = useRouter();

const fileInput = ref(null);
const images = ref([]);
const imageUrls = ref([]);
const unuploadedImageFiles = ref([]);
const unuploadedImageUrls = ref([]);
const removedImageDtos = ref([]);
const wholeImageUrls = computed(() => imageUrls.value.concat(unuploadedImageUrls.value));

async function getReviewData() {
  getReview(route.params.review_id).then((data) => {
    review.value = data;
    images.value = review.value.images;
    imageUrls.value = images.value.map((image) => image.url);
  });
}

const commentCount = ref(0);

watch(review, () => {
  commentCount.value = review.value.comments.length;
});

const goBeforePage = () => {
  router.go(-1);
};

const modifyReviewFunc = async () => {
  const { review_id, title, content } = review.value;

  modifyReview(review_id, title, content).then(async () => {
    if (removedImageDtos.value.length) {
      await deleteImages(review_id, removedImageDtos.value);
    }
    if (unuploadedImageFiles.value.length) {
      const formData = new FormData();

      for (let image of unuploadedImageFiles.value) {
        formData.append("review_images", image);
      }
      await uploadImages(review_id, formData).then(() => router.push({ name: "reviewList" }));
    }
    router.push({
      name: "reviewDetail",
      params: {
        review_id,
      },
    });
  });
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
        unuploadedImageFiles.value.push(file);
        unuploadedImageUrls.value.push(e.target.result);
      }
    };

    reader.readAsDataURL(file);
  }
  fileInput.value.value = "";
};

const deleteImage = (imageUrl) => {
  const dtoIdx = images.value.findIndex((dto) => dto.url === imageUrl);
  if (dtoIdx < 0) {
    const fileIdx = unuploadedImageUrls.value.indexOf(imageUrl);
    unuploadedImageFiles.value.splice(fileIdx, 1);
    unuploadedImageUrls.value.splice(fileIdx, 1);
    console.log(unuploadedImageFiles.value);
    return;
  }

  images.value.splice(dtoIdx, 1);
  imageUrls.value.splice(dtoIdx, 1);
};

getReviewData();
</script>

<template>
  <BackButton text="여행 리뷰 게시판" />
  <div class="flex mx-4 bg-gray-300 justify-center">
    <!-- 리뷰 공간 -->
    <div class="flex flex-col w-dvw h-dvh my-5 mx-4 bg-white">
      <!-- 제목 -->
      <div class="flex flex-row items-center mt-5 ml-3">
        <p>제목 :</p>
        <input type="text" class="text-center text-base font-bold ml-2" v-model="review.title" />
      </div>

      <!-- 글쓴이 -->
      <div class="flex flex-row items-center mt-5 ml-3 text-sm font-semibold">
        <p>작성자 :</p>
        <input type="text" class="text-sm font-bold ml-2" v-model="review.user_name" />
      </div>
      <!-- 작성 시간 -->
      <div class="flex flex-row items-center mt-2 ml-3 text-sm font-semibold mb-1">
        <p>작성 시간 :</p>
        <input type="text" class="text-sm font-bold ml-2" v-model="review.reg_date" />
      </div>

      <div>
        <!-- 이미지 -->
        <template v-if="wholeImageUrls.length">
          <carousel :items-to-show="1">
            <slide v-for="imageUrl in wholeImageUrls" :key="imageUrl">
              <img :src="imageUrl" class="w-1/2" />
            </slide>
            <template #addons>
              <navigation />
              <pagination />
            </template>
          </carousel>
        </template>

        <!-- 내용 -->
        <p class="text-sm mx-5">본문 :</p>
        <div class="flex flex-row items-center mt-2 ml-3 text-sm font-semibold mb-1">
          <textarea class="text-sm font-bold mx-2 w-full h-32" v-model="review.content"></textarea>
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
          <input
            type="file"
            ref="fileInput"
            multiple
            id="file"
            class="absolute w-0 h-0"
            @change="saveImage" />
        </div>
        <!-- 이미지 공간 -->
        <carousel :items-to-show="3" class="w-52">
          <slide v-for="imageUrl in wholeImageUrls" :key="imageUrl">
            <div class="relative">
              <button class="absolute top-0 right-0" @click="deleteImage(imageUrl)">
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
          @click="modifyReviewFunc">
          수정 완료
        </button>
        <!-- 취소 -->
        <button
          class="flex-1 h-6 text-sm bg-sky-500 hover:bg-blue-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline mx-5 my-4"
          @click="goBeforePage">
          이전으로
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
