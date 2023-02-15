<template>
  <el-form
    :ref="(el) => (formRef = el)"
    :model="Model"
    label-width="80px"
    v-bind="$attrs"
  >
    <slot :model="Model" />
    <slot
      v-if="$slots.footer"
      name="footer"
      :loading="loading"
      :submit="onSubmit"
    />
    <div v-else class="submit">
      <el-button :loading="loading" type="primary" @click="onSubmit">
        {{ confirmText }}
      </el-button>
      <el-button @click="$emit('cancel')">
        {{ cancelText }}
      </el-button>
    </div>
  </el-form>
</template>

<script lang="ts">
import { ref, defineComponent, toRefs } from "vue";
export default defineComponent({
  name: "VForm",
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
  },
  emits: ["submit", "cancel", "update:model"],
  setup: (props, { emit, slots }) => {
    const { model } = toRefs(props);
    const formRef = ref();
    const loading = ref(false);
    //内部model
    const Model = ref(model.value || {});
    const onSubmit = () => {
      if (formRef.value) {
        formRef.value.validate((valid: boolean | undefined) => {
          if (valid) {
            loading.value = true;
            emit("submit", Model.value, () => {
              loading.value = false;
            });
          }
        });
      }
    };
    return {
      formRef,
      Model,
      loading,
      onSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.submit {
  padding-top: 43px;
  display: flex;
  justify-content: flex-end;
}
</style>
