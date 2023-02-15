<template>
  <v-table url="/cmsserver/talent/urlConfig/getAllArticle" method="get">
    <template #button>
      <el-button type="primary" @click="onEdit()">新增</el-button>
    </template>
    <el-table-column label="名称" prop="name" align="center"></el-table-column>
    <el-table-column label="连接" prop="url">
      <template #default="{ row }">
        <a :href="row.url">{{ row.url }}</a>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <el-button type="text" @click="onEdit(row)">修改</el-button>
      </template>
    </el-table-column>
  </v-table>

  <!-- 新增 vs 修改 -->
  <v-form-dialog
    v-model="visible"
    v-model:model="model"
    title="角色信息"
    @submit="onSubmit"
  >
    <template #default="{ model }">
      <el-form-item
        label="名称"
        prop="name"
        :rules="[{ required: true, message: '请输入名称' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="链接"
        prop="url"
        :rules="[{ required: true, message: '请输入链接' }]"
      >
        <el-input v-model="model.url"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
</template>
<script>
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import http from "../../config/http";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
  },
  setup() {
    const tableRef = ref();
    const model = ref({});
    const state = reactive({
      visible: false,
    });
    const onEdit = (row) => {
      if (row) {
        model.value = row;
        state.visible = row.id;
      } else {
        model.value = {};
        state.visible = true;
      }
    };
    const onSubmit = (params, done) => {
      console.log(model.value.id);
      http
        .post(
          "/cmsserver/talent/urlConfig/save",
          { id: model.value.id, name: model.value.name, url: model.value.url },
          { message: true }
        )
        .then((res) => {
          done();
          tableRef.value.onFresh();
        })
        .catch(() => {
          done();
        });
    };
    return {
      tableRef,

      ...toRefs(state),
      model,
      onEdit,
      onSubmit,
    };
  },
});
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: $main-color;
  cursor: pointer;
}
</style>
