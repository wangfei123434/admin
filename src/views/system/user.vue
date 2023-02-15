<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/systemserver/system/user/list"
    label-width="50px"
  >
    <template #query="{ query }">
      <el-form-item label="账号" prop="username">
        <el-input v-model="query.username"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <V-Delete
        :url="`/systemserver/system/user/delete/${selection.map(
          (item) => item.id
        )}`"
        :disabled="!selection.length"
        @finish="tableRef.onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column
      label="账号"
      prop="username"
      align="center"
    ></el-table-column>
    <el-table-column label="角色" prop="roleName"></el-table-column>
    <el-table-column label="姓名" prop="fullName"></el-table-column>
    <el-table-column label="所属区划" prop="orgName"></el-table-column>
    <el-table-column label="所属部门" prop="deptName"></el-table-column>
    <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
    <el-table-column label="更新时间" prop="lastUpdated"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="onEditShow(row)">修改</el-button>
        <el-button type="text" @click="onEditRoles(row)">角色</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <v-form-dialog
    v-model="addVisible"
    v-model:model="model"
    title="新增用户信息"
    @submit="onAdd"
  >
    <template #default="{ model }">
      <input type="password" name="password" style="height: 0" />
      <el-form-item
        label="账号"
        prop="username"
        :rules="[{ required: true, message: '请输入账号' }]"
      >
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="fullName">
        <el-input v-model="model.fullName"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
            message: '密码必须由8-16位大写字母,小写字母,数字组成',
          },
        ]"
      >
        <el-input v-model="model.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="model.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="model.email"></el-input>
      </el-form-item>
      <el-form-item label="所属区域" prop="orgId">
        <v-select
          v-model="model.orgId"
          url="/systemserver/system/org/list"
          :lazy="true"
          field-label="name"
          field-value="id"
        ></v-select>

        <span class="red">请选择所属区域</span>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <v-select v-model="model.deptId" :options="deptArr"></v-select>
        <span v-if="deptArr.length <= 0" class="red">
          请先到部门管理配置该组织下的所属部门
        </span>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="editVisible"
    v-model:model="model"
    title="修改用户信息"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item label="账号" prop="username">
        <el-input v-model="model.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="fullName">
        <el-input v-model="model.fullName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="model.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="model.email"></el-input>
      </el-form-item>
      <el-form-item
        label="所属区域"
        prop="orgId"
        :rules="[{ required: true, message: '请选择所属区域' }]"
      >
        <v-select
          v-model="model.orgId"
          url="/systemserver/system/org/list"
          field-label="name"
          field-value="id"
        ></v-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <v-select v-model="model.deptId" :options="deptArr"></v-select>
        <span v-if="deptArr.length <= 0" class="red">
          请先到部门管理配置该组织下的所属部门
        </span>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="roleVisible"
    v-model:model="model"
    title="用户角色"
    :fetch-loading="!model.id"
    @submit="onRolesSubmit"
  >
    <template #default="{ model }">
      <el-form-item
        label="账号"
        class="model"
        prop="username"
        label-width="80px"
      >
        <el-input
          v-model="model.username"
          :disabled="true"
          size="medium"
          class="username"
        ></el-input>
      </el-form-item>

      <V-Table
        id="innerTable"
        :ref="(dom) => (tableRef1 = dom)"
        url="/systemserver/system/role/list"
        :query="{ id: model.id }"
        @selection-change="handleSelectionChange"
        @fetch-success="onSuccess"
      >
        <template #query="{ query }">
          <el-form-item prop="name" label="角色名称" class="name">
            <el-input v-model="query.name" placeholder="请输入"></el-input>
          </el-form-item>
        </template>
        <el-table-column width="55">
          <template #default="scope">
            <el-form-item prop="roles">
              <input v-model="scope.row.id" type="checkbox" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column type="selection"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
        <el-table-column label="标记" prop="mask"></el-table-column>
      </V-Table>

      <!-- <el-form-item label="角色" prop="roles">
        <v-checkbox
          v-model="model.roles"
          url="/systemserver/system/role/list"
          page-size="3000"
          field-label="name"
          field-value="id"
        ></v-checkbox>
      </el-form-item> -->
    </template>
  </v-form-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  nextTick,
  onMounted,
  watch,
  watchEffect,
} from "vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VSelect from "/@/components/VSelect.vue";
// import VCheckbox from "/@/components/VCheckbox.vue";
import VDelete from "/@/components/VDelete.vue";
import http from "../../config/http";
import { Canceler } from "axios";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    VSelect,
    // VCheckbox,
    VDelete,
  },
  setup(prop, content) {
    const tableRef = ref<HTMLElement>();
    const tableRef1 = ref<HTMLElement>();

    const state = reactive({
      data1: [],
      deptArr: [],
      roleList: [],
    });
    const addVisible = ref(false);
    const model = ref({});
    const onAddShow = () => {
      model.value = {};
      addVisible.value = true;
    };
    const onAdd = (params: Record<string, any>, done: () => void) => {
      http
        .post("/systemserver/system/user/save", params, {
          message: true,
        })
        .then((res) => {
          localStorage.setItem("orgId", params.orgId);
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
      //修改调用详情接口
      http
        .get(`/systemserver/system/user/${row.id}`, {}, { aborts: cancels })
        .then((res) => {
          if (res && res.data) {
            state.roleList = res.data.roles;
            model.value = {
              ...res.data,
              deptId:
                res.data.depts.length > 0 ? res.data.depts[0].deptName : "",
            };
            if (!res.data.orgId) {
              model.value.orgId = "864181926267715584";
            }
          }
        });
    };
    watch(
      () => model.value.orgId,
      (newValue, oldValue) => {
        if (oldValue && oldValue != newValue) {
          model.value.deptId = "";
        }
        console.log(model.value);

        http
          .post(
            "/systemserver/system/dept/deptList",
            {
              orgId: model.value.orgId,
            },
            {
              message: false,
            }
          )
          .then((res) => {
            state.deptArr = res.data.list.map((value: any) => ({
              label: value.deptName,
              value: value.id,
              ...value,
            }));
          });
      }
    );

    const onEdit = (params: Record<string, any>, done: () => void) => {
      const { id, fullName, mobile, email, orgId, deptId } = params;
      let userName = localStorage.getItem("user");
      let flag = false;
      if (userName == model.value.username) {
        flag = true;
      } else {
        flag = false;
      }
      http
        .post(
          "/systemserver/system/user/save",
          {
            id,
            fullName,
            mobile,
            email,
            orgId,
            deptId,
          },
          {
            message: true,
          }
        )
        .then((res) => {
          localStorage.setItem(
            "orgId",
            flag && params.orgId == "864181926267715584" ? "" : params.orgId
          );
          done();
          (tableRef.value as any).onFresh();
        })
        .catch(() => {
          done();
        });
    };
    //角色
    const roleVisible = ref(false);
    const cancels: Canceler[] = [];
    const onEditRoles = (row: Record<string, any>) => {
      roleVisible.value = true;
      http
        .get(`/systemserver/system/user/${row.id}`, {}, { aborts: cancels })
        .then((res) => {
          if (res && res.data) {
            model.value = {
              ...res.data,
              roles:
                res.data.roles.length > 0
                  ? res.data.roles.map((item: any) => item.id)
                  : [],
              orgId:
                res.data.orgId == "" ? "864181926267715584" : res.data.orgId,
            };
            console.log(model.value);
          }
          (tableRef1.value as any).onFresh();
        })
        .catch();
    };
    const selection = ref<any[]>([]);
    const handleSelectionChange = (val: Record<string, any>[]) => {
      selection.value = val;
      state.roleList = selection.value.map((item) => item.id);
      console.log(state.roleList);
    };
    watch(
      () => model.value.roles,
      (newValue, oldValue) => {
        if (newValue != oldValue) {
          state.roleList = newValue;
        }
      }
    );
    const onSuccess = (
      list: any[],
      ref: { toggleRowSelection: (row: any, bool: boolean) => void }
    ) => {
      nextTick(() => {
        list?.forEach((item) => {
          ref?.toggleRowSelection(
            item,
            model.value.roles ? model.value.roles.includes(item.id) : false
          );
        });
      });
    };
    const onRolesSubmit = (params: Record<string, any>, done: () => void) => {
      const { id } = params;
      const roles = state.roleList;

      http
        .get(
          `/systemserver/system/user/assign/${id}/${
            roles.length > 0 ? roles.join(",") : "undefined"
          }`,
          {},
          { message: true }
        )
        .then((res) => {
          done();
          (tableRef.value as any).onFresh();
        })
        .catch(done);
    };
    // 获取角色列表

    return {
      selection,
      tableRef,
      tableRef1,
      ...toRefs(state),
      addVisible,
      onAddShow,
      onAdd,
      editVisible,
      model,
      onEditShow,
      onEdit,
      roleVisible,
      onEditRoles,
      onRolesSubmit,
      handleSelectionChange,
      onSuccess,
    };
  },
});
</script>

<style lang="scss" scoped>
.red {
  color: #ff5d5d;
}
:deep(.username) {
  width: 184px !important;
}
:deep(.query .name) {
  position: absolute;
  top: 86px;
  left: 300px;
}
</style>
