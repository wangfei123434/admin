<template>
  <V-Table :ref="(dom) => (tableRef = dom)" url="systemserver/system/dept/page">
    <template #query="{ query }">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="query.deptName"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection, onFresh }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <V-Delete
        :url="`/systemserver/system/dept/delete/${selection.map(
          (item) => item.id
        )}`"
        :disabled="!selection.length"
        @finish="onFresh()"
      ></V-Delete>
    </template>

    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="部门ID" prop="id"></el-table-column>
    <el-table-column label="行政区划" prop="orgName"></el-table-column>
    <el-table-column label="部门名称" prop="deptName"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="onDetail(row)">详情</el-button>
        <el-button type="text" @click="onEditShow(row)">修改</el-button>
      </template>
    </el-table-column>
    <!-- <el-table-column type="expand">
      <template #default="{ row }">
        
      </template>
    </el-table-column> -->
  </V-Table>
  <v-form-dialog
    v-model="addVisible"
    v-model:model="model"
    title="新增部门"
    @submit="onAdd"
  >
    <template #default="{ model }">
      <el-form-item
        label="部门名称"
        prop="deptName"
        :rules="[{ required: true, message: '请输入部门名称' }]"
      >
        <el-input v-model="model.deptName"></el-input>
      </el-form-item>
      <el-form-item
        label="行政区划"
        prop="orgId"
        :rules="[{ required: true, message: '请输入行政区划' }]"
      >
        <v-select v-model="model.orgId" :options="areaList"></v-select>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="editVisible"
    v-model:model="model"
    title="修改部门信息"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="部门名称"
        prop="deptName"
        :rules="[{ required: true, message: '请输入部门名称' }]"
      >
        <el-input v-model="model.deptName"></el-input>
      </el-form-item>
      <el-form-item
        label="行政区划"
        prop="orgId"
        :rules="[{ required: true, message: '请输入行政区划' }]"
      >
        <v-select v-model="model.orgId" :options="areaList"></v-select>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="detailVisible"
    v-model:model="model"
    title="详情"
    :footer="false"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <div class="row">
        <el-form-item label="部门名称" label-width="80px">
          <el-input v-model="model.deptName" :readonly="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门名称" label-width="80px">
            <el-input v-model="model.deptName" :readonly="true"></el-input>
          </el-form-item> -->
      </div>

      <el-tabs v-model="activeName">
        <el-tab-pane label="用户列表" name="用户列表">
          <V-Table :ref="(dom) => (tableRef1 = dom)" :data="data1">
            <template #button="{ selection }">
              <el-button
                type="danger"
                :disabled="!selection.length"
                @click="onCancelPart(selection)"
              >
                取消用户部门
              </el-button>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="全名" prop="fullName"></el-table-column>
            <el-table-column label="手机号" prop="mobile"></el-table-column>
          </V-Table>
        </el-tab-pane>
        <el-tab-pane label="未分配用户列表" name="未分配用户列表">
          <V-Table :ref="(dom) => (tableRef2 = dom)" :data="data2">
            <template #button="{ selection }">
              <el-button
                type="primary"
                :disabled="!selection.length"
                @click="onAuditPart(selection)"
              >
                授权用户部门
              </el-button>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="全名" prop="fullName"></el-table-column>
            <el-table-column label="手机号" prop="mobile"></el-table-column>
            <!-- <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="editPart(row)">修改</el-button>
              </template>
            </el-table-column> -->
          </V-Table>
        </el-tab-pane>
      </el-tabs>
    </template>
  </v-form-dialog>
</template>
<script>
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  toRefs,
  watchEffect,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import VTable from "/@/components/VTable.vue";
import VDelete from "/@/components/VDelete.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VSelect from "/@/components/VSelect.vue";
import http from "../../config/http";
export default defineComponent({
  components: {
    VTable,
    VDelete,
    VFormDialog,
    VSelect,
  },
  setup() {
    const tableRef = ref();
    const tableRef1 = ref();
    const tableRef2 = ref();
    const state = reactive({
      activeName: "用户列表",
      data1: [],
      data2: [],
      areaList: [],
    });
    const model = ref({});
    const addVisible = ref(false);
    const onAddShow = () => {
      model.value = {};
      addVisible.value = true;
      partlist();
    };
    const editVisible = ref(false);
    const onEditShow = (row) => {
      editVisible.value = true;
      partlist();
      http.get(`/systemserver/system/dept/${row.id}`).then((res) => {
        if (res && res.data) {
          model.value = {
            ...res.data,
            orgId: res.data.orgList.length > 0 ? res.data.orgList[0].name : "",
          };
        }
      });
    };
    const onAdd = (params, done) => {
      console.log(params);
      http
        .post("/systemserver/system/dept/save", params, {
          message: true,
        })
        .then((res) => {
          done();
          tableRef.value.onFresh();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    };
    const onEdit = (params, done) => {
      http
        .post(
          "/systemserver/system/dept/save",
          {
            id: params.id,
            deptName: params.deptName,
            orgId: params.orgId,
          },
          {
            message: true,
          }
        )
        .then((res) => {
          done();
          tableRef.value.onFresh();
        })
        .catch(() => {
          done();
        });
    };
    const detailVisible = ref(false);
    const onDetail = (params) => {
      model.value = { ...params };
      detailVisible.value = true;
      state.activeName = "用户列表";
      getData(params.id);
    };
    const getData = (id) => {
      http
        .post("/systemserver/system/dept/userList", {
          deptId: id,
        })
        .then((res) => {
          state.data1 = res.data ? res.data.list : [];
        });

      http
        .post("/systemserver/system/dept/userUnAssignedList", {
          deptId: id,
        })
        .then((res) => {
          state.data2 = res.data.list ? res.data.list : [];
        });
    };
    const editPart = (row) => {
      console.log(row);
    };
    const onAuditPart = (selection) => {
      http
        .get(
          `/systemserver/system/dept/change/${selection.map(
            (item) => item.id
          )}/${model.value.id}`
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
    const onCancelPart = (selection) => {
      http
        .get(
          `/systemserver/system/dept/delete/${selection.map(
            (item) => item.id
          )}/${model.value.id}`
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
    // 获取行政区划列表
    const partlist = () => {
      http.post("/systemserver/system/org/listAll").then((res) => {
        state.areaList = res.data.map((value) => ({
          label: value.name,
          value: value.id,
          ...value,
        }));
      });
    };
    return {
      ...toRefs(state),
      tableRef,
      tableRef1,
      tableRef2,
      onAddShow,
      model,
      addVisible,
      editVisible,
      detailVisible,
      onEditShow,
      onEdit,
      onAdd,
      onDetail,
      getData,
      editPart,
      onAuditPart,
      onCancelPart,
      partlist,
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
