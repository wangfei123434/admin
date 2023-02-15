<template>
<!-- url="/rentserver/apartmentLeaseApply/getAll"
    method="get" -->
  <V-Table
    :ref="(dom) => (tableRef = dom)"
   url="/rentserver/apartmentLeaseApply/getByConditionQuery"
  >
    <template #query="{ query }">
      <el-form-item label="登记意向区域" class="area">
        <el-select v-model="query.leaseIntentionArea" placeholder="请选择">
          <el-option
            v-for="(item, index) in areaList"
            :key="index"
            :label="item.area"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区人社审核状态" class="area">
        <el-select v-model="query.peopleClubCheck" placeholder="请选择">
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>

        <!-- <v-select v-model="query.status" :options="checkList"></v-select> -->
      </el-form-item>
      <el-form-item label="区房管审核状态" class="area">
        <el-select v-model="query.fangGuanCheck" placeholder="请选择">
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="query.name" placeholder="请输入"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="name" label="申请单号">
        <el-input v-model="query.name" placeholder="请输入"></el-input>
      </el-form-item> -->
      <el-form-item prop="idCard" label="身份证号">
        <el-input v-model="query.idCard" placeholder="请输入"></el-input>
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
    <el-table-column label="登记意向区" width="120px" prop="leaseIntentionArea">
      <template #default="{ row }">
        <div v-for="(item, index) in areaList" :key="index">
          {{ item.code == row.leaseIntentionArea ? item.area : "" }}
        </div>
      </template>
    </el-table-column>
    <!-- <el-table-column label="申请单号" prop=""></el-table-column> -->
    <el-table-column
      label="区人社审核状态"
      prop="peopleClubCheck"
    ></el-table-column>
    <el-table-column
      label="区房管审核状态"
      prop="fangGuanCheck"
    ></el-table-column>
    <el-table-column label="最终状态" prop="status"></el-table-column>
    <el-table-column
      label="提交时间"
      prop="applyDate"
      width="140px"
      align="center"
    >
      <template #default="{ row }">
        {{ dayjs(row.applyDate).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" width="200px">
      <template #default="{ row }">
        <el-button type="text" class="check" @click="toDetail(row.id)">
          {{ !row.peopleClubCheck ? "审核" : "查看" }}
        </el-button>
        <el-button type="text" @click="(showAttach = true), toAttach(row.id)">
          附件
        </el-button>
      </template>
    </el-table-column>
  </V-Table>
  <!-- 附件 -->
  <el-dialog v-model="showAttach" width="60%" title="附件">
    <v-table :data="attachList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="文件名称" prop="fileName"></el-table-column>
      <el-table-column label="类型" prop="fileType">
        <template #default="{ row }">
          <span v-for="(item, index) in typeList" :key="index">
            {{ item.code == row.type ? item.val : "" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="createDate">
        <template #default="{ row }">
          {{ dayjs(row.createDate).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
    </v-table>
  </el-dialog>
  <!-- 审核  vs 查看 -->
  <VFormDialog
    v-model="dialogTableVisible"
    custom-class="info"
    width="60%"
    :model="shForm"
    :title="!itemObj.peopleClubCheck ? '审核' : '查看'"
    @submit="onSubmitInfo"
  >
    <table
      width="100%"
      align="center"
      border="1"
      cellspacing="0"
      cellpadding="0"
    >
      <tbody>
        <tr>
          <td class="infobt" rowspan="4" style="width: 15%">基本信息</td>
          <td class="infobt">学生姓名</td>
          <td class="infort" style="width: 25%">
            <span id="labName">{{ itemObj.name }}</span>
          </td>
          <td class="infobt">性别</td>
          <td>
            <span id="labGender">{{ itemObj.gender == 1 ? "男" : "女" }}</span>
          </td>
          <td class="infobt">民族</td>
          <td>
            <span id="labNation">{{ itemObj.nation }}</span>
          </td>
        </tr>
        <tr>
          <td class="infobt">证件号码</td>
          <td colspan="2">
            <span id="labIDCard">身份证 — {{ itemObj.idCard }}</span>
          </td>
          <td class="infobt">婚姻状态</td>
          <td colspan="2">
            <span id="labMarital">{{ itemObj.marital }}</span>
          </td>
        </tr>
        <tr>
          <td class="infobt">户籍地址</td>
          <td colspan="5">
            <span id="labHouseholdAddress">{{ itemObj.houseHoldAddress }}</span>
          </td>
        </tr>
        <tr>
          <td class="infobt">现住地址</td>
          <td colspan="5">
            <span id="labLiveAddress">{{ itemObj.liveAddress }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt" rowspan="2">通讯方式</td>
          <td class="infobt">移动电话</td>
          <td colspan="2">
            <span id="labPhoneNumber">{{ itemObj.phoneNumber }}</span>
          </td>
          <td class="infobt">微信号</td>
          <td colspan="2">
            <span id="labWeixin">{{ itemObj.weixin }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt">通信地址</td>
          <td colspan="5">
            <span id="labMailingAddress">{{ itemObj.mailingAddress }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt" rowspan="4">学历信息</td>
          <td class="infobt">毕业院校</td>
          <td colspan="2">
            <span id="labSchool">{{ itemObj.school }}</span>
          </td>
          <td class="infobt">毕业时间</td>
          <td colspan="2">
            <span id="labGraduateDate">{{ itemObj.graduateDate }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt">学历</td>
          <td colspan="2">
            <span
              v-for="(item, index) in educationList"
              id="labEducation"
              :key="index"
            >
              {{ item.code == itemObj.education ? item.level : "" }}
            </span>
          </td>
          <td class="infobt">毕业证号</td>
          <td colspan="2">
            <span id="labEducationCard">{{ itemObj.educationCard }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt">学位</td>
          <td colspan="2">
            <span v-for="(item, index) in degreeList" :key="index">
              {{ item.code == itemObj.degree ? item.degree : "" }}
            </span>
          </td>
          <td class="infobt">学位证号</td>
          <td colspan="2">
            <span id="labDegreeCard">{{ itemObj.degreeCard }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt">专业类别</td>
          <td colspan="2">
            <span id="labSpecalityType">{{ itemObj.specalityType }}</span>
          </td>
          <td class="infobt">专业名称</td>
          <td colspan="2">
            <span id="labSpecality">{{ itemObj.specality }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt" rowspan="2">创业就业信息</td>
          <td class="infobt">类别</td>
          <td colspan="2">
            <span id="labType">{{ itemObj.type }}</span>
          </td>
          <td class="infobt">行业类别</td>
          <td colspan="2">
            <span v-for="(item, index) in jobTypeList" :key="index">
              {{ item.code == itemObj.industryCategory ? item.type : "" }}
            </span>
          </td>
        </tr>
        <tr>
          <td class="infobt">所在单位</td>
          <td colspan="2">
            <span id="labUnit">{{ itemObj.unit }}</span>
          </td>
          <td class="infobt">单位地址</td>
          <td colspan="2">
            <span id="labUnitAddress">{{ itemObj.unitAddress }}</span>
          </td>
        </tr>

        <tr>
          <td class="infobt" :rowspan="familyList.length * 1 + 1">
            家庭成员情况
          </td>
          <td class="infobt">与申请人关系</td>
          <td class="infobt">姓名</td>
          <td class="infobt" colspan="4">证件号码</td>
        </tr>
        <tr v-for="(item, index) in familyList" :key="index">
          <td>
            {{
              item.relation == 0 ? "父母" : item.relation == 1 ? "配偶" : "子女"
            }}
          </td>
          <td>{{ item.memberName }}</td>
          <td colspan="4">身份证 — {{ item.memberIdcard }}</td>
        </tr>
        <tr>
          <td class="infobt">配租意向</td>
          <td class="infobt">登记意向区域</td>
          <td>
            <span
              v-for="(item, index) in areaList"
              id="labLeaseIntentionArea"
              :key="index"
            >
              {{ item.code == itemObj.leaseIntentionArea ? item.area : "" }}
            </span>
          </td>
          <td class="infobt" colspan="2">是否选择单套</td>
          <td colspan="2">
            <span id="labIsSingleRoom">
              {{ itemObj.isSingleRoom == 1 ? "是" : "否" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!itemObj.peopleClubCheck" class="fileList">
      <p class="title">区人社审核</p>
      <el-form-item
        label="审核结果"
        prop="status"
        :rules="[{ required: true, message: '请选择审核结果' }]"
      >
        <el-radio-group v-model="shForm.status">
          <el-radio label="通过">通过</el-radio>
          <el-radio label="不通过">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="shForm.status == '通过'"
        label="人才类型"
        prop="type"
        :rules="[{ required: true, message: '请选择人才类型' }]"
      >
        <v-select
          v-model="shForm.type"
          :options="[{ label: 'A' }, { label: 'B' }, { label: 'C' }]"
          field-value="label"
        ></v-select>
      </el-form-item>
      <el-form-item label="备注（不通过原因）">
        <el-input v-model="shForm.opinion" type="textarea"></el-input>
      </el-form-item>
    </div>

    <div v-else class="info" style="margin: 20px 0 0 0; width: 100%">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="infobt">
            <td style="font-size: 16px" colspan="2">人社局审核结果</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="infobt">审核结果</td>
            <td>
              <span id="labStatus">{{ itemObj.peopleClubCheck }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">审核意见</td>
            <td>
              <span id="labFinallyOpinion">
                {{ itemObj.peopleClubOpinion }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="itemObj.fangGuanCheck"
      class="info"
      style="margin: 20px 0 0 0; width: 100%"
    >
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="infobt">
            <td style="font-size: 16px" colspan="2">房管局审核结果</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="infobt">审核结果</td>
            <td>
              <span id="labStatus">{{ itemObj.fangGuanCheck }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">审核意见</td>
            <td>
              <span id="labFinallyOpinion">{{ itemObj.fangGuanOpinion }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </VFormDialog>
</template>
<script>
import http from "../../config/http";
import VSelect from "/@/components/VSelect.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VTable from "/@/components/VTable.vue";
import dayjs from "dayjs";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    VSelect,
  },
  setup() {
    const tableRef = ref();
    const state = reactive({
      dialogTableVisible: false,
      showAttach: false,
      attachList: [],
      checkList: ["待审核", "通过", "不通过"],
      itemObj: {},
      familyList: [],
      shForm: {
        status: "",
        opinion: "",
        type: "",
      },
      areaList: [
        { code: "1F8C8A6C-0322-4210-90AB-534ED4668B8A", area: "洪山区" },
        { code: "3E3ECD5E-9976-4A74-9BA1-73A1CF5D2624", area: "东西湖区" },
        { code: "41050CBE-264E-4E56-9585-4F49F0D5CF5C", area: "蔡甸区" },
        { code: "58B27BE0-E1EE-4F0B-A070-634AB8931871", area: "江夏区" },
        { code: "689E478A-F499-428E-9340-F18FD11199C3", area: "黄陂区" },
        { code: "9A4FAA76-4C40-4CD0-A6B3-A8F3ECDF2DED", area: "新洲区" },
        {
          code: "5DA2D683-161D-4357-8ECB-C3519BD9E571",
          area: "东湖新技术开发区",
        },
        {
          code: "42403F88-4D60-4980-90C1-BC4BD124581C",
          area: "武汉经济技术开发区（汉南区）",
        },
        { code: "88FF32FB-8D80-483E-84AE-AF61FCB4EC6A", area: "江岸区" },
        { code: "9BE15342-BC28-45D4-A358-9C614349A03F", area: "江汉区" },
        { code: "B16CA8CB-636C-4FF1-8211-EF6B51CDAA27", area: "硚口区" },
        { code: "D1D5782A-6369-4766-AFCB-9F58668EBF43", area: "汉阳区" },
        { code: "EB5285A8-C841-4F7C-A39F-3F31FD332C12", area: "武昌区" },
        { code: "1988F7F5-4FE9-4992-9662-9F64344744B1", area: "青山区" },
      ],
      educationList: [
        { code: "BAA102522D404273A34CEAF26478CAF2", level: "大专及以下" },
        { code: "6F3A155C4A25410FBD13A47B2EBB5285", level: "本科" },
        { code: "3012A9BC0C8843CB9E74A5D5A5EAE70B", level: "硕士研究生" },
        { code: "79C986D1-8811-45FD-A320-A10108B1FCE6", level: "博士研究生" },
      ],
      degreeList: [
        { code: "FFF9AFFC-6ADF-4673-9384-161D4EEAD08E", degree: "学士及以下" },
        { code: "0FF20517-1EC2-4548-9C7E-4ADE2B2C1B11", degree: "硕士" },
        { code: "9A0EE126-5799-4C7F-A477-50CA214F3A49", degree: "博士" },
      ],
      jobTypeList: [
        {
          code: "0F7AB0C8BCBD46DA97BD76F4EA7D7667",
          type: "计算机/互联网/通信/电子",
        },
        {
          code: "3F2A1D06368043EB9884C753F78DF3FC",
          type: "贸易/消费/制造/营运",
        },
        { code: "7C45D3287BD64915AEAF079F3FADDD26", type: "广告/媒体" },
        { code: "8EE2F240899240EC8873A5A7B25DCE2A", type: "服务业" },
        {
          code: "3962ED65DDCF4B8FADBE7E796C904754",
          type: "会计/金融/银行/保险",
        },
        { code: "A9ACC70BAB344056938CA5EBBFF2DADD", type: "其他" },
        { code: "A7C41A25EC9E482799984B839087778C", type: "政府/非盈利机构" },
        { code: "486928FDFDC0420A847DD0C245627CD0", type: "制药/医疗" },
        { code: "A6C4408F928F4E388F5BC7F6F0D02CA7", type: "能源/原材料" },
        { code: "9272339EB2C948ACB4E15DEC262C66B", type: "物流/运输" },
        { code: "8A38CAE3D31F45C2933104DF8C68B4E9", type: "房地产/建筑" },
        {
          code: "8DBC2EC937CD4DAA99421C46B1E7A79F",
          type: "专业服务/教育/培训",
        },
      ],
      typeList: [
        { code: "0", val: "身份证" },
        { code: "1", val: "父母身份证" },
        { code: "2", val: "配偶身份证" },
        { code: "3", val: "子女身份证" },
        { code: "4", val: "结婚证" },
        { code: "5", val: "学历和学位证书" },
        { code: "6", val: "社保缴纳凭据、劳动合同或在职证明" },
        { code: "7", val: "营业执照和股权证明" },
        { code: "8", val: "其他" },
        { code: "9", val: "户口本本人信息页" },
      ],
    });

    const toDetail = (id) => {
      state.dialogTableVisible = true;
      state.shForm = {};
      http
        .get(`/rentserver/apartmentLeaseApply/getById?id=${id}`)
        .then((res) => {
          if (res) {
            state.itemObj = res.data;
            state.familyList = Array.from(res.data.studentFamilies);
          }
        });
    };
    const toAttach = (id) => {
      http
        .get(`/rentserver/apartmentLeaseApply/getById?id=${id}`)
        .then((res) => {
          if (res) {
            state.attachList = res.data.attachments;
          }
        });
    };
    // 信息审核
    const onSubmitInfo = (params, done) => {
      http
        .get(
          "/rentserver/apartmentLeaseApply/setAlaStatus",
          {
            alaId: state.itemObj.id,
            peopleClubStatus: state.shForm.status,
            talentLevel: state.shForm.type,
            opinion: state.shForm.opinion,
          },
          {
            message: true,
          }
        )
        .then((res) => {
          state.check = false;
          tableRef.value.onFresh();
          done();
        })
        .catch((err) => {
          state.check = false;
          done();
        });
    };
    return {
      ...toRefs(state),
      toDetail,
      onSubmitInfo,
      dayjs,
      toAttach,
      tableRef,
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
span.check,
span.check:hover {
  color: $main-color;
  text-decoration: none;
  cursor: pointer;
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
.fileList {
  padding: 20px;
  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 50px;
  }
  .wei {
    font-size: 14px;
    color: #aaa;
  }
  :deep(.el-radio-group) {
    display: contents;
    .el-radio {
      margin-right: 100px;
    }
  }
  :deep(.el-textarea__inner) {
    resize: none;
  }
}
</style>
