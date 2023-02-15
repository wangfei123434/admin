<template>
  <el-tabs class="tabs">
    <el-tab-pane label="创新人才申报">
      <NotFoundPage></NotFoundPage>
    </el-tab-pane>
    <el-tab-pane label="创业人才申报" :lazy="true">
      <NotFoundPage></NotFoundPage>
    </el-tab-pane>
    <el-tab-pane label="个人自荐" :lazy="true">
      <V-Table>
        <template #query="{ query }">
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
        </template>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="姓名" prop="" align="center"></el-table-column>
        <el-table-column label="性别" prop="" align="center"></el-table-column>
        <el-table-column label="出生日期" prop=""></el-table-column>
        <el-table-column label="工作单位" prop=""></el-table-column>
        <el-table-column
          label="专业技术职务"
          prop=""
          align="center"
        ></el-table-column>
        <el-table-column label="职务" prop="" align="center"></el-table-column>
        <el-table-column
          label="是否完成评选"
          prop=""
          align="center"
        ></el-table-column>
        <el-table-column
          label="复合评选意见"
          prop="dateCreated"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{}">
            <el-button type="text">认定</el-button>
          </template>
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="优秀青年人才申报" :lazy="true">
      <NotFoundPage></NotFoundPage>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotFoundPage from "/@/components/NotFoundPage.vue";
import VTable from "/@/components/VTable.vue";
export default defineComponent({
  components: {
    NotFoundPage,
    VTable,
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
