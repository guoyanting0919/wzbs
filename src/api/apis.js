import req from "./https";

// 全域 api 掛載於 Vue.prototype
// 使用方式 this.$api
// api 命名原則 首字大寫爾後駝峰
const api = {
  // Login
  GetAdminToken(params) {
    return req("get", "Login/GetAdminToken", params);
  },
  GetInfoByToken(params) {
    return req("get", "Login/GetInfoByToken", params);
  },
  GetNavigationBar(params) {
    return req("get", "Permission/GetNavigationBar", params);
  },

  // Roles
  GetRoles(params) {
    return req("get", "Role/Get", params);
  },
  GetAllRoles() {
    return req("get", "Role/GetRoles");
  },
  DeleteRole(params) {
    return req("delete", "Role/Delete", params);
  },
  SearchRoles(params) {
    return req("get", "Role/Get", params);
  },
  AddRole(params) {
    return req("post", "Role/Post", params);
  },
  EditRole(params) {
    return req("put", "Role/put", params);
  },

  // Units
  GetUnits() {
    return req("get", "Unit/GetUnits");
  },

  // School
  GetUsers(params) {
    return req("get", "School/GetUsers", params);
  },
  GetOrg() {
    return req("get", "School/GetUnits");
  },

  // Calendar
  GetEventType() {
    return req("get", "EventType/GetList");
  },
  SearchEventType(params) {
    return req("get", "EventType/Get", params);
  },
  AddEventType(params) {
    return req("post", "EventType/Post", params);
  },
  DeleteEventType(params) {
    return req("delete", "EventType/Delete", params);
  },
  EditEventType(params) {
    return req("put", "EventType/Put", params);
  },
};

export default api;
