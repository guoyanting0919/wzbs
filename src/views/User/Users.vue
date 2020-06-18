<template>
  <div id="userUsers">
    <!-- headerBox -->
    <HeaderBox @handleAddOrEdit="handleAddOrEdit" :buttonList="buttonList"></HeaderBox>

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
          <el-table-column prop="unit" label="單位" sortable></el-table-column>
          <el-table-column prop="name" label="名稱" sortable></el-table-column>
          <el-table-column prop="role" label="角色" sortable>
            <template slot-scope="scope">
              <span class="roleBadge">{{scope.row.role}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="organization" label="組織" sortable></el-table-column>
          <el-table-column prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasBtn('btnEdit')"
                class="outline"
                size="mini"
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
    <el-dialog title="新增" :visible.sync="addOrEditDialog" width="50%" v-if="unitsData">
      <el-scrollbar class="scrollbar-handle">
        <!-- unit -->
        <div class="inputBox">
          <p class="inputTitle">單位</p>
          <el-select
            filterable
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
            >{{unit.UntNameFull}}</el-option>
          </el-select>
          <el-select
            filterable
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
            >{{unit.UntNameFull}}</el-option>
          </el-select>
          <el-select
            filterable
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
            >{{unit.UntNameFull}}</el-option>
          </el-select>
        </div>

        <!-- name -->
        <div class="inputBox">
          <p class="inputTitle">名稱</p>
          <el-select
            :loading="userNameLoading"
            loading-text="Loading..."
            no-data-text="暫無資料"
            filterable
            no-match-text="暫無資料"
            v-model="userNameSelect"
            placeholder="請選擇名稱"
          >
            <el-option
              v-for="user in usersData"
              :key="user.Account"
              :value="user.Account"
              :label="user.Name"
            ></el-option>
          </el-select>
        </div>

        <!-- role -->
        <div class="inputBox">
          <p class="inputTitle">角色</p>
          <el-select filterable no-match-text="暫無資料" v-model="userRoleSelect" placeholder="請選擇角色">
            <el-option
              v-for="role in rolesData"
              :key="role.Id"
              :value="role.Id"
              :label="role.Name"
            >{{role.Name}}</el-option>
          </el-select>
        </div>

        <!-- organization -->
        <div class="inputBox">
          <p class="inputTitle">組織</p>
          <el-input style="width:200px" placeholder="輸入關鍵字" v-model="filterText"></el-input>
        </div>
        <div class="inputBox">
          <p class="inputTitle"></p>
          <el-tree
            class="filter-tree"
            :data="orgsData"
            show-checkbox
            node-key="Id"
            empty-text="暫無資料!"
            :indent="32"
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="tree"
            @change="getCheckedKeys"
          ></el-tree>
        </div>

        <!-- category -->
        <div class="inputBox">
          <p class="inputTitle">行事曆類別</p>
          <el-checkbox-group v-model="categoryList">
            <el-checkbox label="類別A"></el-checkbox>
            <el-checkbox label="類別B"></el-checkbox>
            <el-checkbox label="類別C"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="getCheckedKeys">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
export default {
  name: "UserUsers",
  components: { HeaderBox },
  data() {
    return {
      userNameLoading: false,
      filterText: "",
      categoryList: [],
      addOrEditDialog: false,
      keyWordInput: "",
      orgsData: "",
      rolesData: "",
      usersData: "",
      tableData: [
        {
          name: "陳阿花",
          unit: "最高單位 / 次高單位 / 單位",
          organization:
            "組織名 1, 組織名 2, 組織名 3.組織名 1, 組織名 2,組織名 1, 組織名 2,組織名 1, 組織名 2,組織名 1, 組織名 2,組織名 1, 組織名 2,組織名 1, 組織名 2,",
          role: "Admin"
        },
        {
          name: "林曉婷",
          unit: "最高單位 / 次高單位 / 單位",
          organization: "角色說明角色說明角色說明角色說明",
          role: "User"
        },
        {
          name: "莊曉燕",
          unit: "最高單位 / 次高單位 / 單位",
          organization: "組織名 1, 組織名 2, 組織名 3...",
          role: "Master"
        }
      ],
      data: [
        {
          id: 1,
          label: "師範學院",
          children: [
            {
              id: 4,
              label: "教育學系",
              children: [
                {
                  id: 9,
                  label: "系主任"
                },
                {
                  id: 10,
                  label: "教授"
                }
              ]
            },
            {
              id: 11,
              label: "幼兒教育學系",
              children: [
                {
                  id: 12,
                  label: "系主任"
                },
                {
                  id: 13,
                  label: "教授"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "人文學院",
          children: [
            {
              id: 5,
              label: "外語系",
              children: [
                {
                  id: 14,
                  label: "系主任"
                },
                {
                  id: 15,
                  label: "教授"
                },
                {
                  id: 16,
                  label: "工讀生"
                }
              ]
            },
            {
              id: 6,
              label: "音樂系",
              children: [
                {
                  id: 17,
                  label: "系主任"
                },
                {
                  id: 18,
                  label: "教授"
                }
              ]
            }
          ]
        },
        {
          id: 3,
          label: "商學院",
          children: [
            {
              id: 7,
              label: "企業管理系"
            },
            {
              id: 8,
              label: "商業管理系"
            }
          ]
        }
      ],
      unitsData: "",
      userUnit1Select: "",
      userUnit2Select: "",
      userUnit3Select: "",
      userNameSelect: "",
      userRoleSelect: "",
      buttonList: [],
      defaultProps: {
        children: "Children",
        label: "Label"
      }
    };
  },
  computed: {
    unitLv1() {
      const vm = this;
      return vm.unitsData.filter(unit => {
        return unit.UntLevelb === "1";
      });
    },
    unitLv2() {
      const vm = this;
      let arrLv1 = vm.unitsData.filter(unit => {
        return unit.UntId === vm.userUnit1Select;
      });
      let uintLv1 = arrLv1[0];
      return vm.unitsData.filter(unit => {
        return unit.UntIdUp === uintLv1.UntIdUp && unit.UntLevelb === "2";
      });
    },
    unitLv3() {
      const vm = this;
      let arrLv2 = vm.unitsData.filter(unit => {
        return unit.UntId === vm.userUnit2Select;
      });
      let uintLv2 = arrLv2[0];
      return vm.unitsData.filter(unit => {
        return unit.UntIdUp === uintLv2.UntIdUp && unit.UntLevelb === "3";
      });
    }
  },
  methods: {
    async getUnits() {
      const vm = this;
      await vm.$api.GetUnits().then(res => {
        this.unitsData = res.data;
      });
    },
    getRoles() {
      const vm = this;
      vm.$api.GetAllRoles().then(res => {
        this.rolesData = res.data.response;
      });
    },
    getUsers(params) {
      const vm = this;
      vm.userNameLoading = true;
      vm.$api.GetUsers(params).then(res => {
        console.log(res);
        vm.usersData = res.data;

        vm.userNameLoading = false;
      });
    },
    getOrg() {
      const vm = this;
      vm.$api.GetOrg().then(res => {
        vm.orgsData = res.data;
      });
    },
    lv1Change() {
      const vm = this;
      vm.userUnit2Select = "";
      vm.userNameSelect = "";
      let unitCode = vm.userUnit1Select;
      let params = {
        unitCode
      };
      vm.getUsers(params);
    },
    lv2Change() {
      const vm = this;
      vm.userUnit3Select = "";
      vm.userNameSelect = "";
      let unitCode = vm.userUnit2Select;
      let params = {
        unitCode
      };
      vm.getUsers(params);
    },
    lv3Change() {
      const vm = this;
      vm.userNameSelect = "";
      let unitCode = vm.userUnit3Select;
      let params = {
        unitCode
      };
      vm.getUsers(params);
    },
    handleAddOrEdit() {
      const vm = this;
      this.addOrEditDialog = true;
      this.$nextTick(function() {
        vm.setCheckedKeys();
      });
    },
    handleDel() {},
    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some(btn => btn.iconCls == btnType);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys(["AA00", "EU00"]);
    },
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
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
    this.getRoles();
    this.getOrg();
    await this.getUnits();
    this.$store.dispatch("loadingHandler", false);
  }
};
</script>

<style lang='scss'>
</style>