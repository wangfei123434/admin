<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/systemserver/system/org/list"
    label-width="100px"
  >
    <template #query="{ query }">
      <el-form-item label="组织机构名称" prop="name">
        <el-input v-model="query.name"></el-input>
      </el-form-item>
      <el-form-item label="行政区划" prop="administrativeArea">
        <el-input v-model="query.administrativeArea"></el-input>
      </el-form-item>
      <el-form-item label="机构编码" prop="code">
        <el-input v-model="query.code"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <V-Delete
        :url="`/systemserver/system/org/delete/${selection.map(
          (item) => item.id
        )}`"
        :disabled="!selection.length"
        @finish="tableRef.onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column
      label="组织机构名称"
      prop="name"
      align="center"
    ></el-table-column>
    <el-table-column
      label="行政区划"
      prop="administrativeArea"
    ></el-table-column>
    <el-table-column label="机构编码" prop="code"></el-table-column>
    <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
    <el-table-column label="更新时间" prop="lastUpdated"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="onDetail(row)">详情</el-button>
        <el-button type="text" @click="onEditShow(row)">修改</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <v-form-dialog
    v-model="addVisible"
    v-model:model="model"
    title="新增组织机构"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="组织机构名称"
        prop="name"
        :rules="[{ required: true, message: '请输入组织机构名称' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="行政区划" prop="administrativeArea">
        <el-input v-model="model.administrativeArea"></el-input>
      </el-form-item>
      <el-form-item label="机构编码" prop="code">
        <el-input v-model="model.code"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="editVisible"
    v-model:model="model"
    title="组织机构信息"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="组织机构名称"
        prop="name"
        :rules="[{ required: true, message: '请输入组织机构名称' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="行政区划" prop="administrativeArea">
        <el-input v-model="model.administrativeArea"></el-input>
      </el-form-item>
      <el-form-item label="机构编码" prop="code">
        <el-input v-model="model.code"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
  <!-- 詳情 -->
  <v-form-dialog
    v-model="detailVisible"
    v-model:model="model"
    title="详情"
    :footer="false"
    @submit="onEdit"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="组织下部门列表" name="组织下部门列表">
        <V-Table :ref="(dom) => (tableRef1 = dom)" :data="data1">
          <template #button="{ selection }">
            <el-button
              type="danger"
              :disabled="!selection.length"
              @click="onCancelPart(selection)"
            >
              取消组织部门
            </el-button>
          </template>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="部门名称" prop="deptName"></el-table-column>
          <el-table-column
            label="创建时间"
            prop="dateCreated"
          ></el-table-column>
        </V-Table>
      </el-tab-pane>
      <el-tab-pane label="非组织下部门列表" name="非组织下部门列表">
        <V-Table :ref="(dom) => (tableRef2 = dom)" :data="data2">
          <template #button="{ selection }">
            <el-button
              type="primary"
              :disabled="!selection.length"
              @click="onAuditPart(selection)"
            >
              授权组织部门
            </el-button>
          </template>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="部门名称" prop="deptName"></el-table-column>
          <el-table-column
            label="创建时间"
            prop="dateCreated"
          ></el-table-column>
          <!-- <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="editPart(row)">修改</el-button>
              </template>
            </el-table-column> -->
        </V-Table>
      </el-tab-pane>
    </el-tabs>
  </v-form-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VCheckbox from "/@/components/VCheckbox.vue";
import VDelete from "/@/components/VDelete.vue";
import http from "../../config/http";
import { ElMessageBox, ElMessage } from "element-plus";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    VDelete,
  },
  setup() {
    const tableRef = ref<HTMLElement>();
    const tableRef1 = ref();
    const tableRef2 = ref();
    const state = reactive({
      activeName: "组织下部门列表",
      data1: [],
      data2: [],
    });
    const addVisible = ref(false);
    const model = ref({});
    const onAddShow = () => {
      model.value = {};
      addVisible.value = true;
    };
    const onAdd = (params: Record<string, any>, done: () => void) => {
      http
        .post("/systemserver/system/org/save", params, {
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
          "/systemserver/system/org/save",
          {
            id: params.id,
            administrativeArea: params.administrativeArea,
            code: params.code,
            name: params.name,
            version: params.version,
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
    const detailVisible = ref(false);
    // 查看詳情
    const onDetail = (params: Record<string, any>) => {
      detailVisible.value = true;
      http
        .get(`/systemserver/system/org/${params.id}`)
        .then((res) => {
          if (res && res.data) {
            model.value = res.data;
            getData(params.id);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      state.activeName = "组织下部门列表";
    };
    // 获取详情的数据
    const getData = (id: Record<string, any>) => {
      http
        .post("/systemserver/system/dept/deptList", {
          orgId: id,
        })
        .then((res) => {
          state.data1 = res.data ? res.data.list : [];
        });

      http
        .post("/systemserver/system/dept/deptUnAssignedList", {
          orgId: id,
        })
        .then((res) => {
          state.data2 = res.data.list ? res.data.list : [];
        });
    };
    // 取消用户权限
    const onCancelPart = (selection: any) => {
      http
        .get(
          `/systemserver/system/org/delete/${model.value.id}/${selection.map(
            (item: any) => item.id
          )}`
        )
        .then((res) => {
          if (res.status) {
            ElMessage.success({
              message: res.code,
              type: "success",
            });
            getData(model.value.id);
            tableRef2.value.onFresh();
          }
        })
        .catch((err) => {
          console.log(err);
          tableRef2.value.onFresh();
        });
    };
    // 授权用户
    const onAuditPart = (selection: any) => {
      http
        .get(
          `/systemserver/system/org/change/${model.value.id}/${selection.map(
            (item: any) => item.id
          )}`
        )
        .then((res) => {
          if (res.status) {
            ElMessage.success({
              message: res.code,
              type: "success",
            });
            getData(model.value.id);
            tableRef2.value.onFresh();
          }
        })
        .catch((err) => {
          console.log(err);
          tableRef2.value.onFresh();
        });
    };
    return {
      tableRef,
      ...toRefs(state),
      addVisible,
      detailVisible,
      onAddShow,
      onAdd,
      editVisible,
      model,
      onEditShow,
      onEdit,
      getData,
      tableRef1,
      tableRef2,
      onDetail,
      onCancelPart,
      onAuditPart,
    };
  },
});
</script>

<style lang="scss" scoped></style>
