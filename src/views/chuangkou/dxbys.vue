<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    :query="defaultQuery"
    url="/rentserver/apartmentLeaseApply/getByConditionQuery2"
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
      <el-button type="primary" @click="toAudit('新增', '', '新增')">
        新增
      </el-button>
    </template>
    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column label="性别" prop="gender">
      <template #default="{ row }">
        {{ row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column label="人才类别" prop="talentType" align="center">
      大学毕业生
    </el-table-column>
    <el-table-column label="最高学历" prop="education" align="center">
      <template #default="{ row }">
        <span v-if="row.education == 'BAA102522D404273A34CEAF26478CAF2'">
          大专及以下
        </span>
        <span v-if="row.education == '6F3A155C4A25410FBD13A47B2EBB5285'">
          本科
        </span>
        <span v-if="row.education == '3012A9BC0C8843CB9E74A5D5A5EAE70B'">
          硕士研究生
        </span>
        <span v-if="row.education == '79C986D1-8811-45FD-A320-A10108B1FCE6'">
          博士研究生
        </span>
      </template>
    </el-table-column>
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
        <el-button type="text" @click="logClick(row.id, row.status)">
          日志
        </el-button>
      </template>
    </el-table-column>
  </V-Table>
  <!--  新增日志 -->
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
            <td class="infobt" rowspan="4" style="width: 15%">基本信息</td>
            <td class="infobt">姓名</td>
            <td class="infort" style="width: 15%">
              <el-input v-model="itemObj.name" placeholder="请输入"></el-input>
            </td>
            <td class="infobt">性别</td>
            <td style="width: 20%">
              <el-radio-group v-model="itemObj.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </td>
            <td class="infobt">民族</td>
            <td>
              <el-input
                v-model="itemObj.nation"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td class="infobt">证件类型</td>
            <td colspan="1">
              <el-select v-model="itemObj.zjlx">
                <el-option
                  v-for="(v, i) in idCardList"
                  :key="i"
                  :value="v.code"
                  :label="v.name"
                >
                  {{ v.name }}
                </el-option>
              </el-select>
            </td>
            <td class="infobt">证件号码</td>
            <td colspan="1">
              <el-input
                v-model="itemObj.idCard"
                placeholder="请输入"
              ></el-input>
            </td>
            <td class="infobt">婚姻状态</td>
            <td colspan="1">
              <el-select v-model="itemObj.marital">
                <el-option
                  v-for="(v, i) in marriedList"
                  :key="i"
                  :value="v.code"
                  :label="v.name"
                >
                  {{ v.name }}
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="infobt">户籍地址</td>
            <td colspan="5">
              <el-input
                v-model="itemObj.houseHoldAddress"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td class="infobt">现住地址</td>
            <td colspan="5">
              <el-input
                v-model="itemObj.liveAddress"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="2">通讯方式</td>
            <td class="infobt">移动电话</td>
            <td colspan="2">
              <el-input
                v-model="itemObj.phoneNumber"
                placeholder="请输入"
              ></el-input>
            </td>
            <td class="infobt">微信号</td>
            <td colspan="3">
              <el-input
                v-model="itemObj.weixin"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>
          <tr>
            <td class="infobt">通讯地址</td>
            <td colspan="5">
              <el-input
                v-model="itemObj.mailingAddress"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="5">学历信息</td>
            <td class="infobt">毕业院校</td>
            <td colspan="2">
              <el-input
                v-model="itemObj.school"
                placeholder="请输入"
              ></el-input>
            </td>
            <td class="infobt">毕业时间</td>
            <td colspan="2">
              <el-date-picker
                v-model="itemObj.graduateDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
              ></el-date-picker>
            </td>
          </tr>

          <tr>
            <td class="infobt">学历</td>
            <td colspan="2">
              <el-select v-model="itemObj.education">
                <el-option
                  v-for="(v, i) in educationList"
                  :key="i"
                  :value="v.code"
                  :label="v.level"
                >
                  {{ v.level }}
                </el-option>
              </el-select>
            </td>
            <td class="infobt">毕业证号</td>
            <td colspan="2">
              <el-input
                v-model="itemObj.educationCard"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>

          <tr>
            <td class="infobt">学位</td>
            <td colspan="2">
              <el-select v-model="itemObj.degree">
                <el-option value="" label="—请选择—">—请选择—</el-option>
                <el-option
                  value="FFF9AFFC-6ADF-4673-9384-161D4EEAD08E"
                  label="学士及以下"
                >
                  学士及以下
                </el-option>
                <el-option
                  value="0FF20517-1EC2-4548-9C7E-4ADE2B2C1B11"
                  label="硕士"
                >
                  硕士
                </el-option>
                <el-option
                  value="9A0EE126-5799-4C7F-A477-50CA214F3A49"
                  label="博士"
                >
                  博士
                </el-option>
              </el-select>
            </td>
            <td class="infobt">学位证号</td>
            <td colspan="2">
              <el-input
                v-model="itemObj.degreeCard"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>

          <tr>
            <td class="infobt">专业</td>
            <td colspan="5">
              <el-select
                v-model.trim="specalityXkml"
                style="width: 150px; height: 30px"
                @change="getThrSubject"
              >
                <el-option value="">—请选择—</el-option>
                <el-option
                  v-for="(v, i) in friList"
                  :key="i"
                  :value="v.id"
                  :label="v.dictName"
                >
                  {{ v.dictName }}
                </el-option>
              </el-select>
              —
              <el-select
                v-model.trim="specalitySsml"
                style="width: 150px; height: 30px"
                @change="getThrSubject2"
              >
                <el-option value="">—请选择—</el-option>
                <el-option
                  v-for="(v, i) in stuList"
                  :key="i"
                  :value="v.id"
                  :label="v.dictName"
                >
                  {{ v.dictName }}
                </el-option>
              </el-select>
              —

              <el-select
                v-model.trim="specality"
                :value="specality"
                style="width: 150px; height: 30px"
              >
                <el-option value="">—请选择—</el-option>
                <el-option
                  v-for="(v, i) in stuList2"
                  :key="i"
                  :value="v.id"
                  :label="v.dictName"
                >
                  {{ v.dictName }}
                </el-option>
              </el-select>
            </td>
          </tr>

          <tr>
            <td class="infobt">验证码</td>
            <td colspan="3">
              <a
                href="http://www.chsi.com.cn/"
                target="_blank"
                style="color: #00a9ec; display: inline-block; width: 110px"
              >
                点击学信网获取
              </a>
              <span style="color: red; cursor: pointer" @click="lookFile">
                *点击查看获取说明
              </span>
              <el-dialog
                v-model="itemObj.bzDialogVisible"
                title="学信网获取步骤"
                width="50%"
                center
              >
                <div class="xxwCls">
                  <p style="line-height: 30px">学信网验证码获取流程如下：</p>
                  <p>第一步，访问学信网“中国高等教育学历证书查询系统”；</p>
                  <p>
                    第二步，输入证书编号、姓名、图片验证码三项信息，点击“查询”按钮；
                  </p>
                  <p>
                    第三步，输入手机号码、短信验证码两项信息，点击“查询”按钮，查看学历证书查询结果；
                  </p>
                  <p>
                    第四步，点击学历证书查询结果下方的“申请学历证书电子注册备案表”的按钮进行申请；
                  </p>
                  <p>
                    第五步，申请过程中请选择支付方式，并设置好有效期，支付成功后，可查看您申请的《教育部学历证书电子注册备案表》信息；
                  </p>
                  <p>
                    第六步，请把”学历验证报告”当中“在线验证码”填写在“学信网验证码”中。
                  </p>
                  <p>
                    (“学信网验证码”为16位阿拉伯数字及字母组合而成，请在复制的时候检查是否有“漏复”、“复错”和“未复制成功”等情况。)
                  </p>
                </div>
              </el-dialog>
            </td>
            <td colspan="2">
              <el-input
                v-model="itemObj.checkCode"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="2">创业就业信息</td>
            <td class="infobt">创业就业类型</td>
            <td colspan="2">
              <el-select v-model="itemObj.type">
                <el-option value="" label="-请选择-">—请选择—</el-option>
                <el-option value="创业" label="创业">创业</el-option>
                <el-option value="就业" label="就业">就业</el-option>
              </el-select>
            </td>
            <td class="infobt">所在行业</td>
            <td colspan="2">
              <el-select
                v-model.trim="itemObj.industryCategory"
                name="ddlIndustryCategory"
                class="form-control"
                :popper-append-to-body="false"
              >
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
              <el-input v-model="itemObj.unit" placeholder="请输入"></el-input>
            </td>
            <td class="infobt">单位地址</td>
            <td colspan="2">
              <el-input
                v-model="itemObj.unitAddress"
                placeholder="请输入"
              ></el-input>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="6">家庭成员情况</td>
            <td class="infobt">与申请人关系</td>
            <td class="infobt" colspan="2">姓名</td>
            <td class="infobt" colspan="3">证件类型-证件号码</td>
          </tr>
          <tr v-for="(item, index) in itemObj.studentFamilies" :key="index">
            <td>
              <el-select
                v-model="item.relation"
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
            <td colspan="2">
              <el-input
                v-model.trim="item.memberName"
                type="text"
                class="wenzishur"
              />
            </td>
            <td colspan="3">
              <el-select
                id="ddlfzjlx3"
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
            </td>
          </tr>
          <tr style="height: auto">
            <td class="infobt">备注</td>
            <td colspan="6">
              <el-input
                id="labRemark"
                v-model="itemObj.remark"
                style="height: auto; line-height: 24px"
                type="textarea"
                autosize
              ></el-input>
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
                <b @click="lookFile2">*上传资料规范（点击查看）</b>
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
                :disabled="dis"
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
                })[0]?.val
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
      <el-button type="primary" @click="onSubmitInfo(1)">保存</el-button>
      <el-button type="primary" @click="onSubmitInfo(2)">提交</el-button>
    </div>
  </VFormDialog>
