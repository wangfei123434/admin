<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/systemserver/system/permission/list"
  >
    <template #query="{ query }">
      <!-- <el-form-item label="所属权限" prop="parentName">
        <el-input v-model="query.parentName"></el-input>
      </el-form-item> -->
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="query.name"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="mask">
        <el-input v-model="query.mask"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <V-Delete
        :url="`/systemserver/system/permission/delete/${selection.map(
          (item) => item.id
        )}`"
        :disabled="!selection.length"
        @finish="tableRef.onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column
      label="所属权限"
      prop="parentName"
      align="center"
    ></el-table-column>
    <el-table-column label="权限名称" prop="name"></el-table-column>
    <el-table-column label="权限标识" prop="mask"></el-table-column>
    <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
    <el-table-column label="更新时间" prop="lastUpdated"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="onEditShow(row)">修改</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <v-form-dialog
    v-model="addVisible"
    v-model:model="model"
    title="新增权限"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="权限名称"
        prop="name"
        :rules="[{ required: true, message: '请输入角色名称' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="权限标识"
        prop="mask"
        :rules="[{ required: true, message: '请输入角色标识' }]"
      >
        <el-input v-model="model.mask"></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="model.url"></el-input>
      </el-form-item>
      <el-form-item label="CSS" prop="css">
        <el-input v-model="model.css"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="editVisible"
    v-model:model="model"
    title="权限管理信息"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="权限名称"
        prop="name"
        :rules="[{ required: true, message: '请输入角色名称' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="权限标识"
        prop="mask"
        :rules="[{ required: true, message: '请输入角色标识' }]"
      >
        <el-input v-model="model.mask"></el-input>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="model.url"></el-input>
      </el-form-item>
      <el-form-item label="CSS" prop="css">
        <el-input v-model="model.css"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VCheckbox from "/@/components/VCheckbox.vue";
import VDelete from "/@/components/VDelete.vue";
import http from "../../config/http";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    VDelete,
  },
  setup() {
    const tableRef = ref<HTMLElement>();
    const state = reactive({});
    const addVisible = ref(false);
    const model = ref({});
    const onAddShow = () => {
      model.value = {};
      addVisible.value = true;
    };
    const onAdd = (params: Record<string, any>, done: () => void) => {
      http
        .post("/systemserver/system/permission/save", params, {
          message: true,
        })
        .then((res) => {
          done();
          (tableRef.value as any).onFresh();
        })
        .catch(() => {
          done();
        });
    };
    const editVisible = ref(false);
    const onEditShow = (row: Record<string, any>) => {
      editVisible.value = true;
      model.value = { ...row };
    };
    const onEdit = (params: Record<string, any>, done: () => void) => {
      http
        .post(
          "/systemserver/system/permission/save",
          {
            id: params.id,
            name: params.name,
            mask: params.mask,
            url: params.url,
            css: params.css,
          },
          {
            message: true,
          }
        )
        .then((res) => {
          done();
          (tableRef.value as any).onFresh();
        })
        .catch(() => {
          done();
        });
    };
    return {
      tableRef,
      ...toRefs(state),
      addVisible,
      onAddShow,
      onAdd,
      editVisible,
      model,
      onEditShow,
      onEdit,
    };
  },
});
</script>
<style lang="scss" scoped></style>
