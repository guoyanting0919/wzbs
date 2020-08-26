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
  store.dispatch("loadingHandler", false);
  router.replace({
    name: "Err404",
  });
};

// refreshToken
export const setRefreshToken = (error) => {
  let curTime = new Date();
  let TokenExpire = new Date(Date.parse(window.localStorage.TokenExpire));
  // 在用戶操作的活躍期內
  if (TokenExpire >= curTime) {
    // Vue.prototype.$message({
    //   message: "刷新token中 請稍候...",
    //   type: "success",
    // });
    return Vue.prototype.$api
      .RefreshToken({ token: window.localStorage.Token, loginto: "Cal" })
      .then((res) => {
        if (res.data.success) {
          store.commit("SAVE_TOKEN", res.data.token);

          let curTime = new Date();
          let expiredate = new Date(
            curTime.setSeconds(curTime.getSeconds() + res.data.expires_in)
          );
          store.commit("SAVE_TOKEN_EXPIRE", expiredate);

          error.config.__isRetryRequest = true;
          error.config.headers.Authorization = "Bearer " + res.data.token;
          // console.log("a");
          store.dispatch("loadingHandler", false);
          window.location.reload();
          return axios(error.config);
        } else {
          // 刷新token失敗 清除token信息並跳轉到登錄頁面
          // console.log("刷新失敗");
          toLogin();
        }
      });
  } else {
    // 返回 401，並且不知用戶操作活躍期內 清除token信息並跳轉到登錄頁面
    // toLogin();
    let timerInterval;
    store.dispatch("loadingHandler", false);
    Vue.prototype.$swal({
      title: "帳號時效逾期,請重新登入",
      html: "頁面將於 <b></b> ms後跳轉",
      timer: 3000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Vue.prototype.$swal.showLoading();
        timerInterval = window.setInterval(() => {
          const content = Vue.prototype.$swal.getContent();
          if (content) {
            const b = content.querySelector("b");
            if (b) {
              b.textContent = Vue.prototype.$swal.getTimerLeft();
            }
          }
        }, 100);
      },
      onClose: () => {
        clearInterval(timerInterval);
        toLogin();
      },
    });
  }
};

// token 過期
export const tokenExpire = (error) => {
  // console.log(error);
  let timerInterval;
  store.dispatch("loadingHandler", false);
  Vue.prototype.$swal({
    title: "帳號時效逾期,請重新登入",
    html: "頁面將於 <b></b> ms後跳轉",
    timer: 3000,
    timerProgressBar: true,
    onBeforeOpen: () => {
      Vue.prototype.$swal.showLoading();
      timerInterval = window.setInterval(() => {
        const content = Vue.prototype.$swal.getContent();
        if (content) {
          const b = content.querySelector("b");
          if (b) {
            b.textContent = Vue.prototype.$swal.getTimerLeft();
          }
        }
      }, 100);
    },
    onClose: () => {
      clearInterval(timerInterval);
      toLogin();
    },
  });
};
