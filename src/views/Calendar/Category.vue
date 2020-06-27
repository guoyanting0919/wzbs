<template>
  <div id="calendarCategory">
    <!-- headerBox -->
    <HeaderBox
      @searchHandler="searchHandler"
      @handleAddOrEdit="handleAddOrEdit"
      :buttonList="buttonList"
      :searchLoading="searchLoading"
    ></HeaderBox>

    <!-- mainTable -->
    <el-table
      v-if="eventTypeData"
      :data="eventTypeData"
      empty-text="暫無資料"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column prop="EventTypeName" label="類別名稱" sortable></el-table-column>
      <el-table-column prop="emit" label="操作" width="200" sortable>
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
            @click="deleteHandler(scope.row)"
          >刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination -->
    <Pagination
      v-if="totalCount"
      :keyWord="keyWordInput"
      :total="totalCount"
      :currentPage="currentPage"
      @changePage="getEventType"
    ></Pagination>

    <!-- addDialog -->
    <el-dialog :title="addOrEdit" :visible.sync="addOrEditDialog" width="30%">
      <ValidationObserver ref="obs">
        <div class="inputBox">
          <p class="inputTitle">類別名稱:</p>
          <ValidationProvider name="請輸入類別名!!" rules="required" v-slot="{  errors,classes }">
            <el-input
              style="width:250px"
              :class="classes"
              v-model="categoryName"
              placeholder="請輸入行事曆類別名稱"
            ></el-input>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="inputBox" style="flex-wrap: wrap;">
          <p class="inputTitle">起迄日:</p>
          <ValidationProvider name="請輸入起迄日!!" rules="required" v-slot="{  errors,classes }">
            <el-date-picker
              v-model="startEndDate"
              type="daterange"
              :class="classes"
              style="width:350px"
              range-separator="~"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
            ></el-date-picker>

            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </ValidationObserver>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button
          :loading="addLoading"
          v-if="addOrEdit==='新增'"
          type="primary"
          @click="addHandler"
        >新 增</el-button>
        <el-button :loading="editLoading" v-else type="primary" @click="editHandler">編 輯</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
import Pagination from "../../components/Pagination";
import moment from "moment";
export default {
  name: "CalendarCategory",
  data() {
    return {
      keyWordInput: "",
      categoryName: "",
      totalCount: "",
      startEndDate: "",
      buttonList: [],
      addOrEditDialog: false,
      addOrEdit: "新增",
      editId: "",
      currentPage: 1,
      eventTypeData: "",
      searchLoading: false,
      addLoading: false,
      editLoading: false,
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
    HeaderBox,
    Pagination
  },
  methods: {
    async getEventType(page = 1, key) {
      const vm = this;
      let params = {
        key: vm.keyWordInput,
        page
      };
      await vm.$api.SearchEventType(params).then(res => {
        vm.totalCount = res.data.response.dataCount;
        vm.eventTypeData = res.data.response.data;
        vm.currentPage = page;
      });
    },
    searchHandler({ page, key }) {
      const vm = this;
      vm.searchLoading = true;
      vm.keyWordInput = key;
      let params = {
        key,
        page
      };
      vm.$api.SearchEventType(params).then(res => {
        vm.totalCount = res.data.response.dataCount;
        vm.eventTypeData = res.data.response.data;
        vm.searchLoading = false;
        vm.currentPage = 1;
      });
    },
    async addHandler() {
      const vm = this;
      const isValid = await vm.$refs.obs.validate();
      if (!isValid) {
        vm.$notify({
          title: "失敗",
          type: "error",
          message: "請確認欄位是否正確填寫!"
        });
      } else {
        vm.addLoading = true;
        let eventTypeName = vm.categoryName;
        let StartDate = moment(vm.startEndDate[0]).format("YYYY-MM-DD");
        let EndDate = moment(vm.startEndDate[1]).format("YYYY-MM-DD");
        let params = {
          eventTypeName,
          StartDate,
          EndDate
        };
        vm.$api.AddEventType(params).then(res => {
          vm.getEventType();
          vm.addOrEditDialog = false;
          vm.addLoading = false;
          vm.$notify({
            title: "成功",
            type: "success",
            message: `類別 ${eventTypeName} 添加成功 ! `
          });
        });
      }
    },
    async editHandler() {
      const vm = this;
      const isValid = await vm.$refs.obs.validate();
      if (!isValid) {
        vm.$notify({
          title: "失敗",
          type: "error",
          message: "請確認欄位是否正確填寫!"
        });
      } else {
        vm.editLoading = true;
        let eventTypeName = vm.categoryName;
        let StartDate = moment(vm.startEndDate[0]).format("YYYY-MM-DD");
        let EndDate = moment(vm.startEndDate[1]).format("YYYY-MM-DD");
        let params = {
          id: vm.editId,
          eventTypeName,
          StartDate,
          EndDate
        };
        vm.$api.EditEventType(params).then(res => {
          vm.getEventType();
          this.addOrEditDialog = false;
          vm.editLoading = false;
          vm.$notify({
            title: "成功",
            type: "success",
            message: `類別 ${eventTypeName} 更新成功 ! `
          });
        });
      }
    },
    deleteHandler(type) {
      const vm = this;
      // console.log(type);
      vm.$confirm(`確認刪除 ${type.EventTypeName} ?`, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: type.Id
          };
          vm.$api.DeleteEventType(params).then(res => {
            vm.getEventType();
          });
          vm.$notify({
            title: "成功",
            type: "success",
            message: `類別 ${type.EventTypeName} 删除成功`
          });
        })
        .catch(() => {
          vm.$notify({
            title: "提醒",
            type: "info",
            message: "已取消刪除"
          });
        });
    },
    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some(btn => btn.iconCls == btnType);
    },
    async handleAddOrEdit(act, info = "") {
      const vm = this;
      if (vm.$refs.obs) {
        await vm.$refs.obs.reset();
      }
      vm.categoryName = "";
      vm.startEndDate = "";
      vm.addOrEdit = "新增";
      if (act === "add") {
        vm.addOrEditDialog = true;
      } else {
        console.log(info);
        vm.addOrEdit = "編輯";
        vm.editId = info.Id;
        vm.startEndDate = [info.StartDate, info.EndDate];
        vm.addOrEditDialog = true;
        vm.categoryName = info.EventTypeName;
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
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
    await this.getEventType();

    this.$store.dispatch("loadingHandler", false);
  }
};
</script>

<style lang='scss'>
</style>