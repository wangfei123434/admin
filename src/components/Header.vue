<template>
  <header
    id="header"
    :style="{
      'background-color': scroll ? 'rgba(44, 46, 48, 0.5)' : 'transparent',
    }"
  >
    <div class="header-content">
      <div class="header-left">
        <a>操作指南</a>
        <el-divider direction="vertical"></el-divider>
        <a>武汉市</a>
      </div>
      <h1>武汉市政商服务平台</h1>
      <div class="header-right">
        <a>个人登录</a>
        <el-divider direction="vertical"></el-divider>
        <a>法人登录</a>
        <el-divider direction="vertical"></el-divider>
        <a>政府登录</a>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

export default defineComponent({
  setup() {
    const scroll = ref<boolean>(false);
    const callback = () => {
      scroll.value =
        (document.body.scrollTop || document.documentElement.scrollTop) > 0;
    };
    onMounted(() => {
      window.addEventListener("scroll", callback);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", callback);
    });
    return {
      scroll,
    };
  },
});
</script>
<style lang="scss">
#header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: $header-height;
  transition: background-color 0.3s linear;

  .header-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: $main-width;
    height: 100%;
    margin: 0 auto 0;
    color: #fff;
    font-size: 16px;

    .header-right {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 290px;
      height: 32px;
      border: 1px solid currentColor;
      border-radius: 16px;
    }

    h1 {
      position: absolute;
      left: 50%;
      font-weight: normal;
      font-size: 24px;
      transform: translateX(-50%);
    }
  }
}

.el-divider.el-divider--vertical {
  height: 20px;
  margin: 0 16px;
  color: inherit;
  background-color: currentColor;
}
</style>
