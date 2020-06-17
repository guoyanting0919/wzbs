<template>
  <div id="tags" v-if="showTags">
    <div id="tags-view-container" class="tags-view-container">
      <ScrollPane ref="scrollPane" class="tagsContainer">
        <router-link
          v-for="(tag,index) in tagsList"
          ref="tag"
          :key="tag.path"
          :class="{'active': isActive(tag.path)}"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          @click.middle.native="closeTags(index)"
          class="tagsItem"
        >
          {{ tag.title }}
          <span class="el-icon-close" @click.prevent.stop="closeTags(index)" />
        </router-link>
      </ScrollPane>
    </div>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
export default {
  name: "Tags",
  components: {
    ScrollPane
  },
  data() {
    return {
      tagsList: []
    };
  },
  computed: {
    showTags() {
      if (this.tagsList.length > 1) {
        this.$store.commit("SAVE_TAG_DATA", JSON.stringify(this.tagsList));
      }
      return this.tagsList.length > 0;
    }
  },
  methods: {
    // 設置頁籤
    setTags(route) {
      if (!route.meta.NoTabPage) {
        const isExist = this.tagsList.some(item => {
          return item.path === route.fullPath;
        });
        !isExist &&
          this.tagsList.push({
            title: route.meta.title,
            path: route.fullPath
          });
      }
    },

    isActive(path) {
      return path === this.$route.fullPath;
    },
    closeTags(index) {
      //splice 會更改原陣列 並回傳刪除的"陣列"
      const delItem = this.tagsList.splice(index, 1)[0];
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path);

        this.$store.commit("SAVE_TAG_DATA", JSON.stringify(this.tagsList));
      } else {
        this.$router.push("/");
      }
    }
  },
  watch: {
    // 監聽 router 當 router 改變時觸發
    $route(newValue) {
      // console.log(newValue);
      this.setTags(newValue);

      const tags = this.$refs.tag;
      this.$nextTick(() => {
        if (tags) {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              //該 function 會將當前標籤顯示在標籤列中央(當螢幕寬度較小出現scrollBarX時)
              this.$refs.scrollPane.moveToTarget(tag, tags);
              break;
            }
          }
        }
      });
    }
  },
  created() {
    this.setTags(this.$route);
  },
  mounted() {
    let tags = sessionStorage.getItem("Tags")
      ? JSON.parse(sessionStorage.getItem("Tags"))
      : [];

    if (tags && tags.length > 0) {
      this.tagsList = tags;
    }
  }
};
</script>

<style>
</style>