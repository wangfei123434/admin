<template>
  <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
    <el-tab-pane
      v-for="(item, index) in tabList"
      :key="index"
      :label="item"
      :name="item"
    >
      <div v-if="index == 0" class="firstOne">
        <div class="leftOne">
          <el-button @click="onAddShow">新增</el-button>
          <el-button type="primary" @click="onEdit">修改</el-button>
          <el-button type="danger" @click="onDel">删除</el-button>

          <div class="treeBox">
            <el-tree
              :ref="(el) => (treeRef = el)"
              node-key="nodeKey"
              default-expand-all="true"
              :data="treeData"
              :props="defaultProps"
              highlight-current
              @current-change="currentChange"
            ></el-tree>
          </div>
        </div>
        <div class="rightOne">
          <el-button @click="onAddShow1">新增</el-button>

          <V-Table
            v-if="isVisible"
            :ref="(dom) => (tableRef = dom)"
            url="/rentserver/backend/dict/getChildrenDict"
            :query="{ fatherId }"
            label-width="50px"
            method="get"
          >
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              label="名称"
              prop="dictName"
              align="center"
            ></el-table-column>
            <el-table-column
              label="值"
              prop="otherValue"
              align="center"
            ></el-table-column>
            <el-table-column
              label="描述"
              prop="detail"
              align="center"
            ></el-table-column>
            <el-table-column
              label="时间"
              prop="time"
              align="center"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="text" @click="onEditShow(row)">修改</el-button>
                <el-button type="text" @click="onDelTable(row)">删除</el-button>
              </template>
            </el-table-column>
          </V-Table>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>

  <!-- 父  -->
  <v-form-dialog
    v-model="addVisible"
    v-model:model="model"
    title="新增"
    destroy-on-close
    @submit="onAdd"
  >
    <template #default="{ model }">
      <!-- <el-form-item label="上一级" prop="orgId">
        <v-select
          v-model="model.orgId"
          url="/systemserver/system/org/list"
          :lazy="true"
          field-label="name"
          field-value="id"
        ></v-select>
        <span class="red">若不选所属区域,则可以看所有区数据</span>
      </el-form-item> -->
      <el-form-item
        label="字典名称"
        prop="dictName"
        :rules="[{ required: true, message: '请输入字典名称' }]"
      >
        <el-input v-model="model.dictName"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="detail">
        <el-input v-model="model.detail"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>

  <!-- 子 -->
  <v-form-dialog
    v-model="addVisible1"
    v-model:model="model"
    title="新增"
    destroy-on-close
    @submit="onAdd1"
  >
    <template #default="{ model }">
      <el-form-item
        label="字典名称"
        prop="dictName"
        :rules="[{ required: true, message: '请输入字典名称' }]"
      >
        <el-input v-model="model.dictName"></el-input>
      </el-form-item>
      <el-form-item
        label="值"
        prop="otherValue"
        :rules="[{ required: true, message: '请输入值' }]"
      >
        <el-input v-model="model.otherValue"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="detail">
        <el-input v-model="model.detail"></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
