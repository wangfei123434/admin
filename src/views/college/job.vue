<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/rentserver/jobApply/getByConditionQuery"
    :parse="true"
    label-width="100px"
  >
    <template #query="{ query }">
      <el-form-item prop="unit1" label="申请单位名称">
        <el-input v-model="query.unit1" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="申请岗位类别">
        <el-select v-model="query.jobType" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in workList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="学生姓名">
        <el-input v-model="query.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="idCard" label="身份证号">
        <el-input v-model="query.idCard" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="申请状态">
        <el-select v-model="query.status" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <!-- <el-table-column label="ID" prop="id"></el-table-column> -->
    <el-table-column label="学生姓名" prop="name"></el-table-column>
    <el-table-column label="性别" prop="gender">
      <template #default="{ row }">
        {{ row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column label="身份证号" prop="idCard"></el-table-column>
    <el-table-column label="联系电话" prop="phoneNumber"></el-table-column>
    <el-table-column
      label="毕业(就读)学校"
      prop="school"
      width="150px"
      class="school"
    ></el-table-column>
    <el-table-column label="申请岗位类别" prop="jobType">
      <template #default="{ row }">
        {{ row.jobType == 1 ? "见习" : "实习（训）" }}
      </template>
    </el-table-column>
    <el-table-column label="申请单位1" prop="unit1"></el-table-column>
    <el-table-column label="申请单位2" prop="unit2"></el-table-column>
    <el-table-column label="申请单位3" prop="unit3"></el-table-column>
    <el-table-column label="申请岗位" prop="job1"></el-table-column>
    <el-table-column label="审核时间" prop="checkDate">
      <template #default="{ row }">
        {{
          row.checkDate
            ? dayjs(row.checkDate).format("YYYY-MM-DD HH:mm:ss")
            : ""
        }}
      </template>
    </el-table-column>
    <el-table-column label="申请状态" prop="status"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button
          type="text"
          style="margin-right: 10px"
          @click="toDetail(row)"
        >
          {{ row.status == 1 ? "审核" : "查看" }}
        </el-button>
      </template>
    </el-table-column>
  </V-Table>
  <!-- 查看 -->
  <el-dialog
    v-model="dialogTableVisible"
    custom-class="info"
    width="60%"
    title="详情"
    style="padding-bottom: 100px"
  >
    <v-export
      :url="`/rentserver/jobApply/backend/exportWord?id=${itemObj.studentId}`"
      :filename="itemObj.name"
    >
      <el-button type="primary" class="exportWord">导出word</el-button>
    </v-export>
    <div class="info">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td class="infobt" style="width: 11%">学生姓名</td>
            <td style="width: 38%">
              <span id="labName">{{ itemObj.name }}</span>
            </td>
            <td class="infobt">性别</td>
            <td>
              <span id="labGender">
                {{ itemObj.gender == 0 ? "女" : "男" }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">身份证号</td>
            <td>
              <span id="labIDCard">{{ itemObj.idCard }}</span>
            </td>
            <td class="infobt">民族</td>
            <td>
              <span id="labNation">{{ itemObj.nation }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">联系电话</td>
            <td>
              <span id="labPhoneNumber">{{ itemObj.phoneNumber }}</span>
            </td>
            <td class="infobt">电子邮箱</td>
            <td>
              <span id="labEmail">{{ itemObj.email }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">毕业（就读）学校</td>
            <td>
              <span id="labSchool">{{ itemObj.school }}</span>
            </td>
            <td class="infobt">是否在读</td>
            <td>
              <span id="labIsGraduate">{{ itemObj.graduated }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">专业</td>
            <td>
              <span id="labSpecality">{{ itemObj.specality }}</span>
            </td>
            <td class="infobt">最高学历</td>
            <td>
              <span
                v-for="(item, index) in educationList"
                id="labEducation"
                :key="index"
              >
                {{ item.code == itemObj.education ? item.level : "" }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">毕业证号/学籍号</td>
            <td>
              <span id="labEducationCard">{{ itemObj.educationCard }}</span>
            </td>
            <td class="infobt">毕业时间</td>
            <td>
              <span id="labGraduateDate">
                {{
                  itemObj.graduateDate
                    ? dayjs(itemObj.graduateDate).format("YYYY-MM-DD")
                    : ""
                }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">申请类别</td>
            <td>
              <span v-if="itemObj.jobType == 1" id="labType">{{ "实习" }}</span>
              <span v-else-if="itemObj.jobType == 2" id="labType">
                {{ "见习" }}
              </span>
            </td>
            <td class="infobt">受理时间</td>
            <td>
              <span id="labCheckDate">
                {{
                  itemObj.checkDate
                    ? dayjs(itemObj.checkDate).format("YYYY-MM-DD HH:mm:ss")
                    : ""
                }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">申请单位</td>
            <td>
              <span v-if="itemObj.unit1" id="labUnit1">
                {{ "1、" + itemObj.unit1 }}
              </span>
              <br />
              <span v-if="itemObj.unit2" id="labUnit2">
                {{ "2、" + itemObj.unit2 }}
              </span>
              <br />
              <span v-if="itemObj.unit3" id="labUnit3">
                {{ "3、" + itemObj.unit3 }}
              </span>
            </td>
            <td class="infobt">申请岗位</td>
            <td>
              <span v-if="itemObj.job1" id="labJob1">
                {{ "1、" + itemObj.job1 }}
              </span>
              <br />
              <span v-if="itemObj.job2" id="labJob2">
                {{ "2、" + itemObj.job2 }}
              </span>
              <br />
              <span v-if="itemObj.job3" id="labJob3">
                {{ "3、" + itemObj.job3 }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="itemObj.unit1 && itemObj.status != '未受理'">
      <div class="info" style="margin-top: 50px">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr class="infobt">
              <td style="font-size: 16px">
                <span id="labUnitName1">{{ itemObj.unit1 }}</span>
                审核意见
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="info" style="margin-top: 0px">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td class="infobt">审核结果</td>
              <td>
                <select
                  id="ddlUnit1"
                  v-model="selValue1"
                  name="ddlUnit1"
                  class="forminput2"
                >
                  <option selected="selected">—请选择—</option>
                  <option value="通过">通过</option>
                  <option value="不通过">不通过</option>
                </select>
              </td>
            </tr>
            <tr>
              <td class="infobt">审核意见</td>
              <td style="padding: 10px">
                <textarea
                  id="txtUnit1"
                  v-model="unit1Opinion"
                  name="txtUnit1"
                  rows="3"
                  cols="100"
                  class="forminput3"
                  style="padding: 10px"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="itemObj.unit2 && itemObj.status != '未受理'">
      <div class="info" style="margin-top: 50px">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr class="infobt">
              <td style="font-size: 16px">
                <span id="labUnitName1">{{ itemObj.unit2 }}</span>
                审核意见
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="info" style="margin-top: 0px">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td class="infobt">审核结果</td>
              <td>
                <select
                  id="ddlUnit1"
                  v-model="selValue2"
                  name="ddlUnit1"
                  class="forminput2"
                >
                  <option selected="selected">—请选择—</option>
                  <option value="通过">通过</option>
                  <option value="不通过">不通过</option>
                </select>
              </td>
            </tr>
            <tr>
              <td class="infobt">审核意见</td>
              <td style="padding: 10px">
                <textarea
                  id="txtUnit1"
                  v-model="unit2Opinion"
                  name="txtUnit1"
                  rows="3"
                  cols="100"
                  class="forminput3"
                  style="padding: 10px"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="itemObj.unit3 && itemObj.status != '未受理'">
      <div class="info" style="margin-top: 50px">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr class="infobt">
              <td style="font-size: 16px">
                <span id="labUnitName1">{{ itemObj.unit3 }}</span>
                审核意见
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="info" style="margin-top: 0px">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td class="infobt">审核结果</td>
              <td>
                <select
                  id="ddlUnit1"
                  v-model="selValue3"
                  name="ddlUnit1"
                  class="forminput2"
                >
                  <option selected="selected">—请选择—</option>
                  <option value="通过">通过</option>
                  <option value="不通过">不通过</option>
                </select>
              </td>
            </tr>
            <tr>
              <td class="infobt">审核意见</td>
              <td style="padding: 10px">
                <textarea
                  id="txtUnit1"
                  v-model="unit3Opinion"
                  name="txtUnit1"
                  rows="3"
                  cols="100"
                  class="forminput3"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="btn">
      <el-button
        v-if="itemObj.status == '已受理' || itemObj.status == '已办结'"
        type="primary"
        :loading="loading"
        @click="submitInfo(itemObj.id, done)"
      >
        提交
      </el-button>
      <el-button
        v-else-if="itemObj.status == '未受理'"
        type="primary"
        @click="toDealWith(itemObj.id, done)"
      >
        受理
      </el-button>
      <el-button type="plain" @click="dialogTableVisible = false">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import http from "../../config/http";
import dayjs from "dayjs";
import VTable from "/@/components/VTable.vue";
import VExport from "/@/components/VExport.vue";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
    VExport,
  },
  setup() {
    const tableRef = ref();
    const loading = ref(false);
    const state = reactive({
      dialogTableVisible: false,
      itemObj: {},
      selValue1: "",
      selValue2: "",
      selValue3: "",
      unit1Opinion: "",
      unit2Opinion: "",
      unit3Opinion: "",
      checkList: ["未受理", "已受理", "已办结"],
      educationList: [
        { code: "BAA102522D404273A34CEAF26478CAF2", level: "大专及以下" },
        { code: "6F3A155C4A25410FBD13A47B2EBB5285", level: "本科" },
        { code: "3012A9BC0C8843CB9E74A5D5A5EAE70B", level: "硕士研究生" },
        { code: "79C986D1-8811-45FD-A320-A10108B1FCE6", level: "博士研究生" },
      ],
      workList: [
        { label: "见习", value: 1 },
        { label: "实习（训）", value: 2 },
      ],
    });
    const toDetail = (row) => {
      state.itemObj = row;
      const {
        id,
        unit1Check,
        unit2Check,
        unit3Check,
        unit1Opinion,
        unit2Opinion,
        unit3Opinion,
      } = row;
      state.selValue1 = unit1Check;
      state.selValue2 = unit2Check;
      state.selValue3 = unit3Check;
      state.unit1Opinion = unit1Opinion;
      state.unit2Opinion = unit2Opinion;
      state.unit3Opinion = unit3Opinion;
      state.dialogTableVisible = true;
    };
    // 提交审核结果
    const submitInfo = (id, done) => {
      loading.value = true;
      let params = {
        id,
        unit1Check: state.selValue1,
        unit1Opinion: state.unit1Opinion,
        unit2Check: state.selValue2,
        unit2Opinion: state.unit2Opinion,
        unit3Check: state.selValue3,
        unit3Opinion: state.unit3Opinion,
      };
      http
        .get("/rentserver/jobApply/backend/auditJobApply", params, {
          message: true,
        })
        .then((res) => {
          // done();
          loading.value = false;
          state.dialogTableVisible = false;
          tableRef.value.onFresh();
        })
        .catch((res) => {
          loading.value = false;
          state.dialogTableVisible = false;
        });
    };
    // 受理
    const toDealWith = (id, done) => {
      loading.value = true;
      http
        .get(
          "/rentserver/jobApply/backend/acceptStatus",
          { id },
          {
            message: true,
          }
        )
        .then((res) => {
          // done();
          loading.value = false;
          state.dialogTableVisible = false;
          tableRef.value.onFresh();
        })
        .catch((res) => {
          loading.value = false;
          state.dialogTableVisible = false;
        });
    };
    return {
      ...toRefs(state),
      dayjs,
      toDetail,
      submitInfo,
      toDealWith,
      tableRef,
      loading,
    };
  },
});
</script>
<style lang="scss" scoped>
.area {
  :deep(.el-form-item__label) {
    width: 120px !important;
  }
  :deep(.el-form-item__content) {
    margin-left: 130px !important;
  }
}
.exportWord {
  margin-bottom: 30px;
}
/*info样式开始*/
.info {
  width: 97%;
  margin: 10px auto 0px auto;
  border: solid 1px #cbd4da;
  border-bottom-width: 0px;
  border-right-width: 0px;
}

.info .forminput1 {
  width: 90%;
  height: 22px;
  border: solid 1px #c4cfd6;
  line-height: 22px;
  padding-left: 8px;
  color: #333;
  font-family: "微软雅黑";
  font-size: 12px;
}
.info .forminput3 {
  width: 90%;
  height: 90%;
  padding-top: 6px;
  padding-bottom: 6px;
  border: solid 1px #c4cfd6;
  line-height: 22px;
  padding-left: 8px;
  color: #333;
  font-family: "微软雅黑";
  font-size: 12px;
}
.info .textarea {
  width: 96%;
  height: 22px;
  border: solid 1px #b8c5d8;
  line-height: 22px;
  padding-left: 10px;
  color: #333;
  font-family: "微软雅黑";
  font-size: 12px;
}
.info select.forminput2 {
  width: 93%;
  height: 24px;
  border: solid 1px #b8c5d8;
  line-height: 18px;
  padding-left: 10px;
  cursor: pointer;
}

.info td {
  padding-left: 10px;
  border-bottom: solid 1px #cbd4da;
  border-right: solid 1px #cbd4da;
}
.info td {
  height: 40px;
}
.info th {
  border-bottom: solid 1px #cbd4da;
  border-right: solid 1px #cbd4da;
}
.info td td {
  border-bottom: none;
  border-right-width: 0px;
}
.textBox {
  width: 60%;
  height: 22px;
  border: solid 1px #b8c5d8;
  line-height: 22px;
  padding-left: 10px;
}
.infobt {
  background-color: #ededed;
  font-weight: bold;
  width: 12%;
  height: 40px;
}
.infobt1 {
  background-color: #ededed;
  font-weight: bold;
  width: 10%;
  height: 40px;
  text-align: center;
}
.infobt2 {
  background-color: #ededed;
  font-weight: bold;
  height: 40px;
  text-align: center;
}
.infort {
  width: 38%;
  border-right: solid 1px #cbd4da;
}
.infobt strong {
  color: #d70100;
  font-weight: normal;
  margin-right: 6px;
}
.btntd {
  width: 100px;
  margin: 0px auto;
}
.btn {
  width: 100%;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 80px;
}
tr {
  line-height: normal;
}
</style>
