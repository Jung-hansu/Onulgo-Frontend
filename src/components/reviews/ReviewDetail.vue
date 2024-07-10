<script setup>
import BackButton from "@/components/common/BackButton.vue";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import {
  getReview,
  addComment,
  deleteReview,
  updateCommentCount,
  updateLikeCount,
  updateScrapCount,
  addLike,
  deleteLike,
  addScrap,
  deleteScrap,
  updateCommentLikecount,
  addCommentLike,
  deleteCommentLike,
} from "@/api/review.js";

const review = ref({ comment: [] });
const commentContent = ref("");

const route = useRoute();
const router = useRouter();

async function getReviewData() {
  review.value = await getReview(route.params.review_id);
  // console.log(review.value);
}

getReviewData();

const createComment = async () => {
  console.log(review.value);
  const review_id = await review.value.review_id;
  const content = commentContent.value;
  await addComment(review_id, content);
  commentContent.value = "";
  await updateCommentCount(review_id);
  getReviewData();
};

const deleteReviewFunc = async () => {
  if (confirm("정말 삭제하시겠습니까?") === true) {
    const review_id = await review.value.review_id;
    await deleteReview(review_id);
    router.push({ name: "reviewList" });
  }
};

const addLikeFunc = async () => {
  const review_id = await review.value.review_id;
  await addLike(review_id);
  await updateLikeCount(review_id);
  getReviewData();
};

const deleteLikeFunc = async () => {
  const review_id = await review.value.review_id;
  await deleteLike(review_id);
  await updateLikeCount(review_id);
  getReviewData();
};

const addScrapFunc = async () => {
  const review_id = await review.value.review_id;
  await addScrap(review_id);
  await updateScrapCount(review_id);
  getReviewData();
};

const deleteScrapFunc = async () => {
  const review_id = await review.value.review_id;
  await deleteScrap(review_id);
  await updateScrapCount(review_id);
  getReviewData();
};

const addCommentLikeFunc = async (comment_id) => {
  await addCommentLike(comment_id);
  await updateCommentLikecount(comment_id);
  getReviewData();
};

const deleteCommentLikeFunc = async (comment_id) => {
  await deleteCommentLike(comment_id);
  await updateCommentLikecount(comment_id);
  getReviewData();
};
</script>

<template>
  <BackButton text="여행 리뷰 게시판" />
  <div class="flex mx-4 bg-gray-300 justify-center w-[90dvw]">
    <!-- 리뷰 공간 -->
    <div class="flex flex-col w-[95%] h-dvh my-5 mx-5 bg-white">
      <!-- 제목 -->
      <p class="text-center text-2xl font-bold mt-10">{{ review.title }}</p>
      <div class="flex flex-row justify-between">
        <!-- 글쓴이 -->
        <p class="text-sm font-semibold mt-5 ml-5">작성자 : {{ review.user_name }}</p>
        <!-- 조회수 -->
        <p class="text-sm font-semibold mt-5 mr-5">조회수 : {{ review.view_count }}</p>
      </div>

      <!-- 작성 시간 -->
      <p class="text-sm font-semibold mt-2 ml-5">작성 시간 : {{ review.reg_date }}</p>

      <div>
        <!-- 이미지 -->
        <template v-if="review.images">
          <carousel :items-to-show="1">
            <slide v-for="image in review.images" :key="image.review_image_id">
              <img :src="image.url" class="w-1/2" />
            </slide>
            <template #addons>
              <navigation />
              <pagination />
            </template>
          </carousel>
        </template>
        <!-- 내용 -->
        <p class="mx-5 mt-5 font-semibold">{{ review.content }}</p>
      </div>

      <!-- 글 수정, 삭제 --><!-- 좋아요 댓글 스크랩 -->
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center text-center">
          <button
            class="h-6 text-sm bg-sky-500 hover:bg-blue-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline ml-5 my-4"
            @click="router.push({ name: 'reviewModify' }, { params: { review_id: review.review_id } })"
          >
            글 수정
          </button>
          <button
            class="h-6 text-sm bg-sky-500 hover:bg-blue-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline mx-5 my-4"
            @click="deleteReviewFunc"
          >
            글 삭제
          </button>
        </div>
        <div class="flex flex-row justify-end items-center mx-2">
          <div class="flex flex-row items-center">
            <img src="@/assets/like.png" class="w-4 h-4" v-if="review.is_like" @click="deleteLikeFunc" />
            <img src="@/assets/non-like.png" v-else class="w-4 h-4" @click="addLikeFunc" />
            <p class="ml-1 mr-2">{{ review.like_count }}</p>
          </div>

          <div class="flex flex-row items-center">
            <img src="@/assets/comment.png" class="w-4 h-4" />
            <p class="ml-1 mr-2">{{ review.comment_count }}</p>
          </div>
          <div class="flex flex-row items-center">
            <img src="@/assets/scrap.png" class="w-4 h-4" v-if="review.is_scrap" @click="deleteScrapFunc" />
            <img src="@/assets/non-scrap.png" class="w-4 h-4" v-else @click="addScrapFunc" />
            <p class="ml-1 mr-2">
              {{ review.scrap_count }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-row">
        <!-- 구분선 -->
        <hr class="flex-1 h-1 mx-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
      </div>

      <!-- 댓글 작성 -->
      <div class="flex flex-row h-[3rem] bg-sky-300 items-center">
        <p class="font-semibold mx-5 text-sm">댓글 쓰기</p>
        <input type="text" class="w-60" v-model="commentContent" />
        <button
          class="text-xs bg-sky-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline px-4 py-2"
          @click="createComment"
        >
          댓글 작성
        </button>
      </div>

      <!-- 댓글 공간 -->
      <div v-for="(comment, index) in review.comments" :key="comment.comment_id" class="flex flex-col mx-4">
        <div class="flex flex-row justify-between font-semibold mb-1">
          <!-- 사용자 -->
          <p>{{ comment.user_name }}</p>
          <!-- 작성 시간 -->
          <p class="text-sm">{{ comment.reg_date }}</p>
        </div>

        <div class="flex flex-row justify-between items-center">
          <!-- 내용 -->
          <p class="font-semibold mb-1">
            {{ comment.content }}
          </p>

          <!-- 좋아요 -->
          <div class="flex flex-row items-center">
            <img
              src="@/assets/like.png"
              class="w-4 h-4"
              v-if="comment.is_like"
              @click="deleteCommentLikeFunc(comment.comment_id)"
            />
            <img src="@/assets/non-like.png" class="w-4 h-4" v-else @click="addCommentLikeFunc(comment.comment_id)" />
            <p class="ml-1 mr-2 font-bold">{{ comment.like_count }}</p>
          </div>
        </div>

        <hr
          v-if="index < review.comments.length - 1"
          class="flex-1 h-1 mx-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
