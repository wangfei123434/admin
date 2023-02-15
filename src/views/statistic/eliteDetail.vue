<template>
  <v-table
    :ref="(dom) => (tableRef = dom)"
    :query="query"
    method="get"
    url="/talentserver/talent/statistic/getTalentStatisticsList"
  >
    <template #query="{ query }">
      <el-form-item prop="identity" label="身份证号">
        <el-input v-model="query.identity" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="nameLike" label="姓名">
        <el-input v-model="query.nameLike" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="degree" label="学历学位">
        <el-input v-model="query.degree" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="联系电话">
        <el-input v-model="query.phone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="enterpriseName" label="单位名称">
        <el-input
          v-model="query.enterpriseName"
          placeholder="请输入"
        ></el-input>
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
        :url="`/talentserver/talent/statistic/delete?${selection
          .map((item, index) => `talentIds=${item.id}`)
          .join('&')}`"
        :disabled="!selection.length"
        @finish="tableRef.onFresh()"
      ></V-Delete>
      <!-- <V-Import
        action="/gateway/talentserver/talent/statistic/batchimport"
        :show-file-list="false"
        @finish="tableRef.onFresh()"
      >
        <el-button type="primary">数据导入</el-button>
      </V-Import>
      <v-export url="/talentserver/talent/statistic/getDemo" filename="模板">
        <el-button type="primary">下载模板</el-button>
      </v-export> -->
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column
      label="性别"
      prop="gender"
      align="center"
    ></el-table-column>
    <el-table-column
      label="出生日期"
      prop="birthday"
      align="center"
    ></el-table-column>
    <el-table-column
      label="身份证号"
      prop="identity"
      align="center"
    ></el-table-column>
    <el-table-column
      label="学历学位"
      prop="degree"
      align="center"
    ></el-table-column>
    <el-table-column
      label="毕业院校"
      prop="school"
      align="center"
    ></el-table-column>
    <el-table-column
      label="本人联系电话"
      prop="phone"
      align="center"
    ></el-table-column>
    <el-table-column
      label="单位名称"
      prop="enterpriseName"
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
  <!-- 新增 vs 修改 
   -->
  <VFormDialog
    v-model="checkDialog"
    width="60%"
    :model="addForm"
    :title="checkDialog == 1 ? '新增' : '详情'"
    :footer="checkDialog != 'detail'"
    @submit="onSubmitInfo"
  >
    <div class="row">
      <el-form-item
        label="单位名称："
        :rules="[{ required: true, message: '请输入单位名称' }]"
      >
        <i class="red">（请填写完整的单位名称，且单位必须在人才服务网注册）</i>
        <el-input v-model="addForm.enterpriseName"></el-input>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item
        label="姓名："
        :rules="[{ required: true, message: '请输入姓名' }]"
      >
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="性别："
        :rules="[{ required: true, message: '请输入性别' }]"
      >
        <el-input v-model="addForm.gender"></el-input>
      </el-form-item>
      <el-form-item
        label="出生日期："
        :rules="[{ required: true, message: '请选择日期' }]"
      >
        <el-date-picker
          v-model="addForm.birthday"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="国籍："
        :rules="[{ required: true, message: '请输入国籍' }]"
      >
        <el-input v-model="addForm.nationality"></el-input>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item
        label="政治面貌："
        :rules="[{ required: true, message: '请输入政治面貌' }]"
      >
        <el-input v-model="addForm.politic"></el-input>
      </el-form-item>
      <el-form-item
        label="身份证号："
        :rules="[{ required: true, message: '请输入身份证号' }]"
      >
        <el-input v-model="addForm.identity"></el-input>
      </el-form-item>
      <el-form-item
        label="学历学位："
        :rules="[{ required: true, message: '请输入学历学位' }]"
      >
        <el-input v-model="addForm.degree"></el-input>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item
        label="毕业院校："
        :rules="[{ required: true, message: '请输入毕业院校' }]"
      >
        <el-input v-model="addForm.school"></el-input>
      </el-form-item>
      <el-form-item
        label="专业方向："
        :rules="[{ required: true, message: '请输入专业方向' }]"
      >
        <el-input v-model="addForm.major"></el-input>
      </el-form-item>
      <el-form-item
        label="专业技术职称："
        :rules="[{ required: true, message: '请输入专业技术职称' }]"
      >
        <el-input v-model="addForm.technicalTitle"></el-input>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item
        label="工作单位及职务："
        :rules="[{ required: true, message: '请输入工作单位及职务' }]"
      >
        <el-input v-model="addForm.companyPost"></el-input>
      </el-form-item>
      <el-form-item
        label="本人联系电话："
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <el-input v-model="addForm.phone"></el-input>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item
        label="高层次人才荣誉级别："
        :rules="[{ required: true, message: '选择高层次人才荣誉级别' }]"
      >
        <VSelect v-model="addForm.highLevelType" :options="levelList"></VSelect>
      </el-form-item>
      <el-form-item
        label="高技能人才荣誉类别："
        :rules="[{ required: true, message: '高技能人才荣誉类别' }]"
      >
        <VSelect v-model="addForm.level" :options="teclevelList"></VSelect>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item label="其他荣誉：" prop="otherHonor">
        <el-input
          v-model="addForm.otherHonor"
          type="textarea"
          :rows="5"
          placeholder="请输入意见"
        ></el-input>
      </el-form-item>
    </div>
    <div class="row">
      <el-form-item label="备注：" prop="highTechType">
        <el-input
          v-model="addForm.memo"
          type="textarea"
          :rows="5"
          placeholder="请输入意见"
        ></el-input>
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
import VSelect from "/@/components/VSelect.vue";
import http from "../../config/http";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
    VDelete,
    VFormDialog,
    // VExport,
    // VImport,
    VSelect,
  },
  setup() {
    const tableRef = ref();
    const state = reactive({
      checkDialog: false,
      addForm: {},
      itemObj: {},
      levelList: [
        { label: "①院士", value: "1" },
        { label: "②国家千人计划", value: "1" },
        { label: "③国家万人计划", value: "1" },
        { label: "④省百人计划", value: "1" },
        { label: "⑤武汉城市合伙人", value: "1" },
        { label: "⑥黄鹤英才计划(本项)", value: "1" },
        { label: "⑦黄鹤英才计划(专项)", value: "1" },
        { label: "⑧优秀青年", value: "1" },
      ],
      teclevelList: [
        { label: "①湖北工匠", value: "1" },
        { label: '②湖北省"荆楚工匠"', value: "1" },
        { label: "③湖北省技能大师工作室", value: "1" },
        { label: "④湖北省技能大师", value: "1" },
        { label: "⑤湖北省技术能手", value: "1" },
        { label: "⑥武汉工匠", value: "1" },
        { label: "⑦武汉技能大师工作室", value: "1" },
        { label: "⑧武汉市技能大师", value: "1" },
        { label: "⑨武汉市技术能手", value: "1" },
      ],
    });
    const onSubmitInfo = ({}, done) => {
      let params = Object.assign({}, { id: state.itemObj.id }, state.addForm);
      http
        .post("/talentserver/talent/statistic/saveTalentStatistics", params)
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
.red {
  color: red;
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
h2 {
  font-style: italic;
  margin: 10px 0;
}
:deep(.el-form-item__content) {
  // margin-left: 100px !important;
}
</style>
