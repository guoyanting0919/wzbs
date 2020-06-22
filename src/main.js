import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./api/apis";
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { extend, ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import { configure } from "vee-validate";

configure({
  classes: {
    valid: "valid",
    invalid: "invalid",
  },
});

extend("required", {
  ...required,
  message: "{_field_}",
});

// extend("email", email);

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.use(VueAxios, axios);

Vue.use(ElementUI);

// all(建議放套件Css下層)
import "../src/assets/all.scss";

Vue.config.productionTip = false;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
