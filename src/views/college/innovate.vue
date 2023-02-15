<template>
  <V-Table
    url="/rentserver/businessLocationApply/getByConditionQuery"
    :parse="true"
  >
    <template #query="{ query }">
      <el-form-item prop="name" label="学生姓名">
        <el-input v-model="query.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="projectName" label="创业项目名称" class="area">
        <el-input v-model="query.projectName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="工位所在区" class="area">
        <el-select v-model="query.locationArea" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in areaList"
            :key="index"
            :label="item.area"
            :value="item.code"
          ></el-option>
        </el-select>
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
    <el-table-column label="联系电话" prop="phoneNumber"></el-table-column>
    <el-table-column label="毕业院校" prop="school"></el-table-column>
    <el-table-column label="毕业时间" prop="graduateDate">
      <template #default="{ row }">
        {{
          row.graduateDate ? dayjs(row.graduateDate).format("YYYY-MM-DD") : ""
        }}
      </template>
    </el-table-column>
    <el-table-column label="创业项目名称" prop="projectName"></el-table-column>
    <el-table-column label="工位所在区" prop="locationArea">
      <template #default="{ row }">
        <div v-for="(item, index) in areaList" :key="index">
          {{ item.code == row.locationArea ? item.area : "" }}
        </div>
      </template>
    </el-table-column>
    <!-- <el-table-column label="工位名称" prop="area"></el-table-column> -->
    <el-table-column label="申请状态" prop="status"></el-table-column>
    <el-table-column label="审核时间" prop="validCheckInDate"></el-table-column>
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
  >
    <v-export
      :url="`/rentserver/businessLocationApply/backend/exportWord?id=${itemObj.id}`"
      :filename="itemObj.name"
    >
      <el-button type="primary" class="exportWord">导出word</el-button>
    </v-export>
    <div class="info">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td class="infobt" rowspan="3" style="width: 15%">申报工位信息</td>
            <td class="infobt" style="width: 15%">工位所在地</td>
            <td colspan="4">
              <span
                v-for="(item, index) in areaList"
                id="labLocationAddress"
                :key="index"
              >
                {{ item.code == itemObj.businessArea ? item.area : "" }}
              </span>
              ，{{ itemObj.locationName }}
            </td>
          </tr>
          <tr>
            <td class="infobt">申报时间</td>
            <td style="width: 30%" colspan="2">
              <span id="labApplyDate">
                {{
                  itemObj.applyDate
                    ? dayjs(itemObj.applyDate).format("YYYY-MM-DD HH:mm:ss")
                    : ""
                }}
              </span>
            </td>
            <td class="infobt" style="width: 15%">申报受理时间</td>
            <td>
              <span id="labAcceptDate">
                {{
                  itemObj.acceptDate
                    ? dayjs(itemObj.acceptDate).format("YYYY-MM-DD HH:mm:ss")
                    : ""
                }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">申请使用时间段</td>
            <td colspan="4">
              <span id="labFreeUseDate">
                {{
                  itemObj.useBeginDate
                    ? dayjs(itemObj.useBeginDate).format("YYYY-MM-DD HH:mm:ss")
                    : ""
                }}至{{
                  itemObj.useEndDate
                    ? dayjs(itemObj.useEndDate).format("YYYY-MM-DD HH:mm:ss")
                    : ""
                }}
              </span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="4">大学生概况</td>
            <td class="infobt">学生姓名</td>
            <td colspan="4">
              <span id="labName">{{ itemObj.name }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt">毕业（在读）院校</td>
            <td colspan="4">
              <span id="labSchool">{{ itemObj.school }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt">专业名称</td>
            <td colspan="2">
              <span id="labSpecality">{{ itemObj.specality }}</span>
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
            <td class="infobt">联系方式</td>
            <td colspan="2">
              <span id="labPhoneNumber">{{ itemObj.phoneNumber }}</span>
            </td>
            <td class="infobt">电子邮箱</td>
            <td>
              <span id="labEmail">{{ itemObj.email }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="6">项目情况</td>
            <td class="infobt">创业项目名称</td>
            <td colspan="4">
              <span id="labProjectName">{{ itemObj.projectName }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt">技术领域</td>
            <td colspan="2">
              <span id="labTechnosphere">{{ itemObj.technosphere }}</span>
            </td>
            <td class="infobt">团队人数</td>
            <td>
              <span id="labTeamSize">{{ itemObj.teamSize }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="3">
              工商登记信息
              <br />
              （如有则填）
            </td>
            <td class="infobt">所在区</td>
            <td>
              <span
                v-for="(item, index) in areaList"
                id="labBusinessArea"
                :key="index"
              >
                {{ item.code == itemObj.businessArea ? item.area : "" }}
              </span>
            </td>
            <td class="infobt">法人代表</td>
            <td>
              <span id="labLegal">{{ itemObj.legal }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt">注册地址</td>
            <td colspan="3">
              <span id="labBusinessAddress">{{ itemObj.businessAddress }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt">社会诚信代码</td>
            <td colspan="3">
              <span id="labIntegrityCode">{{ itemObj.integrityCode }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">项目进展</td>
            <td colspan="4">
              <span id="labProjectProgress">
                {{ itemObj.projectProgress }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="info" style="margin-top: 50px">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr class="infobt"><td style="font-size: 16px">申请审核</td></tr>
        </tbody>
      </table>
    </div>
    <div class="info" style="margin-top: 0px">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td class="infobt">审核结果</td>
            <td>
              <span id="labStatus">{{ itemObj.status }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">审核意见</td>
            <td>
              <span id="labFinallyOpinion">{{ itemObj.opinion }}</span>
            </td>
          </tr>
        </tbody>
      </table>
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
    const state = reactive({
      dialogTableVisible: false,
      itemObj: {},
      checkList: ["审核中", "审核通过", "驳回", "申请退出", "到期退出", "清退"],
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
    });
    const toDetail = (row) => {
      state.itemObj = row;
      state.dialogTableVisible = true;
    };
    return {
      ...toRefs(state),
      dayjs,
      toDetail,
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
</style>
