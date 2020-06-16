<template>
  <div id="Login">
    <!-- <button @click="getRoute">login</button> -->
    <button @click="loginHandler">superLogin</button>
    <input type="text" v-model="account" />
    <input type="text" v-model="password" />
    <button @click="loginTest">login</button>
  </div>
</template>

<script>
import route from "../assets/route.json";
import router from "@/router";
import { resetRouter, filterAsyncRouter } from "@/router/index";
export default {
  data() {
    return {
      account: "admin",
      password: "1qaz@WSX"
    };
  },
  methods: {
    loginTest() {
      const vm = this;
      let params = {
        account: vm.account,
        password: vm.password
      };
      // vm.$store.dispatch("loadingHandler", true);
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

        vm.GetNavigationBar(res.data.response.id);
      });
    },
    GetNavigationBar(uid) {
      const vm = this;
      let params = {
        uid
      };
      vm.$api.GetNavigationBar(params).then(res => {
        console.log(res);
        let route = res.data.response.children;
        window.localStorage.router = JSON.stringify(route);

        // 過濾拿到的router
        let getRouter = filterAsyncRouter(route);
        console.log(getRouter);
        // 動態添加router
        router.$addRoutes(getRouter);

        // // window.location.reload();

        vm.$router
          .replace(vm.$route.query.redirect ? vm.$route.query.redirect : "/")
          .then(window.location.reload());
      });
    },
    loginHandler() {
      const vm = this;
      vm.$store.dispatch("loadingHandler", true);
      vm.$api.GetToken().then(data => {
        // console.log(data);
        let res = data.data[0];
        let token = res.token;
        vm.$store.commit("SAVE_TOKEN", token);

        let curTime = new Date();
        // 設定 token 過期時間
        let expiredate = new Date(
          curTime.setSeconds(curTime.getSeconds() + res.expires_in)
        );
        vm.$store.commit("SAVE_TOKEN_EXPIRE", expiredate);

        window.localStorage.refreshtime = expiredate;
        window.localStorage.expires_in = res.expires_in;

        vm.$notify({
          type: "success",
          message: `登入成功，獲取token`,
          duration: 3000
        });

        vm.getUserInfo(token);

        vm.$store.dispatch("loadingHandler", false);
      });
    },
    getUserInfo(token) {
      const vm = this;
      vm.$api.UserInfo(token).then(data => {
        let res = data.data[0];

        window.localStorage.user = JSON.stringify(res.response);
        console.log(res);
        vm.getSideBar();
      });
    },
    getSideBar() {
      const vm = this;
      vm.$api.GetNavigationBar().then(data => {
        let res = data.data[0];
        window.localStorage.router = JSON.stringify(res);

        // api拿到router
        let getRouter = res;
        // 過濾拿到的router
        getRouter = filterAsyncRouter(getRouter);
        // 動態添加router
        router.$addRoutes(getRouter);

        // window.location.reload();

        vm.$router
          .replace(vm.$route.query.redirect ? vm.$route.query.redirect : "/")
          .then(window.location.reload());
      });
    }
    // getRoute() {
    //   const vm = this;
    //   window.localStorage.router = JSON.stringify(route);
    //   let getRouter = route; //後台拿到路由
    //   getRouter = filterAsyncRouter(getRouter); //過濾路由
    //   router.$addRoutes(getRouter); //動態添加路由

    //   vm.$router.replace(
    //     vm.$route.query.redirect ? vm.$route.query.redirect : "/"
    //   ).th;
    // }
  },
  mounted() {}
};
</script>

<style>
.el-notification__closeBtn {
  display: none;
}
</style>
