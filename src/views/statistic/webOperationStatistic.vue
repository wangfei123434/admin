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
    <el-tab-pane label="账号类" name="first" :lazy="true">
      <v-table
        :ref="(dom) => (tableRef1 = dom)"
        url="/accountserver/backend/account/screen/accountStatics"
        :query="query"
        :pagination="false"
        :parse="true"
        method="get"
      >
        <el-table-column
          label="类型"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="数量" prop="value" align="center">
          <template #default="{ row }">
            <a
              :class="{
                active:
                  row.name == '注册法人用户数量' ||
                  row.name == '注册自然人用户数量',
              }"
              @click="toPage(row.name)"
            >
              {{ row.value }}
            </a>
          </template>
        </el-table-column>
      </v-table>
    </el-tab-pane>
    <el-tab-pane label="申报类" name="second" :lazy="true">
      <v-table
        :ref="(dom) => (tableRef2 = dom)"
        url="/accountserver/backend/account/screen/reportStatics"
        :query="query"
        :pagination="false"
        method="get"
      >
        <el-table-column
          label="类型"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="数量"
          prop="value"
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
import http from "../../config/http";
import { useRouter } from "vue-router";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VDate,
    VTable,
  },
  setup() {
    const tableRef1 = ref();
    const tableRef2 = ref();
    const state = reactive({
      activeName: "first",
      query: {
        startDate: dayjs("2019-7-20").format("YYYY-MM-DD HH:mm:ss"),
        endDate: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      },
    });
    const router = useRouter();
    // 查询
    const onQuery = (activeName) => {
      if (activeName == "first") {
        tableRef1.value.onFresh();
      } else if (activeName == "second") {
        tableRef2.value.onFresh();
      }
    };
    const toPage = (val) => {
      if (val == "注册自然人用户数量") {
        router.push("/user/single");
      } else if (val == "注册法人用户数量") {
        router.push("/user/firm");
      } else {
        return;
      }
    };

    return {
      ...toRefs(state),
      onQuery,
      toPage,
      tableRef2,
      tableRef1,
    };
  },
});
</script>
<style lang="scss" scoped>
.query {
  margin-left: 30px;
}
.tabs {
  margin: 30px;
}
.active {
  color: $main-color;
  text-decoration: underline;
}
</style>
