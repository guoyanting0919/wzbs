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

    <!-- user -->
    <div class="userBox">
      <el-dropdown trigger="hover">
        <span @click="$router.push('/login')" class="el-dropdown-link userinfo-inner userStyle">User</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>我的消息</el-dropdown-item>
          <el-dropdown-item>設置</el-dropdown-item>
          <el-dropdown-item @click.native="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit("getCollapse", this.isCollapse);
    },
    logout() {
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
          global.antRouter = [];
          vm.$router.push("/Login");
          // window.location.reload();
          //  this.$store.commit("saveTagsData", "");
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
</style>