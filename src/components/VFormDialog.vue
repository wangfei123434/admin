<template>
  <el-dialog
    v-model="visible"
    title="提示"
    :destroy-on-close="false"
    :append-to-body="true"
    v-bind="$attrs"
  >
    <el-form
      :ref="getRef"
      v-loading="fetchLoading"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.4)"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :disabled="disabled"
      :model="Model"
    >
      <slot :model="Model" :done="() => $emit('update:modelValue', false)" />
    </el-form>
    <template v-if="footer" #footer>
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ElFormItemContext } from "element-plus/lib/el-form";
import { computed, defineComponent, ref, toRefs } from "vue";
export default defineComponent({
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fetchLoading: {
      type: Boolean,
      default: false,
    },
    footer: {
      type: Boolean,
      default: true,
    },
    // buttonLoading: {
    //   type: Boolean,
    //   default: false,
    // },
    labelWidth: {
      type: String,
      default: "120px",
    },
    labelPosition: {
      type: String,
      default: "right",
    },
  },
  emits: ["submit", "update:modelValue", "update:model"],
  setup(props, { emit }) {
    const loading = ref(false);
    const formRef = ref<ElFormItemContext>();
    const getRef = (el: ElFormItemContext) => (formRef.value = el);
    const { modelValue, model } = toRefs(props);
    const visible = computed({
      set(value) {
        emit("update:modelValue", value);
      },
      get() {
        return modelValue.value;
      },
    });
    const Model = computed(() => model.value || {});
    const onSubmit = () => {
      if (!formRef.value) return false;
      formRef.value.validate((valid: boolean | undefined) => {
        if (valid) {
          loading.value = true;
          emit("submit", Model.value, (flag: any) => {
            loading.value = false;
            !flag && emit("update:modelValue", false);
          });
          return true;
        } else {
          return false;
        }
      });
    };
    const setLoadingVal = (done: any) => {
      // loading.value = done;
      done && done(true);
    };
    return {
      visible,
      loading,
      getRef,
      Model,
      onSubmit,
      setLoadingVal,
    };
  },
});
</script>
