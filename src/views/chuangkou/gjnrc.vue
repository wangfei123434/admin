<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    :query="defaultQuery"
    url="/rentserver/apartmentLeaseApplySkillTalent/getByConditionQuery2"
    :parse="true"
    label-width="100px"
    @delete-time="deleteTimeFun"
  >
    <template #query="{ query }">
      <el-form-item label="配租意向区域">
        <template v-if="!isOrg">
          <el-select
            v-model="query.leaseIntentionArea"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in areaList"
              :key="index"
              :label="item.area"
              :value="item.code"
            ></el-option>
          </el-select>
        </template>
        <template v-if="isOrg">
          <div v-for="(item, index) in areaList" :key="index">
            <el-input
              v-if="item.code == isOrg"
              :key="index"
              v-model="query.leaseIntentionArea"
              disabled
              :placeholder="item.area"
            ></el-input>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="资格审核状态">
        <el-select v-model="query.status" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model.trim="query.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="idCard" label="身份证号">
        <el-input v-model.trim="query.idCard" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="dates" class="keyword" label="审核日期">
        <el-date-picker
          v-model="dates"
          style="width: 225px !important"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDates"
        ></el-date-picker>
      </el-form-item>
    </template>
    <template #button="">
      <el-button type="primary" @click="toAudit()">新增</el-button>
    </template>
    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column label="性别" prop="gender">
      <template #default="{ row }">
        {{ row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column label="人才类别" prop="talentType" align="center">
      高技能人才
    </el-table-column>
    <el-table-column
      label="技能等级"
      prop="skillGrade"
      align="center"
    ></el-table-column>
    <el-table-column label="身份证号" prop="idCard"></el-table-column>
    <el-table-column label="联系电话" prop="phoneNumber"></el-table-column>
    <el-table-column
      label="配租意向区域"
      width="120px"
      prop="leaseIntentionArea"
    >
      <template #default="{ row }">
        <div v-for="(item, index) in areaList" :key="index">
          {{ item.code == row.leaseIntentionArea ? item.area : "" }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="资格审核" prop="status" align="center">
      <template #default="{ row }">
        <span :style="row.status == '审核中' ? 'color:red' : ''">
          {{ row.status }}
        </span>
      </template>
    </el-table-column>
    <!-- <el-table-column label="最终状态" prop="status"></el-table-column> -->
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
    <el-table-column
      label="审核时间"
      prop="checkDate"
      width="140px"
      align="center"
    >
      <template #default="{ row }">
        {{
          row.checkDate
            ? dayjs(row.checkDate).format("YYYY-MM-DD HH:mm:ss")
            : ""
        }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200px">
      <template #default="{ row }">
        <el-button type="text" class="check">
          <span
            v-if="
              row.status == null ||
              row.status == '' ||
              row.status == '退回' ||
              row.status == '不通过' ||
              row.status == '作废'
            "
            @click="toAudit(row.id, row.status, '修改')"
          >
            修改
          </span>
          <span v-else @click="toAudit(row.id, row.status, '查看')">查看</span>
        </el-button>
        <el-button type="text" @click="logClick(row.id)">日志</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <!-- 2022-07-01 新增日志 wf -->
  <el-dialog v-model="logDialogISshow" width="60%" title="日志">
    <v-table :data="logListData">
      <el-table-column label="审核结果" prop="type"></el-table-column>
      <el-table-column label="备注说明" prop="memo"></el-table-column>
      <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
      <el-table-column label="操作账号" prop="auditor"></el-table-column>
      <el-table-column label="所属区划" prop="auditOrg"></el-table-column>
      <el-table-column label="角色" prop="auditRole"></el-table-column>
    </v-table>
  </el-dialog>

  <VFormDialog
    v-model="shDialogTableVisible"
    :footer="false"
    custom-class="info"
    width="70%"
    :model="shForm"
    :title="titleName"
    @submit="onSubmitInfo2"
  >
    <div class="tx-box">
      <table
        width="100%"
        align="center"
        border="1"
        cellspacing="0"
        cellpadding="0"
      >
        <tbody>
          <tr>
            <td class="infobt" rowspan="3" style="width: 15%">基本信息</td>
            <td class="infobt">姓名</td>
            <td class="infort" style="width: 25%">
              <el-input v-model="itemObj.name"></el-input>
            </td>
            <td class="infobt">性别</td>
            <td>
              <span id="labGender">
                <el-radio-group v-model="itemObj.gender">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="0">女</el-radio>
                </el-radio-group>
              </span>
            </td>
            <td class="infobt">年龄</td>
            <td>
              <span id="labNation">
                <el-input v-model="itemObj.age" type="number"></el-input>
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">证件号码</td>
            <td colspan="2">
              <span id="labIDCard">
                <el-input v-model="itemObj.idCard"></el-input>
              </span>
            </td>
            <td class="infobt">婚姻状态</td>
            <td colspan="2">
              <span id="labMarital">
                <el-radio-group v-model="itemObj.marital">
                  <el-radio :label="'已婚'">已婚</el-radio>
                  <el-radio :label="'未婚'">未婚</el-radio>
                </el-radio-group>
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">户籍地址</td>
            <td colspan="5">
              <span id="labHouseholdAddress">
                <el-input
                  v-model="itemObj.houseHoldAddress"
                  placeholder="请输入"
                ></el-input>
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt" rowspan="2" style="width: 15%">通讯方式</td>
            <td class="infobt">移动电话</td>
            <td colspan="5">
              <span id="labPhoneNumber">
                <el-input
                  v-model="itemObj.phoneNumber"
                  placeholder="请输入"
                ></el-input>
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">通讯地址</td>
            <td colspan="5">
              <span id="labLiveAddress">
                <el-input
                  v-model="itemObj.mailingAddress"
                  placeholder="请输入"
                ></el-input>
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt" rowspan="4">证书信息</td>
            <td class="infobt">技能等级</td>
            <td colspan="5">
              <span id="labSchool">
                <el-select v-model="itemObj.skillGrade">
                  <el-option value="">—请选择—</el-option>
                  <el-option value="高级技师（政策：40周岁以下）">
                    高级技师（政策：40周岁以下）
                  </el-option>
                  <el-option value="技师（政策：35周岁以下）">
                    技师（政策：35周岁以下）
                  </el-option>
                  <el-option value="高级工（政策：30周岁以下）">
                    高级工（政策：30周岁以下）
                  </el-option>
                </el-select>
              </span>
            </td>
          </tr>

          <tr>
            <td class="infobt">证书名称</td>
            <td colspan="5">
              <span>
                <el-select v-model="itemObj.certificateName">
                  <el-option value="">—请选择—</el-option>
                  <el-option value="职业资格证书">职业资格证书</el-option>
                  <el-option value="技能等级证书">技能等级证书</el-option>
                </el-select>
              </span>
            </td>
          </tr>

          <tr>
            <td class="infobt">证书编号</td>
            <td colspan="5">
              <span>
                <el-input
                  v-model="itemObj.certificateNumber"
                  type="text"
                  tag="请输入证书编号！"
                />
              </span>
            </td>
          </tr>

          <tr>
            <td class="infobt">办理机构</td>
            <td colspan="5">
              <span>
                <el-input
                  v-model="itemObj.agency"
                  type="text"
                  class="wenzishur"
                  tag="请输入办理机构！"
                />
              </span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="2">创业就业信息</td>
            <td class="infobt">创业就业类型</td>
            <td colspan="2">
              <span>
                <el-select v-model="itemObj.type">
                  <el-option value="">—请选择—</el-option>
                  <el-option value="创业">创业</el-option>
                  <el-option value="就业">就业</el-option>
                </el-select>
              </span>
            </td>
            <td class="infobt">所在行业</td>
            <td colspan="3">
              <el-select v-model="itemObj.industryCategory">
                <el-option value="">—请选择—</el-option>
                <el-option
                  value="3F2A1D06368043EB9884C753F78DF3FC"
                  label="贸易/消费/制造/营运"
                >
                  贸易/消费/制造/营运
                </el-option>
                <el-option
                  value="7C45D3287BD64915AEAF079F3FADDD26"
                  label="广告/媒体"
                >
                  广告/媒体
                </el-option>
                <el-option
                  value="0F7AB0C8BCBD46DA97BD76F4EA7D7667"
                  label="计算机/互联网/通信/电子"
                >
                  计算机/互联网/通信/电子
                </el-option>
                <el-option
                  value="8EE2F240899240EC8873A5A7B25DCE2A"
                  label="服务业"
                >
                  服务业
                </el-option>
                <el-option
                  value="3962ED65DDCF4B8FADBE7E796C904754"
                  label="会计/金融/银行/保险"
                >
                  会计/金融/银行/保险
                </el-option>
                <el-option
                  value="A7C41A25EC9E482799984B839087778C"
                  label="政府/非盈利机构"
                >
                  政府/非盈利机构
                </el-option>
                <el-option
                  value="486928FDFDC0420A847DD0C245627CD0"
                  label="制药/医疗"
                >
                  制药/医疗
                </el-option>
                <el-option
                  value="A6C4408F928F4E388F5BC7F6F0D02CA7"
                  label="能源/原材料"
                >
                  能源/原材料
                </el-option>
                <el-option
                  value="9272339EB2C948ACB4E15DEC262C66B"
                  label="物流/运输"
                >
                  物流/运输
                </el-option>
                <el-option
                  value="8A38CAE3D31F45C2933104DF8C68B4E9"
                  label="房地产/建筑"
                >
                  房地产/建筑
                </el-option>
                <el-option
                  value="8DBC2EC937CD4DAA99421C46B1E7A79F"
                  label="专业服务/教育/培训"
                >
                  专业服务/教育/培训
                </el-option>
                <el-option
                  value="A9ACC70BAB344056938CA5EBBFF2DADD"
                  label="其他"
                >
                  其他
                </el-option>
              </el-select>
            </td>
          </tr>

          <tr>
            <td class="infobt">所在单位</td>
            <td colspan="2">
              <span id="labUnit">
                <el-input
                  v-model="itemObj.unit"
                  type="text"
                  class="wenzishur"
                  tag="请输入所在单位！"
                />
              </span>
            </td>
            <td class="infobt">单位地址</td>
            <td colspan="3">
              <span id="labUnitAddress">
                <el-input
                  v-model="itemObj.unitAddress"
                  type="text"
                  class="wenzishur"
                  tag="请输入单位地址！"
                />
              </span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="2" style="width: 15%">
              社会保险缴费状态
            </td>
            <td class="infobt">缴费单位</td>
            <td colspan="5">
              <span>
                <el-input
                  v-model="itemObj.socialSecurityUnit"
                  type="text"
                  class="wenzishur"
                  tag="请输入办理机构！"
                />
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">缴费状态</td>
            <td colspan="5">
              <span>
                <el-select v-model="itemObj.socialSecurityStatus">
                  <el-option value="">—请选择—</el-option>
                  <el-option value="正常">正常</el-option>
                  <el-option value="暂停">暂停</el-option>
                </el-select>
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt" :rowspan="familyList.length * 1 + 1">
              家庭成员情况
            </td>
            <td class="infobt">与申请人关系</td>
            <td class="infobt">姓名</td>
            <td class="infobt" colspan="4">证件类型-证件号码</td>
          </tr>
          <tr v-for="(item, index) in familyList" :key="index">
            <td>
              <el-select
                v-model="item.relation"
                name="ddlRelation3"
                class="form-control"
                style="width: 150px"
              >
                <el-option value="">—请选择—</el-option>
                <el-option
                  v-for="(v, i) in relationClsList"
                  :key="i"
                  :value="v.code"
                  :label="v.name"
                >
                  {{ v.name }}
                </el-option>
              </el-select>
            </td>
            <td>
              <el-input v-model.trim="item.memberName" type="text" />
            </td>
            <td colspan="3">
              <el-select
                v-model="item.zjlx"
                class="form-control"
                style="width: 150px"
              >
                <el-option value="">—请选择类型—</el-option>
                <el-option
                  v-for="(v, i) in idCardList"
                  :key="i"
                  :value="v.code"
                  :label="v.name"
                >
                  {{ v.name }}
                </el-option>
              </el-select>
              —
              <el-input
                :id="'txtMemberIDcard3_' + i"
                v-model.trim="item.memberIdcard"
                name="txtMemberIDcard3"
                type="text"
                class="wenzishur"
                style="width: 50%"
              />
            </td>
          </tr>
          <tr>
            <td class="infobt">配租意向</td>
            <td class="infobt">配租意向区域</td>
            <td colspan="5">
              <span>
                <el-select v-model="itemObj.leaseIntentionArea">
                  <el-option value="">—请选择—</el-option>
                  <el-option
                    v-for="(v, i) in areaList"
                    :key="i"
                    :value="v.code"
                    :label="v.area"
                  >
                    {{ v.area }}
                  </el-option>
                </el-select>
              </span>
            </td>
          </tr>
          <tr style="height: auto">
            <td class="infobt">备注</td>
            <td colspan="6">
              <div>
                <el-input
                  id="labRemark"
                  v-model="itemObj.remark"
                  style="height: auto; line-height: 24px"
                  type="textarea"
                  autosize
                ></el-input>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="list_news clearfix biaodan_m2">
      <table class="Form1" style="margin: 20px 0; width: 100%">
        <tbody>
          <tr>
            <th>
              <span
                class="NewSet"
                style="cursor: pointer; text-decoration: none; color: red"
              >
                <b @click="itemObj.dialogVisible = true">
                  *上传资料规范（点击查看）
                </b>
              </span>
              <el-dialog
                v-model="itemObj.dialogVisible"
                title="上传资料规范"
                width="50%"
                style="text-align: left"
              >
                <tipFile />
              </el-dialog>

              <el-select
                v-model="itemObj.chooseFile"
                name="FileUploadControl1$ddlDict"
                class="form-control"
                style="width: 40%"
              >
                <el-option value="">--请选择--</el-option>
                <el-option
                  v-for="(v, i) in attachType"
                  :key="i"
                  :value="v.code"
                  :label="v.val"
                >
                  {{ v.val }}
                </el-option>
              </el-select>
            </th>
            <th style="display: flex; height: 40px; align-items: center">
              <input
                ref="file"
                type="file"
                name="FileUploadControl1$FileUpload1"
                style="width: 100%; color: #fff"
                @change="getFile"
              />
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="list_news clearfix biaodan_m2">
      <table
        class="Form1"
        style="width: 100%"
        title="认定资料"
        data-options="toolbar:FileUploadControl1_tbupload"
      >
        <thead>
          <tr>
            <th style="text-align: center; width: 50%">文件</th>
            <th style="text-align: center; width: 20%">分类</th>
            <th style="text-align: center; width: 20%">上传时间</th>
            <th style="text-align: center; width: 10%">操作</th>
          </tr>
        </thead>
        <tbody v-for="(v, i) in itemObj.attachments" id="fileList" :key="i">
          <tr>
            <td>{{ v.fileName }}</td>
            <td>
              {{
                attachType.filter((e) => {
                  return v.type == e.code;
                })[0].val
              }}
            </td>
            <td>{{ dayjs(v.time).format("YYYY-MM-DD HH:mm:ss") }}</td>
            <td>
              <a style="margin-left: 10px">
                <span
                  v-if="itemObj.status == '通过' || itemObj.status == '审核中'"
                  @click="downFile(v)"
                >
                  下载
                </span>
                <span v-else @click="delFile(v)">删除</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="btnIsShow" style="margin-left: 45%; margin-top: 20px">
      <el-button type="primary" @click="newOnSubmitInfo(1)">保存</el-button>
      <el-button type="primary" @click="newOnSubmitInfo(2)">提交</el-button>
    </div>
  </VFormDialog>
</template>
<script>
import moment from "moment";
import http from "/@/config/http";
import VFormDialog from "/@/components/VFormDialog.vue";
import VTable from "/@/components/VTable.vue";
import dayjs from "dayjs";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import tipFile from "./tipFile.vue";
import { apartmentLeaseApplySkillTalentSave } from "/@/config/commonHttp";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    tipFile,
  },
  setup() {
    //图片list
    const dialogObjDelDef = reactive({
      dialogVisible: false,
      title: "附件列表",
      width: "60%",
      successBtnText: "确定",
      closeBtnText: "取消",
      isFooter: true,
      imgs: [],
    });

    const defaultQuery = ref({});
    const dates = ref([]);

    const tableRef = ref();
    const isOrg = ref(
      localStorage.getItem("orgId") ? localStorage.getItem("orgId") : false
    );
    const state = reactive({
      flag: true, //提交防连点
      titleName: "新增",
      btnIsShow: true, //底部保存、提交按钮显示    修改状态显示  查看状态不显示
      idCardList: [
        { code: 0, name: "身份证" },
        { code: 2, name: "港澳台通行证" },
        { code: 3, name: "护照" },
      ],
      relationClsList: [
        { code: 3, name: "父亲" },
        { code: 4, name: "母亲" },
        { code: 1, name: "配偶" },
        { code: 2, name: "子女" },
      ],
      attachType: [
        { code: "13", val: "本人身份证正反面" },
        { code: "9", val: "户口本本人信息页" },
        { code: "18", val: "父亲身份证正反面" },
        { code: "19", val: "母亲身份证正反面" },
        { code: "4", val: "结婚证或婚姻状况具结书" },
        { code: "20", val: "配偶身份证正反面" },
        { code: "21", val: "单位证明(紧缺工种)" },
        { code: "22", val: "劳动合同复印件" },
      ],

      zfDialogTableVisible: false,
      dialogTableVisible: false,
      showAttach: false,
      attachList: [],
      checkList: ["审核中", "通过", "不通过", "退回", "作废"],
      RecordCheckList: [
        {
          label: "审核中",
          value: "1",
        },
        {
          label: "通过",
          value: "2",
        },
        {
          label: "不通过",
          value: "3",
        },
        {
          label: "退回",
          value: "4",
        },
        {
          label: "作废",
          value: "5",
        },
      ],
      rclbList: ["高层次人才", "大学毕业生", "高技能人才"],
      rcdjList: [
        "高层次人才",
        "全日制博士",
        "全日制硕士",
        "全日制本科",
        "高级技师",
        "技师",
        "高级工",
      ],
      itemObj: {
        id: "",
        name: "",
        gender: "",
        age: "",
        idCard: "",
        marital: "",
        houseHoldAddress: "",
        phoneNumber: "",
        mailingAddress: "",
        skillGrade: "",
        certificateName: "",
        certificateNumber: "",
        agency: "",
        type: "",
        industryCategory: "",
        unit: "",
        unitAddress: "",
        socialSecurityUnit: "",
        socialSecurityStatus: "",
        familyList: [],
        attachments: [], //附件
        chooseFile: "", //当前上传文件
        chooseFileArr: [], //所有附件列表--提交参数
        chooseFileArr1: [], //所
        delAttachmentIds: [], //删除附件id集合
        dialogVisible: false,
        leaseIntentionArea: "",
        remark: "",
        status: "",
      },
      familyList: [],
      relationList: ["父母", "配偶", "子女", "父亲", "母亲"],
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
        {
          code: "ABE152E0-6D92-4FEB-9E2B-0314C8783824",
          area: "东湖生态旅游风景区",
        },
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

      // 2022-06-30
      shDialogTableVisible: false,
      mask: JSON.parse(localStorage.getItem("maskObj"))[0].mask,
      logDialogISshow: false,
      logListData: [],

      zfForm: {
        alaId: "",
        studentId: "",
        fangGuanOpinion: "",
        peopleClubOpinion: "",
        type: "alas",
      },
    });

    const toAudit = (id, status, titleName) => {
      if (
        status == null ||
        status == "" ||
        status == "退回" ||
        status == "不通过" ||
        status == "作废"
      ) {
        state.btnIsShow = true;
      } else {
        state.btnIsShow = false;
      }
      state.shDialogTableVisible = true;
      state.shForm = {};
      let arr = [
        {
          relation: "",
          memberName: "",
          zjlx: "",
          memberIdcard: "",
        },
        {
          relation: "",
          memberName: "",
          zjlx: "",
          memberIdcard: "",
        },
        {
          relation: "",
          memberName: "",
          zjlx: "",
          memberIdcard: "",
        },
        {
          relation: "",
          memberName: "",
          zjlx: "",
          memberIdcard: "",
        },
        {
          relation: "",
          memberName: "",
          zjlx: "",
          memberIdcard: "",
        },
      ];
      if (!id) {
        state.titleName = "新增";
        let familyList = [];
        state.familyList = familyList.concat(...arr).slice(0, 5);

        state.itemObj.id = "";
        state.itemObj.name = "";
        state.itemObj.gender = "";
        state.itemObj.age = "";
        state.itemObj.idCard = "";
        state.itemObj.marital = "";
        state.itemObj.houseHoldAddress = "";
        state.itemObj.phoneNumber = "";
        state.itemObj.mailingAddress = "";
        state.itemObj.skillGrade = "";
        state.itemObj.certificateName = "";
        state.itemObj.certificateNumber = "";
        state.itemObj.agency = "";
        state.itemObj.type = "";
        state.itemObj.industryCategory = "";
        state.itemObj.unit = "";
        state.itemObj.unitAddress = "";
        state.itemObj.socialSecurityUnit = "";
        state.itemObj.socialSecurityStatus = "";
        state.itemObj.familyList = [];
        state.itemObj.attachments = []; //附件
        state.itemObj.chooseFile = ""; //当前上传文件
        state.itemObj.chooseFileArr = []; //所有附件列表--提交参数
        state.itemObj.chooseFileArr1 = [];
        state.itemObj.delAttachmentIds = []; //删除附件id集合
        state.itemObj.dialogVisible = false;
        state.itemObj.leaseIntentionArea = "";
        state.itemObj.remark = "";
        state.itemObj.status = "";
      } else {
        state.titleName = titleName;
        http
          .get(`/rentserver/apartmentLeaseApplySkillTalent/getById?id=${id}`)
          .then((res) => {
            if (res) {
              state.itemObj.id = res.data.id;
              state.itemObj.status = res.data.status;
              state.itemObj.name = res.data.name;
              state.itemObj.gender = res.data.gender;
              state.itemObj.age = res.data.age;
              state.itemObj.idCard = res.data.idCard;
              state.itemObj.marital = res.data.marital;
              state.itemObj.houseHoldAddress = res.data.houseHoldAddress;
              state.itemObj.phoneNumber = res.data.phoneNumber;
              state.itemObj.mailingAddress = res.data.mailingAddress;
              state.itemObj.skillGrade = res.data.skillGrade;
              state.itemObj.certificateName = res.data.certificateName;
              state.itemObj.certificateNumber = res.data.certificateNumber;
              state.itemObj.agency = res.data.agency;
              state.itemObj.type = res.data.type;
              state.itemObj.industryCategory = res.data.industryCategory;
              state.itemObj.unit = res.data.unit;
              state.itemObj.unitAddress = res.data.unitAddress;
              state.itemObj.socialSecurityUnit = res.data.socialSecurityUnit;
              state.itemObj.socialSecurityStatus =
                res.data.socialSecurityStatus;
              state.itemObj.attachments = res.data.attachments; //附件
              state.itemObj.chooseFileArr = res.data.attachments.map((e) => {
                return e.type;
              }); //所有附件列表--提交参数
              state.itemObj.leaseIntentionArea = res.data.leaseIntentionArea;
              state.itemObj.remark = res.data.remark;
              let familyList = res.data.studentFamilies;
              state.familyList = familyList.concat(arr).slice(0, 5);
              state.itemObj.delAttachmentIds = [];
              state.itemObj.chooseFileArr1 = [];
            }
          });
      }
    };

    // 日志
    const logClick = (id) => {
      let paramsObj = {
        applyId: id,
      };
      http
        .get("/rentserver/auditLog/getByApplyId", paramsObj, {
          message: false,
        })
        .then((res) => {
          state.logListData = res.data.list;
          state.logDialogISshow = true;
        });
    };

    const downFile = ({ fileName, filePath }) => {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function (e) {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png");
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        if (fileName) {
          a.download = fileName;
        } else {
          a.download = "down_load.jpg";
        }
        a.href = url;
        a.dispatchEvent(event);
      };
      image.src = "/images" + filePath;
    };

    const handleDates = () => {
      defaultQuery.value.startDate = dates.value[0];
      defaultQuery.value.endDate = dates.value[1];
    };

    // 关闭弹窗
    const dialogCloseDef = () => {
      dialogObjDelDef.dialogVisible = false;
    };
    // 确定
    const dialogSuccessDef = () => {
      dialogObjDelDef.dialogVisible = false;
    };

    const showDialogObjDelDef = () => {
      dialogObjDelDef.imgs.length = 0;
      for (let i = 0; i < state.attachList.length; i++) {
        dialogObjDelDef.imgs.push("/images" + state.attachList[i].filePath);
      }
      dialogObjDelDef.dialogVisible = true;
    };
    const deleteTimeFun = (e) => {
      dates.value = e;
    };

    // 上传附件
    const getFile = (e) => {
      if (!state.itemObj.chooseFile) {
        ElMessage({ type: "error", message: "请选择类型" });
        return false;
      }
      const input = e.target;
      const [file] = input.files;
      input.value = "";
      let reg = /\.(JPG|jpg|PDF|pdf)$/;
      let regStatus = reg.test(file.name);
      if (!regStatus) {
        ElMessage({ type: "error", message: "请上传jpg或pdf格式类型的附件" });
        return;
      }
      let arr = state.itemObj.attachments.filter((item) => {
        return item.type == state.itemObj.chooseFile;
      });
      if (arr.length > 0) {
        ElMessage({ type: "error", message: "当前选择的附件类型已上传" });
        return;
      }

      let arr2 = state.itemObj.attachments;
      arr2.push({
        file,
        fileName: file.name,
        time: Date.now(),
        id: "",
        filePath: "",
        type: state.itemObj.chooseFile,
      });
      state.itemObj.attachments = arr2;
      state.itemObj.chooseFileArr.push(state.itemObj.chooseFile);
      state.itemObj.chooseFileArr1.push(state.itemObj.chooseFile);
    };

    // 删除附件
    const delFile = (v) => {
      let i = state.itemObj.attachments.findIndex((e) => e.type === v.type);
      if (i > -1) {
        if (state.itemObj.attachments[i].id) {
          state.itemObj.delAttachmentIds.push(state.itemObj.attachments[i].id);
        }
        state.itemObj.attachments.splice(i, 1);
        state.itemObj.chooseFileArr.splice(i, 1);
        let c = state.itemObj.chooseFileArr1.indexOf(v.type);
        state.itemObj.chooseFileArr1.splice(c, 1);
      }
    };

    // 表单校验
    const checkForm = () => {
      if (state.itemObj.name.length == 0) {
        ElMessage({ type: "error", message: "姓名为空，请先填写" });
        return false;
      }
      if (state.itemObj.gender != "0" && state.itemObj.gender != "1") {
        ElMessage({ type: "error", message: "性别为空，请先填写" });
        return false;
      }
      if (!state.itemObj.age) {
        ElMessage({ type: "error", message: "年龄为空，请先填写" });
        return false;
      }
      if (state.itemObj.idCard.length == 0) {
        ElMessage({ type: "error", message: "证件号为空，请先填写" });
        return false;
      }
      const idCardRegx = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!idCardRegx.test(state.itemObj.idCard)) {
        ElMessage({ type: "error", message: "证件号不合法！" });
        return false;
      }
      if (!state.itemObj.marital) {
        ElMessage({ type: "error", message: "婚姻状态为空，请先填写" });
        return false;
      }
      if (state.itemObj.houseHoldAddress.length == 0) {
        ElMessage({ type: "error", message: "户籍地址为空，请先填写" });
        return false;
      }
      if (state.itemObj.phoneNumber.length == 0) {
        ElMessage({ type: "error", message: "移动电话为空，请先填写" });
        return false;
      }
      const mobilePhoneRegx = /^1[3|4|5|7|8|9]\d{9}$/;
      if (!mobilePhoneRegx.test(state.itemObj.phoneNumber)) {
        ElMessage({ type: "error", message: "移动电话不合法！" });
        return false;
      }
      if (state.itemObj.mailingAddress.length == 0) {
        ElMessage({ type: "error", message: "通讯地址，请先填写" });
        return false;
      }
      if (state.itemObj.skillGrade.length == 0) {
        ElMessage({ type: "error", message: "技能等级，请先填写" });
        return false;
      }
      if (state.itemObj.certificateName.length == 0) {
        ElMessage({ type: "error", message: "证书名称，请先填写" });
        return false;
      }
      if (state.itemObj.certificateNumber.length == 0) {
        ElMessage({ type: "error", message: "证书编号，请先填写" });
        return false;
      }
      if (state.itemObj.agency.length == 0) {
        ElMessage({ type: "error", message: "办理机构，请先填写" });
        return false;
      }
      if (state.itemObj.type.length == 0) {
        ElMessage({ type: "error", message: "创业就业类型为空，请先填写" });
        return false;
      }
      if (state.itemObj.industryCategory.length == 0) {
        ElMessage({ type: "error", message: "所在行业为空，请先填写" });
        return false;
      }
      if (state.itemObj.unit.length == 0) {
        ElMessage({ type: "error", message: "所在单位为空，请先填写" });
        return false;
      }
      if (state.itemObj.unitAddress.length == 0) {
        ElMessage({ type: "error", message: "单位地址为空，请先填写" });
        return false;
      }
      if (state.itemObj.socialSecurityUnit.length == 0) {
        ElMessage({ type: "error", message: "缴费单位为空，请先填写" });
        return false;
      }
      if (state.itemObj.socialSecurityStatus.length == 0) {
        ElMessage({ type: "error", message: "缴费状态，请先填写" });
        return false;
      }
      if (state.itemObj.leaseIntentionArea.length == 0) {
        ElMessage({ type: "error", message: "配租意向为空，请先填写" });
        return false;
      }
      if (state.itemObj.remark !== "" && state.itemObj.remark.length > 200) {
        ElMessage({ type: "error", message: "备注不能超过200个字" });
        return false;
      }

      // 家庭成员情况
      if (state.familyList) {
        let relation = state.familyList.every((e) => e.relation == "");
        let memberName = state.familyList.every((e) => e.memberName == "");
        let zjlx = state.familyList.every(
          (e) => e.zjlx != "0" && e.zjlx != "2" && e.zjlx != "3"
        );
        let memberIdcard = state.familyList.every((e) => e.memberIdcard == "");

        if (relation || memberName || zjlx || memberIdcard) {
          ElMessage({
            type: "error",
            message: "家庭成员情况列表为空，请先填写",
          });
          return false;
        }

        // 果然已婚。需提交配偶信息
        if (state.itemObj.marital == "已婚") {
          let relation1 = state.familyList.filter((e) => e.relation == "1");
          if (relation1.length == 0) {
            ElMessage({
              type: "error",
              message: "婚姻状况为已婚，必须填写完整配偶信息！",
            });
            return false;
          }
          if (
            relation1[0].relation == "" ||
            relation1[0].memberName == "" ||
            relation1[0].zjlx === "" ||
            relation1[0].memberIdcard == ""
          ) {
            ElMessage({
              type: "error",
              message: "婚姻状况为已婚，必须填写完整配偶信息！",
            });
            return false;
          }
        }
      }
      return true;
    };
    const checkAttach = () => {
      if (!state.itemObj.chooseFileArr.includes("13")) {
        ElMessage({ type: "error", message: "请上传本人身份证正反面" });
        return false;
      }
      if (!state.itemObj.chooseFileArr.includes("9")) {
        ElMessage({ type: "error", message: "请上传户口本本人信息页" });
        return false;
      }

      if (state.itemObj.marital == "已婚") {
        if (!state.itemObj.chooseFileArr.includes("4")) {
          ElMessage({ type: "error", message: "请上传结婚证或婚姻状况具结书" });
          return false;
        }
        if (!state.itemObj.chooseFileArr.includes("20")) {
          ElMessage({ type: "error", message: "请上传配偶身份证正反面" });
          return false;
        }
      } else if (state.itemObj.marital == "未婚") {
        let isfather = state.familyList.some((e) => e.relation == "3");
        if (isfather) {
          if (!state.itemObj.chooseFileArr.includes("18")) {
            ElMessage({ type: "error", message: "请上传父亲身份证正反面" });
            return false;
          }
        }
        let ismother = state.familyList.some((e) => e.relation == "4");
        if (ismother) {
          if (!state.itemObj.chooseFileArr.includes("19")) {
            ElMessage({ type: "error", message: "请上传母亲身份证正反面" });
            return false;
          }
        }
      }

      if (!state.itemObj.chooseFileArr.includes("21")) {
        ElMessage({ type: "error", message: "请上传单位证明（紧缺工种）" });
        return false;
      }
      if (!state.itemObj.chooseFileArr.includes("22")) {
        ElMessage({ type: "error", message: "请上传劳动合同复印件" });
        return false;
      }
      return true;
    };

    // 保存1、提交2
    const newOnSubmitInfo = (num) => {
      if (num == 1) {
        if (!state.flag) {
          ElMessage({ type: "warning", message: "请勿重复点击~" });
          return;
        }
        state.flag = false;
        submitHttp(1);
      } else if (num == 2) {
        if (!checkForm()) {
          return;
        }
        if (!checkAttach()) {
          return;
        }
        if (!state.flag) {
          ElMessage({ type: "warning", message: "请勿重复点击~" });
          return;
        }
        state.flag = false;
        submitHttp(2);
      }
    };

    const submitHttp = (operateType) => {
      let formData = getParam(operateType);
      apartmentLeaseApplySkillTalentSave(formData)
        .then((res) => {
          if (res.code == 200) {
            ElMessage({ type: "success", message: "操作成功！" });
            state.shDialogTableVisible = false;
            tableRef.value.onFresh();
            state.flag = true;
          } else {
            state.flag = true;
            ElMessage({ type: "error", message: res.msg });
          }
        })
        .catch(() => {
          state.flag = true;
          console.log("出错了");
        });
    };

    // 获取提交参数
    const getParam = (operateType) => {
      const formData = new FormData();
      formData.append("id", state.itemObj.id);
      formData.append("name", state.itemObj.name);
      formData.append("gender", state.itemObj.gender);
      formData.append("age", state.itemObj.age);
      formData.append("idCard", state.itemObj.idCard);
      formData.append("marital", state.itemObj.marital);
      formData.append("houseHoldAddress", state.itemObj.houseHoldAddress);
      formData.append("phoneNumber", state.itemObj.phoneNumber);
      formData.append("mailingAddress", state.itemObj.mailingAddress);
      formData.append("skillGrade", state.itemObj.skillGrade);
      formData.append("certificateName", state.itemObj.certificateName);
      formData.append("certificateNumber", state.itemObj.certificateNumber);
      formData.append("agency", state.itemObj.agency);
      formData.append("type", state.itemObj.type);
      formData.append("industryCategory", state.itemObj.industryCategory);
      formData.append("unit", state.itemObj.unit);
      formData.append("unitAddress", state.itemObj.unitAddress);
      formData.append("socialSecurityUnit", state.itemObj.socialSecurityUnit);
      formData.append(
        "socialSecurityStatus",
        state.itemObj.socialSecurityStatus
      );
      formData.append("leaseIntentionArea", state.itemObj.leaseIntentionArea);
      formData.append("remark", state.itemObj.remark);
      formData.append("deleteIds", state.itemObj.delAttachmentIds.join(","));
      formData.append("chooseFile", state.itemObj.chooseFileArr1.join(","));
      let item = state.familyList.filter((e) => {
        return (
          e.relation !== "" &&
          e.memberName !== "" &&
          e.zjlx !== "" &&
          e.memberIdcard !== ""
        );
      });
      item.forEach((v, index) => {
        for (let key in v) {
          if (key == "createDate") v[key] = moment(v[key]).format("YYYY-MM-DD");
          formData.append(`studentFamilies[${index}].${key}`, v[key]);
        }
      });
      state.itemObj.attachments.forEach((file, index) => {
        file.file && formData.append(`file`, file.file);
      });
      formData.append("operateType", operateType);
      formData.append("applyType", 2);
      return formData;
    };
    return {
      ...toRefs(state),
      tableRef,
      isOrg,
      dayjs,
      toAudit,
      logClick,
      handleDates,
      dates,
      defaultQuery,
      dialogObjDelDef,
      dialogCloseDef,
      dialogSuccessDef,
      showDialogObjDelDef,
      deleteTimeFun,
      downFile,
      getFile,
      delFile,
      newOnSubmitInfo,
      checkForm,
      checkAttach,
      submitHttp,
      getParam,
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

.tx-box {
  display: flex;
  img {
    width: 180px;
    height: 180px;
    margin-right: 20px;
  }
}

// 底部横向滚动条屏小不显示
::v-deep .el-table__body-wrapper {
  overflow: initial !important;
}
::v-deep .el-table__header-wrapper {
  overflow: initial !important;
}
</style>
