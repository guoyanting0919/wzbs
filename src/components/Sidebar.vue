<template>
  <div id="sideBar">
    <!-- 有子節點 -->
    <template v-if="item.children">
      <!-- 當該父節點的path為'' or ' ' or '-' 且不是按鈕時 -->
      <el-submenu
        v-if="!(item.path!=''&&item.path!=' '&&item.path!='-')&&!item.IsButton"
        :index="item.id+'index'"
        :key="item.id"
      >
        <template slot="title">
          <i
            v-if="item.children&&item.children.length>0&&item.iconCls&&!item.IsButton"
            class="fa"
            :class="item.iconCls"
          ></i>
          <span class="title-name" slot="title" v-if="!isCollapse">{{item.name}}</span>
        </template>
        <!-- 渲染子層路由 -->
        <template v-for="child in item.children">
          <!-- 實現元件(sidbar)嵌套 當子層不隱藏且不是按鈕時 -->
          <template v-if="!child.IsHide&&!item.IsButton">
            <sidebar
              v-if="child.children&&child.children.length>0"
              :item="child"
              :index="child.id"
              :key="child.id"
            />
            <el-menu-item v-else :key="child.id" :index="child.path">
              <!-- {{child.name}}2 -->
              <i class="fa" :class="child.iconCls"></i>
              <template slot="title">
                <span class="title-name" slot="title">{{child.name}}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-submenu>
      <!-- 當父層有 path 時 -->
      <template v-else>
        <el-menu-item v-if="!item.IsButton" :index="item.path" :key="item.path+'d'">
          <i class="fa" :class="item.iconCls"></i>
          <template slot="title">
            <span class="title-name" slot="title">{{item.name}}</span>
          </template>
        </el-menu-item>
      </template>
    </template>
    <!-- 沒有子節點渲染 -->
    <template v-else>
      <el-menu-item :index="item.path" :key="item.id+'d'">
        <i class="fa" :class="item.iconCls"></i>
        <template slot="title">
          <span class="title-name" slot="title">{{item.name}}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      //   isCollapse: false
    };
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
      required: false
    },
    item: {
      type: Object,
      required: false
    }
  }
};
</script>

<style scoped lang='scss'>
</style>