<template>
  <div id="Login">
    <div class="loginTitle">
      <p>文藻行事曆後台管理系統</p>
      <p>管理員登入</p>
    </div>

    <div class="loginBox">
      <div class="inputBox">
        <el-input
          style="width:300px"
          prefix-icon="el-icon-user-solid"
          placeholder="帳號 / Username"
          v-model="account"
        ></el-input>
      </div>
      <div class="inputBox">
        <el-input
          prefix-icon="el-icon-key"
          style="width:300px"
          placeholder="密碼 / Password"
          v-model="password"
          show-password
        ></el-input>
      </div>
      <button class="loginHandler" @click="loginHandler">登入 / Login</button>
    </div>
  </div>
</template>

<script>
import route from "../assets/route.json";
import router from "@/router";
import { resetRouter, filterAsyncRouter } from "@/router/index";
export default {
  data() {
    return {
      account: "87042",
      password: "45445145",
    };
  },
  methods: {
    loginHandler() {
      const vm = this;
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
      let params = {
        uid,
      };
      vm.$api.GetNavigationBar(params).then((res) => {
        console.log(res, params);
        let route = res.data.response.children;
        window.localStorage.router = JSON.stringify(route);

        // 過濾拿到的router
        let getRouter = filterAsyncRouter(route);
        console.log(getRouter);
        // 動態添加router
        router.$addRoutes(getRouter);

        vm.$store.dispatch("loadingHandler", false);

        // // window.location.reload();

        vm.$router
          .replace(vm.$route.query.redirect ? vm.$route.query.redirect : "/")
          .then(window.location.reload());
      });
    },
  },
  mounted() {},
};
</script>

<style lang='scss'>
</style>
