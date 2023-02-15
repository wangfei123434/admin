<template>
  <slot></slot>
  <slot name="preview" :file="file"></slot>
</template>

<script lang="ts">
import { defineComponent, h, ref, VNode } from "vue";
import http from "../config/http";
import { Canceler } from "axios";
import { ElMessage } from "element-plus";
export default defineComponent({
  props: {
    type: {
      type: String,
      default: "download",
    },
    filename: {
      type: String,
      default: "",
    },
    method: {
      type: String,
      default: "get",
    },
    url: {
      type: String,
      required: true,
    },
    query: {
      type: Object,
      default: () => ({}),
    },
    text: {
      type: String,
      default: "导出",
    },
    fileType: {
      type: String,
      default: "",
    },
  },
  emits: ["preview"],
  setup(props, { slots, emit }) {
    const httpInstance = props.method == "get" ? http.get : http.post;
    if (slots.default) {
      const cancels: Canceler[] = [];
      const file = ref<any>(null);
      const onClick = () => {
        httpInstance(props.url, props.query, {
          responseType: "blob",
          aborts: cancels,
        })
          .then((res) => {
            const a = document.createElement("a");
            if (props.fileType) {
              a.href = URL.createObjectURL(
                new Blob([res as any], { type: props.fileType })
              );
            } else {
              a.href = URL.createObjectURL(res);
            }
            if (props.type == "download") {
              a.download = props.filename;
              a.click();
              setTimeout(() => {
                URL.revokeObjectURL(a.href);
              });
            } else if (props.type == "preview-target") {
              a.target = "_blank";
              a.click();
            } else if (props.type == "preview-slot") {
              file.value = a.href;
              emit("preview", a.href);
            }
          })
          .catch((msg = "") => {
            ElMessage.error(msg);
          });
      };
      const vNodes: VNode[] = slots.default();
      return () =>
        vNodes
          .map((vNode) => h(vNode, { onClick }))
          .concat(slots.preview ? slots.preview({ file: file.value }) : []);
    }
    return {};
  },
});
</script>
