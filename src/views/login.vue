<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="login-wrapper-left">
        <div class="title">
          <!-- <i></i> -->
          <h1 class="nanshen">人才安居管理系统</h1>
        </div>
        <img :src="Login" />
      </div>
      <div class="login-wrapper-right">
        <h2 class="bold">登录</h2>
        <V-Form
          class="login-form"
          label-width="0"
          size="medium"
          @submit="onSubmit"
        >
          <template #default="{ model }">
            <el-form-item
              class="login-form-item"
              prop="loginName"
              :rules="[{ required: true, message: '请输入用户名' }]"
            >
              <el-input
                v-model="model.loginName"
                name="username"
                placeholder="请输入用户名"
              >
                <template #prefix>
                  <i class="iconfont iconyonghuming-01" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              class="login-form-item"
              prop="password"
              :rules="[{ required: true, message: '请输入密码' }]"
            >
              <el-input
                v-model="model.password"
                name="password"
                type="password"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <i class="iconfont iconmima-01" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              class="login-form-item"
              prop="verifyCode"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <el-input v-model="model.verifyCode" placeholder="请输入验证码">
                <template #prefix>
                  <i class="el-icon-picture-outline" />
                </template>
              </el-input>
              <div style="width: 72px">
                <Code
                  :ref="(ref) => (codeRef = ref)"
                  v-model="model.paramCode"
                ></Code>
              </div>
            </el-form-item>
            <!-- <div class="forward">
              <a>忘记密码？</a>
            </div> -->
            <!-- <div class="register">
              还没有账号？
              <a>去注册</a>
            </div> -->
          </template>
          <template #footer="{ loading, submit }">
            <el-button
              type="primary"
              :loading="loading"
              class="submit medium"
              style="margin-top: 30px"
              @click.enter="submit"
            >
              登录
            </el-button>
          </template>
        </V-Form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import VForm from "/@/components/VForm.vue";
import { useRouter } from "vue-router";
import http from "../config/http";
import Code from "./components/Code.vue";
import store from "../store";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    VForm,
    Code,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const codeRef = ref<HTMLElement>(document.body);
    const onSubmit = (values: Record<string, any>, done: () => void) => {
      store.commit("SET_PSW", values.password);

      http
        .post("/systemserver/login/login", values, { message: true })
        .then((res) => {
          if (res) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("userId", res.user.id);

            localStorage.setItem("user", res.user.username);
            localStorage.setItem("orgId", res.user.orgId);
            router.push("/home");
            done();
          }
        })
        .catch((err) => {
          done();
          (codeRef.value as any).onFresh();
        });
    };
    return {
      onSubmit,
      codeRef,
    };
  },
});
</script>
<style lang="scss" scoped>
.login {
  flex: 1;
  overflow: hidden;
  background: linear-gradient(-90deg, #0058bb, #022a85);
  display: flex;
  justify-content: center;
  align-items: center;
  &-wrapper {
    width: 900px;
    height: 500px;
    background: linear-gradient(225deg, #1ec2ff, #2181f4);
    box-shadow: 0px 0px 30px 0px rgba(7, 39, 111, 0.5);
    border-radius: 4px;
    display: flex;
    &-left {
      width: 460px;
      padding: 48px 0 0 44px;
      .title {
        display: flex;
        margin-bottom: 21px;
      }
      i {
        width: 42px;
        margin-right: 11px;
      }
      h1 {
        font-size: 31px;
        text-shadow: 0px 0px 30px rgba(0, 92, 218, 0.5);
        letter-spacing: 6px;
      }
      p {
        padding-left: 54px;
        font-size: 14px;
        margin-bottom: 6px;
      }
    }
    &-right {
      background-color: #fff;
      flex: 1;
      padding: 30px;
      h2 {
        color: #333;
        font-size: 20px;
        border-left: 4px solid $main-color;
        padding-left: 12px;
        margin-left: -30px;
        margin-bottom: 5px;
      }
      .login-form {
        i {
          color: $second-color;
        }
        &-item {
          margin-top: 40px;
          margin-bottom: 0;
        }
        :deep(.el-form-item__content) {
          display: flex;
          .el-input__prefix,
          .el-input__suffix {
            display: flex;
            align-items: center;
          }
          input {
            border-top: none;
            border-left: none;
            border-right: none;
            border-radius: 0;
            font-size: 14px;
          }
        }
      }
      .forward {
        margin-top: 12px;
        display: flex;
        justify-content: flex-end;
        color: $main-color;
        font-size: 14px;
      }
      .register {
        margin-top: 45px;
        font-size: 14px;
        color: #666;
        a {
          color: $main-color;
        }
      }
      .submit {
        box-shadow: 0px 10px 20px 0px rgba(49, 106, 238, 0.3);
        height: 48px;
        width: 100%;
        border-radius: 4px;
        margin-top: 15px;
        background: linear-gradient(90deg, $main-color, $second-color);
        font-size: 18px;
      }
      .link {
        height: 48px;
        margin-top: 20px;
        border-radius: 4px;
        width: 100%;
        font-size: 18px;
        font-weight: 500;
      }
      .more {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        color: $main-color;
        margin-top: 17px;
      }
    }
  }
}
</style>
