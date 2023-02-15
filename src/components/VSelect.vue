<template>
  <el-select
    v-model="Value"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 0.4)"
    :disabled="loading"
    :clearable="true"
    :popper-append-to-body="false"
    v-bind="$attrs"
    style="width: 100%"
    popper-class="custom"
    @click="onClick"
  >
    <template v-if="groupKey">
      <el-option-group
        v-for="group in Options"
        :key="group[0]"
        :label="group[0]"
      >
        <el-option
          v-for="item in group[1]"
          :key="item[fieldValue]"
          :label="item[fieldLabel]"
          :value="item[fieldValue]"
        />
      </el-option-group>
    </template>
    <el-option
      v-for="item in Options"
      v-else
      :key="item[fieldValue]"
      :label="item[fieldLabel]"
      :value="item[fieldValue]"
    />
  </el-select>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, Ref, ref, toRefs } from "vue";
import http from "../config/http";
export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    url: {
      type: String,
      default: "",
    },
    method: {
      type: String,
      default: "post",
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    //分组
    groupKey: {
      type: String,
      default: "",
    },
    //label
    fieldLabel: {
      type: String,
      default: "label",
    },
    //value
    fieldValue: {
      type: String,
      default: "value",
    },
    pageSize: {
      type: String,
      default: "30",
    },
    // 自定义改造
    custom: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    let options: { value: any[] };
    const { url, lazy } = toRefs(props);
    const loading = ref(false);
    const sortByGroup = (list: Record<string, any>[]) => {
      const res: Record<string, any> = {};
      list.forEach((item) => {
        let key = item[props.groupKey];
        res[key] = res[key] || [];
        res[key].push(item);
      });
      return Object.entries(res);
    };
    const fetch = () => {
      loading.value = true;
      const httpInstance = props.method == "post" ? http.post : http.get;
      httpInstance(url.value, {
        pageNum: "1",
        pageSize: props.pageSize,
      }).then((res) => {
        if (res && res.data) {
          const list = res.data.list || res.data;
          let l = props.groupKey ? sortByGroup(list) : list;
          if (props.custom) {
            options.value = l.map((e: any) => {
              return {
                value: e,
                label: e,
              };
            });
          } else {
            options.value = l;
          }
          nextTick(() => {
            loading.value = false;
          });
        }
      });
    };
    if (url.value) {
      options = ref(props.options);
      if (!lazy.value) fetch();
    } else {
      options = computed(() =>
        props.groupKey
          ? sortByGroup(props.options as Record<string, any>[])
          : props.options
      );
    }
    const Value = computed({
      get() {
        return props.modelValue;
      },
      set(v) {
        emit("update:modelValue", v);
      },
    });

    return {
      Value,
      Options: options,
      loading,
      onClick() {
        if (lazy.value && !options.value.length) {
          fetch();
        }
      },
    };
  },
});
</script>
