import Vue from "vue";
import router from "../router/index";

// 跳轉回首頁
// 登入完成後跳轉回原頁面
export const toLogin = () => {
  router.replace({
    name: "Login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });
};

// 跳轉到404頁面
export const to404Page = () => {
  router.replace({
    name: "Err404",
  });
};

// refreshToken
export const setRefreshToken = () => {
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

          store.commit("saveToken", res.data.token);

          let curTime = new Date();
          let expiredate = new Date(
            curTime.setSeconds(curTime.getSeconds() + res.data.expires_in)
          );
          store.commit("saveTokenExpire", expiredate);

          error.config.__isRetryRequest = true;
          error.config.headers.Authorization = "Bearer " + res.data.token;
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
