import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../views/Layout/Layout";
import Home from "../views/Home.vue";

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
  var f = (item) => {
    if (item["children"]) {
      item["children"] = item["children"].filter(f);
      return true;
    } else if (item["IsButton"]) {
      return item["IsButton"] === false;
    } else {
      return true;
    }
  };

  var params = params.filter(f);

  router.addRoutes(params);
};

function getObjArr(name) {
  return JSON.parse(window.localStorage.getItem(name));
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

let getRouter; //類似flag以驗證是否刷新頁面

if (!getRouter) {
  //不加這個判斷，路由會陷入死循環

  if (!getObjArr("router")) {
    //本地沒有，則從數據庫獲取
    var user = window.localStorage.user
      ? JSON.parse(window.localStorage.user)
      : null;
    if (user && user.uID > 0) {
      console.info(user.uID);
      var loginParams = { uid: user.uID };
      getNavigationBar(loginParams).then((data) => {
        if (data.success) {
          console.info("%c get navigation bar from api succeed!", "color:red");
          getRouter = data.response.children; //後台拿到路由
          saveObjArr("router", getRouter); //存儲路由到localStorage
          // routerGo(to, next)//執行路由跳轉方法
        }
      });
    }
  } else {
    //從localStorage拿到了路由
    console.info(
      "%c get navigation bar from localStorage succeed!",
      "color:green"
    );
    getRouter = getObjArr("router"); //拿到路由
    getRouter = filterAsyncRouter(getRouter); //過濾路由
    router.$addRoutes(getRouter); //動態添加路由
    global.antRouter = getRouter; //將路由數據傳遞給全局變量，做側邊欄菜單渲染工作
  }
}

router.beforeEach((to, from, next) => {
  // console.log(to.meta);
  if (to.meta.title) {
    document.title = `文藻行事曆後臺-${to.meta.title}`;
  }
  if (!getRouter) {
    if (!getObjArr("router")) {
    } else {
      //刷新頁面時
      getRouter = getObjArr("router");
      routerGo(to, next);
    }

    // if (!getObjArr("router")) {
    //   var user = window.localStorage.user
    //     ? JSON.parse(window.localStorage.user)
    //     : null;
    //   if (user && user.uID > 0) {
    //     var loginParams = { uid: user.uID };
    //     getNavigationBar(loginParams).then((data) => {
    //       console.log(
    //         "router before each get navigation bar from api succeed!"
    //       );
    //       if (data.success) {
    //         getRouter = data.response.children; //後台拿到路由
    //         saveObjArr("router", getRouter); //存儲路由到localStorage
    //         routerGo(to, next); //執行路由跳轉方法
    //       }
    //     });
    //   }
    // } else {
    //   //從localStorage拿到了路由
    //   console.log(2);
    //   getRouter = getObjArr("router"); //拿到路由
    //   routerGo(to, next);
    // }
  } else {
    if (to.name && to.name != "login") {
      // console.log(to);s
      getRouter = getObjArr("router"); //拿到路由
      global.antRouter = getRouter;
      // routerGo(to, next); //執行路由跳轉方法
    }
    next();
  }
});

export default router;
