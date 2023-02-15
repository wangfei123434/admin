<template>
  <el-checkbox-group v-model="result" v-loading="loading">
    <el-checkbox
      v-for="option in Options"
      :key="option[fieldValue]"
      :label="option[fieldValue]"
    >
      {{
        typeof fieldLabel == "string" ? option[fieldLabel] : fieldLabel(option)
      }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import http from "../config/http";

export default defineComponent({
  props: {
    url: {
      type: String,
      default: "",
    },
    fieldLabel: {
      type: [String, Function],
      default: "label",
    },
    fieldValue: {
      type: String,
      default: "value",
    },
    options: {
      type: Array,
      default: () => [],
    },
    pageSize: {
      type: String,
      default: "30",
    },
    modelValue: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const result = computed({
      set(value) {
        emit("update:modelValue", value);
      },
      get() {
        return props.modelValue;
      },
    });
    const loading = ref(false);
    const Options = ref(props.options);
    const fetch = () => {
      if (!props.url) return false;
      loading.value = true;
      http
        .post(props.url, {
          currentPage: "1",
          pageSize: props.pageSize,
        })
        .then((res) => {
          if (res && res.data) {
            const list = res.data.list;
            Options.value = list;
            nextTick(() => {
              loading.value = false;
            });
          }
        });
    };
    onMounted(() => {
      fetch();
    });
    return {
      result,
      Options,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped></style>
