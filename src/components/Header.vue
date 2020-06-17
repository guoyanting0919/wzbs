<template>
  <div id="header">
    <div class="logoBox" v-if="!isCollapse">文藻行事曆系統後台</div>
    <div class="logoBox logoBoxCollapse" v-else>W.Z</div>
    <div class="breads">
      <i :class="{'activeBar':isCollapse}" @click="setCollapse" class="fas fa-bars"></i>

      <!-- breads -->
      <el-breadcrumb separator="/" class="breadItems">
        <el-breadcrumb-item class="breadLink" v-for="item in $route.matched" :key="item.path">
          <router-link :to="item.path" class="breadLink">{{ item.name }}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- theme switch -->
    <el-switch @change="changeTheme" class="themeSwitch" v-model="themeMode"></el-switch>

    <!-- user -->
    <div class="userBox" v-if="userInfo">
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link userinfo-inner userStyle">{{userInfo.LoginName}}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logoutHandler">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div style="cursor:pointer" @click="$router.push('/login')" class="userBox" v-else>登入</div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isCollapse: false,
      themeMode: true
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(window.localStorage.getItem("user"));
    }
  },
  methods: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit("getCollapse", this.isCollapse);
    },
    logoutHandler() {
      const vm = this;
      vm.$confirm("即將登出", "提示", {
        type: "info",
        confirmButtonText: "確定"
      })
        .then(() => {
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("Token");
          window.localStorage.removeItem("TokenExpire");
          window.localStorage.removeItem("refreshtime");
          window.localStorage.removeItem("router");
          sessionStorage.removeItem("Tags");
          // this.$store.commit("SAVE_TAG_DATA", "");
          global.antRouter = [];
          vm.$router.push("/");
          window.location.reload();
        })
        .catch(() => {});
    },
    changeTheme() {
      // window.localStorage.setItem("Theme", theme);
      // console.log(theme);
      if (this.themeMode) {
        window.document.documentElement.setAttribute("data-theme", "theme1");
      } else {
        window.document.documentElement.setAttribute("data-theme", "theme2");
      }
    }
  }
};
</script>

<style>
</style>