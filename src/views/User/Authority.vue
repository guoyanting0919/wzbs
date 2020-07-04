<template>
  <div id="userAuthority">
    <el-col :span="12" class="toolbar roles">
      <el-card class="box-card">
        <div slot="header" class="authorityHeader">
          <span>角色</span>
          <el-button style="padding: 3px 0" type="text" @click="refreshRoles">刷新</el-button>
        </div>
        <div
          v-for="role in rolesData"
          :key="role.Id"
          @click="getPermissionByRid(role.Id,role.Name)"
          :class="role.Id == roleid ? 'active' : ''"
          class="text item role-item"
        >{{ role.Name }}</div>
      </el-card>
    </el-col>

    <el-col :span="12" class="toolbar perms">
      <el-card class="box-card">
        <div slot="header" class="authorityHeader">
          <span>權限管理</span>
          <el-button @click="editHandler" style="padding: 3px 0" type="text">修改</el-button>
        </div>
        <div>
          <el-tree
            v-if="authorityData"
            :data="authorityData"
            @check="getCheckedKeys"
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
      roleName: "",
      permissionId: [],
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
    async getRoles() {
      const vm = this;
      await vm.$api.GetAllRoles().then(res => {
        vm.rolesData = res.data.response;
      });
    },
    async refreshRoles() {
      const vm = this;
      vm.$store.dispatch("loadingHandler", true);
      await vm.getRoles();

      vm.$store.dispatch("loadingHandler", false);
      vm.$alertM.fire({
        icon: "success",
        title: `角色列表刷新成功 ! `
      });
    },
    getPermissionByRid(id, name) {
      const vm = this;
      vm.$store.dispatch("loadingHandler", true);
      vm.roleid = id;
      vm.roleName = name;
      let rid = id;
      let params = {
        rid
      };
      vm.$api.GetPermissionByRid(params).then(res => {
        // console.log(res.data.response.permissionids);
        vm.permissionId = res.data.response.permissionids;
        vm.$nextTick(function() {
          this.$refs.tree.setCheckedKeys(vm.permissionId);
        });
        vm.$store.dispatch("loadingHandler", false);
      });
    },
    editHandler() {
      const vm = this;
      if (!vm.roleName) {
        vm.$alertM.fire({
          icon: "error",
          title: "請選擇欲修改角色 ! "
        });
      } else {
        vm.$swal({
          title: "修改提示",
          text: `確認修改角色 ${vm.roleName} 權限 ?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#2f3e52",
          cancelButtonColor: "#522f2f",
          confirmButtonText: "確定",
          cancelButtonText: "取消"
        }).then(result => {
          if (result.value) {
            vm.$store.dispatch("loadingHandler", true);
            let rid = vm.roleid;
            let pids = vm.$refs.tree.getCheckedKeys();
            let params = { rid, pids };
            console.log(params);
            vm.$api.EditPermissionByRid(params).then(res => {
              vm.$alertT.fire({
                icon: "success",
                title: `角色 ${vm.roleName} 權限修改成功 ! `
              });
              vm.$store.dispatch("loadingHandler", false);
            });
          } else {
            vm.$alertT.fire({
              icon: "warning",
              title: `已取消修改`
            });
          }
        });
      }
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
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
