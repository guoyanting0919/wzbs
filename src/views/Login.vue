<template>
  <div id="Login">
    <div class="loginTitle">
      <p>文藻行事曆後台管理系統</p>
      <p>管理員登入</p>
    </div>

    <div class="loginBox">
      <div class="inputBox">
        <el-input
          style="width: 300px"
          prefix-icon="el-icon-user-solid"
          placeholder="帳號 / Username"
          v-model="account"
        ></el-input>
      </div>
      <div class="inputBox">
        <el-input
          prefix-icon="el-icon-key"
          style="width: 300px"
          placeholder="密碼 / Password"
          v-model="password"
          show-password
        ></el-input>
      </div>
      <div class="identifyBox">
        <div @click="refreshCode">
          <Identify :identifyCode="identifyCode"></Identify>
        </div>
        <input type="text" v-model="code" placeholder="請輸入驗證碼" />
      </div>
      <div class="changeCode">點擊圖片更新驗證碼</div>
      <button class="loginHandler" @click="loginHandler">登入 / Login</button>
    </div>
  </div>
</template>

<script>
import route from "../assets/route.json";
import router from "@/router";
import { resetRouter, filterAsyncRouter } from "@/router/index";
import Identify from "../components/Identify";
export default {
  data() {
    return {
      account: "",
      password: "",
      // 數字驗證
      code: "",
      identifyCodes: "1234567890",
      identifyCode: "",
    };
  },
  components: {
    Identify,
  },
  methods: {
    // 生成隨機數
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 切換驗證碼
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 生成四位隨機驗證碼
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    loginHandler() {
      const vm = this;
      if (vm.account === "" || vm.password === "") {
        vm.$alertM.fire({
          icon: "error",
          title: "帳號密碼不得為空",
        });
      } else {
        if (vm.identifyCode !== vm.code) {
          vm.$alertM.fire({
            icon: "error",
            title: `驗證碼輸入錯誤`,
          });
        } else {
          let params = {
            account: vm.account,
            password: vm.password,
            loginto: "Cal",
          };
          vm.$store.dispatch("loadingHandler", true);
          vm.$api.GetAdminToken(params).then((res) => {
            if (!res.data.success) {
              vm.$store.dispatch("loadingHandler", false);
              vm.$alertM.fire({
                icon: "error",
                title: res.data.message,
              });
            } else {
              let token = res.data.token;
              vm.$store.commit("SAVE_TOKEN", token);

              let curTime = new Date();
              // 設定 token 過期時間
              let expiredate = new Date(
                curTime.setSeconds(curTime.getSeconds() + res.data.expires_in)
              );
              vm.$store.commit("SAVE_TOKEN_EXPIRE", expiredate);

              window.localStorage.refreshtime = expiredate;
              window.localStorage.expires_in = res.data.expires_in;

              vm.GetInfoByToken(token);
            }
          });
        }
      }
    },
    GetInfoByToken(token) {
      const vm = this;
      let params = {
        token,
      };
      vm.$api.GetInfoByToken(params).then((res) => {
        window.localStorage.user = JSON.stringify(res.data.response);
        console.log(res.data.response);

        vm.GetNavigationBar(res.data.response.Id);
      });
    },
    GetNavigationBar(uid) {
      const vm = this;
      console.log(uid);
      let params = {
        uid,
      };
      vm.$api.GetNavigationBar(params).then((res) => {
        console.log(res.data.success);
        if (res.data.success) {
          let route = res.data.response.children;
          window.localStorage.router = JSON.stringify(route);

          // 過濾拿到的router
          let getRouter = filterAsyncRouter(route);
          // 動態添加router
          router.$addRoutes(getRouter);

          vm.$store.dispatch("loadingHandler", false);

          vm.$router
            .replace(vm.$route.query.redirect ? vm.$route.query.redirect : "/")
            .then(window.location.reload());
        } else {
          vm.$alertM.fire({
            icon: "error",
            title: "無此帳號或該帳號尚未設定權限",
          });
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("Token");
          window.localStorage.removeItem("TokenExpire");
          window.localStorage.removeItem("refreshtime");
          window.localStorage.removeItem("router");
          sessionStorage.removeItem("Tags");
          vm.$store.dispatch("loadingHandler", false);
        }
      });
    },
  },
  mounted() {
    const vm = this;
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
    let isLogin = localStorage.Token;
    if (isLogin) {
      vm.GetInfoByToken(isLogin);
    }
  },
};
</script>

<style lang='scss'>
</style>
