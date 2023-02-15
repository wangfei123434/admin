<template>
  <el-date-picker
    v-model="timeRange"
    :default-time="[
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59),
    ]"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    format="YYYY-MM-DD"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from "vue";
import dayjs from "dayjs";
export default defineComponent({
  props: {
    start: {
      type: String,
      default: "",
    },
    end: {
      type: String,
      default: "",
    },
  },
  emits: ["update:start", "update:end"],
  setup(props, { emit }) {
    const { start, end } = toRefs(props);
    const timeRange = computed({
      set(range: Date[]) {
        if (range) {
          const [startTime, endTime] = range;
          const start = dayjs(startTime).format("YYYY-MM-DD HH:mm:ss");
          const end = dayjs(endTime).format("YYYY-MM-DD HH:mm:ss");
          emit("update:start", start);
          emit("update:end", end);
        } else {
          emit("update:start", "");
          emit("update:end", "");
        }
      },
      get() {
        if (start.value && end.value) {
          return [new Date(start.value), new Date(end.value)];
        } else {
          return [];
        }
      },
    });
    return {
      timeRange,
    };
  },
});
</script>
