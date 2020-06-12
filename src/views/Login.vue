<template>
  <div id="Login">
    <button @click="getRoute">login</button>
  </div>
</template>

<script>
import route from "../assets/route.json";
import router from "@/router";
import { resetRouter, filterAsyncRouter } from "@/router/index";
export default {
  methods: {
    getRoute() {
      const vm = this;
      window.localStorage.router = JSON.stringify(route);
      let getRouter = route; //後台拿到路由
      getRouter = filterAsyncRouter(getRouter); //過濾路由
      router.$addRoutes(getRouter); //動態添加路由

      vm.$router.replace(
        vm.$route.query.redirect ? vm.$route.query.redirect : "/"
      );
    }
  },
  mounted() {
    this.$http.get("/api/users").then(res => {
      console.log(res);
    });
  }
};
</script>

<style></style>
