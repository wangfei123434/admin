<template>
  <img :src="src" style="height: 36px; cursor: pointer" @click="onFresh" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import http from "../../config/http";

export default defineComponent({
  props: {
    modelVale: String,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const src = ref("");
    let loading = false;
    const onFresh = () => {
      if (loading) return false;
      loading = true;
      http.get("/accountserver/login/getPictureCode").then((res) => {
        loading = false;
        const { base64Img, paramCode } = res as any;
        src.value = `data:image/png;base64,${base64Img}`;
        emit("update:modelValue", paramCode);
      });
    };
    onMounted(() => {
      onFresh();
    });
    return {
      src,
      onFresh,
    };
  },
});
</script>
