<template>
  <NotFoundPage></NotFoundPage>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotFoundPage from "/@/components/NotFoundPage.vue";
export default defineComponent({
  components: {
    NotFoundPage,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-tabs__content) {
    flex: 1;
    .el-tab-pane {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}

.row {
  display: flex;
  margin: 0 -15px;
  > * {
    flex: 1;
    padding: 0 15px;
  }
  span {
    line-height: 36px;
  }
}
.exportWord {
  position: absolute;
  top: 60px;
  right: 20px;
}
.iconRight {
  display: flex;
  justify-content: flex-end;
}
</style>
