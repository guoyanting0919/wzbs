<template>
  <div id="calendarEvent">
    <!-- searchBox -->
    <!-- <div class="searchBox">
      <el-input class="keyWordInput" v-model="keyWordInput" placeholder="請輸入關鍵字"></el-input>
      <el-button class="searchBtn" type="primary">搜尋</el-button>
      <el-button @click="handleAddOrEdit('add')" class="addBtn" type="primary">新增</el-button>
      <el-button @click="changeDialog = true" class="changeBtn" type="primary">批次替換</el-button>
      <el-button @click="importDialogVisible = true" class="importBtn" type="primary">匯入</el-button>
      <el-button class="exportBtn" type="primary">匯出</el-button>
    </div>-->

    <!-- headerBox -->
    <HeaderBox
      @changeHandler="changeHandler"
      @handleAddOrEdit="handleAddOrEdit"
      @getSearchDate="getSearchDate"
      :buttonList="buttonList"
      :showDatePicker="true"
    ></HeaderBox>

    <!-- mainTable -->
    <div class="mainTable" v-if="unitsData">
      <div class="tableContainer mt-5">
        <el-table
          :data="eventsData"
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="EventName" label="事件名稱" sortable></el-table-column>
          <el-table-column prop="EventTypeName" label="行事曆類別" sortable></el-table-column>
          <el-table-column prop="ShowStartDate" label="顯示時間" sortable>
            <template slot-scope="scope">
              <div class="showDateBox">
                <span>{{ scope.row.ShowStartDate }}</span>
                <div class="dateLine"></div>
                <span>{{ scope.row.ShowEndDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="EventStartDate" label="活動時間" sortable>
            <template slot-scope="scope">
              <div class="eventDateBox">
                <span>{{ scope.row.EventStartDate }}</span>
                <div class="dateLine"></div>
                <span>{{ scope.row.EventEndDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="EventAddr" label="地址" sortable></el-table-column>
          <el-table-column prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button class="outline" size="mini" @click="handleCopy(scope.row)">複製</el-button>
              <el-button
                v-if="hasBtn('btnEdit')"
                class="outline"
                size="mini"
                @click="handleAddOrEdit('edit', scope.row)"
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
    <el-dialog
      :close-on-click-modal="false"
      title="新增"
      :visible.sync="addOrEditDialog"
      v-if="unitsData"
    >
      <el-scrollbar class="scrollbar-handle">
        <div class="inputBox">
          <div class="inputTitle">事件名稱</div>
          <el-input
            type="textarea"
            :rows="2"
            style="width:550px"
            v-model="eventNameInput"
            placeholder="請輸入事件名稱"
          ></el-input>
        </div>
        <div class="inputBox">
          <div class="inputTitle">事件描述</div>
          <el-input
            type="textarea"
            :rows="2"
            style="width:550px"
            v-model="inputDescription"
            placeholder="請輸入事件描述"
          ></el-input>
        </div>
        <div class="inputBox">
          <div class="inputTitle">行事曆類別</div>
          <el-select v-if="eventTypeData" v-model="eventCategorySelete" placeholder="請選擇行事曆類別">
            <el-option
              v-for="type in eventTypeData"
              :key="type.Value"
              :label="type.Text"
              :value="type.Value"
            ></el-option>
          </el-select>
        </div>
        <div class="inputBox">
          <div class="inputTitle">顯示時間</div>
          <el-date-picker
            v-model="showDate"
            type="daterange"
            range-separator="~"
            start-placeholder="開始顯示時間"
            end-placeholder="結束顯示時間"
          ></el-date-picker>
        </div>
        <div class="inputBox">
          <div class="inputTitle">會議/活動時間</div>
          <el-date-picker
            v-model="eventDate"
            type="daterange"
            range-separator="~"
            start-placeholder="會議/活動開始時間"
            end-placeholder="會議/活動結束時間"
          ></el-date-picker>
        </div>
        <div class="inputBox">
          <div class="inputTitle">會議/活動地址</div>
          <el-input style="width:700px" v-model="eventSiteInput" placeholder="請輸入會議/活動地點"></el-input>
        </div>
        <div class="inputBox">
          <div class="inputTitle">連結</div>
          <el-input style="width:700px" v-model="eventUrlInput" placeholder="請輸入會議/活動連結"></el-input>
        </div>
        <div class="inputBox">
          <div class="inputTitle">上傳文件</div>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
          >
            <el-button size="small" type="primary">選擇上傳文件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
        <div class="inputBox" style="align-items:flex-start">
          <div class="inputTitle">參與人員</div>
          <div>
            <el-checkbox class="relatedCheck" v-model="isRelated">是否關聯</el-checkbox>
            <div class="selectBox">
              <el-select
                filterable
                no-match-text="暫無資料"
                @change="lv1Change"
                class="unitSelect"
                v-model="unit1"
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
                v-model="unit2"
                placeholder="請選擇次高單位"
                v-if="unit1 && unitLv2.length > 0"
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
                v-model="unit3"
                placeholder="請選擇單位"
                v-if="unit2 && unitLv3.length > 0"
              >
                <el-option
                  v-for="unit in unitLv3"
                  :key="unit.UntId"
                  :value="unit.UntId"
                  :label="unit.UntNameFull"
                >{{unit.UntNameFull}}</el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="inputBox" style="align-items:flex-start">
          <div class="inputTitle"></div>
          <div class="selectBox">
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
            <el-select v-model="memberTitle" placeholder="職稱">
              <el-option value="memberTitle">校長</el-option>
            </el-select>
            <el-select v-model="rloe" placeholder="Role">
              <el-option value="Role">Role</el-option>
            </el-select>
          </div>
          <el-button>加入</el-button>
        </div>
        <div class="inputBox" style="align-items:flex-start">
          <div class="inputTitle"></div>
          <el-table :data="tableData2" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="title" label="職稱" width="180"></el-table-column>
            <el-table-column prop="unit" label="單位"></el-table-column>
            <el-table-column prop label="刪除">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="delMember(scope.row)">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
      <el-dialog width="30%" title :visible.sync="addInnerVisible" append-to-body>
        <p>xxx已有活動，是否確認提交</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addInnerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrEditConfirm">提 交</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="addInnerVisible = true">提 交</el-button>
      </div>
    </el-dialog>

    <!-- changeDialog -->
    <el-dialog title="替換人員" :visible.sync="changeDialog" width="30%">
      <div class="changeInputBox">
        <p class="changeInputTitle">原始人員</p>
        <el-select v-model="changeMember" placeholder="請選擇原始人員">
          <el-option value="YT"></el-option>
        </el-select>
      </div>
      <div class="changeInputBox">
        <p class="changeInputTitle">替換人員</p>
        <el-select v-model="newChangeMember" placeholder="請選擇替換人員">
          <el-option value="AS"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeDialog = false">提 交</el-button>
      </span>
    </el-dialog>

    <!-- importDialog -->
    <el-dialog title="匯入報表" :visible.sync="importDialogVisible" width="30%">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture"
      >
        <el-button size="small" type="primary">選擇上傳文件</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importDialogVisible = false">匯 入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBox from "../../components/HeaderBox";
import moment from "moment";
export default {
  name: "CalendarEvents",
  components: {
    HeaderBox
  },
  data() {
    return {
      userNameLoading: false,
      // 全域資料
      eventsData: "",
      eventTypeData: "",
      unitsData: "",
      usersData: "",

      //欄位
      eventNameInput: "",
      inputDescription: "",
      eventCategorySelete: "",
      showDate: [],
      eventDate: [],
      eventSiteInput: "",
      eventUrlInput: "",
      unit1: "",
      unit2: "",
      unit3: "",

      // 123
      userNameSelect: "",
      multipleSelection: [],
      changeMember: "",
      newChangeMember: "",
      member: "",
      memberTitle: "",
      rloe: "",
      isRelated: "",
      keyWordInput: "",
      buttonList: [],

      tableData2: [
        {
          title: "主任",
          name: "王小虎",
          unit: "Unit1"
        },
        {
          title: "教師",
          name: "王小虎",
          unit: "Unit2"
        },
        {
          title: "教授",
          name: "王小虎",
          unit: "Unit3"
        },
        {
          title: "校長",
          name: "王小虎",
          unit: "Unit1"
        }
      ],
      addOrEditDialog: false,
      addInnerVisible: false,
      importDialogVisible: false,
      changeDialog: false,
      searchDate: ""
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
        return unit.UntId === vm.unit1;
      });
      let uintLv1 = arrLv1[0];
      return vm.unitsData.filter(unit => {
        return unit.UntIdUp === uintLv1.UntId && unit.UntLevelb === "2";
      });
    },
    unitLv3() {
      const vm = this;
      let arrLv2 = vm.unitsData.filter(unit => {
        return unit.UntId === vm.unit2;
      });
      let uintLv2 = arrLv2[0];
      return vm.unitsData.filter(unit => {
        return unit.UntIdUp === uintLv2.UntId && unit.UntLevelb === "3";
      });
    }
  },
  methods: {
    async getUnits() {
      const vm = this;
      await vm.$api.GetUnits().then(res => {
        vm.unitsData = res.data;
      });
    },
    getEvents() {
      const vm = this;
      vm.$api.GetEventsPage().then(res => {
        console.log(res);
        let arr = res.data.response.data;
        arr.map(event => {
          event.EventEndDate = moment(event.EventEndDate).format("YYYY-MM-DD");
          event.EventStartDate = moment(event.EventStartDate).format(
            "YYYY-MM-DD"
          );
          event.ShowEndDate = moment(event.ShowEndDate).format("YYYY-MM-DD");
          event.ShowStartDate = moment(event.ShowStartDate).format(
            "YYYY-MM-DD"
          );
        });
        vm.eventsData = arr;
      });
    },
    getEventType() {
      let user = JSON.parse(window.localStorage.user);
      this.eventTypeData = user.DropCtrlTypes;
    },
    lv1Change() {
      const vm = this;
      vm.unit2 = "";
      vm.unit3 = "";
      let unitCode = vm.unit1;
      let params = {
        unitCode
      };
      vm.getUsers(params);
    },
    lv2Change() {
      const vm = this;
      vm.unit3 = "";
      vm.userNameSelect = "";
      let unitCode = vm.unit2;
      let params = {
        unitCode
      };
      vm.getUsers(params);
    },
    lv3Change() {
      const vm = this;
      vm.userNameSelect = "";
      let unitCode = vm.unit3;
      let params = {
        unitCode
      };
      vm.getUsers(params);
    },
    getUsers(params) {
      const vm = this;
      vm.userNameLoading = true;
      vm.$api.GetUsers(params).then(res => {
        // console.log(res);
        vm.usersData = res.data;

        vm.userNameLoading = false;
      });
    },
    handleAddOrEdit(act, info) {
      this.showDate = [];
      if (act === "add") {
        this.addOrEditDialog = !this.addOrEditDialog;
      } else {
        this.eventNameInput = info.eventName;
        this.showDate[0] = info.showStartDate;
        this.showDate[1] = info.showEndDate;
        this.addOrEditDialog = !this.addOrEditDialog;
      }
    },
    changeHandler() {
      this.changeDialog = true;
    },
    handleCopy() {},
    handleEdit() {},
    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some(btn => btn.iconCls == btnType);
    },
    handleDel() {
      this.$notify({
        title: "刪除成功",
        message: "已成功刪除該事件",
        type: "success"
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    addOrEditConfirm() {
      this.addOrEditDialog = false;
      this.addInnerVisible = false;
      this.$notify({
        title: "成功",
        message: "添加成功",
        type: "success"
      });
    },
    getSearchDate(dateArr) {
      this.searchDate = dateArr;
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
            vm.getButtonList(path, element.children);
          }
        }
      });
      return buttonList;
    }
  },
  async mounted() {
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
    this.getEvents();
    this.getEventType();
    await this.getUnits();
  }
};
</script>

<style lang="scss">
.el-notification__closeBtn {
  display: none !important;
}
</style>