</template>
<script lang="ts">
import { ElMessage } from "element-plus";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  toRefs,
  nextTick,
} from "vue";
import http from "../../config/http";
import { Canceler } from "axios";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
  },
  setup() {
    const cancels: Canceler[] = [];
    const treeRef = ref();
    const tableRef = ref();
    const model = ref({});
    // const model1 = ref({});
    const state = reactive({
      activeName: "字典管理",
      tabList: ["字典管理"],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        nodeKey: "nodeKey",
      },
      fatherId: "",
      tableData: [],
      tableQuery: { fatherId: "" },
      isVisible: true,

      addVisible: false,
      addVisible1: false,
    });

    const getTreeData = () => {
      http
        .get(
          `/rentserver/backend/dict/getParentDict?code=talentLevel`,
          {},
          { aborts: cancels }
        )
        .then((res) => {
          console.log(res);
          if (res && res.code == 200) {
            let d = res.data;
            let dd = d.map((e: any, i: number) => {
              return {
                ...e,
                label: e.dictName,
                isLeaf: false,
                nodeKey: i,
              };
            });
            state.treeData = [
              {
                nodeKey: -1,
                label: "人才类型",
                children: dd,
              },
            ];
            state.isVisible = false;

            nextTick(() => {
              treeRef.value.setCurrentKey(0);
              state.fatherId = dd[0].id;
              state.isVisible = true;
            });
          }
        });
    };
    getTreeData();

    const currentChange = (d: any, node: Node) => {
      // console.log(d, node, treeRef);
      if (d.id) {
        state.fatherId = d.id;
        state.isVisible = false;
        nextTick(() => {
          state.isVisible = true;
        });
      }
    };

    const onAddShow = () => {
      model.value = {};
      state.addVisible = true;
    };
    const onAdd = (params: Record<string, any>, done: () => void) => {
      http
        .post("/rentserver/backend/dict/save", {
          ...model.value,
          code: "talentlevel",
        })
        .then((res) => {
          if (res && res.code == 200) {
            ElMessage.success("操作成功");
            state.addVisible = false;
            getTreeData();

            done();
          }
        });
    };
    const onEdit = () => {
      let node = treeRef.value.getCurrentNode();
      let id = node.id;
      if (id) {
        model.value = {
          id: id,
          dictName: node.dictName,
          detail: node.detail,
        };
        state.addVisible = true;
      }
    };
    const onDel = () => {
      let node = treeRef.value.getCurrentNode();
      let id = node.id;
      if (id) {
        http
          .get("/rentserver/backend/dict/deleteParentDict", {
            fatherId: state.fatherId,
          })
          .then((res) => {
            if (res.code == 200) {
              ElMessage.success("删除成功");
              getTreeData();
            }
          });
      }
    };

    const onAddShow1 = () => {
      model.value = {};
      state.addVisible1 = true;
    };
    const onAdd1 = (params: Record<string, any>, done: () => void) => {
      http
        .post("/rentserver/backend/dict/save", {
          ...model.value,
          code: "talentlevel",
          fatherId: state.fatherId,
        })
        .then((res) => {
          if (res && res.code == 200) {
            ElMessage.success("操作成功");

            state.isVisible = false;
            state.addVisible1 = false;
            // getTreeData();

            nextTick(() => {
              let node = treeRef.value.getCurrentNode();
              state.fatherId = node.id;
              state.isVisible = true;
            });

            done();
          }
        });
    };
    const onDelTable = (row: any) => {
      console.log(row);
      let id = row.id;
      if (id) {
        http
          .get("/rentserver/backend/dict/deleteChildrenDict", {
            id,
          })
          .then((res) => {
            if (res && res.code == 200) {
              ElMessage.success("删除成功");
              state.isVisible = false;
              nextTick(() => {
                let node = treeRef.value.getCurrentNode();
                state.fatherId = node.id;
                state.isVisible = true;
              });
            }
          });
      }
    };
    const onEditShow = (row: any) => {
      let id = row.id;
      if (id) {
        model.value = {
          id: id,
          dictName: row.dictName,
          detail: row.detail,
          otherValue: row.otherValue,
        };
        state.addVisible1 = true;
      }
    };

    return {
      ...toRefs(state),
      treeRef,
      currentChange,
      tableRef,
      onAddShow,
      model,
      onAdd,
      onAddShow1,
      onAdd1,
      onEdit,
      onDel,
      onDelTable,
      onEditShow,
    };
  },
});
</script>
<style lang="scss" scoped>
.firstOne {
  width: 100%;
  min-height: 500px;
  display: flex;
  justify-content: space-between;
  .leftOne {
    flex: 2;
    border-right: 1px solid #000;

    .treeBox {
      padding: 20px;

      :deep(.is-leaf.el-tree-node__expand-icon) {
        display: none;
      }
      :deep(.el-tree-node) {
        margin: 10px 0;
      }
      :deep(.el-checkbox) {
        margin: 0 8px;
      }
      :deep(.is-current) {
        background: #f0f7ff;
      }
    }
  }
  .rightOne {
    flex: 6;
    padding-left: 20px;
  }
}
</style>
