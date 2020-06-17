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
    <div class="mainTable">
      <div class="tableContainer mt-5">
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="eventName" label="事件名稱" sortable></el-table-column>
          <el-table-column prop="eventCategory" label="行事曆類別" sortable></el-table-column>
          <el-table-column prop="showDate" label="顯示時間" sortable>
            <template slot-scope="scope">
              <div class="showDateBox">
                <span>{{ scope.row.showStartDate }}</span>
                <div class="dateLine"></div>
                <span>{{ scope.row.showEndDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="eventDate" label="活動時間" sortable>
            <template slot-scope="scope">
              <div class="eventDateBox">
                <span>{{ scope.row.eventStartDate }}</span>
                <div class="dateLine"></div>
                <span>{{ scope.row.eventEndDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="eventSite" label="地址" sortable></el-table-column>
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
    <el-dialog :close-on-click-modal="false" title="新增" :visible.sync="addOrEditDialog">
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
          <el-select v-model="eventCategorySelete" placeholder="請選擇行事曆類別">
            <el-option value="111">111111</el-option>
            <el-option value="2222">222222</el-option>
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
              <el-select v-model="unit1" placeholder="單位一">
                <el-option value="111">單位1</el-option>
              </el-select>
              <el-select v-model="unit2" placeholder="單位二">
                <el-option value="111">單位2</el-option>
              </el-select>
              <el-select v-model="unit3" placeholder="單位三">
                <el-option value="111">單位3</el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="inputBox" style="align-items:flex-start">
          <div class="inputTitle"></div>
          <div class="selectBox">
            <el-select v-model="member" placeholder="人員">
              <el-option value="YT">YT</el-option>
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
export default {
  name: "CalendarEvents",
  data() {
    return {
      eventNameInput: "",
      inputDescription: "",
      multipleSelection: [],
      changeMember: "",
      newChangeMember: "",
      member: "",
      memberTitle: "",
      rloe: "",
      isRelated: "",
      unit1: "",
      unit2: "",
      unit3: "",
      eventCategorySelete: "",
      eventUrlInput: "",
      eventSiteInput: "",
      showDate: [],
      eventDate: "",
      keyWordInput: "",
      buttonList: [],
      tableData: [
        {
          eventName: "重大會議A",
          eventCategory: "重大事件",
          eventSite: "新北市板橋區板新路27號8樓如果字太多就會折行",
          showStartDate: "2020-05-01",
          showEndDate: "2020-06-01",
          eventStartDate: "2020-05-12",
          eventEndDate: "2020-05-22 ",
          emit: 1
        },
        {
          eventName: "活動B",
          eventCategory: "活動",
          eventSite: "竹市板橋區板新路27號8樓如果字太多就會折行",
          showStartDate: "2020-05-02",
          showEndDate: "2019-07-01",
          eventStartDate: "2020-05-13",
          eventEndDate: "2020-05-22 ",
          emit: 1
        },
        {
          eventName: "重大會議A",
          eventCategory: "重大事件",
          eventSite: "新北市板橋區板新路27號8樓如果字太多就會折行",
          showStartDate: "2019-05-03",
          showEndDate: "2020-06-01",
          eventStartDate: "2020-05-14",
          eventEndDate: "2020-05-22 ",
          emit: 1
        }
      ],
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
  components: {
    HeaderBox
  },
  methods: {
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
  mounted() {
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
  }
};
</script>

<style lang="scss">
.el-notification__closeBtn {
  display: none !important;
}
</style>
