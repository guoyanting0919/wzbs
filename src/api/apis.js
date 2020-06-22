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
  RefreshToken(params) {
    return req("get", "Login/RefreshToken/api/RefreshToken", params);
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

  // AdminUsers
  GetAdminUsers(params) {
    return req("get", "AdminUser/Get", params);
  },
  AddAdminUser(params) {
    return req("post", "AdminUser/Post", params);
  },
  DeleteAdminUser(params) {
    return req("delete", "AdminUser/Delete", params);
  },
  GetAdminUserById(params) {
    return req("get", "AdminUser/GetAdminUserById", params);
  },
  EditAdminUserById(params) {
    return req("put", "AdminUser/Put", params);
  },

  // Authority
  GetAuthority(params) {
    return req("get", "Permission/GetPermissionTree", params);
  },
  GetPermissionByRid(params) {
    return req("get", "Permission/GetPermissionIdByRoleId", params);
  },
  EditPermissionByRid(params) {
    return req("post", "Permission/Assign", params);
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

  // Calendar EventType
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

  //  Calendar Event
  GetEventsPage() {
    return req("get", "CalendarEvent/Get");
  },
};

export default api;
