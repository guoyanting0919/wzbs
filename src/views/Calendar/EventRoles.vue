<template>
  <div id="eventRoles">
    <!-- headerBox -->
    <HeaderBox
      @searchHandler="searchHandler"
      @handleAddOrEdit="handleAddOrEdit"
      :buttonList="buttonList"
      :searchLoading="searchLoading"
    ></HeaderBox>

    <!-- mainBox -->
    <div class="mainTable">
      <div class="tableContainer mt-5" v-if="eventRolesData">
        <el-table
          header-cell-class-name="tableHeader"
          :data="eventRolesData"
          empty-text="暫無資料"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="Name" label="參與角色名" sortable></el-table-column>
          <el-table-column prop="Sort" width="100" label="排序"></el-table-column>

          <el-table-column width="100" prop="Enable" label="狀態" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.Enable" class="status1">啟用</span>
              <span v-else class="status2">禁用</span>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button
                class="outline"
                size="mini"
                v-if="hasBtn('btnEdit')"
                @click="handleAddOrEdit('edit',scope.row)"
                :disabled="scope.row.Name==='最高權限管理員'"
              >編輯</el-button>
              <el-button
                v-if="hasBtn('btnDelete')"
                type="danger"
                class="outline"
                size="mini"
                @click="deleteHandler(scope.row)"
                :disabled="scope.row.Name==='最高權限管理員'"
              >刪除</el-button>
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
      @changePage="getEventRoles"
      :page-size="pageSize"
    ></Pagination>

    <!-- addOrEditDialog -->
    <el-dialog custom-class="addOrEditDialog" :title="addOrEdit" :visible.sync="addOrEditDialog">
      <ValidationObserver ref="obs">
        <div class="inputBox">
          <p class="inputTitle">參與角色名</p>
          <ValidationProvider name="請輸入參與角色名!!" rules="required" v-slot="{  errors,classes }">
            <el-input
              :class="classes"
              style="width:300px"
              v-model="roleNameInput"
              placeholder="請輸入參與角色名"
            ></el-input>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="inputBox">
          <p class="inputTitle">狀態</p>
          <el-switch
            active-text="啟用"
            inactive-text="禁用"
            v-model="roleStatusSelect"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </div>
        <div class="inputBox">
          <p class="inputTitle">排序</p>
          <el-input-number v-model="roleSort" :min="0" :max="999" label="排序"></el-input-number>
        </div>
      </ValidationObserver>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button v-if="addOrEdit==='新增'" type="primary" @click="addHandler">新 增</el-button>
        <el-button v-else type="primary" @click="editHandler">編 輯</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
import Pagination from "../../components/Pagination";
import moment from "moment";
export default {
  name: "UserRoles",
  components: { HeaderBox, Pagination },
  data() {
    return {
      addOrEditDialog: false,
      roleNameInput: "",
      roleStatusSelect: "",
      roleSort: "",
      buttonList: [],
      keyWordInput: "",
      eventRolesData: "",
      currentPage: 1,
      totalCount: "",
      pageSize: "",
      searchLoading: false,
      addLoading: false,
      editLoading: false,
      addOrEdit: "新增",
      editId: "",
    };
  },
  computed: {
    // rolesDataFilter() {
    //   let data = this.eventRolesData;
    //   data.map((role) => {
    //     role.CreateTime = moment(role.CreateTime).format("YYYY-MM-DD");
    //   });
    //   return data;
    // },
  },
  methods: {
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
    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some((btn) => btn.iconCls == btnType);
      // return true;
    },
    async handleAddOrEdit(act, info = "") {
      const vm = this;
      if (vm.$refs.obs) {
        await vm.$refs.obs.reset();
      }
      vm.roleNameInput = "";
      vm.roleStatusSelect = true;
      vm.roleSort = "";
      vm.addOrEdit = "新增";
      if (act === "add") {
        vm.addOrEditDialog = true;
      } else {
        // console.log(info);
        vm.addOrEdit = "編輯";
        vm.addOrEditDialog = true;
        vm.roleNameInput = info.Name;
        vm.roleStatusSelect = info.Enable;
        vm.editId = info.Id;
        vm.roleSort = info.Sort || 0;
      }
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
        let Name = vm.roleNameInput;
        let Enable = vm.roleStatusSelect;
        let Sort = vm.roleSort;
        let params = {
          Name,
          Enable,
          Sort,
        };
        vm.$api.AddEventRoles(params).then((res) => {
          vm.getEventRoles();
          // console.log(res);
          vm.addOrEditDialog = false;
          vm.addLoading = false;
          vm.$alertM.fire({
            icon: "success",
            title: `參與角色 ${Name} 添加成功 ! `,
          });
        });
      }
    },
    searchHandler({ page, key }) {
      const vm = this;
      vm.searchLoading = true;
      vm.keyWordInput = key;
      let params = {
        key,
        page,
      };
      vm.$api.GetEventRolesPages(params).then((res) => {
        // console.log(res);
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.eventRolesData = res.data.response.data;
        vm.searchLoading = false;
        vm.currentPage = 1;
      });
    },
    deleteHandler(role) {
      const vm = this;
      // console.log(role);
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除參與角色 ${role.Name} ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2f3e52",
        cancelButtonColor: "#522f2f",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let params = {
            id: role.Id,
          };
          vm.$api.DeleteEventRoles(params).then((res) => {
            vm.getEventRoles();
          });
          vm.$alertT.fire({
            icon: "success",
            title: `角色 ${role.Name} 删除成功`,
          });
        } else {
          vm.$alertT.fire({
            icon: "info",
            title: `已取消刪除`,
          });
        }
      });
    },
    async editHandler() {
      const vm = this;
      const isValid = await vm.$refs.obs.validate();
      if (!isValid) {
        vm.$alertM.fire({
          icon: "error",
          title: `請確認欄位是否正確填寫`,
        });
      } else {
        vm.editLoading = true;
        let Id = vm.editId;
        let Name = vm.roleNameInput;
        let Enable = vm.roleStatusSelect;
        let Sort = vm.roleSort;
        let params = {
          Id,
          Name,
          Enable,
          Sort,
        };
        vm.$api.EditEventRoles(params).then((res) => {
          vm.getEventRoles();
          this.addOrEditDialog = false;
          vm.editLoading = false;
          vm.$alertM.fire({
            icon: "success",
            title: `角色 ${Name} 更新成功 ! `,
          });
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    async getEventRoles(page = 1, key) {
      const vm = this;
      let params = {
        key: vm.keyWordInput,
        page,
      };
      await vm.$api.GetEventRolesPages(params).then((res) => {
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.eventRolesData = res.data.response.data;
        vm.currentPage = page;
        vm.$store.dispatch("loadingHandler", false);
      });
    },
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);

    await this.getEventRoles();

    this.$store.dispatch("loadingHandler", false);
  },
};
</script>

<style lang='scss'>
</style>