import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: "",
    tokenExpire: "",
    tagsStoreList: [],
    isLoading: false,
  },
  actions: {
    //loading
    loadingHandler(context, payload) {
      context.commit("LOADING", payload);
    },
  },
  mutations: {
    LOADING(state, payload) {
      state.isLoading = payload;
    },
    SAVE_TOKEN(state, data) {
      state.token = data;
      window.localStorage.setItem("Token", data);
    },
    SAVE_TOKEN_EXPIRE(state, data) {
      state.tokenExpire = data;
      window.localStorage.setItem("TokenExpire", data);
    },
    saveTagsData(state, data) {
      state.tagsStoreList = data;
      sessionStorage.setItem("Tags", data);
    },
    // GET_BUTTON_LIST(state,{routePath, routers}){

    // }
  },

  modules: {},
});
