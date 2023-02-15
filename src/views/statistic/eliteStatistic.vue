<template>
  <v-table
    :ref="(dom) => (tableRef = dom)"
    :query="query"
    method="get"
    url="/talentserver/enterpriseTalentStatistics/getEnterpriseTalentStatisticses"
  >
    <template #query="{ query }">
      <el-form-item
        prop="unifiedCode"
        class="keyword"
        label-width="130PX"
        label="社会信用统一代码"
      >
        <el-input v-model="query.unifiedCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="companyName" class="keyword" label="单位名称">
        <el-input v-model="query.companyName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="contactor" class="keyword" label="联系人">
        <el-input v-model="query.contactor" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" class="keyword" label="手机号">
        <el-input v-model="query.mobile" placeholder="请输入"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection }">
      <el-button
        type="primary"
        @click="(checkDialog = true), (addForm = {}), onAddShow"
      >
        新增
      </el-button>
      <V-Delete
        :url="`/talentserver/enterpriseTalentStatistics/delete?${selection
          .map((item, index) => `talentIds=${item.id}`)
          .join('&')}`"
        :disabled="!selection.length"
        @finish="tableRef.onFresh()"
      ></V-Delete>
      <!-- <V-Import
        action="/gateway/talentserver/enterpriseTalentStatistics/batchimport"
        :show-file-list="false"
        @finish="tableRef.onFresh()"
      >
        <el-button type="primary">数据导入</el-button>
      </V-Import> -->
      <!-- <v-export
        url="/talentserver/enterpriseTalentStatistics/getDemo"
        filename="模板"
      >
        <el-button type="primary">下载模板</el-button>
      </v-export> -->
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column
      label="单位名称"
      prop="name"
      align="center"
    ></el-table-column>
    <el-table-column
      label="社会统一信用代码"
      prop="unifiedCode"
      align="center"
    ></el-table-column>
    <el-table-column
      label="职工总数"
      prop="staffCount"
      align="center"
    ></el-table-column>
    <el-table-column
      label="党员人数"
      prop="partyMemberCount"
      align="center"
    ></el-table-column>
    <el-table-column
      label="联系人"
      prop="contactor"
      align="center"
    ></el-table-column>
    <el-table-column
      label="手机号码"
      prop="mobile"
      align="center"
    ></el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <el-button
          type="text"
          @click="(checkDialog = row.id), (itemObj = row), (addForm = row)"
        >
          修改
        </el-button>
        <el-button
          type="text"
          @click="(checkDialog = 'detail'), (addForm = row)"
        >
          详情
        </el-button>
      </template>
    </el-table-column>
  </v-table>
  <!-- 新增 vs 修改  -->
  <VFormDialog
    v-model="checkDialog"
    width="60%"
    :model="addForm"
    :title="checkDialog == 1 ? '新增' : '详情'"
    :footer="checkDialog != 'detail'"
    @submit="onSubmitInfo"
  >
    <div class="row">
      <el-form-item label="单位名称：">
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="社会信用统一代码：" label-width="200px">
        <el-input v-model="addForm.unifiedCode"></el-input>
      </el-form-item>
    </div>
    <h2>学历分布</h2>
    <div class="row">
      <el-form-item label="大专人数：">
        <el-input v-model="addForm.collegeCount"></el-input>
      </el-form-item>
      <el-form-item label="本科人数：">
        <el-input v-model="addForm.regularCount"></el-input>
      </el-form-item>
      <el-form-item label="硕士人数：">
        <el-input v-model="addForm.masterCount"></el-input>
      </el-form-item>
      <el-form-item label="博士人数：">
        <el-input v-model="addForm.doctorCount"></el-input>
      </el-form-item>
    </div>
    <h2>专业技术职称</h2>
    <div class="row">
      <el-form-item label="中级职称：">
        <el-input v-model="addForm.intermediateTitle"></el-input>
      </el-form-item>
      <el-form-item label="高级职称：">
        <el-input v-model="addForm.seniorTitle"></el-input>
      </el-form-item>
      <el-form-item label="正高级职称：">
        <el-input v-model="addForm.superSeniorTitle"></el-input>
      </el-form-item>
    </div>
    <h2>技能人才</h2>
    <div class="row">
      <el-form-item label="技师：">
        <el-input v-model="addForm.technician"></el-input>
      </el-form-item>
      <el-form-item label="高级技师：">
        <el-input v-model="addForm.superTechnician"></el-input>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item label="职工总数：">
        <el-input v-model="addForm.staffCount"></el-input>
      </el-form-item>
      <el-form-item label="党员数：">
        <el-input v-model="addForm.partyMemberCount"></el-input>
      </el-form-item>
      <el-form-item label="联系人：">
        <el-input v-model="addForm.contactor"></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </div>
    <template v-if="checkDialog == 'detail'" #footer></template>
  </VFormDialog>
</template>
<script>
import VTable from "/@/components/VTable.vue";
import VDelete from "/@/components/VDelete.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VExport from "/@/components/VExport.vue";
import VImport from "/@/components/VImport.vue";
import http from "../../config/http";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
    VDelete,
    VFormDialog,
    // VExport,
    // VImport,
  },
  setup() {
    const tableRef = ref();
    const state = reactive({
      checkDialog: false,
      addForm: {},
      itemObj: {},
    });
    const onSubmitInfo = ({}, done) => {
      let params = Object.assign({}, { id: state.itemObj.id }, state.addForm);
      http
        .post(
          "/talentserver/enterpriseTalentStatistics/saveEnterpriseTalentStatistics",
          params
        )
        .then((res) => {
          tableRef.value.onFresh();
          state.checkDialog = false;
          done();
        })
        .catch(() => {
          state.checkDialog = false;
          done();
        });
    };
    return {
      tableRef,
      ...toRefs(state),
      onSubmitInfo,
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
h2 {
  font-style: italic;
  margin: 10px 0;
}
:deep(.el-form-item__content) {
  // margin-left: 100px !important;
}
</style>
