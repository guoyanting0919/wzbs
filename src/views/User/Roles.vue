<template>
  <div id="userRoles">
    <!-- headerBox -->
    <HeaderBox
      @searchHandler="searchHandler"
      @handleAddOrEdit="handleAddOrEdit"
      :buttonList="buttonList"
    ></HeaderBox>

    <!-- mainBox -->
    <div class="mainTable">
      <div class="tableContainer mt-5" v-if="rolesData">
        <el-table
          :data="rolesDataFilter"
          empty-text="暫無資料"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="Name" label="角色名" sortable></el-table-column>
          <el-table-column prop="Description" label="說明" sortable></el-table-column>
          <el-table-column prop="CreateTime" label="創建時間" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.CreateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Enabled" label="狀態" sortable>
            <template slot-scope="scope">
              <span v-if="scope.row.Enabled" class="status1">啟用</span>
              <span v-else class="status2">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button
                class="outline"
                size="mini"
                v-if="hasBtn('btnEdit')"
                @click="handleAddOrEdit('edit',scope.row)"
              >編輯</el-button>
              <el-button
                v-if="hasBtn('btnDelete')"
                type="danger"
                class="outline"
                size="mini"
                @click="handleDel(scope.row)"
              >刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- addOrEditDialog -->
    <el-dialog title="新增" :visible.sync="addOrEditDialog" width="40%">
      <div class="inputBox">
        <p class="inputTitle">角色名</p>
        <el-input style="width:300px" v-model="roleNameInput" placeholder="請輸入角色名"></el-input>
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
        <p class="inputTitle">說明</p>
        <el-input style="width:300px" v-model="roleDescriptionInput" placeholder="說明欄位"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditDialog = false">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
import moment from "moment";
export default {
  name: "UserRoles",
  components: { HeaderBox },
  data() {
    return {
      addOrEditDialog: false,
      roleNameInput: "",
      roleStatusSelect: "",
      roleDescriptionInput: "",
      buttonList: [],
      rolesData: ""
    };
  },
  computed: {
    rolesDataFilter() {
      let data = this.rolesData;
      data.map(role => {
        role.CreateTime = moment(role.CreateTime).format("YYYY-MM-DD");
      });
      return data;
    }
  },
  methods: {
    getButtonList(routePath, routers) {
      const vm = this;
      let buttonList = [];
      routers.forEach(element => {
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
      return this.buttonList.some(btn => btn.iconCls == btnType);
      // return true;
    },
    handleAddOrEdit(method, data) {
      const vm = this;
      if (method === "add") {
        vm.addOrEditDialog = true;
      } else {
        vm.addOrEditDialog = true;
        console.log(data);
        vm.roleNameInput = data.Name;
        vm.roleStatusSelect = data.Enabled;
        vm.roleDescriptionInput = data.Description;
      }
    },
    searchHandler(key) {
      const vm = this;
      vm.$store.dispatch("loadingHandler", true);
      let params = {
        page: 1,
        key
      };
      vm.$api.SearchRoles(params).then(res => {
        console.log(res);
        vm.rolesData = res.data.response.data;
        vm.$store.dispatch("loadingHandler", false);
      });
    },
    handleDel() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    async getRoles() {
      const vm = this;
      await vm.$api.GetRoles().then(res => {
        vm.rolesData = res.data;
      });
    }
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);

    await this.getRoles();

    this.$store.dispatch("loadingHandler", false);
  }
};
</script>

<style lang='scss'>
</style>