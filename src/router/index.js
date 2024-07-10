import { createRouter, createWebHistory } from "vue-router";
import MainPageView from "@/views/MainPageView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainPageView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginPageView.vue"),
    },
    {
      path: "/join",
      name: "join",
      component: () => import("@/views/JoinPageView.vue"),
    },
    {
      path: "/find",
      name: "find",
      component: () => import("@/views/FindPageView.vue"),
      redirect: { name: "password" },
      children: [
        {
          path: "email",
          name: "email",
          component: () => import("@/components/auth/FindEmail.vue"),
        },
        {
          path: "password",
          name: "password",
          component: () => import("@/components/auth/FindPassword.vue"),
        },
      ],
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/TestPageView.vue"),
    },
    {
      path: "/plans/all",
      name: "allPlans",
      component: () => import("@/views/plans/AllPlanView.vue"),
    },
    {
      path: "/plans",
      name: "plan",
      redirect: { name: "planList" },
      component: () => import("@/views/plans/PlanView.vue"),
      children: [
        {
          path: "list",
          name: "planList",
          component: () => import("@/components/plans/PlanList.vue"),
        },
        {
          path: ":plan_id",
          name: "planDetail",
          component: () => import("@/components/plans/PlanDetail.vue"),
        },
        {
          path: "create",
          name: "planCreate",
          component: () => import("@/components/plans/create/PlanCreate.vue"),
          children: [
            {
              path: "date",
              name: "planCreateDate",
              component: () => import("@/components/plans/create/PlanCreateDate.vue"),
            },
            {
              path: "accommodation",
              name: "planCreateAccommodation",
              component: () => import("@/components/plans/create/PlanCreateAccommodation.vue"),
            },
            {
              path: "attraction",
              name: "planCreateAttraction",
              component: () => import("@/components/plans/create/PlanCreateAttraction.vue"),
            },
          ],
        },
        {
          path: ":plan_id/modify",
          name: "planModify",
          component: () => import("@/components/plans/modify/PlanModify.vue"),
          children: [
            {
              path: "date",
              name: "planModifyDate",
              component: () => import("@/components/plans/modify/PlanModifyDate.vue"),
            },
            {
              path: "accommodation",
              name: "planModifyAccommodation",
              component: () => import("@/components/plans/modify/PlanModifyAccommodation.vue"),
            },
            {
              path: "attraction",
              name: "planModifyAttraction",
              component: () => import("@/components/plans/modify/PlanModifyAttraction.vue"),
            },
          ],
        },
      ],
    },

    {
      path: "/user",
      name: "user",
      redirect: { name: "userInfo" },
      component: () => import("@/views/UserPageView.vue"),
      children: [
        {
          path: "info",
          name: "userInfo",
          component: () => import("@/components/user/UserInfo.vue"),
        },
        {
          path: "modify",
          name: "modify",
          component: () => import("@/components/user/ModifyUserInfo.vue"),
        },
        {
          path: "plan",
          name: "userPlan",
          component: () => import("@/components/user/UserPlans.vue"),
        },
        {
          path: "review",
          name: "userReview",
          component: () => import("@/components/user/UserReviews.vue"),
        },
        {
          path: "comment",
          name: "userComment",
          component: () => import("@/components/user/UserComments.vue"),
        },
        {
          path: "plan",
          name: "userScrapPlan",
          component: () => import("@/components/user/UserScrapPlans.vue"),
        },
        {
          path: "review",
          name: "userScrapReview",
          component: () => import("@/components/user/UserScrapReviews.vue"),
        },
      ],
    },
    {
      path: "/ai",
      name: "ai",
      redirect: { name: "aiPrompt" },
      component: () => import("@/views/AIPlanPageView.vue"),
      children: [
        {
          path: "prompt",
          name: "aiPrompt",
          component: () => import("@/components/AI/AIPrompt.vue"),
        },
        {
          path: "plan",
          name: "aiPlan",
          component: () => import("@/components/AI/AIPlan.vue"),
        },
      ],
    },
    {
      path: "/review",
      name: "review",
      component: () => import("@/views/reviews/ReviewView.vue"),
      redirect: { name: "reviewList" },
      children: [
        {
          path: "list",
          name: "reviewList",
          component: () => import("@/components/reviews/ReviewList.vue"),
        },
        {
          path: "detail/:review_id",
          name: "reviewDetail",
          component: () => import("@/components/reviews/ReviewDetail.vue"),
        },
        {
          path: "modify/:review_id",
          name: "reviewModify",
          component: () => import("@/components/reviews/ReviewModify.vue"),
        },
        {
          path: "create",
          name: "reviewCreate",
          component: () => import("@/components/reviews/ReviewCreate.vue"),
        },
      ],
    },
  ],
});

export default router;
