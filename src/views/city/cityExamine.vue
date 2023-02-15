<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/talentserver/backend/talent/city/expert/list"
  >
    <template #query="{ query }">
      <el-form-item label="姓名" prop="name" label-width="30">
        <el-input v-model="query.nameLike" placeholder="请输入"></el-input>
      </el-form-item>
      <!-- <el-form-item label="组别" prop="">
        <v-select v-model="query.group" :options="groupList"></v-select>
      </el-form-item> -->
      <el-form-item label="申报类型" prop="type">
        <v-select v-model="query.types" :options="applyList"></v-select>
      </el-form-item>
    </template>
    <!-- <template #button>
      <v-export
        :url="`/talentserver/backend/talent/screen/getTalentCountDetailExcel?startDate=${start}&endDate=${end}`"
        filename="专家评审.xlsx"
      >
        <el-button type="primary">数据导出</el-button>
      </v-export>
    </template> -->
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column label="性别" prop="gender" align="center">
      <template #default="{ row }">
        {{ row.gender == "male" ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column label="出生日期" prop="birthday"></el-table-column>
    <el-table-column label="工作单位" prop="companyName"></el-table-column>
    <el-table-column
      label="专业技术职务"
      prop="techPosition"
      align="center"
    ></el-table-column>
    <el-table-column label="职务" prop="post" align="center"></el-table-column>
    <el-table-column label="是否提交" prop="pass" align="center">
      <template #default="{ row }">
        {{ row.pass == 1 ? "是" : "否" }}
      </template>
    </el-table-column>
    <el-table-column
      label="专家评分"
      prop="grade"
      align="center"
    ></el-table-column>
    <el-table-column label="操作" width="200px">
      <template #default="{ row }">
        <el-button type="text" @click="(detailVisible = true), (model = row)">
          详情
        </el-button>
        <!-- <el-button type="text">附件</el-button>
        <el-button type="text">专家意见</el-button>
        <el-button type="text">审核</el-button> -->
      </template>
    </el-table-column>
  </V-Table>

  <!-- 詳情 -->
  <v-form-dialog
    v-model="detailVisible"
    v-model:model="model"
    label-position="top"
    title="专家评审详情"
    :footer="false"
    @submit="(_, done) => done()"
  >
    <!-- 下载申请书 
    
      :filename="model.name"
     -->

    <template #default="{ model }">
      <v-export
        :url="`/talentserver/backend/talent/district/accept/download?talentId`"
        file-type="application/pdf"
      ></v-export>
      <div class="row">
        <el-form-item label="申报人">
          <el-input v-model="model.name" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input
            :model-value="model.gender == 'male' ? '男' : '女'"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-input v-model="model.birthday" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="申报人联系电话">
          <el-input v-model="model.mobile" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="证件类型">
          <el-input v-model="model.idName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="证件编号">
          <el-input v-model="model.idNumber" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="最高学历">
          <el-input v-model="model.education" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="最高学位">
          <el-input v-model="model.degree" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="毕业院校">
          <el-input v-model="model.school" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="毕业时间">
          <el-input v-model="model.graduationDate" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="model.field" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="专业技术职务">
          <el-input v-model="model.techPosition" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="联系人">
          <el-input v-model="model.contactor" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="model.phone" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="电子邮箱">
          <el-input v-model="model.email" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="工作单位">
          <el-input v-model="model.companyName" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="工作单位类型">
          <el-input v-model="model.nature" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="工作单位所在地行政区划">
          <el-input v-model="model.org" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="工作单位地址">
          <el-input v-model="model.address" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="单位电话">
          <el-input v-model="model.companyPhone" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="职务(岗位)">
          <el-input v-model="model.post" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="model.zip" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="通讯地址">
          <el-input v-model="model.companyPhone" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="申报是否取得所在单位同意">
          <el-input
            :model-value="
              model.isAgree == '1' ? '是' : model.isAgree == '0' ? '否' : ''
            "
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="教育经历">
          <el-input
            v-model="model.edu"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="工作经历">
          <el-input
            v-model="model.work"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="主要学术(创新)成果">
          <el-input
            v-model="model.achievement"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="主要学术(创新)成果">
          <el-input
            v-model="model.contrib"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="个人未来三年工作设想">
          <el-input
            v-model="model.future"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
    </template>
  </v-form-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import NotFoundPage from "/@/components/NotFoundPage.vue";
import VSelect from "/@/components/VSelect.vue";
import VTable from "/@/components/VTable.vue";
import VExport from "/@/components/VExport.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
export default defineComponent({
  components: {
    // NotFoundPage,
    VTable,
    VSelect,
    VExport,
    VFormDialog,
  },
  setup() {
    const tableRef = ref(null);
    const detailVisible = ref(false);
    const state = reactive({
      model: {},
      groupList: ["第一组", "第二组", "第三组"].map((value) => ({
        label: value,
        value,
      })),
      applyList: [
        { label: "全部申报类型", value: ["a1", "a2", "b1", "b2", "b3", "c"] },
        { label: "海内外知名高校博士类", value: ["a1"] },
        { label: "获得省级以上荣誉优秀毕业生类", value: ["a2"] },
        { label: "入选青年科技创新人才榜单类", value: ["b1"] },
        { label: "获得市级以上创业赛事大奖类", value: ["b2"] },
        { label: "创投机构举荐类", value: ["b3"] },
        { label: "用人单位举荐类", value: ["c"] },
      ],
    });
    return {
      tableRef,
      ...toRefs(state),
      detailVisible,
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
