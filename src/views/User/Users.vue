<template>
  <div id="userUsers">
    <!-- headerBox -->
    <HeaderBox
      @searchHandler="searchHandler"
      :searchLoading="searchLoading"
      @handleAddOrEdit="handleAddOrEdit"
      @changeHandler="changeHandler"
      :buttonList="buttonList"
      :isUser="true"
    ></HeaderBox>

    <!-- mainBox -->
    <div class="mainTable">
      <div class="tableContainer mt-5">
        <el-table
          header-cell-class-name="tableHeader"
          v-if="adminUsersData"
          :data="adminUsersData"
          empty-text="暫無資料"
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="UnitName"
            width="150"
            label="單位"
            sortable
          ></el-table-column>
          <el-table-column
            prop="RealName"
            width="100"
            label="名稱"
            sortable
          ></el-table-column>
          <el-table-column
            prop="LoginName"
            width="100"
            label="帳號"
            sortable
          ></el-table-column>
          <el-table-column prop="RoleNames" label="角色" sortable>
            <template slot-scope="scope">
              <span
                v-for="role in scope.row.RoleNames"
                :key="`da${role}`"
                class="roleBadge"
                >{{ role }}</span
              >
            </template>
          </el-table-column>

          <el-table-column prop="DropCtrlTypes" label="控制類別" sortable>
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :open-delay="500"
                placement="top-start"
              >
                <div slot="content">
                  <span
                    v-for="(type, index) in scope.row.DropCtrlTypes"
                    :key="`da${type.Value}`"
                    >{{ index + 1 }}.{{ type.Text }}</span
                  >
                </div>
                <p class="textOverflow">
                  <span
                    v-for="(type, index) in scope.row.DropCtrlTypes"
                    :key="`da${type.Value}`"
                    class="unitBadge"
                    >{{ index + 1 }}.{{ type.Text }}</span
                  >
                </p>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column prop="CtrlUnits" label="組織" sortable>
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :open-delay="500"
                placement="top-start"
              >
                <div slot="content">
                  <span
                    v-for="(unit, index) in scope.row.CtrlUnits"
                    :key="`da${unit}`"
                    >{{ index + 1 }}.{{ unit }}</span
                  >
                </div>
                <p class="textOverflow">
                  <span
                    v-for="(unit, index) in scope.row.CtrlUnits"
                    :key="`da${unit}`"
                    class="unitBadge"
                    >{{ index + 1 }}.{{ unit }}</span
                  >
                </p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="emit" min-width="150" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasBtn('btnEdit')"
                class="outline"
                size="mini"
                @click="handleAddOrEdit('edit', scope.row)"
                >編輯</el-button
              >
              <el-button
                v-if="hasBtn('btnDelete')"
                type="danger"
                class="outline"
                size="mini"
                @click="deleteHandler(scope.row)"
                >刪除</el-button
              >
              <el-button
                v-if="hasBtn('btnDelete')"
                class="outline"
                size="mini"
                @click="handleChangeUser(scope.row)"
                >切換</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- pagination -->
    <Pagination
      v-if="totalCount"
      :keyWord="keyWordInput"
      :total="totalCount"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @changePage="getUsersPage"
    ></Pagination>

    <!-- addOrEditDialog -->
    <el-dialog
      @opened="scrollToTop"
      @close="arrUnit = []"
      :title="addOrEdit"
      :visible.sync="addOrEditDialog"
      v-if="unitsData"
      custom-class="addOrEditDialog"
    >
      <ValidationObserver ref="obs">
        <el-scrollbar ref="scrollBox" class="scrollbar-handle">
          <!-- unit -->
          <div class="inputBox" style="margin-top: 3rem">
            <p class="inputTitle">單位</p>
            <ValidationProvider
              name="請選擇最高單位"
              rules="required"
              v-slot="{ errors, classes }"
            >
              <el-select
                filterable
                :class="classes"
                no-match-text="暫無資料"
                @change="lv1Change"
                class="unitSelect"
                v-model="userUnit1Select"
                placeholder="請選擇最高單位"
              >
                <el-option
                  :value="unit.UntId"
                  :label="unit.UntNameFull"
                  v-for="unit in unitLv1"
                  :key="unit.UntId"
                  >{{ unit.UntNameFull }}</el-option
                >
              </el-select>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider v-slot="{ classes }">
              <el-select
                filterable
                :class="classes"
                no-match-text="暫無資料"
                @change="lv2Change"
                class="unitSelect"
                v-model="userUnit2Select"
                placeholder="請選擇次高單位"
                v-if="userUnit1Select && unitLv2.length > 0"
              >
                <el-option
                  v-for="unit in unitLv2"
                  :key="unit.UntId"
                  :value="unit.UntId"
                  :label="unit.UntNameFull"
                  >{{ unit.UntNameFull }}</el-option
                >
              </el-select>
            </ValidationProvider>

            <ValidationProvider v-slot="{ classes }">
              <el-select
                filterable
                :class="classes"
                no-match-text="暫無資料"
                class="unitSelect"
                @change="lv3Change"
                v-model="userUnit3Select"
                placeholder="請選擇單位"
                v-if="userUnit2Select && unitLv3.length > 0"
              >
                <el-option
                  v-for="unit in unitLv3"
                  :key="unit.UntId"
                  :value="unit.UntId"
                  :label="unit.UntNameFull"
                  >{{ unit.UntNameFull }}</el-option
                >
              </el-select>
            </ValidationProvider>
          </div>

          <!-- name -->
          <div class="inputBox">
            <p class="inputTitle">名稱</p>
            <ValidationProvider
              name="請選擇人員名稱"
              rules="required"
              v-slot="{ errors, classes }"
            >
              <el-select
                :class="classes"
                :loading="userNameLoading"
                loading-text="Loading..."
                no-data-text="暫無資料"
                filterable
                no-match-text="暫無資料"
                v-model="userNameSelect"
                placeholder="請選擇名稱"
                @change="setOrg"
              >
                <el-option
                  v-for="user in usersData"
                  :key="user.Account"
                  :value="user.Account"
                  :label="user.Name"
                ></el-option>
              </el-select>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <!-- role -->
          <div class="inputBox">
            <p class="inputTitle">角色</p>
            <ValidationProvider
              name="請至少選擇一種角色"
              rules="required"
              v-slot="{ errors, classes }"
            >
              <el-select
                :class="classes"
                multiple
                filterable
                no-match-text="暫無資料"
                v-model="userRoleSelect"
                placeholder="請選擇角色"
              >
                <el-option
                  v-for="role in rolesData"
                  :key="role.Id"
                  :value="role.Id"
                  :label="role.Name"
                  >{{ role.Name }}</el-option
                >
              </el-select>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <!-- organization -->
          <div class="inputBox">
            <p class="inputTitle">組織</p>
            <el-input
              style="width: 220px"
              placeholder="輸入關鍵字搜尋"
              v-model="filterText"
            ></el-input>
          </div>
          <div class="inputBox">
            <p class="inputTitle"></p>
            <el-tree
              class="filter-tree"
              @check="getCheckedKeys"
              :data="orgsData"
              show-checkbox
              node-key="Id"
              :check-strictly="true"
              empty-text="暫無資料!"
              :indent="32"
              :props="defaultProps"
              :filter-node-method="filterNode"
              ref="tree"
            ></el-tree>
          </div>

          <!-- category -->
          <div class="inputBox">
            <p class="inputTitle" style="align-self: flex-start">行事曆類別</p>
            <el-checkbox-group v-model="eventTypeSelect" v-if="eventTypeData">
              <el-checkbox
                v-for="type in eventTypeData"
                :key="type.Id"
                :label="type.Id"
                >{{ type.EventTypeName }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-scrollbar>
      </ValidationObserver>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button
          type="primary"
          v-if="addOrEdit === '新增'"
          :loading="addLoading"
          @click="addHandler"
          >新 增</el-button
        >
        <el-button
          type="primary"
          v-else
          :loading="addLoading"
          @click="editHandler"
          >提 交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
import Pagination from "../../components/Pagination";
import { resetRouter, filterAsyncRouter } from "@/router/index";
import router from "@/router";
export default {
  name: "UserUsers",
  components: { HeaderBox, Pagination },
  data() {
    return {
      arrUnit: [],
      buttonList: [],
      userNameLoading: false,
      searchLoading: false,
      addLoading: false,
      addOrEditDialog: false,
      addOrEdit: "新增",
      filterText: "",
      totalCount: "",
      keyWordInput: "",
      currentPage: 1,
      pageSize: "",
      orgsData: "",
      rolesData: "",
      usersData: "",
      adminUsersData: "",
      unitsData: "",
      eventTypeData: "",
      editUserId: "",
      eventTypeSelect: [],
      userUnit1Select: "",
      userUnit2Select: "",
      userUnit3Select: "",
      userNameSelect: "",
      userRoleSelect: "",
      userControlSelect: "",
      userIds: [],
      defaultProps: {
        children: "Children",
        label: "Label",
      },
    };
  },
  computed: {
    unitLv1() {
      const vm = this;
      return vm.unitsData.filter((unit) => {
        return unit.UntLevelb === "1";
      });
    },
    unitLv2() {
      const vm = this;
      let arrLv1 = vm.unitsData.filter((unit) => {
        return unit.UntId === vm.userUnit1Select;
      });
      let uintLv1 = arrLv1[0];
      return vm.unitsData.filter((unit) => {
        return (
          unit.UntIdUp === uintLv1.UntId && unit.UntId !== vm.userUnit1Select
        );
      });
    },
    unitLv3() {
      const vm = this;
      let arrLv2 = vm.unitsData.filter((unit) => {
        return unit.UntId === vm.userUnit2Select;
      });
      let uintLv2 = arrLv2[0];
      return vm.unitsData.filter((unit) => {
        return (
          unit.UntIdUp === uintLv2.UntId && unit.UntId !== vm.userUnit2Select
        );
      });
    },
  },
  methods: {
    handleChangeUser(user) {
      console.log(user.LoginName);
      const vm = this;
      vm.$api.GetAdminTokenAll({ account: user.LoginName }).then((res) => {
        console.log(res);
        let token = res.data.token;
        vm.$store.commit("SAVE_TOKEN", token);
        let curTime = new Date();
        // 設定 token 過期時間
        let expiredate = new Date(
          curTime.setSeconds(curTime.getSeconds() + res.data.expires_in)
        );
        vm.$store.commit("SAVE_TOKEN_EXPIRE", expiredate);

        window.localStorage.refreshtime = expiredate;
        window.localStorage.expires_in = res.data.expires_in;

        vm.GetInfoByToken(token);
      });
    },
    GetInfoByToken(token) {
      const vm = this;
      let params = {
        token,
      };
      vm.$api.GetInfoByToken(params).then((res) => {
        window.localStorage.user = JSON.stringify(res.data.response);
        console.log(res.data.response);

        vm.GetNavigationBar(res.data.response.Id);
      });
    },
    GetNavigationBar(uid) {
      const vm = this;
      console.log(uid);
      let params = {
        uid,
      };
      vm.$api.GetNavigationBar(params).then((res) => {
        // console.log(res, params);
        let route = res.data.response.children;
        window.localStorage.router = JSON.stringify(route);

        // 過濾拿到的router
        let getRouter = filterAsyncRouter(route);
        // console.log(getRouter);
        // 動態添加router
        router.$addRoutes(getRouter);

        // vm.$store.dispatch("loadingHandler", false);

        // // window.location.reload();

        vm.$router
          .replace(vm.$route.query.redirect ? vm.$route.query.redirect : "/")
          .then(window.location.reload());
      });
    },
    async getUnits() {
      const vm = this;
      await vm.$api.GetUnits().then((res) => {
        this.unitsData = res.data;
      });
    },
    getRoles() {
      const vm = this;
      vm.$api.GetAllRoles().then((res) => {
        this.rolesData = res.data.response;
      });
    },
    getUsersPage(page = this.currentPage, key) {
      const vm = this;
      let params = {
        key: vm.keyWordInput,
        page,
      };
      vm.$api.GetAdminUsers(params).then((res) => {
        // console.log(res);
        vm.adminUsersData = res.data.response.data;
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.currentPage = page;

        vm.$store.dispatch("loadingHandler", false);
      });
    },
    getAdminUsers() {
      const vm = this;
      let params;
      vm.$api.GetAdminUsers(params).then((res) => {
        // console.log(res);
        vm.adminUsersData = res.data.response.data;
        vm.totalCount = res.data.response.dataCount;
        vm.currentPage = res.data.response.page;
        vm.pageSize = res.data.response.PageSize;
      });
    },
    getUsers(params) {
      const vm = this;
      vm.userNameLoading = true;
      vm.$api.GetUsers(params).then((res) => {
        // console.log(res);
        vm.usersData = res.data;

        vm.userNameLoading = false;
      });
    },
    getEventType() {
      const vm = this;
      vm.$api.GetEventType().then((res) => {
        vm.eventTypeData = res.data;
      });
    },
    getOrg() {
      const vm = this;
      vm.$api.GetOrg().then((res) => {
        vm.orgsData = res.data;
      });
    },
    async addHandler() {
      const vm = this;
      const isValid = await vm.$refs.obs.validate();
      if (!isValid) {
        vm.$alertM.fire({
          icon: "error",
          title: "請確認欄位是否正確填寫",
        });
      } else {
        vm.addLoading = true;
        let unitCode =
          vm.userUnit3Select || vm.userUnit2Select || vm.userUnit1Select;
        let loginName = vm.userNameSelect;
        let roles = vm.userRoleSelect;
        let ctrlUnits = vm.userControlSelect;
        let ctrlType = vm.eventTypeSelect;
        let realNameArr = vm.usersData.filter((user) => {
          return user.Account === vm.userNameSelect;
        });
        let realName = realNameArr[0].Name;
        let params = {
          unitCode,
          loginName,
          roles,
          ctrlUnits,
          ctrlType,
          realName,
        };
        // console.log(params);
        vm.$api.AddAdminUser(params).then((res) => {
          vm.addOrEditDialog = false;
          vm.addLoading = false;
          vm.getUsersPage();
          vm.$alertM.fire({
            icon: "success",
            title: `用戶 ${loginName} 添加成功 ! `,
          });
        });
      }
    },
    deleteHandler(user) {
      const vm = this;
      // console.log(user);
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除 ${user.LoginName} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2f3e52",
        cancelButtonColor: "#522f2f",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let params = {
            id: user.Id,
          };
          vm.$api.DeleteAdminUser(params).then((res) => {
            vm.getUsersPage();
          });
          vm.$alertT.fire({
            icon: "success",
            title: `用戶 ${user.LoginName} 删除成功`,
          });
        } else {
          vm.$alertT.fire({
            icon: "info",
            title: `已取消刪除`,
          });
        }
      });
    },
    searchHandler({ page, key }) {
      const vm = this;
      vm.searchLoading = true;
      vm.keyWordInput = key;
      let params = {
        key,
        page,
      };
      vm.$api.GetAdminUsers(params).then((res) => {
        // console.log(res);
        vm.adminUsersData = res.data.response.data;
        vm.totalCount = res.data.response.dataCount;
        vm.currentPage = res.data.response.page;
        vm.pageSize = res.data.response.PageSize;
        vm.searchLoading = false;
        vm.currentPage = 1;
      });
    },
    async editHandler() {
      const vm = this;
      const isValid = await vm.$refs.obs.validate();
      if (!isValid) {
        vm.$alertT.fire({
          icon: "error",
          title: `請確認欄位是否正確填寫`,
        });
      } else {
        vm.$store.dispatch("loadingHandler", true);
        let id = vm.editUserId;
        let unitCode =
          vm.userUnit3Select || vm.userUnit2Select || vm.userUnit1Select;
        let loginName = vm.userNameSelect;
        let roles = vm.userRoleSelect;
        let ctrlUnits = vm.userControlSelect;
        let ctrlType = vm.eventTypeSelect;
        let realNameArr = vm.usersData.filter((user) => {
          return user.Account === vm.userNameSelect;
        });
        let realName = realNameArr[0].Name;
        let params = {
          id,
          unitCode,
          loginName,
          roles,
          ctrlUnits,
          ctrlType,
          realName,
        };
        // console.log(params);
        vm.$api.EditAdminUserById(params).then((res) => {
          vm.$store.dispatch("loadingHandler", false);
          vm.addOrEditDialog = false;
          vm.getUsersPage();
          vm.$alertM.fire({
            icon: "success",
            title: `用戶${loginName}更新成功 ! `,
          });
        });
      }
    },
    changeHandler(act) {
      const vm = this;
      if (vm.userIds.length === 0) {
        vm.$store.dispatch("loadingHandler", false);
        vm.$alertM.fire({
          icon: "error",
          title: `請勾選欲更新User`,
        });
      } else {
        let setMeeting;
        if (act === "add") {
          setMeeting = true;
        } else {
          setMeeting = false;
        }
        let params = {
          setMeeting: setMeeting,
        };
        let data1 = vm.userIds;
        vm.$api.PostBatchMeeting(params, data1).then((res) => {
          // console.log(res);
          vm.$alertM.fire({
            icon: "success",
            title: res.data.msg,
          });
          vm.getUsersPage();
        });
      }
    },
    scrollToTop() {
      this.$refs.scrollBox.wrap.scrollTop = 0;
    },
    lv1Change() {
      const vm = this;
      vm.userUnit2Select = "";
      vm.userNameSelect = "";
      vm.$refs.tree.setCheckedKeys([]);
      let unitCode = vm.userUnit1Select;
      let params = {
        unitCode,
      };
      vm.getUsers(params);
    },
    lv2Change() {
      const vm = this;
      vm.userUnit3Select = "";
      vm.userNameSelect = "";
      vm.$refs.tree.setCheckedKeys([]);
      let unitCode = vm.userUnit2Select;
      let params = {
        unitCode,
      };
      vm.getUsers(params);
    },
    lv3Change() {
      const vm = this;
      vm.userNameSelect = "";
      vm.$refs.tree.setCheckedKeys([]);
      let unitCode = vm.userUnit3Select;
      let params = {
        unitCode,
      };
      vm.getUsers(params);
    },
    async handleAddOrEdit(act, info = "") {
      const vm = this;
      if (vm.$refs.obs) {
        await vm.$refs.obs.reset();
      }
      (vm.userUnit3Select = ""),
        (vm.userUnit2Select = ""),
        (vm.userUnit1Select = ""),
        (vm.userNameSelect = ""),
        (vm.userRoleSelect = ""),
        (vm.userControlSelect = []),
        (vm.eventTypeSelect = []);

      if (act === "add") {
        vm.addOrEdit = "新增";
        vm.addOrEditDialog = true;

        vm.$nextTick(function () {
          vm.$refs.tree.setCheckedKeys([]);
        });
      } else {
        vm.$store.dispatch("loadingHandler", true);
        vm.editUserId = info.Id;
        vm.addOrEditDialog = true;
        vm.addOrEdit = "編輯";
        let params = {
          id: info.Id,
        };
        vm.$api.GetAdminUserById(params).then((res) => {
          let user = res.data.response;
          vm.$nextTick(function () {
            vm.userRoleSelect = user.Roles;
            vm.eventTypeSelect = user.CtrlType;
            vm.userControlSelect = user.CtrlUnits;
            vm.$refs.tree.setCheckedKeys(vm.userControlSelect);
            vm.userNameSelect = user.LoginName;
            let arr = vm.unitsData.filter((unit) => {
              return unit.UntId === user.UnitCode;
            });
            let userUnit = arr[0];
            /* ------- */
            vm.fun(userUnit);
            /* ------- */
            vm.arrUnit = vm.arrUnit.reverse();
            if (vm.arrUnit.length === 1) {
              vm.userUnit1Select = vm.arrUnit[0];
              vm.$api.GetUsers({ unitCode: vm.userUnit1Select }).then((res) => {
                vm.usersData = res.data;
                vm.$store.dispatch("loadingHandler", false);
              });
            } else if (vm.arrUnit.length === 2) {
              vm.userUnit1Select = vm.arrUnit[0];
              vm.userUnit2Select = vm.arrUnit[1];
              vm.$api.GetUsers({ unitCode: vm.userUnit2Select }).then((res) => {
                vm.usersData = res.data;
                vm.$store.dispatch("loadingHandler", false);
              });
            } else {
              vm.userUnit1Select = vm.arrUnit[0];
              vm.userUnit2Select = vm.arrUnit[1];
              vm.userUnit3Select = vm.arrUnit[2];

              vm.$api.GetUsers({ unitCode: vm.userUnit3Select }).then((res) => {
                vm.usersData = res.data;
                vm.$store.dispatch("loadingHandler", false);
              });
            }
          });
        });

        // console.log(info);
      }
    },

    fun(user) {
      const vm = this;
      vm.arrUnit.push(user.UntId);
      if (user.UntId !== user.UntIdUp) {
        let a = vm.unitsData.filter((u) => {
          return u.UntId == user.UntIdUp;
        })[0];
        vm.fun(a);
      }
    },

    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some((btn) => btn.iconCls == btnType);
    },
    handleSelectionChange(val) {
      const vm = this;
      let arr = [];
      val.map((user) => {
        arr.push(user.Id);
      });
      vm.userIds = arr;
      // console.log(vm.userIds);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.Label.indexOf(value) !== -1;
    },
    getCheckedKeys() {
      this.userControlSelect = this.$refs.tree.getCheckedKeys();
      // console.log(this.userControlSelect);
    },
    setOrg() {
      let org = "";
      org =
        this.userUnit3Select || this.userUnit2Select || this.userUnit1Select;
      let arr = [];
      arr.push(org);
      this.userControlSelect = arr;
      this.$refs.tree.setCheckedKeys(arr);
    },
    // setCheckedKeys() {
    //   this.$refs.tree.setCheckedKeys(["AA00", "EU00"]);
    // },
    getButtonList(routePath, routers) {
      const vm = this;
      let buttonList = [];
      routers.forEach((element) => {
        if (routePath && element.path) {
          let path = routePath.toLowerCase();
          if (element.path && element.path.toLowerCase() === path) {
            buttonList = element.children;
            vm.buttonList = buttonList;
            return;
          } else if (element.children) {
            this.getButtonList(path, element.children);
          }
        }
      });
      return buttonList;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
    this.getRoles();
    this.getOrg();
    this.getEventType();
    this.getAdminUsers();
    await this.getUnits();
    this.$store.dispatch("loadingHandler", false);
  },
};
</script>

<style lang="scss"></style>
