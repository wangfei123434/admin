<template>
  <!-- 已入选 -->
  <el-tabs class="tabs">
    <el-tab-pane label="创新人才">
      <v-table
        url="/talentserver/backend/talent/city/list"
        :query="{ types: ['lj1'], status: '3', year: '2019' }"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="申请区域"
          prop="org"
          align="center"
        ></el-table-column>
        <el-table-column
          label="申请人"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="申请类型" prop="type" align="center">
          <template #default="{ row }">
            <div v-for="(item, index) in typeList" :key="index">
              <a v-if="row.type == item.value">{{ item.label }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            {{
              row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="applyYear"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="200px"></el-table-column>
      </v-table>
    </el-tab-pane>
    <el-tab-pane label="创业人才" :lazy="true">
      <v-table
        url="/talentserver/backend/talent/city/list"
        :query="{ types: ['lj2'], status: '3', year: '2019' }"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="申请区域"
          prop="org"
          align="center"
        ></el-table-column>
        <el-table-column
          label="申请人"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="申请类型" prop="type" align="center">
          <template #default="{ row }">
            <div v-for="(item, index) in typeList" :key="index">
              <a v-if="row.type == item.value">{{ item.label }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            {{
              row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="applyYear"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="200px"></el-table-column>
      </v-table>
      <!-- <NotFoundPage></NotFoundPage> -->
    </el-tab-pane>
    <el-tab-pane label="优秀青年人才" :lazy="true">
      <v-table
        url="/talentserver/backend/talent/city/list"
        :query="{
          types: ['a1', 'a2', 'b1', 'b2', 'b3', 'c'],
          status: '3',
          year: '2019',
        }"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="申请区域"
          prop="org"
          align="center"
        ></el-table-column>
        <el-table-column
          label="申请人"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="申请类型" prop="type" align="center">
          <template #default="{ row }">
            <div v-for="(item, index) in typeList" :key="index">
              <a v-if="row.type == item.value">{{ item.label }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            {{
              row.gender == "male" ? "男" : row.gender == "female" ? "女" : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          prop="applyYear"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="200px"></el-table-column>
      </v-table>
      <!-- <NotFoundPage></NotFoundPage> -->
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import NotFoundPage from "/@/components/NotFoundPage.vue";
import VTable from "/@/components/VTable.vue";
export default defineComponent({
  components: {
    // NotFoundPage,
    VTable,
  },
  setup() {
    const state = reactive({
      typeList: [
        { label: "海内外知名高校博士类", value: "a1" },
        { label: "获得省级以上荣誉优秀毕业生类", value: "a2" },
        { label: "入选青年科技创新人才榜单类", value: "b1" },
        { label: "获得市级以上创业赛事大奖类", value: "b2" },
        { label: "创投机构举荐类", value: "b3" },
        { label: "用人单位举荐类", value: "c" },
        { label: "战略科技人才", value: "zl" },
        { label: "产业领军创新人才", value: "lj1" },
        { label: "产业领军创业人才", value: "lj2" },
      ],
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-tabs__content) {
    flex: 1;
    .el-tab-pane {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}

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
.exportWord {
  position: absolute;
  top: 60px;
  right: 20px;
}
.iconRight {
  display: flex;
  justify-content: flex-end;
}
</style>
