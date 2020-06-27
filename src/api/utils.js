import Vue from "vue";
import router from "../router/index";
import store from "../store/index";
import axios from "axios";

// 跳轉回首頁
// 登入完成後跳轉回原頁面
export const toLogin = () => {
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("Token");
  window.localStorage.removeItem("TokenExpire");
  window.localStorage.removeItem("refreshtime");
  window.localStorage.removeItem("router");
  sessionStorage.removeItem("Tags");
  store.dispatch("loadingHandler", false);
  router.replace({
    name: "Login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });

  // window.location.reload()
};

// 跳轉到404頁面
export const to404Page = () => {
  router.replace({
    name: "Err404",
  });
};

// refreshToken
export const setRefreshToken = (error) => {
  let curTime = new Date();
  let refreshtime = new Date(Date.parse(window.localStorage.refreshtime));
  // 在用戶操作的活躍期內
  if (window.localStorage.refreshtime && curTime <= refreshtime) {
    return Vue.prototype.$api
      .RefreshToken({ token: window.localStorage.Token })
      .then((res) => {
        if (res.data.success) {
          Vue.prototype.$message({
            message: "refreshToken success! loading data...",
            type: "success",
          });

          store.commit("SAVE_TOKEN", res.data.token);

          let curTime = new Date();
          let expiredate = new Date(
            curTime.setSeconds(curTime.getSeconds() + res.data.expires_in)
          );
          store.commit("SAVE_TOKEN_EXPIRE", expiredate);

          error.config.__isRetryRequest = true;
          error.config.headers.Authorization = "Bearer " + res.data.token;
          console.log("a");
          store.dispatch("loadingHandler", false);
          window.location.reload();
          return axios(error.config);
        } else {
          // 刷新token失敗 清除token信息並跳轉到登錄頁面
          toLogin();
        }
      });
  } else {
    // 返回 401，並且不知用戶操作活躍期內 清除token信息並跳轉到登錄頁面
    toLogin();
  }
};
