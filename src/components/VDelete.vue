<template>
  <el-button type="danger" :loading="loading" v-bind="$attrs" @click="onDelete">
    删除
  </el-button>
</template>

<script lang="ts">
import { ElMessageBox } from "element-plus";
import { defineComponent, ref } from "vue";
import http from "../config/http";

export default defineComponent({
  props: {
    url: {
      type: String,
      default: "",
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    method: {
      type: String,
      default: "get",
    },
  },
  emits: ["finish"],
  setup(props, { emit }) {
    const loading = ref(false);
    const onDelete = () => {
      ElMessageBox.confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        loading.value = true;
        const httpInstance = props.method == "get" ? http.get : http.post;
        httpInstance(props.url, props.params, { message: true })
          .then((res) => {
            loading.value = false;
            emit("finish");
          })
          .catch(() => {
            loading.value = false;
          });
      });
    };
    return {
      loading,
      onDelete,
    };
  },
});
</script>

<style lang="scss" scoped></style>
