<template>
  <el-config-provider :locale="locale">
    <component :is="$route.meta?.layout || layout"></component>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import LayoutDefault from "./layout/default.vue";
import LayoutAdmin from "./layout/admin.vue";
import router from "./router";
import emitter from "./config/bus";
import { useStore } from "vuex";
import { ElConfigProvider } from "element-plus";
import zhcn from "element-plus/lib/locale/lang/zh-cn";
export default defineComponent({
  name: "App",

  components: {
    default: LayoutDefault,
    admin: LayoutAdmin,
    [ElConfigProvider.name]: ElConfigProvider,
  },
  setup() {
    // watch(route, () => {
    //   const { layout } = route.meta;
    //   layoutComponent.value = (layout as string) || "admin";
    // });
    const layout = ref();
    const router = useRouter();
    const store = useStore();
    router.beforeResolve((to) => {
      layout.value = localStorage.getItem("token") ? "admin" : "default";
    });
    onMounted(() => {
      emitter.on("tokenInvalid", (e) => {
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
        localStorage.setItem("orgId", "");

        store.commit("SET_ROUTERs", []);
        router.push("/login");
      });
    });
    let locale = zhcn;
    return {
      layout: layout,
      locale,
    };
  },
});
</script>

<style lang="scss">
@import "/@/style/common.css";
</style>
