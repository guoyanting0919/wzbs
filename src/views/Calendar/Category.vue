<template>
  <div id="calendarCategory">
    <!-- searchBox -->
    <!-- <div class="searchBox">
      <el-input class="keyWordInput" v-model="keyWordInput" placeholder="請輸入關鍵字"></el-input>
      <el-button class="searchBtn" type="primary">搜尋</el-button>
      <el-button @click="handleAddOrEdit('add')" class="addBtn" type="primary">新增</el-button>
    </div>-->

    <!-- headerBox -->
    <HeaderBox @handleAddOrEdit="handleAddOrEdit" :buttonList="buttonList"></HeaderBox>

    <!-- mainTable -->
    <el-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column prop="category" label="類別名稱" sortable></el-table-column>
      <el-table-column prop="emit" label="操作" width="200" sortable>
        <template slot-scope="scope">
          <el-button class="outline" size="mini" @click="handleAddOrEdit('edit',scope.row)">編輯</el-button>
          <el-button type="danger" class="outline" size="mini" @click="handleDel(scope.row)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- addDialog -->
    <el-dialog title="新增" :visible.sync="addOrEditDialog" width="30%">
      <el-input v-model="categoryName" placeholder="請輸入行事曆類別名稱"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditDialog = false">新 增</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
export default {
  name: "CalendarCategory",
  data() {
    return {
      keyWordInput: "",
      categoryName: "",
      buttonList: [],
      addOrEditDialog: false,
      tableData: [
        {
          category: "重大會議"
        },
        {
          category: "活動"
        },
        {
          category: "節慶"
        },
        {
          category: "其他事件"
        }
      ]
    };
  },
  components: {
    HeaderBox
  },
  methods: {
    handleEdit() {},
    handleDel() {},
    handleAddOrEdit(act, info = "") {
      this.categoryName = "";
      if (act === "add") {
        this.addOrEditDialog = true;
      } else {
        this.addOrEditDialog = true;
        this.categoryName = info.category;
      }
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
  mounted() {
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
  }
};
</script>

<style lang='scss'>
</style>