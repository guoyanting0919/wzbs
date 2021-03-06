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
  GetAdminTokenAll(params) {
    return req("get", "Login/GetAdminTokenAll", params);
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
  PostBatchMeeting(params, data1) {
    return req(
      "post",
      `AdminUser/PostBatchMeeting?setMeeting=${params.setMeeting}`,
      data1
    );
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

  // School
  GetUsers(params) {
    return req("get", "School/GetUsers", params);
  },
  GetOrg() {
    return req("get", "School/GetUnits");
  },
  GetUnits() {
    return req("get", "School/GetUnitList");
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
  GetEventsPage(params) {
    return req("get", "CalendarEvent/Get", params);
  },
  AddEvent(params) {
    return req("post", "CalendarEvent/Post", params);
  },
  EditEvent(params) {
    return req("put", "CalendarEvent/Put", params);
  },
  DeleteEvent(params) {
    return req("delete", "CalendarEvent/Delete", params);
  },
  SearchEvent(params) {
    return req("get", "CalendarEvent/Get", params);
  },
  CheckUserHasEvent(params) {
    return req("get", "CalendarEvent/CheckUserHasEvent", params);
  },
  GetEventById(params) {
    return req("get", "CalendarEvent/GetById/Id", params);
  },
  GetJoinUserByEventIds(params) {
    return req("get", "CalendarEvent/GetJoinUserByEventIds", params);
  },
  ChangeMember(params) {
    return req("get", "CalendarEvent/ReplaceJoinUser", params);
  },
  GetUserTitle(params) {
    return req("get", "CalendarEvent/GetUserTitle", params);
  },

  // calendar event roles
  GetEventRolesPages(params) {
    return req("get", "JoinUserRole/Get", params);
  },
  GetEventRoles(params) {
    return req("get", "JoinUserRole/GetRoles", params);
  },
  GetEventRoleById(params) {
    return req("get", "JoinUserRole/GetRoleById", params);
  },
  AddEventRoles(params) {
    return req("post", "JoinUserRole/Post", params);
  },
  EditEventRoles(params) {
    return req("put", "JoinUserRole/Put", params);
  },
  DeleteEventRoles(params) {
    return req("delete", "JoinUserRole/Delete", params);
  },
  GetEventRolesExcel(params) {
    return req("get", "JoinUserRole/GetCalendarExcel", params);
  },

  // upload
  UploadFile() {
    return req("get", "/images/Upload/CalPic");
  },

  // download
  DownloadExcel() {
    return req("get", "CalendarEvent/GetCalendarExcel");
  },
  DownUnitExcel() {
    return req("get", "School/GetUnitExcel");
  },

  //adminTitle
  GetAdminTitles(params) {
    return req("get", "JoinUserRole/GetAdminTitle", params);
  },
};

export default api;
