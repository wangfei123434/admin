<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/accountserver/backend/account/user/list"
    :parse="false"
  >
    <template #query="{ query }">
      <el-form-item label="姓名" prop="name" label-width="50px">
        <el-input v-model="query.name"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="query.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="query.mobile"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection, onFresh }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <V-Delete
        :url="`/accountserver/backend/account/user/delete/${selection.map(
          (item) => item.id
        )}`"
        :disabled="!selection.length"
        @finish="onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column label="手机号" prop="mobile"></el-table-column>
    <el-table-column label="身份证号" prop="idNumber"></el-table-column>
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
    title="新增个人用户"
    destroy-on-close
    @submit="onEdit"
  >
    <template #default="{ model }">
      <input type="password" style="height: 0" />
      <el-form-item
        label="姓名"
        prop="name"
        :rules="[{ required: true, message: '请输入姓名' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <el-input v-model="model.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="model.email"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="mobile"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <el-input v-model="model.mobile"></el-input>
      </el-form-item>
      <el-form-item
        label="证件类型"
        prop="idType"
        :rules="[{ required: true, message: '请选择证件类型' }]"
      >
        <el-select
          v-model="model.idType"
          placeholder="请选择证件类型"
          style="width: 100%"
        >
          <el-option label="身份证" value="0"></el-option>
          <el-option label="港澳台通行证" value="2"></el-option>
          <el-option label="护照" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="证件号"
        prop="idNumber"
        :rules="[{ required: true, message: '请输入证件号' }]"
      >
        <el-input v-model="model.idNumber"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="editVisible"
    v-model:model="model"
    title="角色信息"
    destroy-on-close
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="姓名"
        prop="name"
        :rules="[{ required: true, message: '请输入姓名' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="model.email"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="mobile"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <el-input v-model="model.mobile"></el-input>
      </el-form-item>
      <el-form-item
        label="证件类型"
        prop="idType"
        :rules="[{ required: true, message: '请选择证件类型' }]"
      >
        <el-select
          v-model="model.idType"
          placeholder="请选择证件类型"
          style="width: 100%"
        >
          <el-option label="身份证" value="0"></el-option>
          <el-option label="港澳台通行证" value="2"></el-option>
          <el-option label="护照" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="证件号"
        prop="idNumber"
        :rules="[{ required: true, message: '请输入证件号' }]"
      >
        <el-input v-model="model.idNumber"></el-input>
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
        .post("/accountserver/backend/account/user/save", params, {
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
          "/accountserver/backend/account/user/save",
          {
            id: params.id,
            name: params.name,
            email: params.email,
            mobile: params.mobile,
            idNumber: params.idNumber,
            password: params.password,
            idType: params.idType,
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
