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
    <el-tab-pane label="已提交认定企业" name="first" :lazy="true">
      <v-table
        :ref="(dom) => (tableRef1 = dom)"
        url="/accountserver/backend/enterprisePool/listByIsAudit?isAudit=1"
        method="get"
        :query="query"
        @fetch-success="onSuccess"
      >
        <template #button>
          <v-export
            :url="`/accountserver/backend/enterprisePool/getEnterpriseExcel?startDate=${query.startDate}&endDate=${query.endDate}&isAudit=1&pageSize=${total}`"
            filename="已提交认定企业.xlsx"
          >
            <el-button type="primary">数据导出</el-button>
          </v-export>
        </template>
        <!-- <el-table-column
            label="序号"
            prop="id"
            align="center"
          ></el-table-column> -->
        <el-table-column
          label="企业名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="统一社会信用代码"
          prop="usccName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="企业类型"
          prop="type"
          align="center"
        ></el-table-column>
        <el-table-column
          label="所在区域"
          prop="districtName"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
          </template>
        </el-table-column>
      </v-table>
    </el-tab-pane>
    <el-tab-pane label="已认定通过企业" name="second" :lazy="true">
      <v-table
        :ref="(dom) => (tableRef2 = dom)"
        url="/accountserver/backend/enterprisePool/listByIsAudit?isAudit=2"
        method="get"
        :query="query"
        @fetch-success="onSuccess"
      >
        <template #button>
          <v-export
            :url="`/accountserver/backend/enterprisePool/getEnterpriseExcel?startDate=${query.startDate}&endDate=${query.endDate}&isAudit=2&pageSize=${total}`"
            filename="已认定通过企业.xlsx"
          >
            <el-button type="primary">数据导出</el-button>
          </v-export>
        </template>
        <!-- <el-table-column
            label="序号"
            prop="id"
            align="center"
          ></el-table-column> -->
        <el-table-column
          label="企业名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="统一社会信用代码"
          prop="usccName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="企业类型"
          prop="type"
          align="center"
        ></el-table-column>
        <el-table-column
          label="所在区域"
          prop="districtName"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
          </template>
        </el-table-column>
      </v-table>
    </el-tab-pane>
  </el-tabs>

  <!-- 详情 -->
  <v-form-dialog
    v-model="detailVisible"
    v-model:model="model"
    label-position="top"
    title="详细信息"
    @submit="(_, done) => done()"
  >
    <template #default="{ model }">
      <div class="row">
        <el-form-item label="企业名称" prop="name">
          <el-input
            v-model="model.name"
            :value="model.name"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位类型" prop="type">
          <el-input
            v-model="model.type"
            :value="model.type"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="address">
          <el-input v-model="model.address" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="单位联系人" prop="contactor">
          <el-input v-model="model.contactor" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="单位联系人手机号码" prop="contactorMobile">
          <el-input v-model="model.contactorMobile" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="法人代表" prop="represent">
          <el-input v-model="model.represent" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="单位注册时间" prop="registerDate">
          <el-input v-model="model.registerDate" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="实到注册资金(万元)" prop="registerCapitcal">
          <el-input
            v-model="model.registerCapitcal"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否上市" prop="isOnsale">
          <el-input
            :model-value="model.isOnsale ? '是' : '否'"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否为高新企业或高品备案企业" prop="isHighTech">
          <el-input
            :model-value="model.isHighTech ? '是' : '否'"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="主营业务" prop="major">
          <el-input
            v-model="model.major"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
    </template>
  </v-form-dialog>
</template>
<script>
import dayjs from "dayjs";
import VDate from "/@/components/VDate.vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VExport from "/@/components/VExport.vue";
import http from "../../config/http";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VDate,
    VTable,
    VFormDialog,
    VExport,
  },
  setup() {
    const tableRef1 = ref();
    const tableRef2 = ref();
    const model = ref({});
    const state = reactive({
      detailVisible: false,
      activeName: "first",
      query: {
        startDate: dayjs("2019-7-20").format("YYYY-MM-DD HH:mm:ss"),
        endDate: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      },
      total: null,
    });
    // 查询
    const onQuery = (activeName) => {
      if (activeName == "first") {
        tableRef1.value.onFresh();
      } else if (activeName == "second") {
        tableRef2.value.onFresh();
      }
    };

    const onDetailShow = (row) => {
      state.detailVisible = true;
      model.value = row;
    };
    // 分頁
    const onSuccess = (list, ref, total) => {
      state.total = total;
      console.log(total);
    };
    return {
      ...toRefs(state),
      onQuery,
      onDetailShow,
      model,
      tableRef1,
      tableRef2,
      onSuccess,
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
