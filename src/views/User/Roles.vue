<template>
  <div id="userRoles">
    <!-- searchBox -->
    <div class="searchBox">
      <el-input style="width:240px;margin-right:10px" v-model="keyWordInput" placeholder="請輸入關鍵字"></el-input>
      <el-button class="searchBtn" type="primary">搜尋</el-button>
      <el-button @click="handleAddOrEdit('add')" class="addBtn" type="primary">新增</el-button>
    </div>

    <!-- mainBox -->
    <div class="mainTable">
      <div class="tableContainer mt-5">
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="roleName" label="角色名" sortable></el-table-column>
          <el-table-column prop="roleDescription" label="說明" sortable></el-table-column>
          <el-table-column prop="creatDate" label="創建時間" sortable></el-table-column>
          <el-table-column prop="status" label="狀態" sortable>
            <template slot-scope="scope">
              <span :class="[scope.row.status==='正常' ? 'status1' : 'status2']">{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button class="outline" size="mini" @click="handleAddOrEdit('edit',scope.row)">編輯</el-button>
              <el-button type="danger" class="outline" size="mini" @click="handleDel(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- addOrEditDialog -->
    <el-dialog title="新增" :visible.sync="addOrEditDialogVisible" width="40%">
      <div class="inputBox">
        <p class="inputTitle">角色名</p>
        <el-input style="width:300px" v-model="roleNameInput" placeholder="請輸入角色名"></el-input>
      </div>
      <div class="inputBox">
        <p class="inputTitle">狀態</p>
        <el-select v-model="roleStatusSelect" placeholder="請選擇狀態">
          <el-option value="正常"></el-option>
          <el-option value="異常"></el-option>
        </el-select>
      </div>
      <div class="inputBox">
        <p class="inputTitle">說明</p>
        <el-input style="width:300px" v-model="roleDescriptionInput" placeholder="說明欄位"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditDialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserRoles",
  data() {
    return {
      addOrEditDialogVisible: false,
      roleNameInput: "",
      roleStatusSelect: "",
      roleDescriptionInput: "",
      keyWordInput: "",
      buttonList: [],
      tableData: [
        {
          roleName: "角色A",
          status: "正常",
          roleDescription:
            "角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明",
          creatDate: "2020-05-01",
          emit: 1
        },
        {
          roleName: "角色B",
          status: "正常",
          roleDescription: "角色說明角色說明角色說明角色說明",
          creatDate: "2020-05-02",
          emit: 1
        },
        {
          roleName: "角色C",
          status: "異常",
          roleDescription:
            "角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明角色說明",
          creatDate: "2019-05-03",
          emit: 1
        }
      ]
    };
  },
  methods: {
    getButtonList(routePath, routers) {
      // console.log("1", routers);
      // console.log(routePath);
      const vm = this;
      var buttonList = [];
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
    handleAddOrEdit() {
      this.addOrEditDialogVisible = true;
    },
    handleDel() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    }
  },
  mounted() {
    let routers = JSON.parse(window.localStorage.router);
    // ? JSON.parse(window.localStorage.router)
    // : [];
    this.getButtonList(this.$route.path, routers);
  }
};
</script>

<style lang='scss'>
</style>