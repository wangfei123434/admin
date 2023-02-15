<template>
  <div id="el-menu" :style="{ width: cls.width }">
    <div class="header">
      <h1 class="nanshen">人才安居管理系统</h1>
    </div>
    <el-menu
      :unique-opened="true"
      class="el-menu"
      background-color="#021C4D"
      text-color="#fff"
      active-text-color="#fff"
      :router="true"
      :default-active="$route.path"
    >
      <template v-for="Router in asyncRouters">
        <el-submenu
          v-if="Router.children?.length"
          :key="Router.path"
          :index="Router.path"
        >
          <template #title>
            <i :class="['iconfont', Router.meta.icon]"></i>
            <span>{{ Router.meta.name }}</span>
          </template>
          <template v-for="item in Router.children" :key="item.path">
            <el-menu-item
              v-if="!item.meta.hidden"
              :index="Router.path + '/' + item.path"
            >
              {{ item.meta.name }}
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item v-else :key="Router.path" :index="Router.path">
          <i :class="['iconfont', Router.meta.icon]"></i>
          <template #title>{{ Router.meta.name }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
  <div class="wrapper">
    <div class="wrapper-top">
      <div class="wrapper-top-left">
        <button @click="switchIcon">
          <i v-if="isShow" style="font-size: 20px" class="el-icon-s-fold"></i>
          <i v-else style="font-size: 20px" class="el-icon-s-unfold"></i>
        </button>
        <template v-for="item in $route.matched">
          <span v-if="$route.path == item.path" :key="item.path">
            {{ item.meta?.name }}
          </span>
          <span v-else :key="item.path" @click="$router.push(item.path)">
            <a>{{ item.meta?.name }}</a>
            <i>/</i>
          </span>
        </template>
      </div>
      <div class="wrapper-top-right">
        人才安居管理系统
        <span>|</span>
        <el-dropdown type="primary">
          <span class="el-dropdown-link">
            {{ user }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="callout">
              <el-dropdown-item @click="logOut">退出</el-dropdown-item>
              <el-dropdown-item @click="(pswVisible = true), showPsw">
                修改密码
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <v-form-dialog
      v-model="pswVisible"
      v-model:model="model"
      title="修改密码"
      width="40%"
      @submit="changePsw"
    >
      <template #default="{ model }">
        <el-form-item
          label="原始密码"
          prop="oldPass"
          :rules="[
            { required: true, message: '请输入原始密码' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,16}$/,
              message: '请输入8-16位大小字母加数字的密码',
            },
          ]"
        >
          <el-input v-model="model.oldPass" type="password"></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPass"
          :rules="[
            { required: true, message: '请输入新密码' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,16}$/,
              message: '请输入8-16位大小字母加数字的密码',
            },
          ]"
        >
          <el-input v-model="model.newPass" type="password"></el-input>
        </el-form-item>
      </template>
    </v-form-dialog>
    <div class="wrapper-content">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { ElMessageBox, ElMessage } from "element-plus";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import http from "../config/http";
import VFormDialog from "/@/components/VFormDialog.vue";
import store from "../store";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    VFormDialog,
  },
  setup() {
    const isShow = ref(true);
    const cls = ref({ width: "300px" });
    const router = useRouter();
    const store = useStore();
    const pswVisible = ref(false);
    const model = ref({});
    const user = localStorage.getItem("user");
    const handleOpen = (key: string) => {
      key;
    };
    const handleClose = (key: string) => {
      key;
    };
    const logOut = () => {
      ElMessageBox.confirm("退出登录 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(
          (res) => {
            return http.post("/systemserver/login/loginOut");
          },
          () => {
            return new Promise(() => {
              console.log("");
            });
          }
        )
        .then((res) => {
          localStorage.setItem("token", "");
          localStorage.setItem("user", "");
          localStorage.setItem("orgId", "");

          store.commit("SET_ROUTERs", []);
          router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          localStorage.setItem("token", "");
          localStorage.setItem("user", "");
          store.commit("SET_ROUTERs", []);
          router.push("/login");
        });
    };
    const changePsw = (params: Record<string, any>, done: () => void) => {
      const id = localStorage.getItem("userId");
      const { newPass, oldPass } = params;
      http
        .get(
          `/systemserver/system/user/handleChangePwd/${id}/${oldPass}/${newPass}`
        )
        .then((res) => {
          if (res.status == true) {
            ElMessage.success({
              message: "修改密码成功",
              type: "success",
            });
          }
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    };
    const showPsw = () => {
      pswVisible.value = true;
    };
    const switchIcon = () => {
      isShow.value = !isShow.value;
      if (isShow.value) {
        cls.value.width = "300px";
      } else {
        cls.value.width = "0px";
      }
    };
    return {
      asyncRouters: computed(() => store.state.asyncRouters),
      logOut,
      changePsw,
      user,
      model,
      pswVisible,
      showPsw,
      cls,
      isShow,
      switchIcon,
    };
  },
});
</script>
<style lang="scss">
#el-menu {
  width: 264px;
  height: 100%;
  background-color: #021c4d;
  overflow-y: overlay;
  overflow-x: hidden;
  .el-menu {
    border: none;
  }
  .el-submenu__icon-arrow {
    color: #fff;
  }
  .header {
    /* height: 85px; */
    padding: 42px 0 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: 23px;
    }
  }
  i.iconfont {
    font-size: 24px;
    color: #fff;
    margin-right: 12px;
  }
  /*所有的标题*/
  .el-menu > .el-menu-item,
  .el-submenu__title {
    height: 80px;
    line-height: 80px;
    padding-left: 42px !important;
    font-size: 20px;
    font-family: "SourceHanSansCN-Medium";
  }
  /*标题激活*/
  .el-menu > .el-menu-item.is-active,
  .el-submenu.is-active .el-submenu__title {
    background-color: $main-color !important;
  }
  /*子标题*/
  .el-submenu .el-menu {
    padding-left: 30px !important;
  }
  .el-submenu.is-active .el-menu {
    background-color: #00256b !important;
  }
  .el-submenu .el-menu-item {
    height: 40px;
    margin: 12px 0;
    line-height: 40px;
    border-radius: 6px 0px 0px 6px;
    padding-left: 60px !important;
    font-size: 18px;
    font-family: "SourceHanSansCN-Bold";
    font-weight: normal;
    background-color: transparent !important;
    &:first-child {
      margin-top: 22px;
    }
    &:last-child {
      margin-bottom: 22px;
    }
  }
  .el-submenu .el-menu-item.is-active {
    background-color: #fff !important;
    color: $main-color !important;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      padding: auto;
      left: 29px;
      top: 15px;
      width: 10px;
      height: 10px;
      background-color: $main-color;
      border-radius: 50%;
    }
  }
}

.wrapper {
  width: calc(100vw - 264px);
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  background-color: rgba(241, 244, 249, 1);
  &-top {
    height: 48px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      color: #999;
      font-size: 16px;
      i {
        padding: 0 5px;
        font-style: normal;
      }
      span:last-child {
        color: #333;
      }
    }
    &-right {
      color: #333;
      padding-right: 15px;
      span {
        margin: 0 12px;
      }
    }
  }
  &-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 6px;
    overflow-y: auto;
    color: #333;
    padding: 20px;
  }
}
.callout {
  cursor: pointer;
}
</style>
