<template>
  <div id="userAuthority">
    <el-col :span="12" class="toolbar roles">
      <el-card class="box-card">
        <div slot="header" class="authorityHeader">
          <span>角色</span>
          <el-button style="padding: 3px 0" type="text">刷新</el-button>
        </div>
        <div
          v-for="role in rolesData"
          :key="role.Id"
          @click="operate(role.Id)"
          :class="role.Id == roleid ? 'active' : ''"
          class="text item role-item"
        >{{ role.Name }}</div>
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
            v-if="authorityData"
            :data="authorityData"
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
      ],
      rolesData: "",
      authorityData: ""
    };
  },
  methods: {
    async getAuthority() {
      const vm = this;
      let params = {
        needbtn: true
      };
      await vm.$api.GetAuthority(params).then(res => {
        vm.authorityData = res.data.response.children;
        console.log(vm.authorityData);
      });
    },
    getRoles() {
      const vm = this;
      vm.$api.GetAllRoles().then(res => {
        vm.rolesData = res.data.response;
      });
    },
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
  },
  async mounted() {
    this.$store.dispatch("loadingHandler", true);
    this.getRoles();
    await this.getAuthority();

    this.$store.dispatch("loadingHandler", false);
  }
};
</script>

<style lang="scss">
</style>
