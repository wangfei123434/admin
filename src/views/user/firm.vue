<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/accountserver/backend/account/enterprise/list"
    :parse="true"
    :cell-style="{ 'text-align': 'center' }"
  >
    <template #query="{ query }">
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="query.companyName"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input v-model="query.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="query.mobile"></el-input>
      </el-form-item>
      <el-form-item label="统一社会征信代码" prop="uscc" label-width="150px">
        <el-input v-model="query.uscc"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection, onFresh }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <V-Delete
        :url="`/accountserver/backend/account/enterprise/delete/?${selection
          .map(
            (item, index) =>
              ids + item.id + (index == selection.length - 1 ? '' : '&')
          )
          .join('')}`"
        :disabled="!selection.length"
        @finish="onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column
      label="企业名称"
      prop="companyName"
      align="center"
    ></el-table-column>
    <el-table-column
      label="统一社会征信代码"
      prop="uscc"
      align="center"
    ></el-table-column>
    <el-table-column label="法人" prop="name" align="center"></el-table-column>
    <el-table-column
      label="联系电话"
      prop="mobile"
      align="center"
    ></el-table-column>
    <el-table-column
      label="身份证号"
      prop="idNumber"
      align="center"
      width="150px"
    ></el-table-column>
    <el-table-column
      label="创建时间"
      prop="dateCreated"
      align="center"
    ></el-table-column>
    <el-table-column
      label="更新时间"
      prop="lastUpdated"
      align="center"
    ></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="onEditShow(row)">修改</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <v-form-dialog
    ref="addDialog"
    v-model="addVisible"
    v-model:model="model"
    title="新增企业用户"
    destroy-on-close
    label-width="150px"
    :button-loading="buttonLoading"
    @submit="onAdd"
  >
    <template #default="{ model }">
      <input type="password" style="height: 0" />
      <el-form-item
        label="企业名称"
        prop="companyName"
        :rules="[{ required: true, message: '请输入企业名称' }]"
      >
        <el-input v-model="model.companyName"></el-input>
      </el-form-item>
      <el-form-item
        label="社会统一征信代码"
        prop="uscc"
        :rules="[{ required: true, message: '请输入社会统一征信代码' }]"
      >
        <el-input v-model="model.uscc"></el-input>
      </el-form-item>
      <el-form-item
        label="单位注册所在地"
        prop="district"
        :rules="[{ required: true, message: '请选择单位注册所在地' }]"
      >
        <v-select
          v-model="model.district"
          url="/systemserver/system/org/per"
          method="get"
          :custom="true"
        ></v-select>
      </el-form-item>
      <el-form-item
        label="联系人"
        prop="name"
        :rules="[{ required: true, message: '请输入联系人' }]"
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
        label="联系电话"
        prop="mobile"
        :rules="[{ required: true, message: '请输入联系电话' }]"
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
    ref="addDialog"
    v-model="editVisible"
    v-model:model="model"
    title="企业信息"
    destroy-on-close
    label-width="150px"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="企业名称"
        prop="companyName"
        :rules="[{ required: true, message: '请输入企业名称' }]"
      >
        <el-input v-model="model.companyName"></el-input>
      </el-form-item>
      <el-form-item
        label="社会统一征信代码"
        prop="uscc"
        :rules="[{ required: true, message: '请输入社会统一征信代码' }]"
      >
        <el-input v-model="model.uscc"></el-input>
      </el-form-item>
      <el-form-item
        label="单位注册所在地"
        prop="district"
        :rules="[{ required: true, message: '请选择单位注册所在地' }]"
      >
        <v-select
          v-model="model.district"
          url="/systemserver/system/org/per"
          method="get"
          :custom="true"
        ></v-select>
      </el-form-item>
      <el-form-item
        label="联系人"
        prop="name"
        :rules="[{ required: true, message: '请输入联系人' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <!-- <el-form-item
        label="密码"
        prop="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <el-input v-model="model.password" type="password"></el-input>
      </el-form-item> -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="model.email"></el-input>
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="mobile"
        :rules="[{ required: true, message: '请输入联系电话' }]"
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
import VSelect from "/@/components/VSelect.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VCheckbox from "/@/components/VCheckbox.vue";
import VDelete from "/@/components/VDelete.vue";
import http from "../../config/http";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    VDelete,
    VSelect,
  },
  setup() {
    const addDialog = ref(null);
    const tableRef = ref<HTMLElement>();
    const state = reactive({ ids: "ids=" });
    const addVisible = ref(false);
    const model = ref({});
    const onAddShow = () => {
      addVisible.value = true;
      model.value = { district: "" };
    };

    const onAdd = (params: Record<string, any>, done: () => void) => {
      console.log(params);

      http
        .post(
          "/accountserver/backend/account/enterprise/save",
          Object.assign(params, { districtName: params.district }),
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
    const editVisible = ref(false);
    const onEditShow = (row: Record<string, any>) => {
      editVisible.value = true;
      model.value = { ...row };
    };
    const onEdit = (params: Record<string, any>, done: () => void) => {
      http
        .post(
          "/accountserver/backend/account/enterprise/save",
          {
            id: params.id,
            companyName: params.companyName,
            uscc: params.uscc,
            name: params.name,
            email: params.email,
            mobile: params.mobile,
            idNumber: params.idNumber,
            password: params.password,
            idType: params.idType,
            district: params.district,
            districtName: params.district,
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
          // done();
          (addDialog.value as any).setLoadingVal(done);
          // addDialog.value.setLoadingVal(false);
          return false;
        });
    };
    const buttonLoading = ref(false);

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
      addDialog,
      buttonLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.query {
  display: flex;
  flex-wrap: nowrap !important;
}
</style>
