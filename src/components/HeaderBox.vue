<template>
  <div id="headerBox">
    <div class="searchBox">
      <el-date-picker
        class="datePicker"
        v-model="searchDate"
        type="daterange"
        range-separator="~"
        start-placeholder="開始時間"
        end-placeholder="結束時間"
        v-if="showDatePicker"
        @change="setSearchDate"
      ></el-date-picker>
      <el-input
        v-if="hasBtn('btnSearch') && !isEvent"
        class="keyWordInput"
        v-model="keyWordInput"
        placeholder="請輸入關鍵字"
        @keyup.enter.native="setSearchHandler "
      ></el-input>
      <el-input
        v-if="hasBtn('btnSearch') && isEvent"
        class="keyWordInput"
        v-model="keyWordInput"
        placeholder="請輸入關鍵字"
        @keyup.enter.native="setSearchHandlerDate "
      ></el-input>
      <el-button
        v-if="hasBtn('btnSearch') && !isEvent"
        class="searchBtn"
        :loading="searchLoading"
        type="primary"
        @click="setSearchHandler"
      >搜尋</el-button>
      <el-button
        v-if="hasBtn('btnSearch') && isEvent"
        class="searchBtn"
        :loading="searchLoading"
        type="primary"
        @click="setSearchHandlerDate"
      >搜尋</el-button>
      <el-button
        v-if="hasBtn('btnAdd')"
        @click="setHandleAddOrEdit('add')"
        class="addBtn"
        type="primary"
      >新增</el-button>
      <el-button
        v-if="hasBtn('btnEdit') && isEvent"
        @click="setChangeHandler"
        class="changeBtn"
        type="primary"
      >批次替換</el-button>
      <el-button
        v-if="hasBtn('btnImport')"
        @click="setImportHandler"
        class="importBtn"
        type="primary"
      >匯入</el-button>
      <el-button
        @click="setExportHandler"
        v-if="hasBtn('btnExport')"
        class="exportBtn"
        type="primary"
      >匯出</el-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
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
    },
    searchLoading: {
      type: Boolean,
      default: false,
      required: false
    },
    isEvent: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    hasBtn(btnType) {
      // return true;
      const vm = this;
      return this.buttonList.some(btn => btn.iconCls == btnType);
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
    setSearchHandler() {
      const vm = this;
      let page = 1;
      let key = vm.keyWordInput;
      vm.$emit("searchHandler", { page, key });
    },
    setExportHandler() {
      const vm = this;
      let key = vm.keyWordInput;
      if (vm.searchDate !== null && vm.searchDate) {
        let startDate = moment(vm.searchDate[0]).format("YYYY-MM-DD");
        let endDate = moment(vm.searchDate[1]).format("YYYY-MM-DD");
        vm.$emit("exportHandler", { key, startDate, endDate });
      } else {
        let startDate = "";
        let endDate = "";
        vm.$emit("exportHandler", { key, startDate, endDate });
      }
    },
    setImportHandler() {
      this.$emit("importHandler", true);
    },
    setSearchHandlerDate() {
      const vm = this;
      let page = 1;
      let key = vm.keyWordInput;
      console.log(vm.searchDate);

      if (vm.searchDate !== null && vm.searchDate) {
        console.log("y");
        let startDate = moment(vm.searchDate[0]).format("YYYY-MM-DD");
        let endDate = moment(vm.searchDate[1]).format("YYYY-MM-DD");
        vm.$emit("searchHandlerDate", { page, key, startDate, endDate });
      } else {
        console.log("n");
        let startDate = "";
        let endDate = "";
        vm.$emit("searchHandlerDate", { page, key, startDate, endDate });
      }
    }
  }
};
</script>

<style lang='scss' >
</style>