import axios from "axios";
import router from "../router/index";
import store from "../store/index";
import { toLogin, to404Page, setRefreshToken, tokenExpire } from "./utils";
import moment from "moment";

export const saveRefreshtime = (params) => {
  let nowtime = new Date();
  // 尚未過期
  if (nowtime < new Date(Date.parse(window.localStorage.TokenExpire))) {
    let expiretime = moment(nowtime)
      .add(60, "m")
      .toDate();
    // console.log(expiretime);
    window.localStorage.TokenExpire = expiretime;
  } else {
    window.localStorage.TokenExpire = new Date(-1);
  }
  // let lastRefreshtime = window.localStorage.refreshtime
  //   ? new Date(window.localStorage.refreshtime)
  //   : new Date(-1);
  // console.log("lastRefreshtime", lastRefreshtime);
  // let expiretime = new Date(Date.parse(window.localStorage.TokenExpire));

  // console.log(expiretime);
  // let refreshCount = 1; //滑動係數
  // if (lastRefreshtime >= nowtime) {
  //   lastRefreshtime = nowtime > expiretime ? nowtime : expiretime;
  //   lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount);
  //   window.localStorage.refreshtime = lastRefreshtime;
  //   console.log("if");
  // } else {
  //   window.localStorage.refreshtime = new Date(-1);
  //   console.log("else");
  // }
};

// 錯誤捕捉
const errorHandle = (status, msg, response) => {
  switch (status) {
    case 400:
      to404Page();
      break;

    case 401:
      // console.log(response);
      setRefreshToken(response);
      // tokenExpire(response);
      break;

    case 403:
      to404Page();
      break;

    case 404:
      to404Page();
      break;

    case 500:
      to404Page();
      break;

    default:
      to404Page();
      break;
  }
};

let url = process.env.VUE_APP_BASE_URL;

// 設定 baseURL
let instance = axios.create({
  baseURL: url,
  // baseURL: "http://localhost:8081/api/",
});

// request 攔截
instance.interceptors.request.use(
  (config) => {
    const token = store.state.token;
    token && (config.headers.Authorization = `Bearer ${token}`);

    saveRefreshtime();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response 攔截
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      errorHandle(response.status, response.data.error, response);
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export default function(method, url, data = null) {
  method = method.toLowerCase();
  if (method == "post") {
    return instance.post(url, data);
  } else if (method == "get") {
    return instance.get(url, { params: data });
  } else if (method == "delete") {
    return instance.delete(url, { params: data });
  } else if (method == "put") {
    return instance.put(url, data);
  } else {
    console.log("未知的 method");
    return false;
  }
}
