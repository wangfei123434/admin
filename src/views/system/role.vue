<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/systemserver/system/role/list"
  >
    <template #query="{ query }">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="query.name"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="mask">
        <el-input v-model="query.mask"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection, onFresh }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <V-Delete
        :url="`/systemserver/system/role/delete/${selection.map(
          (item) => item.id
        )}`"
        :disabled="!selection.length"
        @finish="onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column
      label="角色名称"
      prop="name"
      align="center"
    ></el-table-column>
    <el-table-column label="角色标识" prop="mask"></el-table-column>
    <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
    <el-table-column label="更新时间" prop="lastUpdated"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="onEditShow(row)">修改</el-button>
        <el-button type="text" @click="onPermShow(row)">权限</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <v-form-dialog
    v-model="addVisible"
    v-model:model="model"
    title="新增角色"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="角色名称"
        prop="name"
        :rules="[{ required: true, message: '请输入角色名称' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="角色标识"
        prop="mask"
        :rules="[{ required: true, message: '请输入角色标识' }]"
      >
        <el-input v-model="model.mask"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="editVisible"
    v-model:model="model"
    title="角色信息"
    @submit="onEdit"
  >
    <template #default="{ model }">
      <el-form-item
        label="角色名称"
        prop="name"
        :rules="[{ required: true, message: '请输入角色名称' }]"
      >
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item
        label="角色标识"
        prop="mask"
        :rules="[{ required: true, message: '请输入角色标识' }]"
      >
        <el-input v-model="model.mask"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="permVisible"
    v-model:model="model"
    title="角色权限"
    :fetch-loading="!model.id"
    @submit="onPermSubmit"
  >
    <template #default="{ model }">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="model.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          :ref="(el) => (treeRef = el)"
          class="th-leaf"
          :data="data"
          show-checkbox
          highlight-current
          node-key="id"
          :expand-on-click-node="false"
          :default-checked-keys="model.permissions"
          :props="defaultProps"
          @check-change="getChecked"
        ></el-tree>
      </el-form-item>
    </template>
  </v-form-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VCheckbox from "/@/components/VCheckbox.vue";
import VDelete from "/@/components/VDelete.vue";
import http from "../../config/http";
import { Canceler } from "axios";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    // VCheckbox,
    VDelete,
  },
  setup() {
    const tableRef = ref<HTMLElement>();
    const treeRef = ref();
    const state = reactive({
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: (data: any, node: any) => {
          if (node.childNodes === 2) {
            return true;
          }
        },
      },
    });
    const addVisible = ref(false);
    const model = ref({});
    const onAddShow = () => {
      model.value = {};
      addVisible.value = true;
    };
    // 获取权限数据
    const getData = () => {
      http
        .post(
          "/systemserver/system/permission/list",
          { pageSize: 1000 },
          {
            message: false,
          }
        )
        .then((res) => {
          const data = res.data.list;
          let arr: any = [],
            arr1: any = [];
          data.forEach((item: Record<string, any>, index: any) => {
            if (item.parentId == "") {
              arr1 = data.filter((i: Record<string, any>, index: any) => {
                return i.parentId == item.id;
              });
              arr.push((item = Object.assign({}, item, { children: arr1 })));
            }
          });
          state.data = arr;
        })
        .catch((err) => {
          console.log("error");
        });
    };
    const onAdd = (params: Record<string, any>, done: () => void) => {
      http
        .post("/systemserver/system/role/save", params, {
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
          "/systemserver/system/role/save",
          {
            id: params.id,
            name: params.name,
            mask: params.mask,
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

    const permVisible = ref(false);
    const cancels: Canceler[] = [];
    const onPermShow = (row: Record<string, any>) => {
      permVisible.value = true;
      model.value = { permissions: null };
      getData();
      http
        .get(`/systemserver/system/role/${row.id}`, {}, { aborts: cancels })
        .then((res) => {
          if (res && res.data) {
            model.value = {
              ...row,
              permissions: res.data.permissions.map(
                (item: Record<string, any>) => {
                  if (
                    (item.method == "0" && item.parentId == "") ||
                    item.method == ""
                  ) {
                    return item.id;
                  }
                }
              ),
            };
          }
        });
    };
    const getChecked = () => {
      model.value.permissions = treeRef.value.getCheckedNodes();
    };
    const onPermSubmit = (params: Record<string, any>, done: () => void) => {
      const { id, permissions } = params;
      console.log(params);
      let arr: any = [];
      if (permissions.length > 0) {
        permissions.forEach((item: any) => {
          if (item.parentId || item.parentId == "") {
            if (item.parentId != "") {
              arr.push(item.parentId);
            }
            arr.push(item.id);
          }
        });
      }
      arr = Array.from(new Set(arr));
      http
        .get(
          `/systemserver/system/role/assign/${id}/${
            permissions.length > 0 ? arr.join(",") : "undefined"
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
    // onMounted(() => {

    // });
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
      permVisible,
      onPermShow,
      onPermSubmit,
      getChecked,
      treeRef,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.is-leaf.el-tree-node__expand-icon) {
  display: none;
}
:deep(.el-tree-node) {
  margin: 10px 0;
}
:deep(.el-checkbox) {
  margin: 0 8px;
}
</style>
