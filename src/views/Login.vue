<template>
  <div id="Login">
    <!-- <button @click="getRoute">login</button> -->
    <!-- <button @click="loginHandler">superLogin</button>
    <input type="text" v-model="account" />
    <input type="text" v-model="password" />
    <button @click="loginHandler">login</button>-->

    <div class="loginBox">
      <h2>LOGIN</h2>
      <div class="inputBox">
        <label for="userName">Username:</label>
        <input
          autocomplete="off"
          v-model="account"
          id="userName"
          type="text"
          placeholder="example@gmail.com"
        />
      </div>
      <div class="inputBox">
        <label for="password">Password:</label>
        <input
          autocomplete="off"
          v-model="password"
          id="password"
          type="password"
          placeholder="●●●●●●●●●"
        />
      </div>
      <button class="loginHandler" @click="loginHandler">Sign in</button>
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
      password: "1qaz@WSX"
    };
  },
  methods: {
    loginHandler() {
      const vm = this;
      let params = {
        account: vm.account,
        password: vm.password
      };
      vm.$store.dispatch("loadingHandler", true);
      vm.$api.GetAdminToken(params).then(res => {
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
      });
    },
    GetInfoByToken(token) {
      const vm = this;
      let params = {
        token
      };
      vm.$api.GetInfoByToken(params).then(res => {
        window.localStorage.user = JSON.stringify(res.data.response);
        console.log(res.data.response);

        vm.GetNavigationBar(res.data.response.Id);
      });
    },
    GetNavigationBar(uid) {
      const vm = this;
      let params = {
        uid
      };
      vm.$api.GetNavigationBar(params).then(res => {
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
    }
  },
  mounted() {}
};
</script>

<style lang='scss'>
</style>
