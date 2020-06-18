<template >
  <div id="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :pager-count="5"
      :current-page="setCurrentPage"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
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
    currentPage: {
      type: Number,
      default: 1,
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
      this.setCurrentPage = page;
      let key = this.$props.keyWord;
      this.$emit("getEventType", page, key);
    }
  }
};
</script>

<style lang='scss'>
</style>