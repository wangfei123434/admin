<template>
  <el-upload
    :before-remove="beforeRemove"
    :before-upload="beforeUpload"
    multiple
    :headers="headers"
    :on-exceed="handleExceed"
    :on-error="onError"
    :on-success="onSuccess"
    :with-credentials="true"
    :file-list="fileList"
    :disabled="loading"
    v-bind="$attrs"
    style="padding: 0"
  >
    <slot />
    <el-button
      v-if="!$slots.default"
      :loading="loading"
      :size="size"
      type="primary"
    >
      {{ text }}
    </el-button>
    <template #tip>
      <slot name="tip" />
    </template>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElMessage } from "element-plus";
export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array],
    },
    text: {
      type: String,
      default: "上传",
    },
    size: {
      type: String,
      default: "medium",
    },
    headers: {
      type: Object,
      default: () => ({
        Authorization: localStorage.getItem("token"),
      }),
    },
    // limit: {
    //   type: Number,
    //   default: 1,
    // },
    fileSize: {
      //单位kb
      type: Number,
      default: 5000,
    },
  },
  setup(props, { emit }) {
    const loading = ref(false);
    const fileList = ref([]);
    return {
      fileList,
      loading,
      beforeRemove(file, fileList) {
        // return ElMessageBox.confirm(`确定移除 ${file.name}？`);
      },
      handleExceed(files, fileList) {
        ElMessage.warning(
          `当前限制选择${props.limit}个文件，本次选择了 ${files.length} 个文件`
        );
      },
      onError(err: Error) {
        loading.value = false;
        ElMessage.error(err.message);
      },
      beforeUpload(file: File) {
        const size = props.fileSize;
        if (file.size > size * 1024) {
          const isMb = size > 1024;
          ElMessage.error(
            `文件不能大于${isMb ? (size / 1024).toFixed(2) : size}${
              isMb ? "mb" : "kb"
            }`
          );
          return false;
        }
        loading.value = true;
      },
      onSuccess(res: any, file: File, filelist: File[]) {
        loading.value = false;
        emit("finish");
        // emit("update:modelValue", res);
      },
    };
  },
});
</script>
