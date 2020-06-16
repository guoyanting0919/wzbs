<template>
  <div id="app">
    <loading :active.sync="isLoading"></loading>

    <!-- 需要父層樣式 -->
    <div class="needHome" v-if="!$route.meta.NoNeedHome">
      <el-container class="mainLayout">
        <!-- header -->
        <el-header style="padding:0">
          <Header @getCollapse="getCollapse"></Header>
        </el-header>
        <el-container>
          <el-aside class="mainLayoutAside" :class="{'isCollapse':isCollapse}">
            <!-- aside -->
            <el-menu
              :default-active="$route.path"
              :collapse-transition="false"
              class="sideBar"
              :unique-opened="uniqueOp"
              :collapse="isCollapse"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router="true"
            >
              <Sidebar
                :isCollapse="isCollapse"
                v-for="(menu) in routes"
                :key="menu.id"
                :item="menu"
              ></Sidebar>
            </el-menu>
          </el-aside>
          <el-main>
            <!-- tags -->
            <Tags></Tags>
            <div class="viewHeight">
              <router-view></router-view>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>

    <!-- 不須父層樣式 -->
    <div v-else>
      <div class="noNeedHome">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Tags from "./components/Tags";

import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "App",

  components: {
    Loading,
    Header,
    Sidebar,
    Tags
  },

  data() {
    return {
      isCollapse: false,
      uniqueOp: true,
      routes: [],
      transitionName: "slide-left"
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    }
  },

  methods: {
    getCollapse(boolen) {
      this.isCollapse = boolen;
    }
  },

  mounted() {
    let NavigationBar = JSON.parse(
      window.localStorage.router ? window.localStorage.router : null
    );

    if (this.routes.length <= 0 && NavigationBar && NavigationBar.length >= 0) {
      this.routes = NavigationBar;
    }
  },

  watch: {}
};
</script>

<style lang="scss">
</style>
