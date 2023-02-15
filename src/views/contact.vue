<template>
  <v-table
    :ref="(dom) => (tableRef = dom)"
    url="/cmsserver/backend/comment/list"
    method="get"
  >
    <template #button="{ selection }">
      <V-Delete
        :url="`/cmsserver/backend/comment/deleteIds?ids=${selection
          .map((item) => item.id)
          .join(',')}`"
        :disabled="!selection.length"
        method="post"
        @finish="tableRef.onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="标题" prop="title"></el-table-column>
    <el-table-column label="发布人" prop="creator"></el-table-column>
    <el-table-column label="联系方式" prop="contact"></el-table-column>
    <el-table-column label="内容" prop="contents"></el-table-column>
    <el-table-column label="创建时间" prop="dateCreated">
      <template #default="{ row }">
        <span>{{ formDate(row.dateCreated) }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="toDetail(row)">详情</el-button>
      </template>
    </el-table-column>
  </v-table>
  <v-form-dialog
    v-model="showDetail"
    v-model:model="model"
    title="详情"
    :footer="false"
  >
    <template #default="{ model }">
      <div class="row">
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="发布人" prop="creator">
          <el-input v-model="model.creator" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="model.contact" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="内容" prop="contents">
          <el-input
            v-model="model.contents"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
    </template>
  </v-form-dialog>
</template>
<script>
import dayjs from "dayjs";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VDelete from "/@/components/VDelete.vue";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    VDelete,
  },
  setup() {
    const state = reactive({
      showDetail: false,
    });
    const tableRef = ref();
    const model = ref({});
    const toDetail = (row) => {
      model.value = row;
      state.showDetail = true;
    };
    const onAddShow = () => {
      state.showDetail = true;
    };
    return {
      ...toRefs(state),
      model,
      toDetail,
      tableRef,
      formDate(date) {
        return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      },
    };
  },
});
</script>
<style lang="scss" scoped>
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
</style>
