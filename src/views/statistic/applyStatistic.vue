<template>
  <div>
    <v-date
      v-model:start="query.startDate"
      v-model:end="query.endDate"
    ></v-date>
    <el-button type="primary" class="query" @click="onQuery(activeName)">
      查询
    </el-button>
  </div>

  <el-tabs v-model="activeName" class="tabs">
    <el-tab-pane label="各区人才申报汇总统计" name="first" :lazy="true">
      <v-table
        :ref="(dom) => (tableRef1 = dom)"
        :query="query"
        method="get"
        url="/talentserver/backend/talent/screen/talentCount"
        :pagination="false"
        :page-size="100"
      >
        <template #button>
          <v-export
            :url="`/talentserver/backend/talent/screen/getTalentCountDetailExcel?startDate=${query.startDate}&endDate=${query.endDate}`"
            filename="各区人才申报汇总统计.xlsx"
          >
            <el-button type="primary">数据导出</el-button>
          </v-export>
        </template>
        <el-table-column
          label="行政区划"
          prop="org"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	海内外知名高校博士类"
          prop="a1"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	获得省级以上荣誉优秀毕业生类"
          prop="a2"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	入选青年科技创新人才榜单类"
          prop="b1"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	获得市级以上创业赛事大奖类"
          prop="b2"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	创投机构举荐类"
          prop="b3"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	用人单位举荐类"
          prop="c"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	创新人才数量"
          prop="lj1"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	用人单位举荐类"
          prop="lj2"
          align="center"
        ></el-table-column>
      </v-table>
    </el-tab-pane>
    <el-tab-pane label="各区人才申报明细情况" name="second" :lazy="true">
      <v-table
        :data="data1"
        method="get"
        :pagination="false"
        :span-method="objectSpanMethod"
        :page-size="100"
      >
        <template #button>
          <v-export
            :url="`/talentserver/backend/talent/screen/getTalentCountExcel?startDate=${query.startDate}&endDate=${query.endDate}`"
            filename="各区人才申报明细情况.xlsx"
          >
            <el-button type="primary">数据导出</el-button>
          </v-export>
        </template>
        <el-table-column
          label="行政区划"
          prop="org"
          align="center"
        ></el-table-column>
        <el-table-column
          label="状态"
          prop="step"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	海内外知名高校博士类"
          prop="a1"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	获得省级以上荣誉优秀毕业生类"
          prop="a2"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	入选青年科技创新人才榜单类"
          prop="b1"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	获得市级以上创业赛事大奖类"
          prop="b2"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	创投机构举荐类"
          prop="b3"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	用人单位举荐类"
          prop="c"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	创新人才数量"
          prop="lj1"
          align="center"
        ></el-table-column>
        <el-table-column
          label="	用人单位举荐类"
          prop="lj2"
          align="center"
        ></el-table-column>
      </v-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import dayjs from "dayjs";
import VDate from "/@/components/VDate.vue";
import VTable from "/@/components/VTable.vue";
import VExport from "/@/components/VExport.vue";
import http from "../../config/http";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VDate,
    VTable,
    VExport,
  },
  setup() {
    const tableRef1 = ref();
    const tableRef2 = ref();
    const state = reactive({
      activeName: "first",
      data1: [],
      query: {
        startDate: dayjs("2019-7-20").format("YYYY-MM-DD HH:mm:ss"),
        endDate: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      },
    });

    // 查询
    const onQuery = (activeName) => {
      if (activeName == "first") {
        tableRef1.value.onFresh();
      } else if (activeName == "second") {
        http
          .get(
            "/talentserver/backend/talent/screen/talentCountDetail",
            state.query
          )
          .then((res) => {
            handleData(res.data);
          });
      }
    };
    // 数据处理
    const handleData = (data) => {
      let arr = [];
      data.map((item, index) => {
        arr.push(...item.list);
      });
      state.data1 = arr;
    };
    // 合并单元格
    const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    };
    const getData = (active) => {
      http
        .get(
          "/talentserver/backend/talent/screen/talentCountDetail",
          state.query
        )
        .then((res) => {
          handleData(res.data);
        });
    };
    // 获取初始化的数据
    onMounted(() => {
      getData();
    });
    return {
      ...toRefs(state),
      onQuery,
      handleData,
      objectSpanMethod,
      tableRef1,
      tableRef2,
    };
  },
});
</script>
<style lang="scss" scoped>
.query {
  margin-left: 30px;
}

.tabs {
  flex: 1;
  overflow: hidden;
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
</style>
