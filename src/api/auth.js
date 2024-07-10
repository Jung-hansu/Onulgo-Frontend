import axios from "axios";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

function checkToken() {
    const access_token = cookies.get("access_token");
    let user = null;

    //액세스 토큰이 없는 경우
    if (access_token === null) {
        reIssue();    
        return;
    }

    // try {

    // } catch (error) {
    //     console.error(error);
    // }
    
    
    return axios.get("http://localhost:80/check", {
        headers: {
            "Authorization": "Bearer " + access_token,
        }
    })
        .then((response) => {
            return response.data.user;
    });
}

function reIssue() {
    const refresh_token = cookies.get("refresh_token");

    console.log("refresh : " + refresh_token);
    if (refresh_token === null) {
        return;
    }

    
}

function logout(router) {

    const access_token = cookies.get("access_token");
    axios.get("http://localhost:80/logout", {
        headers: {
            "Authorization": "Bearer " + access_token,
        }
    })
        .catch((error) => console.error(error));
    
    cookies.remove("access_token");
    cookies.remove("refresh_token");

    router.go(0);

}

function login(router, email, password) {
    axios
      .post("http://localhost:80/login", {
        email,
        password,
      })
      .then((response) => {
        // console.log(response);
        // console.log(cookies);
  
        // console.log(response.cookies);
  
        cookies.set("access_token", response.data.access_token);
        cookies.set("refresh_token", response.data.refresh_token);
  
        console.log(cookies.get("access_token"));
        console.log(cookies.get("refresh_token"));
        router.push("/");
      })
      .catch((error) => {
        console.log(error.response.status);
        console.log(error);
      });
  }

function findPassword(name, email) { 
    return axios.post("http://localhost:80/find/password", {
        name,
        email,
    }).then((response) => { 
        return response.data.password;
    })
}

function findEmail(name, phoneNumber) { 
    return axios.post("http://localhost:80/find/email", {
        name: name,
        phone_number: phoneNumber,
    }).then((response) => { 
        return response.data.email;
    })
}

export {
    checkToken,
    reIssue,
    logout,
    login,
    findEmail,
    findPassword
}