</template>
<script>
import moment from "moment";
import http from "/@/config/http";
import VFormDialog from "/@/components/VFormDialog.vue";
import VTable from "/@/components/VTable.vue";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import tipFile from "./tipFile.vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import {
  friSubject,
  thrSubject,
  apartmentLeaseApplySave,
} from "/@/config/commonHttp";
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
      attachType: [
        { code: "13", val: "本人身份证正反面" },
        { code: "9", val: "户口本本人信息页" },
        { code: "18", val: "父亲身份证正反面" },
        { code: "19", val: "母亲身份证正反面" },
        { code: "4", val: "结婚证或婚姻状况具结书" },
        { code: "20", val: "配偶身份证正反面" },
        { code: "3", val: "子女身份证正反面" },
        { code: "11", val: "学历证书或留学生服务中心认证报告" },
        { code: "5", val: "学位证书" },
        { code: "6", val: "社保缴纳证明或就业合同或其他形式就业证明" },
        { code: "7", val: "营业执照或其他形式创业证明" },
      ],
      itemObj: {
        marital: "",
        id: "",
        studentId: "",
        name: "",
        gender: "",
        nation: "",
        idCard: "",
        zjlx: "",
        phoneNumber: "",
        weixin: "",
        school: "",
        graduateDate: "",
        degreeCard: "",
        type: "",
        unit: "",
        unitAddress: "",
        houseHoldAddress: "",
        liveAddress: "",
        mailingAddress: "",
        studentFamilies: [],
        leaseIntentionArea: "",
        educationCard: "",
        education: "",
        degree: "",
        industryCategory: "",
        // 备注
        tip: "",
        chooseFile: "",
        chooseFileArr: [],
        chooseFileArr1: [],
        file: [],
        saveBtnStatus: false, // 表单提交按钮的状态
        status: "",

        dis: true,
        attachments: [],
        delAttachmentIds: [], // 删除附件的id

        itemSaveId: "", // 保存时接口返回的id
        // 三级
        specalityXkml: "", //专业1
        specalitySsml: "", //专业2
        specality: "", //专业3
        //验证码
        checkCode: "",
        personTableStatus: "", // 个人信息表单的状态
        dialogVisible: false,
        email: "",
        talentType: "",
        talentGrade: "",
        bzDialogVisible: false,
        // 新增头像
        txImg: "",
        photoId: "",
        userStatus: "",
      },
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
      marriedList: [
        { code: "已婚", name: "已婚" },
        { code: "未婚", name: "未婚" },
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

      shDialogTableVisible: false,
      mask: JSON.parse(localStorage.getItem("maskObj"))[0].mask,
      logDialogISshow: false,
      logListData: [],

      zfForm: {
        alaId: "",
        studentId: "",
        fangGuanOpinion: "",
        peopleClubOpinion: "",
        type: "ala",
      },
      bzDialogVisible: false,
      dialogVisible: false,
      friList: [],
      stuList: [],
      stuList2: [],
      specalityXkml: "",
      specalitySsml: "",
      specality: "",
      dis: false,
    });

    const toAudit = (id, status, titleName) => {
      state.titleName = titleName;
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
      if (id == "新增") {
        let studentFamilies = [];
        state.itemObj.studentFamilies = studentFamilies
          .concat(...arr)
          .slice(0, 5);
      } else {
        http
          .get(`/rentserver/apartmentLeaseApply/getAlaById?id=${id}`)
          .then((res) => {
            if (res) {
              state.itemObj.id = res.data.id;
              state.itemObj.studentId = res.data.studentId;
              state.itemObj.status = res.data.status;
              state.itemObj.marital = res.data.marital;
              state.itemObj.name = res.data.name;
              state.itemObj.gender = res.data.gender;
              state.itemObj.nation = res.data.nation;
              state.itemObj.idCard = res.data.idCard;
              state.itemObj.zjlx = res.data.zjlx;
              state.itemObj.phoneNumber = res.data.phoneNumber;
              state.itemObj.weixin = res.data.weixin;
              state.itemObj.school = res.data.school;
              state.itemObj.graduateDate =
                res.data.graduateDate && res.data.graduateDate != "null"
                  ? moment(res.data.graduateDate).format("YYYY-MM-DD")
                  : "";

              state.itemObj.degreeCard = res.data.degreeCard;
              state.itemObj.type = res.data.type;
              state.itemObj.unit = res.data.unit;
              state.itemObj.unitAddress = res.data.unitAddress;
              state.itemObj.houseHoldAddress = res.data.houseHoldAddress;
              state.itemObj.liveAddress = res.data.liveAddress;
              state.itemObj.mailingAddress = res.data.mailingAddress;
              state.itemObj.leaseIntentionArea = res.data.leaseIntentionArea;
              state.itemObj.educationCard = res.data.educationCard;
              state.itemObj.education = res.data.education;
              state.itemObj.degree = res.data.degree;
              state.itemObj.industryCategory = res.data.industryCategory;
              state.itemObj.checkCode = res.data.checkCode;

              state.specalityXkml = res.data.specalityXkml;
              state.specalitySsml = res.data.specalitySsml;
              state.specality = res.data.specality;
              getThrSubjectCopy();
              getThrSubject2Copy();

              state.itemObj.remark = res.data.remark.includes("\n")
                ? res.data.remark.replace("\n", "<br/>")
                : res.data.remark;

              state.itemObj.attachments = res.data.attachments;
              state.itemObj.chooseFileArr = res.data.attachments.map((e) => {
                return e.type;
              });
              let studentFamilies = res.data.studentFamilies || [];
              state.itemObj.studentFamilies = studentFamilies
                .concat(arr)
                .slice(0, 5);
              state.itemObj.delAttachmentIds = [];
              state.itemObj.chooseFileArr1 = [];
            }
          });
      }
    };

    const onSubmitInfo = (operateType) => {
      let formData = getParam(operateType);
      if (operateType == 1) {
        if (!state.flag) {
          ElMessage({ type: "warning", message: "请勿重复点击~" });
          return;
        }
        state.flag = false;
        apartmentLeaseApplySave(formData)
          .then((res) => {
            if (res.code == 200) {
              ElMessage({ type: "success", message: res.msg });
              state.flag = true;
              state.shDialogTableVisible = false;
              tableRef.value.onFresh();
            } else {
              state.flag = true;
              ElMessage({ type: "error", message: res.msg });
            }
          })
          .catch(() => {
            state.flag = true;
            console.log("出错了");
          });
      } else if (operateType == 2) {
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
        apartmentLeaseApplySave(formData)
          .then((res) => {
            if (res.code == 200) {
              ElMessage({ type: "success", message: res.msg });
              state.flag = true;
              state.shDialogTableVisible = false;
              tableRef.value.onFresh();
            } else {
              state.flag = true;
              ElMessage({ type: "error", message: res.msg });
            }
          })
          .catch(() => {
            state.flag = true;
            console.log("出错了");
          });
      }
    };

    const getParam = (operateType) => {
      const formData = new FormData();
      formData.append("id", state.itemObj.id || "");
      formData.append("studentId", state.itemObj.studentId || "");
      formData.append("name", state.itemObj.name || "");
      formData.append("nation", state.itemObj.nation || "");
      formData.append("marital", state.itemObj.marital || "");
      formData.append("gender", state.itemObj.gender || "0");
      formData.append("idCard", state.itemObj.idCard || "");
      formData.append("zjlx", state.itemObj.zjlx || "0");
      formData.append("phoneNumber", state.itemObj.phoneNumber || "");
      formData.append("weixin", state.itemObj.weixin || "");
      formData.append("school", state.itemObj.school || "");
      formData.append("graduateDate", state.itemObj.graduateDate || "");
      formData.append("type", state.itemObj.type || "");
      formData.append("unit", state.itemObj.unit || "");
      formData.append("unitAddress", state.itemObj.unitAddress || "");
      formData.append("houseHoldAddress", state.itemObj.houseHoldAddress || "");
      formData.append("liveAddress", state.itemObj.liveAddress || "");
      let item = state.itemObj.studentFamilies.filter((e) => {
        return (
          e.relation !== "" &&
          e.memberName !== "" &&
          e.zjlx !== "" &&
          e.memberIdcard !== ""
        );
      });
      item.forEach((v, index) => {
        for (let key in v) {
          if (key == "createDate") {
            v[key] = dayjs(v[key]).format("YYYY-MM-DD");
          }
          formData.append(`studentFamilies[${index}].${key}`, v[key]);
        }
      });
      formData.append(
        "leaseIntentionArea",
        state.itemObj.leaseIntentionArea || ""
      );
      formData.append("educationCard", state.itemObj.educationCard || "");
      formData.append("education", state.itemObj.education || "");
      formData.append("degree", state.itemObj.degree || "");
      formData.append("degreeCard", state.itemObj.degreeCard || "");
      formData.append("industryCategory", state.itemObj.industryCategory || "");
      formData.append("remark", state.itemObj.remark || "");
      formData.append("status", state.itemObj.status || "");
      formData.append("checkCode", state.itemObj.checkCode || "");
      state.itemObj.attachments.forEach((file, index) => {
        file.file && formData.append(`file`, file.file);
      });

      formData.append("deleteIds", state.itemObj.delAttachmentIds.join(","));
      let arr = state.itemObj.chooseFileArr1;
      formData.append("chooseFile", arr.join(","));
      formData.append("professionalType", state.specality || "");
      formData.append("specalityXkml", state.specalityXkml || "");
      formData.append("specalitySsml", state.specalitySsml || "");
      formData.append("specality", state.specality || "");
      formData.append("operateType", operateType);
      formData.append("email", state.itemObj.email || "");
      formData.append("talentType", state.itemObj.talentType || "");
      formData.append("talentGrade", state.itemObj.talentGrade || "");
      formData.append("photoId", state.itemObj.photoId || "");
      formData.append("mailingAddress", state.itemObj.mailingAddress || "");
      formData.append("applyType", 2);
      return formData;
    };

    const getFile = (e) => {
      console.log(state.itemObj.chooseFile);
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

    // 日志
    const logClick = (id) => {
      let paramsObj = {
        applyId: id,
      };
      http
        .get("/rentserver/auditLog/getByApplyId", paramsObj, {
          message: true,
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

    const handleDates = () => {
      defaultQuery.value.startDate = dates.value[0];
      defaultQuery.value.endDate = dates.value[1];
    };

    const dialogCloseDef = () => {
      dialogObjDelDef.dialogVisible = false;
    };
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

    const lookFile = () => {
      state.itemObj.bzDialogVisible = true;
    };

    const lookFile2 = () => {
      state.itemObj.dialogVisible = true;
    };

    const getfriSubject = async () => {
      const { data } = await friSubject();
      state.friList = data;
    };
    const getThrSubject = async () => {
      const { data } = await thrSubject({
        parentName: state.specalityXkml,
      });
      state.stuList = data;
      state.specalitySsml = "";
      state.specality = "";
    };
    const getThrSubject2 = async () => {
      const { data } = await thrSubject({
        parentName: state.specalitySsml,
      });
      state.stuList2 = data;
      state.specality = "";
    };

    const getThrSubjectCopy = async () => {
      const { data } = await thrSubject({
        parentName: state.specalityXkml,
      });
      state.stuList = data;
    };
    const getThrSubject2Copy = async () => {
      const { data } = await thrSubject({
        parentName: state.specalitySsml,
      });
      state.stuList2 = data;
    };
    getfriSubject();

    // 附件校验
    const checkAttach = () => {
      if (!state.itemObj.chooseFileArr.includes("13")) {
        ElMessage({ type: "error", message: "请上传本人身份证正反面" });
        return false;
      }
      if (!state.itemObj.chooseFileArr.includes("9")) {
        ElMessage({ type: "error", message: "请上传户口本本人信息页" });
        return false;
      }
      if (!state.itemObj.chooseFileArr.includes("11")) {
        ElMessage({
          type: "error",
          message: "请上传学历证书或留学生服务中心认证报告",
        });
        return false;
      }

      // if (!this.chooseFileArr.includes("5")) {
      //   this.$message.error("请上传学位证书");
      //   return false;
      // }

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
        let isfather = state.itemObj.studentFamilies.some(
          (e) => e.relation == "3"
        );
        if (isfather) {
          if (!state.itemObj.chooseFileArr.includes("18")) {
            ElMessage({ type: "error", message: "请上传父亲身份证正反面" });
            return false;
          }
        }
        let ismother = state.itemObj.studentFamilies.some(
          (e) => e.relation == "4"
        );
        if (ismother) {
          if (!state.itemObj.chooseFileArr.includes("19")) {
            ElMessage({ type: "error", message: "请上传母亲身份证正反面" });
            return false;
          }
        }
      }

      if (state.itemObj.type === "创业") {
        if (!state.itemObj.chooseFileArr.includes("7")) {
          ElMessage({
            type: "error",
            message: "请上传营业执照或其他形式创业证明",
          });
          return false;
        }
        if (!state.itemObj.chooseFileArr.includes("6")) {
          ElMessage({
            type: "error",
            message: "请上传社保缴纳证明或就业合同或其他形式就业证明",
          });
          return false;
        }
      } else if (state.itemObj.type === "就业") {
        if (!state.itemObj.chooseFileArr.includes("6")) {
          ElMessage({
            type: "error",
            message: "请上传社保缴纳证明或就业合同或其他形式就业证明",
          });
          return false;
        }
      }

      // 头像校验
      // if (!this.txImg) {
      //   this.$message.error("请上传个人登记照");
      //   return false;
      // }

      return true;
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
      if (state.itemObj.nation.length == 0) {
        ElMessage({ type: "error", message: "民族为空，请先填写" });
        return false;
      }
      if (
        state.itemObj.zjlx != "0" &&
        state.itemObj.zjlx != "2" &&
        state.itemObj.zjlx != "3"
      ) {
        ElMessage({ type: "error", message: "证件类型为空，请先填写" });
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
      if (state.itemObj.houseHoldAddress.length == 0) {
        ElMessage({ type: "error", message: "户籍地址为空，请先填写" });
        return false;
      }
      if (state.itemObj.liveAddress.length == 0) {
        ElMessage({ type: "error", message: "现住地址为空，请先填写" });
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
      if (state.itemObj.school.length == 0) {
        ElMessage({ type: "error", message: "毕业院校为空，请先填写" });
        return false;
      }
      if (state.itemObj.graduateDate.length == 0) {
        ElMessage({ type: "error", message: "毕业时间为空，请先填写" });
        return false;
      }
      // if (
      //   state.itemObj.specalityXkml.length == 0 ||
      //   state.itemObj.specalitySsml.length == 0 ||
      //   state.itemObj.specality.length == 0
      // ) {
      //   ElMessage({ type: "error", message: "专业为空，请先填写" });
      //   return false;
      // }
      if (!state.specalityXkml || !state.specalitySsml || !state.specality) {
        ElMessage({ type: "error", message: "专业为空，请先填写" });
        return false;
      }
      if (state.itemObj.education.length == 0) {
        ElMessage({ type: "error", message: "学历为空，请先填写" });
        return false;
      }
      if (state.itemObj.educationCard.length == 0) {
        ElMessage({ type: "error", message: "毕业证号为空，请先填写" });
        return false;
      }
      // if (this.degree.length == 0) {
      //   this.$message.error("学位为空，请先填写");
      //   return false;
      // }
      // if (this.degreeCard.length == 0) {
      //   this.$message.error("学位证号为空，请先填写");
      //   return false;
      // }
      if (state.itemObj.checkCode.length == 0) {
        ElMessage({ type: "error", message: "验证码为空，请先填写" });
        return false;
      } else {
        // let regu = "^[0-9a-zA-Z]{16}$";
        // let re = new RegExp(regu);
        // if (!re.test(this.checkCode)) {
        //   this.$message.error("验证码不符合规范");
        //   return false;
        // }
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
      // if (state.itemObj.married.length == 0) {
      //   ElMessage({ type: "error", message: "婚姻状态为空，请先填写" });
      //   return false;
      // }
      if (!state.itemObj.marital) {
        ElMessage({ type: "error", message: "婚姻状态为空，请先填写" });
        return false;
      }
      if (state.itemObj.leaseIntentionArea.length == 0) {
        ElMessage({ type: "error", message: "配租意向为空，请先填写" });
        return false;
      }
      // 家庭成员情况
      if (state.itemObj.studentFamilies) {
        let relation = state.itemObj.studentFamilies.every(
          (e) => e.relation == ""
        );
        let memberName = state.itemObj.studentFamilies.every(
          (e) => e.memberName == ""
        );
        let zjlx = state.itemObj.studentFamilies.every(
          (e) => e.zjlx != "0" && e.zjlx != "2" && e.zjlx != "3"
        );
        let memberIdcard = state.itemObj.studentFamilies.every(
          (e) => e.memberIdcard == ""
        );

        if (relation || memberName || zjlx || memberIdcard) {
          ElMessage({
            type: "error",
            message: "家庭成员情况列表为空，请先填写",
          });
          return false;
        }

        // 果然已婚。需提交配偶信息
        if (state.itemObj.marital == "已婚") {
          let relation1 = state.itemObj.studentFamilies.filter(
            (e) => e.relation == "1"
          );
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

      if (state.itemObj.remark !== "" && state.itemObj.remark.length > 200) {
        ElMessage({ type: "error", message: "备注不能超过200个字" });
        return false;
      }

      return true;
    };
    return {
      ...toRefs(state),
      onSubmitInfo,
      dayjs,
      tableRef,
      isOrg,
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
      lookFile,
      lookFile2,
      getfriSubject,
      getThrSubject,
      getThrSubject2,
      getParam,
      downFile,
      delFile,
      getFile,
      checkAttach,
      checkForm,
      getThrSubjectCopy,
      getThrSubject2Copy,
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
.xxwCls {
  p {
    line-height: 2em !important;
  }
}
</style>
