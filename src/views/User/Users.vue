<template>
  <div id="userUsers">
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
              <el-button class="outline" size="mini" @click="handleAddOrEdit('edit',scope.row)">編輯</el-button>
              <el-button type="danger" class="outline" size="mini" @click="handleDel(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- addOrEditDialog -->
    <el-dialog title="新增" :visible.sync="addOrEditDialogVisible" width="50%">
      <el-scrollbar class="scrollbar-handle">
        <!-- unit -->
        <div class="inputBox">
          <p class="inputTitle">單位</p>
          <el-select class="unitSelect" v-model="userUnit1Select" placeholder="請選擇最高單位">
            <el-option value="正常"></el-option>
            <el-option value="異常"></el-option>
          </el-select>
          <el-select class="unitSelect" v-model="userUnit2Select" placeholder="請選擇次高單位">
            <el-option value="正常"></el-option>
            <el-option value="異常"></el-option>
          </el-select>
          <el-select class="unitSelect" v-model="userUnit3Select" placeholder="請選擇單位">
            <el-option value="正常"></el-option>
            <el-option value="異常"></el-option>
          </el-select>
        </div>

        <!-- name -->
        <div class="inputBox">
          <p class="inputTitle">名稱</p>
          <el-select v-model="userNameSelect" placeholder="請選擇名稱">
            <el-option value="正常"></el-option>
            <el-option value="異常"></el-option>
          </el-select>
        </div>

        <!-- role -->
        <div class="inputBox">
          <p class="inputTitle">角色</p>
          <el-select v-model="userRoleSelect" placeholder="請選擇角色">
            <el-option value="正常"></el-option>
            <el-option value="異常"></el-option>
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
            :data="data"
            show-checkbox
            node-key="id"
            empty-text="暫無資料!"
            :indent="32"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree"
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
        <el-button @click="addOrEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditDialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserUsers",
  data() {
    return {
      filterText: "",
      categoryList: [],
      addOrEditDialogVisible: false,
      keyWordInput: "",
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
      userUnit1Select: "",
      userUnit2Select: "",
      userUnit3Select: "",
      userNameSelect: "",
      userRoleSelect: "",
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    handleAddOrEdit() {
      const vm = this;
      this.addOrEditDialogVisible = true;
      this.$nextTick(function() {
        vm.setCheckedKeys();
      });
    },
    handleDel() {},
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
      this.$refs.tree.setCheckedKeys([3, 12]);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang='scss'>
</style>