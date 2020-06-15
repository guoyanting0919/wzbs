<template>
  <div id="headerBox">
    <div class="searchBox">
      <el-date-picker
        class="datePicker"
        v-model="searchDate"
        type="daterange"
        range-separator="~"
        start-placeholder="開始顯示時間"
        end-placeholder="結束顯示時間"
        v-if="showDatePicker"
        @change="setSearchDate"
      ></el-date-picker>
      <el-input
        v-if="hasBtn('btnSearch')"
        class="keyWordInput"
        v-model="keyWordInput"
        placeholder="請輸入關鍵字"
      ></el-input>
      <el-button
        v-if="hasBtn('btnSearch')"
        class="searchBtn"
        type="primary"
        @click="searchHandler"
      >搜尋</el-button>
      <el-button
        v-if="hasBtn('btnAdd')"
        @click="setHandleAddOrEdit('add')"
        class="addBtn"
        type="primary"
      >新增</el-button>
      <el-button
        v-if="hasBtn('btnChange')"
        @click="setChangeHandler"
        class="changeBtn"
        type="primary"
      >批次替換</el-button>
      <el-button
        v-if="hasBtn('btnImport')"
        @click="importDialogVisible = true"
        class="importBtn"
        type="primary"
      >匯入</el-button>
      <el-button v-if="hasBtn('btnExport')" class="exportBtn" type="primary">匯出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderBox",
  data() {
    return {
      keyWordInput: "",
      changeDialogVisible: false,
      importDialogVisible: false,
      searchDate: ""
    };
  },
  props: {
    buttonList: {
      type: Array,
      required: true,
      default: []
    },
    showDatePicker: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some(btn => btn.btype == btnType);
    },
    setHandleAddOrEdit(method) {
      //   console.log(method);
      this.$emit("handleAddOrEdit", method);
    },
    setChangeHandler() {
      this.$emit("changeHandler");
    },
    setSearchDate() {
      this.$emit("getSearchDate", this.searchDate);
    },
    searchHandler() {
      // 透過當前 router 決定跑哪支api
      console.log(this.$route);
    }
  }
};
</script>

<style lang='scss' >
</style>