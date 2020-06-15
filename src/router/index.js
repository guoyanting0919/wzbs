import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout/Layout";
import Home from "../views/Home.vue";
import api from "../api/apis";
import store from "../store";

const _import = require("@/router/_import_" + process.env.NODE_ENV); //獲取組件的方法

// 防止重複點擊相同router噴error
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);
const createRouter = () =>
  new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosition) {
      return { x: 0, y: 0 };
    },
    routes: [
      {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
          title: "後臺首頁",
          // requireAuth: false, //表示是否登入驗證 false 時可省略
          // NoNeedHome: false, // 表示不需要父層模板 false 時可省略
        },
      },

      {
        path: "/Login",
        name: "Login",
        component: () => import("../views/Login.vue"),
        meta: {
          title: "登入頁",
          requireAuth: false,
          NoNeedHome: true,
          NoTabPage: true, // 不顯示頁籤
        },
      },

      {
        path: "/Err404",
        name: "Err404",
        component: () => import("../views/Err404.vue"),
        meta: {
          title: "404頁面",
          requireAuth: false,
          NoNeedHome: false,
          NoTabPage: true, // 不顯示頁籤
        },
      },

      // 不存在的路由跳轉
      {
        path: "*",
        redirect: "/Err404",
      },
    ],
  });

const router = createRouter();

export function filterAsyncRouter(asyncRouterMap) {
  //注意這裡的 asyncRouterMap 是一個數組
  const accessedRouters = asyncRouterMap.filter((route) => {
    if (route.path && !route.IsButton) {
      if (route.path === "/" || route.path === "-" || route.path === " ") {
        //Layout組件特殊處理
        route.component = Layout;
      } else {
        try {
          route.component = _import(route.path.replace("/:id", ""));
        } catch (e) {
          try {
            route.component = () =>
              import("@/views" + route.path.replace("/:id", "") + ".vue");
          } catch (error) {
            console.info(
              "%c 當前路由 " +
                route.path.replace("/:id", "") +
                ".vue 不存在，因此如法導入組件，請檢查接口數據和組件是否匹配，並重新登錄，清空緩存!",
              "color:red"
            );
          }
        }
      }
    }
    if (route.children && route.children.length && !route.IsButton) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });

  return accessedRouters;
}

router.$addRoutes = (params) => {
  let f = (item) => {
    if (item["children"]) {
      item["children"] = item["children"].filter(f);
      return true;
    } else if (item["IsButton"]) {
      return item["IsButton"] === false;
    } else {
      return true;
    }
  };

  params = params.filter(f);

  router.addRoutes(params);
};

function getObjArr(name) {
  return JSON.parse(window.localStorage.getItem(name));
}

function saveObjArr(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function saveRefreshtime(params) {
  let nowtime = new Date();
  let lastRefreshtime = window.localStorage.refreshtime
    ? new Date(window.localStorage.refreshtime)
    : new Date(-1);
  let expiretime = new Date(Date.parse(window.localStorage.TokenExpire));

  let refreshCount = 1; //滑動係數
  if (lastRefreshtime >= nowtime) {
    lastRefreshtime = nowtime > expiretime ? nowtime : expiretime;
    lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount);
    window.localStorage.refreshtime = lastRefreshtime;
  } else {
    window.localStorage.refreshtime = new Date(-1);
  }
}

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // the relevant part
}

function routerGo(to, next) {
  //過濾路由
  getRouter = filterAsyncRouter(getRouter);
  resetRouter();

  //動態添加路由
  router.$addRoutes(getRouter);

  //將路由數據傳遞給全局變量，做側邊欄菜單渲染工作
  console.log(to);
  global.antRouter = getRouter;
  next({ ...to, replace: true });
}

//類似flag以驗證是否刷新頁面，首次進入會執行以下程式
let getRouter;

if (!getRouter) {
  if (!getObjArr("router")) {
    // 若 localStorage 不存在 router資料
    let user = window.localStorage.user
      ? JSON.parse(window.localStorage.user)
      : null;
    if (user && user.uID > 0) {
      let params = { uid: user.uID };
      api.GetNavigationBar().then((data) => {
        if (data.success) {
          console.log("已透過 api 獲取 router");
          getRouter = data.data[0];
          // 將 router 存到 localStorage
          saveObjArr("router", getRouter);
          //執行路由跳轉方法
          routerGo(to, next);
        }
      });
    } else {
      console.log("未登入狀態");
    }
  } else {
    // localStorage 中有 router
    console.log("已從 localStorage 獲取路由");
    //獲取 router
    getRouter = getObjArr("router");
    // 過濾拿到的router
    getRouter = filterAsyncRouter(getRouter);
    // 動態添加router
    router.$addRoutes(getRouter);
    // global.antRouter = getRouter; //將路由數據傳遞給全局變量，做側邊欄菜單渲染工作
  }
} else {
  if (to.name && to.name != "Login") {
    // 獲取 localStorage 裏頭得 router
    getRouter = getObjArr("router");
    global.antRouter = getRouter;
    // routerGo(to, next)//執行路由跳轉方法
  }
  next();
}

// let store = store;
router.beforeEach((to, from, next) => {
  // console.log(store);
  // 設定網頁 title
  if (to.meta.title) {
    document.title = `文藻行事曆後臺-${to.meta.title}`;
  }

  // 檢查 token
  {
    if (!store.state.token) {
      store.commit("SAVE_TOKEN", window.localStorage.Token);
    }
    if (!store.state.tokenExpire) {
      store.commit("SAVE_TOKEN_EXPIRE", window.localStorage.TokenExpire);
    }
    saveRefreshtime();

    // 判斷該路由是否需要登入權限
    if (to.meta.requireAuth) {
      var curTime = new Date();
      var expiretime = new Date(Date.parse(window.localStorage.TokenExpire));
      if (store.state.token && store.state.token != "undefined") {
        // 通過vuex state獲取當前的token是否存在
        next();
      } else {
        store.commit("SAVE_TOKEN", "");
        store.commit("SAVE_TOKEN_EXPIRE", "");
        store.commit("saveTagsData", "");
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("NavigationBar");
        window.localStorage.removeItem("router");

        next({
          path: "/login",
          query: { redirect: to.fullPath }, // 將跳轉的路由path作為參數，登錄成功後跳轉到該路由
        });

        window.location.reload();
      }
    } else {
      next();
    }
  }

  // 檢查 router 設置
  {
    if (!getRouter) {
      if (!getObjArr("router")) {
        // 若 localStorage 不存在 router資料
        let user = window.localStorage.user
          ? JSON.parse(window.localStorage.user)
          : null;
        if (user && user.uID > 0) {
          let params = { uid: user.uID };
          api.GetNavigationBar().then((data) => {
            if (data.success) {
              console.log("已透過 api 獲取 router");

              getRouter = data.data[0];
              // 將 router 存到 localStorage
              saveObjArr("router", getRouter);
              //執行路由跳轉方法
              routerGo(to, next);
            }
          });
        }
      } else {
        // localStorage 中有 router
        getRouter = getObjArr("router");
        routerGo(to, next);
      }
    } else {
      if (to.name && to.name != "login") {
        // 獲取 localStorage 中的 router
        getRouter = getObjArr("router");
        global.antRouter = getRouter;
        // routerGo(to, next); //執行路由跳轉方法
      }
      next();
    }
  }
});

export default router;
