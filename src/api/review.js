import axios from "axios";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

function getReviewList() {
  const access_token = cookies.get("access_token");
  return axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/reviews`, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => response.data);
}

function getReview(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/detail/` + review_id;
  const access_token = cookies.get("access_token");
  // console.log(url);
  return axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => {
      // console.log(response.data);
      return response.data;
    });
}

function deleteReview(review_id) {
  const access_token = cookies.get("access_token");

  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + review_id;

  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function addComment(review_id, commentContent) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/comments`;

  const access_token = cookies.get("access_token");

  return axios.post(
    url,
    {
      review_id,
      content: commentContent,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function modifyReview(review_id, title, content) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews`;
  const access_token = cookies.get("access_token");
  return axios.put(
    url,
    {
      review_id,
      title,
      content,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function createReview(plan_id, title, content) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + plan_id;
  console.log(url);
  const access_token = cookies.get("access_token");
  return axios.post(
    url,
    {
      title,
      content,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

async function uploadImages(review_id, form_data) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + review_id + "/image";
  const access_token = cookies.get("access_token");

  return axios.post(url, form_data, {
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "multipart/form-data",
    },
  });
}

async function deleteImages(review_id, images) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + review_id + "/image";
  const access_token = cookies.get("access_token");

  console.log(images);
  return axios.delete(url, {
    data: {
      images,
    },
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function updateCommentCount(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + "comment" + "/" + review_id;
  const access_token = cookies.get("access_token");
  return axios.put(
    url,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function updateLikeCount(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + "like" + "/" + review_id;
  const access_token = cookies.get("access_token");
  return axios.put(
    url,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function updateScrapCount(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + "scrap" + "/" + review_id;
  const access_token = cookies.get("access_token");
  return axios.put(
    url,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function addLike(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + "like" + "/" + review_id;
  const access_token = cookies.get("access_token");
  console.log("addLike");
  return axios.post(
    url,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function deleteLike(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + "like" + "/" + review_id;
  const access_token = cookies.get("access_token");
  console.log("deleteLike");
  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function addScrap(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + "scrap" + "/" + review_id;
  const access_token = cookies.get("access_token");
  console.log("addScrap");
  return axios.post(
    url,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function deleteScrap(review_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/` + "scrap" + "/" + review_id;
  const access_token = cookies.get("access_token");
  console.log("deleteScrap");
  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function updateCommentLikecount(comment_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/comments/` + "like" + "/" + comment_id;
  const access_token = cookies.get("access_token");
  return axios.put(
    url,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}

function addCommentLike(comment_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/comments/` + "like" + "/" + comment_id;
  const access_token = cookies.get("access_token");
  console.log("addCommentLike");
  return axios.post(
    url,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );
}
function deleteCommentLike(comment_id) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/comments/` + "like" + "/" + comment_id;
  const access_token = cookies.get("access_token");
  console.log("deleteCommentLike");
  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function getPopularReviews() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/reviews/popular`;
  const access_token = cookies.get("access_token");

  return axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => response.data);
}

export {
  getReviewList,
  getReview,
  addComment,
  deleteReview,
  modifyReview,
  createReview,
  uploadImages,
  deleteImages,
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
  getPopularReviews,
};
