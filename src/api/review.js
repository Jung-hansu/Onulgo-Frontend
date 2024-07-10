import axios from "axios";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

function getReviewList() {
  const access_token = cookies.get("access_token");
  return axios
    .get("http://localhost:80/reviews", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => response.data);
}

function getReview(review_id) {
  const url = "http://localhost:80/reviews/detail/" + review_id;
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

  const url = "http://localhost:80/reviews/" + review_id;

  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function addComment(review_id, commentContent) {
  const url = "http://localhost:80/comments";

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
  const url = "http://localhost:80/reviews";
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
  const url = "http://localhost:80/reviews/" + plan_id;
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
  const url = "http://localhost:80/reviews/" + review_id + "/image";
  const access_token = cookies.get("access_token");

  return axios.post(url, form_data, {
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "multipart/form-data",
    },
  });
}

async function deleteImages(review_id, images) {
  const url = "http://localhost:80/reviews/" + review_id + "/image";
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
  const url = "http://localhost:80/reviews/" + "comment" + "/" + review_id;
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
  const url = "http://localhost:80/reviews/" + "like" + "/" + review_id;
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
  const url = "http://localhost:80/reviews/" + "scrap" + "/" + review_id;
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
  const url = "http://localhost:80/reviews/" + "like" + "/" + review_id;
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
  const url = "http://localhost:80/reviews/" + "like" + "/" + review_id;
  const access_token = cookies.get("access_token");
  console.log("deleteLike");
  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function addScrap(review_id) {
  const url = "http://localhost:80/reviews/" + "scrap" + "/" + review_id;
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
  const url = "http://localhost:80/reviews/" + "scrap" + "/" + review_id;
  const access_token = cookies.get("access_token");
  console.log("deleteScrap");
  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function updateCommentLikecount(comment_id) {
  const url = "http://localhost:80/comments/" + "like" + "/" + comment_id;
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
  const url = "http://localhost:80/comments/" + "like" + "/" + comment_id;
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
  const url = "http://localhost:80/comments/" + "like" + "/" + comment_id;
  const access_token = cookies.get("access_token");
  console.log("deleteCommentLike");
  return axios.delete(url, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
}

function getPopularReviews() {
  const url = "http://localhost:80/reviews/popular";
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
