import axios from "axios";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

function getMyInfo() {
  const access_token = cookies.get("access_token");

  return axios
    .get("http://localhost:80/users", {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    });
}

function updateUserInfo(userInfo) {
  const access_token = cookies.get("access_token");

  const { user_id,name, email, password, address, phone_number } = userInfo;

  axios.put("http://localhost:80/users", {
    user_id,
    name,
    email,
    password,
    address,
    phone_number,
  }, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then(response => { console.log(response)});
}

function check(password) {
  const access_token = cookies.get("access_token");
  console.log(access_token);
  console.log(password);
  return axios.post("http://localhost:80/users/check", {
    password: password,
  }, {
    headers: {
      Authorization: "Bearer " + access_token,
    }
  })
    .then((response) => {
      return response.data.flag;
    })
}

function getPlans() {
  const access_token = cookies.get("access_token");
  console.log(access_token);
  return axios.get("http://localhost:80/users/plans", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then((response) => { 
    console.log(response.data);
    
    return response.data;
    })
    
}

function getReviews() {
  const access_token = cookies.get("access_token");
  console.log(access_token);

  return axios.get("http://localhost:80/users/reviews", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then((response) => { 
    console.log(response.data);
    return response.data;
    })
    
}

function getComments() {
  const access_token = cookies.get("access_token");
  console.log(access_token);

  return axios.get("http://localhost:80/users/comments", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then((response) => { 
    console.log(response.data);
    return response.data;
  }).catch((error) => {
    console.error(error);
    })
    
}

function getScrapPlans() {
  const access_token = cookies.get("access_token");
  console.log(access_token);
  return axios.get("http://localhost:80/plans/scrap", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then((response) => { 
    console.log(response.data);
    
    return response.data;
    })
    
}

function getScrapReviews() {
  const access_token = cookies.get("access_token");
  console.log(access_token);

  return axios.get("http://localhost:80/reviews/scrap", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then((response) => { 
    console.log(response.data);
    return response.data;
    })
    
}

export { getMyInfo, updateUserInfo, check, getPlans, getComments, getReviews, getScrapPlans, getScrapReviews};
