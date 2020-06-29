<template >
  <div id="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :pager-count="5"
      :current-page="setCurrentPage"
      :page-size="pageSize"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import moment from "moment";
import store from "../store/index";
export default {
  name: "Pagination",
  data() {
    return {
      //   currentPage: 1
    };
  },
  props: {
    total: {
      type: Number,
      default: 1,
      required: true
    },
    keyWord: {
      type: String,
      default: "",
      required: false
    },
    start: {
      type: String,
      default: "",
      required: false
    },
    end: {
      type: String,
      default: "",
      required: false
    },
    currentPage: {
      type: Number,
      default: 1,
      required: false
    },
    pageSize: {
      type: Number,
      default: 10,
      required: false
    }
  },
  computed: {
    setCurrentPage: {
      get() {
        return this.$props.currentPage;
      },
      set() {}
    }
  },
  methods: {
    handleCurrentChange(page) {
      store.dispatch("loadingHandler", true);
      this.setCurrentPage = page;
      if (!this.$props.end) {
        // console.log("NOEND");
        let key = this.$props.keyWord;
        this.$emit("changePage", page, key);
        window.scrollTo(0, 0);
      } else {
        console.log("END");
        let key = this.$props.keyWord;
        console.log(key);
        let startDate = this.$props.start;
        let endDate = this.$props.end;
        this.$emit("changePage", page, key, startDate, endDate);
        window.scrollTo(0, 0);
      }
    }
  }
};
</script>

<style lang='scss'>
</style>