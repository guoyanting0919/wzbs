<template>
  <div id="userAuthority">
    <el-col :span="12" class="toolbar roles">
      <el-card class="box-card">
        <div slot="header" class="authorityHeader">
          <span>角色</span>
          <el-button style="padding: 3px 0" type="text">刷新</el-button>
        </div>
        <div
          v-for="o in roles"
          :key="o.Id"
          @click="operate(o.Id)"
          :class="o.Id == roleid ? 'active' : ''"
          class="text item role-item"
        >{{ o.Name }}</div>
      </el-card>
    </el-col>

    <el-col :span="12" class="toolbar perms">
      <el-card class="box-card">
        <div slot="header" class="authorityHeader">
          <span>權限管理</span>
          <el-button style="padding: 3px 0" type="text">保存</el-button>
        </div>
        <div>
          <el-tree
            :data="data5"
            show-checkbox
            node-key="value"
            ref="tree"
            default-expand-all
            :expand-on-click-node="true"
            :props="defaultProps"
          ></el-tree>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
// import tree from ''
import ogTree from "../../assets/tree.json";
export default {
  name: "UserAuthority",
  data() {
    return {
      ogTree,
      roleid: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      roles: [
        {
          Name: "Super_Admin",
          Id: 1
        },
        {
          Name: "Admin",
          Id: 2
        },
        {
          Name: "Master",
          Id: 3
        },
        {
          Name: "User",
          Id: 4
        }
      ]
    };
  },
  methods: {
    operate(id) {
      this.roleid = id;
      this.$refs.tree.setCheckedKeys([23, 35]);
    }
  },
  computed: {
    data5() {
      let data = this.ogTree.response.children;
      return JSON.parse(JSON.stringify(data));
    }
  }
};
</script>

<style lang="scss">
</style>
