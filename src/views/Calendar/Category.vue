<template>
  <div id="calendarCategory">
    <!-- searchBox -->
    <div class="searchBox">
      <el-input class="keyWordInput" v-model="keyWordInput" placeholder="請輸入關鍵字"></el-input>
      <el-button class="searchBtn" type="primary">搜尋</el-button>
      <el-button @click="handleAddOrEdit('add')" class="addBtn" type="primary">新增</el-button>
    </div>

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
    <el-dialog title="新增" :visible.sync="addDialogVisible" width="30%">
      <el-input v-model="categoryName" placeholder="請輸入行事曆類別名稱"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">新 增</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CalendarCategory",
  data() {
    return {
      keyWordInput: "",
      categoryName: "",
      addDialogVisible: false,
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
  methods: {
    handleEdit() {},
    handleDel() {},
    handleAddOrEdit(act, info = "") {
      this.categoryName = "";
      if (act === "add") {
        this.addDialogVisible = true;
      } else {
        this.addDialogVisible = true;
        this.categoryName = info.category;
      }
    }
  }
};
</script>

<style lang='scss'>
</style>