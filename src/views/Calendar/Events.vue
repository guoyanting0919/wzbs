<template>
  <div id="calendarEvent">
    <!-- headerBox -->
    <HeaderBox
      @searchHandlerDate="searchHandlerDate"
      @changeHandler="changeHandler"
      @handleAddOrEdit="handleAddOrEdit"
      @getSearchDate="getSearchDate"
      :buttonList="buttonList"
      :showDatePicker="true"
      :isEvent="true"
      :searchLoading="searchLoading"
    ></HeaderBox>

    <!-- mainTable -->
    <div class="mainTable" v-if="eventsData">
      <div class="tableContainer mt-5">
        <el-table
          empty-text="暫無資料"
          :data="eventsData"
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="EventName" label="活動 / 會議名稱" sortable></el-table-column>
          <el-table-column width="180" prop="EventTypeName" label="行事曆類別" sortable></el-table-column>
          <el-table-column width="280" prop="ShowStartDate" label="公告時間" sortable>
            <template slot-scope="scope">
              <div class="showDateBox">
                <span>{{ scope.row.ShowStartDate }}</span>
                <div class="dateLine"></div>
                <span>{{ scope.row.ShowEndDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="280" prop="EventStartDate" label="活動 / 會議時間" sortable>
            <template slot-scope="scope">
              <div class="eventDateBox">
                <span>{{ scope.row.EventStartDate }}</span>
                <div class="dateLine"></div>
                <span>{{ scope.row.EventEndDate }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="EventAddr" label="地點" sortable></el-table-column>
          <el-table-column width="250" prop="emit" label="操作">
            <template slot-scope="scope">
              <el-button class="outline" size="mini" @click="copyHandler(scope.row)">複製</el-button>
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
                @click="deleteHandler(scope.row)"
              >刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- pagination -->
    <Pagination
      v-if="totalCount"
      :keyWord="keyWordInput"
      :start="startDate"
      :end="endDate"
      :total="totalCount"
      :page-size="pageSize"
      :currentPage="currentPage"
      @changePage="getEvents"
    ></Pagination>

    <!-- addOrEditDialog -->

    <el-dialog
      @opened="scrollToTop"
      :close-on-click-modal="true"
      :title="addOrEdit"
      :visible.sync="addOrEditDialog"
      v-if="unitsData"
      width="70%"
    >
      <ValidationObserver ref="obs">
        <el-scrollbar class="scrollbar-handle" ref="scrollBox">
          <div class="inputBox" style="margin-top: 1rem;">
            <div class="inputTitle">活動 / 會議名稱</div>
            <ValidationProvider name="請輸入活動會議名稱!!" rules="required" v-slot="{  errors,classes }">
              <el-input
                :class="classes"
                type="textarea"
                :rows="2"
                style="width:550px"
                v-model="eventNameInput"
                placeholder="請輸入活動 / 會議名稱"
              ></el-input>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">活動 / 會議描述</div>
            <ValidationProvider name="請輸入活動會議描述!!" rules="required" v-slot="{  errors,classes }">
              <el-input
                :class="classes"
                type="textarea"
                :rows="2"
                style="width:550px"
                v-model="inputDescription"
                placeholder="請輸入活動 / 會議描述"
              ></el-input>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">行事曆類別</div>
            <ValidationProvider name="請選擇類別!!" rules="required" v-slot="{  errors,classes }">
              <el-select
                :class="classes"
                v-if="eventTypeData"
                v-model="eventCategorySelete"
                placeholder="請選擇行事曆類別"
              >
                <el-option
                  v-for="type in eventTypeData"
                  :key="type.Value"
                  :label="type.Text"
                  :value="type.Value"
                ></el-option>
              </el-select>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">公告時間</div>
            <ValidationProvider name="請選擇公告時間!!" rules="required" v-slot="{  errors,classes }">
              <el-date-picker
                :class="classes"
                v-model="showDate"
                type="datetimerange"
                range-separator="~"
                start-placeholder="公告時間開始"
                end-placeholder="公告時間結束"
              ></el-date-picker>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">會議 / 活動時間</div>
            <ValidationProvider name="請選擇活動時間!!" rules="required" v-slot="{  errors,classes }">
              <el-date-picker
                :class="classes"
                v-model="eventDate"
                type="datetimerange"
                range-separator="~"
                start-placeholder="開始時間"
                end-placeholder="結束時間"
              ></el-date-picker>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">會議 / 活動地點</div>
            <ValidationProvider name="請輸入會議 / 活動地點!!" rules="required" v-slot="{  errors,classes }">
              <el-input
                :class="classes"
                style="width:700px"
                v-model="eventSiteInput"
                placeholder="請輸入會議 / 活動地點"
              ></el-input>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">連結</div>
            <ValidationProvider name="請輸入會議 / 活動連結!!" rules="required" v-slot="{  errors,classes }">
              <el-input
                :class="classes"
                style="width:700px"
                v-model="eventUrlInput"
                placeholder="請輸入會議 / 活動連結"
              ></el-input>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">單位</div>
            <ValidationProvider name="請選擇單位!!" rules="required" v-slot="{  errors,classes }">
              <el-select
                filterable
                no-match-text="暫無資料"
                :class="classes"
                v-if="userControlUnit"
                v-model="unitSelete"
                placeholder="請選擇單位"
              >
                <el-option
                  v-for="unit in userControlUnit"
                  :key="unit.UntId"
                  :label="unit.UntNameFull"
                  :value="unit.UntId"
                ></el-option>
              </el-select>
              <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="inputBox">
            <div class="inputTitle">上傳文件</div>
            <el-upload
              ref="upload"
              class="upload-demo"
              action="https://scan.1966.org.tw/api/Img"
              list-type="text"
              :headers="uploadHeader"
              :on-success="successUpload"
            >
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  檔案格式限制:doc/docx/xls/xlsx/ppt/pttx/pdf/jpg/png
                  <br />檔案大小限制:10MB
                </div>
                <el-button size="small" type="primary">選擇上傳文件</el-button>
              </el-tooltip>
            </el-upload>
          </div>

          <div class="inputBox" v-if="uploadUrl">
            <div class="inputTitle">已上傳文件</div>
            <p class="noFiles" v-if="uploadUrl.length === 0 || uploadUrl[0] ==''">尚未上傳文件</p>

            <div v-else>
              <el-button
                v-for="(url,index) in uploadUrl"
                :key="index"
                class="downloadBtn"
                size="mini"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="fileName(url)"
                  placement="top-start"
                >
                  <p class="fileName" v-if="url">
                    <i @click.capture="delFile(index)" class="fas fa-trash-alt"></i>
                    {{fileName(url)}}
                  </p>
                </el-tooltip>
              </el-button>
            </div>
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
                filterable
                no-match-text="暫無資料"
                :loading="userNameLoading"
                loading-text="Loading..."
                no-data-text="暫無資料"
                v-model="userNameSelect"
                placeholder="請選擇名稱"
                @change="setUser"
              >
                <el-option
                  v-for="user in usersData"
                  :key="user.Account"
                  :value="user.Account"
                  :label="user.Name"
                ></el-option>
              </el-select>
              <el-select v-model="memberTitle" placeholder="職稱">
                <el-option :value="userData.Title">{{userData.Title}}</el-option>
              </el-select>
              <el-select v-model="rloeSelect" placeholder="Role">
                <el-option v-for="role in rolesData" :key="role" :value="role"></el-option>
              </el-select>
            </div>
            <el-button :loading="addLoading" @click="addToTable">加入</el-button>
          </div>
          <div class="inputBox" style="align-items:flex-start">
            <div class="inputTitle"></div>
            <el-table
              v-if="usersTableData"
              empty-text="暫無資料"
              :data="usersTableData"
              style="width: 100%"
            >
              <el-table-column prop="userName" label="姓名" width="180"></el-table-column>
              <el-table-column prop="usertitle" label="職稱" width="180"></el-table-column>
              <el-table-column prop="unit" label="單位"></el-table-column>
              <el-table-column prop label="刪除">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click.native.prevent="deleteRow(scope.$index, usersTableData)"
                  >刪除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </ValidationObserver>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialog = false">取 消</el-button>
        <el-button v-if="addOrEdit==='新增'" type="primary" @click="addHandler">新 增</el-button>
        <el-button v-if="addOrEdit==='編輯'" type="primary" @click="editHandler">編 輯</el-button>
        <el-button v-if="addOrEdit==='複製'" type="primary" @click="addHandler">複 製</el-button>
      </div>
    </el-dialog>

    <!-- changeDialog -->

    <el-dialog title="替換人員" :visible.sync="changeDialog" width="30%">
      <ValidationObserver ref="obs2">
        <div class="changeInputBox">
          <p class="changeInputTitle">原始人員</p>
          <ValidationProvider name="請選擇原始人員!!" rules="required" v-slot="{  errors,classes }">
            <el-select
              filterable
              :class="classes"
              no-match-text="無匹配資料"
              no-data-text="無資料"
              v-model="changeMember"
              placeholder="請選擇原始人員"
            >
              <el-option
                v-for="(member,index) in changeMemberData"
                :key="`${member + index}`"
                :value="member"
              ></el-option>
            </el-select>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>

        <div class="changeInputBox">
          <p class="changeInputTitle">替換人員</p>
          <ValidationProvider name="請選擇原始人員!!" rules="required" v-slot="{  errors,classes }">
            <el-autocomplete
              class="inline-input"
              :class="classes"
              v-model="newChangeMember"
              :fetch-suggestions="querySearch"
              placeholder="請選擇替換人員"
              :trigger-on-focus="false"
            ></el-autocomplete>
            <span class="validateSpan" v-if="errors[0]">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </ValidationObserver>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmChange">提 交</el-button>
      </span>
    </el-dialog>

    <!-- importDialog -->
    <el-dialog title="匯入報表" :visible.sync="importDialogVisible" width="30%">
      <el-upload
        class="upload-demo"
        action="https://cors-anywhere.herokuapp.com/https://scan.1966.org.tw/images/Upload/Pic"
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
import Pagination from "../../components/Pagination";
import moment from "moment";
export default {
  name: "CalendarEvents",
  components: {
    HeaderBox,
    Pagination
  },
  data() {
    return {
      userNameLoading: false,
      // 全域資料
      eventsData: "",
      eventTypeData: "",
      unitsData: "",
      usersData: "",
      rolesData: [
        "主席/主任委員",
        "副主任委員",
        "執行秘書",
        "副執行秘書",
        "當任委員/代表",
        "選任委員/代表",
        "系(中心)主任代表",
        "導師代表",
        "教師代表",
        "學生代表",
        "職員(工)代表",
        "家長代表",
        "業務單位代表",
        "專家(學者)顧問代表",
        "業界代表",
        "列席代表(人員)",
        "諮詢顧問",
        "社會公正人士",
        "工作小組人員"
      ],
      userData: "",
      usersTable: [],
      allMembersData: "",

      //欄位
      eventNameInput: "",
      inputDescription: "",
      eventCategorySelete: "",
      showDate: [],
      eventDate: [],
      eventSiteInput: "",
      eventUrlInput: "",
      unitSelete: "",
      uploadUrl: "",
      unit1: "",
      unit2: "",
      unit3: "",
      userNameSelect: "",
      rloeSelect: "",
      isRelated: true,
      memberTitle: "",

      // 替換
      eventIds: "",
      changeMemberData: [],
      changeMember: "",
      newChangeMember: "",
      allMembersData: "",

      // copy
      copyEventId: "",

      //全域變數
      searchLoading: false,
      addLoading: false,
      totalCount: "",
      pageSize: "",
      currentPage: 1,
      addOrEdit: "新增",
      editEventId: "",
      startDate: "",
      endDate: "",
      keyWordInput: "",
      uploadHeader: {
        Authorization: `Bearer ${window.localStorage.getItem("Token")}`
      },
      member: "",
      buttonList: [],
      addOrEditDialog: false,
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
    },
    usersTableData() {
      return this.usersTable;
    },
    userControlUnit() {
      const vm = this;
      let userCtrl = JSON.parse(window.localStorage.getItem("user")).CtrlUnits;
      let arr = userCtrl.map(uc => {
        return vm.unitsData.filter(unit => {
          return unit.UntId === uc;
        })[0];
      });
      return arr;
    }
  },
  methods: {
    async getUnits() {
      const vm = this;
      await vm.$api.GetUnits().then(res => {
        vm.unitsData = res.data;
      });
    },
    getEvents(page = 1, key, startDate, endDate) {
      const vm = this;
      let params = {
        key: vm.keyWordInput,
        page,
        startDate: vm.startDate,
        endDate: vm.endDate
      };
      vm.$api.GetEventsPage(params).then(res => {
        console.log(res);
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        vm.currentPage = page;
        let arr = res.data.response.data;
        arr.map(event => {
          event.EventEndDate = moment(event.EventEndDate).format(
            "YYYY-MM-DD HH:mm"
          );
          event.EventStartDate = moment(event.EventStartDate).format(
            "YYYY-MM-DD HH:mm"
          );
          event.ShowEndDate = moment(event.ShowEndDate).format(
            "YYYY-MM-DD HH:mm"
          );
          event.ShowStartDate = moment(event.ShowStartDate).format(
            "YYYY-MM-DD HH:mm"
          );
        });
        vm.eventsData = arr;
        vm.$store.dispatch("loadingHandler", false);
      });
    },
    getEventType() {
      let user = JSON.parse(window.localStorage.user);
      this.eventTypeData = user.DropCtrlTypes;
    },
    getAllUser() {
      const vm = this;
      let arr = [];
      vm.$api.GetUsers({ unitCode: "" }).then(res => {
        vm.allMembersData = res.data.map(u => {
          u.value = u.Name;
          return u;
        });
      });
    },
    lv1Change() {
      const vm = this;
      vm.unit2 = "";
      vm.unit3 = "";
      vm.userNameSelect = "";
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
    setUser() {
      const vm = this;
      let id = vm.userNameSelect;
      let userArr = vm.usersData.filter(user => {
        return user.Account === id;
      });
      vm.userData = userArr[0];
      console.log(vm.userData);
    },
    getUsers(params) {
      const vm = this;
      vm.userNameLoading = true;
      if (!vm.isRelated) {
        let params1 = {
          unitCode: ""
        };
        vm.$api.GetUsers(params1).then(res => {
          console.log(res);
          vm.usersData = res.data;
          vm.userNameLoading = false;
        });
      } else {
        vm.$api.GetUsers(params).then(res => {
          vm.usersData = res.data;
          vm.userNameLoading = false;
        });
      }
    },
    successUpload(res) {
      const vm = this;
      vm.uploadUrl.push(res.response);
      vm.$nextTick(() => {
        vm.$refs.upload.clearFiles();
      });
    },
    delFile(id) {
      console.log(id);
      this.uploadUrl.splice(id, 1);
    },
    fileName(url) {
      if (url) {
        return url.split("\\")[1].split(".")[0];
      }
      // return url.split('\')[1].split('.')[0];
      //return url;
    },
    addToTable() {
      const vm = this;
      if (!vm.userData) {
        vm.$notify({
          title: "失敗",
          type: "error",
          message: `請確認是否正確選擇參與人員及會議 / 活動時間`
        });
      } else {
        vm.addLoading = true;
        if (vm.isRelated) {
          let userId = vm.userData.Account;
          let userType = vm.userData.UserType;
          let unitCode = vm.userData.UnitCode;
          let userName = vm.userData.Name;
          let usertitle = vm.memberTitle;
          let unit = vm.userData.UnitName;
          let eventId = vm.eventCategorySelete;
          let userData = {
            userId,
            eventId,
            userType,
            unitCode,
            userName,
            usertitle,
            unit
          };
          let startDate = moment(vm.eventDate[0]).format("YYYY-MM-DD HH:mm:ss");
          let EndDate = moment(vm.eventDate[1]).format("YYYY-MM-DD HH:mm:ss");
          let UserName = vm.userData.Name;
          let params = {
            startDate,
            EndDate,
            UserName
          };
          vm.$api.CheckUserHasEvent(params).then(res => {
            if (res.data.success) {
              vm.addLoading = false;
              vm.$notify({
                title: "成功",
                type: "success",
                message: `成功加入${UserName}`
              });
              vm.usersTable.push(userData);
              vm.unit1 = "";
              vm.unit2 = "";
              vm.unit3 = "";
              vm.memberTitle = "";
              vm.rloeSelect = "";
              vm.userNameSelect = "";
              vm.userData = "";
              vm.usersData = "";
            } else {
              vm.$confirm(
                `${userName} 已於同時間參與 ${res.data.response} 活動，是否依舊將加入活動參與人員 ?`,
                "提示",
                {
                  confirmButtonText: "確定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  vm.addLoading = false;
                  vm.$notify({
                    title: "成功",
                    type: "success",
                    message: `成功加入${UserName}`
                  });
                  vm.usersTable.push(userData);
                  vm.unit1 = "";
                  vm.unit2 = "";
                  vm.unit3 = "";
                  vm.memberTitle = "";
                  vm.rloeSelect = "";
                  vm.userNameSelect = "";
                  vm.userData = "";
                  vm.usersData = "";
                })
                .catch(() => {
                  vm.addLoading = false;
                  vm.$notify({
                    title: "提醒",
                    type: "info",
                    message: "已取消加入"
                  });
                });
            }
          });
        } else {
          console.log("nR");
          let userId = vm.userData.Account;
          let userType = vm.userData.UserType;
          let unitCode = vm.unit3 || vm.unit2 || vm.unit1;
          let userName = vm.userData.Name;
          let usertitle = vm.memberTitle;
          let unitArr = vm.unitsData.filter(u => {
            return u.UntId === unitCode;
          });
          let unit = unitArr[0].UntNameFull;
          let eventId = vm.eventCategorySelete;
          let userData = {
            userId,
            eventId,
            userType,
            unitCode,
            userName,
            usertitle,
            unit
          };
          let startDate = moment(vm.eventDate[0]).format("YYYY-MM-DD HH:mm:ss");
          let EndDate = moment(vm.eventDate[1]).format("YYYY-MM-DD HH:mm:ss");
          let UserName = vm.userData.Name;
          let params = {
            startDate,
            EndDate,
            UserName
          };
          vm.$api.CheckUserHasEvent(params).then(res => {
            console.log(res);
            if (res.data.success) {
              vm.addLoading = false;
              vm.$notify({
                title: "成功",
                type: "success",
                message: `成功加入${UserName}`
              });
              vm.usersTable.push(userData);
              vm.unit1 = "";
              vm.unit2 = "";
              vm.unit3 = "";
              vm.memberTitle = "";
              vm.rloeSelect = "";
              vm.userNameSelect = "";
              vm.userData = "";
              vm.usersData = "";
            } else {
              vm.$confirm(
                `${userName} 已於同時間參與 ${res.data.response} 等...活動 / 會議，是否依舊將 ${userName} 加入會議 / 活動參與人員 ?`,
                "提示",
                {
                  confirmButtonText: "確定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  vm.addLoading = false;
                  vm.$notify({
                    title: "成功",
                    type: "success",
                    message: `成功加入${UserName}`
                  });
                  vm.usersTable.push(userData);
                  vm.unit1 = "";
                  vm.unit2 = "";
                  vm.unit3 = "";
                  vm.memberTitle = "";
                  vm.rloeSelect = "";
                  vm.userNameSelect = "";
                  vm.userData = "";
                  vm.usersData = "";
                })
                .catch(() => {
                  vm.addLoading = false;
                  vm.$notify({
                    title: "提醒",
                    type: "info",
                    message: "已取消加入"
                  });
                });
            }
          });
        }
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
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
        if (vm.usersTableData.length == 0) {
          vm.$notify({
            title: "失敗",
            type: "error",
            message: "請確實新增參與人員!"
          });
        } else {
          let eventName = vm.eventNameInput;
          let eventTypeId = vm.eventCategorySelete;
          let summary = vm.inputDescription;
          let eventStartDate = moment(vm.eventDate[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let eventEndDate = moment(vm.eventDate[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let showStartDate = moment(vm.showDate[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let showEndDate = moment(vm.showDate[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let eventAddr = vm.eventSiteInput;
          let pushData = true;
          let unitCode = vm.unitSelete;
          let attachDoc = vm.uploadUrl;
          let linkUrl = vm.eventUrlInput;
          let joinUsers = vm.usersTableData;
          let params = {
            eventName,
            eventTypeId,
            summary,
            eventStartDate,
            eventEndDate,
            showStartDate,
            showEndDate,
            eventAddr,
            pushData,
            unitCode,
            attachDoc,
            linkUrl,
            joinUsers
          };
          console.log(params);
          vm.$api.AddEvent(params).then(res => {
            if (res.data.success) {
              vm.addOrEditDialog = false;
              vm.$notify({
                title: "成功",
                type: "success",
                message: `成功${vm.addOrEdit}${eventName}`
              });
              vm.getEvents();
            } else {
              vm.addOrEditDialog = false;
              vm.$notify({
                title: "失敗",
                type: "error",
                message: `${vm.addOrEdit}失敗`
              });
            }
          });
        }
      }
    },
    async handleAddOrEdit(act, info) {
      const vm = this;
      if (vm.$refs.obs) {
        await vm.$refs.obs.reset();
      }

      if (act === "add") {
        vm.addOrEdit = "新增";
        vm.addOrEditDialog = true;
        vm.eventNameInput = "";
        vm.inputDescription = "";
        vm.eventCategorySelete = "";
        vm.showDate = [];
        vm.eventDate = [];
        vm.eventSiteInput = "";
        vm.eventUrlInput = "";
        vm.uploadUrl = [];
        vm.unit1 = "";
        vm.unit2 = "";
        vm.unit3 = "";
        vm.userNameSelect = "";
        vm.unitSelete = "";
        vm.rloeSelect = "";
        vm.usersTable = [];
        vm.$nextTick(() => {
          vm.$refs.upload.clearFiles();
        });
      } else {
        vm.addOrEdit = "編輯";
        vm.editEventId = info.Id;
        vm.$store.dispatch("loadingHandler", true);
        let params = {
          Id: info.Id
        };
        vm.$api.GetEventById(params).then(res => {
          let event = res.data.response;

          vm.$store.dispatch("loadingHandler", false);
          console.log(event);
          vm.showDate = [];
          vm.eventDate = [];
          vm.eventNameInput = event.EventName;
          vm.inputDescription = event.Summary;
          vm.uploadUrl = event.AttachDoc;
          vm.eventCategorySelete = event.EventTypeId;
          vm.showDate[0] = moment(event.ShowStartDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          vm.showDate[1] = moment(event.ShowEndDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          vm.eventDate[0] = moment(event.EventStartDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          vm.eventDate[1] = moment(event.EventEndDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          vm.eventSiteInput = event.EventAddr;
          vm.eventUrlInput = event.LinkUrl;
          vm.unitSelete = event.UnitCode;
          vm.unit1 = "";
          vm.unit2 = "";
          vm.unit3 = "";
          vm.userNameSelect = "";
          vm.rloeSelect = "";
          vm.usersTable = event.JoinUsers;
          vm.$nextTick(() => {
            vm.addOrEditDialog = true;
            vm.$nextTick(() => {
              vm.$refs.upload.clearFiles();
            });
          });
        });
      }
    },
    async changeHandler() {
      const vm = this;

      vm.$store.dispatch("loadingHandler", true);
      if (vm.$refs.obs2) {
        await vm.$refs.obs2.reset();
      }
      vm.changeMember = "";
      vm.newChangeMember = "";
      let eventIds = vm.eventIds;
      if (!eventIds) {
        vm.$store.dispatch("loadingHandler", false);
        vm.$notify({
          title: "失敗",
          type: "error",
          message: "請勾選欲替換人員之活動!"
        });
      } else {
        let params = {
          eventIds
        };
        vm.$api.GetJoinUserByEventIds(params).then(res => {
          console.log(res.data.response);
          vm.changeMemberData = res.data.response;
          vm.changeDialog = true;
          vm.$store.dispatch("loadingHandler", false);
        });
      }
    },
    async confirmChange() {
      const vm = this;
      const isValid = await vm.$refs.obs2.validate();
      if (!isValid) {
        vm.$notify({
          title: "失敗",
          type: "error",
          message: "請確認欄位是否正確填寫!"
        });
      } else {
        if (!vm.changeMember) {
          vm.$notify({
            title: "失敗",
            type: "error",
            message: "請確認欄位是否正確填寫!"
          });
        } else {
          let eventIds = vm.eventIds;
          let oldName = vm.changeMember;
          let newName = vm.newChangeMember;
          let params = { eventIds, oldName, newName };
          vm.$api.ChangeMember(params).then(res => {
            vm.changeDialog = false;
            console.log(res);
            vm.getEvents();
            vm.$notify({
              title: "成功",
              type: "success",
              message: `人員替換成功! ${res.data.response}。`
            });
          });
        }
      }
    },
    searchHandlerDate({ page, key, startDate, endDate }) {
      console.log(page, key, startDate, endDate);
      const vm = this;
      vm.searchLoading = true;
      vm.keyWordInput = key;
      vm.startDate = startDate;
      vm.endDate = endDate;
      let params = {
        key,
        page,
        startDate,
        endDate
      };
      vm.$api.SearchEvent(params).then(res => {
        vm.totalCount = res.data.response.dataCount;
        vm.pageSize = res.data.response.PageSize;
        // vm.eventsData = res.data.response.data;
        let arr = res.data.response.data;
        arr.map(event => {
          event.EventEndDate = moment(event.EventEndDate).format(
            "YYYY-MM-DD HH:mm"
          );
          event.EventStartDate = moment(event.EventStartDate).format(
            "YYYY-MM-DD HH:mm"
          );
          event.ShowEndDate = moment(event.ShowEndDate).format(
            "YYYY-MM-DD HH:mm"
          );
          event.ShowStartDate = moment(event.ShowStartDate).format(
            "YYYY-MM-DD HH:mm"
          );
        });
        vm.eventsData = arr;
        vm.searchLoading = false;
        vm.currentPage = 1;
      });
    },
    copyHandler(info) {
      console.log(info);
      const vm = this;
      vm.addOrEdit = "複製";
      vm.copyEventId = info.Id;
      vm.$store.dispatch("loadingHandler", true);
      let params = {
        Id: info.Id
      };
      vm.$api.GetEventById(params).then(res => {
        let event = res.data.response;

        vm.$store.dispatch("loadingHandler", false);
        console.log(event);
        vm.showDate = [];
        vm.eventDate = [];
        vm.eventNameInput = event.EventName;
        vm.inputDescription = event.Summary;
        vm.eventCategorySelete = event.EventTypeId;
        vm.uploadUrl = event.AttachDoc;
        vm.showDate[0] = moment(event.ShowStartDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        vm.showDate[1] = moment(event.ShowEndDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        vm.eventDate[0] = moment(event.EventStartDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        vm.eventDate[1] = moment(event.EventEndDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        vm.eventSiteInput = event.EventAddr;
        vm.eventUrlInput = event.LinkUrl;
        vm.unitSelete = event.UnitCode;
        vm.unit1 = "";
        vm.unit2 = "";
        vm.unit3 = "";
        vm.userNameSelect = "";
        vm.rloeSelect = "";
        vm.usersTable = event.JoinUsers;
        vm.$nextTick(() => {
          vm.addOrEditDialog = true;
          vm.$nextTick(() => {
            vm.$refs.upload.clearFiles();
          });
        });
      });
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
        if (vm.usersTableData.length == 0) {
          vm.$notify({
            title: "失敗",
            type: "error",
            message: "請確實新增參與人員!"
          });
        } else {
          let id = vm.editEventId;
          let eventName = vm.eventNameInput;
          let eventTypeId = vm.eventCategorySelete;
          let summary = vm.inputDescription;
          let eventStartDate = moment(vm.eventDate[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let eventEndDate = moment(vm.eventDate[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let showStartDate = moment(vm.showDate[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let showEndDate = moment(vm.showDate[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          let eventAddr = vm.eventSiteInput;
          let pushData = true;
          let unitCode = vm.unitSelete;
          let attachDoc = vm.uploadUrl;
          let linkUrl = vm.eventUrlInput;
          let joinUsers = vm.usersTableData;
          let params = {
            id,
            eventName,
            eventTypeId,
            summary,
            eventStartDate,
            eventEndDate,
            showStartDate,
            showEndDate,
            eventAddr,
            pushData,
            unitCode,
            attachDoc,
            linkUrl,
            joinUsers
          };
          console.log(params);
          vm.$api.EditEvent(params).then(res => {
            if (res.data.success) {
              vm.addOrEditDialog = false;
              vm.$notify({
                title: "成功",
                type: "success",
                message: `${eventName} 編輯成功`
              });
              vm.getEvents();
            } else {
              vm.addOrEditDialog = false;
              vm.$notify({
                title: "失敗",
                type: "error",
                message: `編輯失敗`
              });
            }
          });
        }
      }
    },
    hasBtn(btnType) {
      const vm = this;
      return this.buttonList.some(btn => btn.iconCls == btnType);
    },
    deleteHandler(event) {
      console.log(event);
      const vm = this;
      vm.$confirm(
        `確認刪除 ${event.EventName} (${event.EventTypeName}) ?`,
        "提示",
        {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let params = {
            id: event.Id
          };
          vm.$api.DeleteEvent(params).then(res => {
            vm.getEvents();
          });
          vm.$notify({
            title: "成功",
            type: "success",
            message: `${event.EventName} (${event.EventTypeName}) 删除成功`
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
    handleSelectionChange(val) {
      const vm = this;
      let arr = [];
      val.map(event => {
        arr.push(event.Id);
      });
      vm.eventIds = arr.join(",");
    },
    addOrEditConfirm() {
      this.addOrEditDialog = false;
      this.$notify({
        title: "成功",
        message: "添加成功",
        type: "success"
      });
    },
    getSearchDate(dateArr) {
      this.searchDate = dateArr;
    },
    scrollToTop() {
      this.$refs.scrollBox.wrap.scrollTop = 0;
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
    },
    querySearch(queryString, cb) {
      let allMembersDatas = this.allMembersData;
      let results = queryString
        ? allMembersDatas.filter(this.createFilter(queryString))
        : allMembersDatas;
      // 调用 callback 返回建议列表的数据
      cb(results);
      console.log(results);
    },
    createFilter(queryString) {
      return str => {
        return str.value.indexOf(queryString) === 0;
      };
    }
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    let routers = JSON.parse(window.localStorage.router)
      ? JSON.parse(window.localStorage.router)
      : [];
    this.getButtonList(this.$route.path, routers);
    this.getEvents();
    this.getEventType();
    this.getAllUser();
    await this.getUnits();
    this.$store.dispatch("loadingHandler", false);
  }
};
</script>

<style lang="scss">
.el-notification__closeBtn {
  display: none !important;
}
</style>
