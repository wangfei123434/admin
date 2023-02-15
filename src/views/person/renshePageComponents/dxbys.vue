<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    :query="defaultQuery"
    url="/rentserver/apartmentLeaseApply/getByConditionQuery"
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
      <el-form-item label="学历审核状态">
        <el-select v-model="query.studentStatus" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in RecordCheckList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人社审核状态">
        <el-select
          v-model="query.peopleClubCheck"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房管审核状态">
        <el-select v-model="query.fangGuanCheck" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
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
    <template #button="{ query }">
      <v-export
        url="/rentserver/apartmentLeaseApply/exportAla"
        method="post"
        :query="{
          leaseIntentionArea: query.leaseIntentionArea,
          status: query.status,
          name: query.name,
          idCard: query.idCard,
          studentStatus: query.studentStatus,
          peopleClubCheck: query.peopleClubCheck,
          fangGuanCheck: query.fangGuanCheck,
          startDate: query.startDate,
          endDate: query.endDate,
        }"
        filename="大学毕业生租房申请.xlsx"
      >
        <el-button type="primary">导出</el-button>
      </v-export>
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
    <el-table-column label="学历审核状态" prop="studentStatus" align="center">
      <template #default="{ row }">
        <span v-if="row.studentStatus == 1">审核中</span>
        <span v-if="row.studentStatus == 2">通过</span>
        <span v-if="row.studentStatus == 3">不通过</span>
        <span v-if="row.studentStatus == 4">退回</span>
        <span v-if="row.studentStatus == 5">作废</span>
      </template>
    </el-table-column>
    <el-table-column
      label="人社审核状态"
      prop="peopleClubCheck"
      align="center"
    ></el-table-column>
    <el-table-column
      label="房管审核状态"
      prop="fangGuanCheck"
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
        <el-button
          type="text"
          @click="(zfDialogTableVisible = true), zuofei(row)"
        >
          <span v-if="row.status == '通过'">作废</span>
        </el-button>
        <el-button type="text" class="check">
          <!-- 房管局角色 -->
          <span v-if="mask == 'ROLE_HOUSE_MANAGE'">
            <span
              v-if="
                (row.fangGuanCheck == null ||
                  row.fangGuanCheck == '' ||
                  row.fangGuanCheck == '审核中') &&
                row.status == '审核中'
              "
              @click="toAudit(row.id)"
            >
              审核
            </span>
            <span v-else @click="toDetail(row.id)">查看</span>
          </span>
          <!-- 人社局角色 -->
          <span v-else-if="mask == 'ROLE_PEOPLE_CLUB'">
            <span
              v-if="
                (row.peopleClubCheck == null ||
                  row.peopleClubCheck == '' ||
                  row.peopleClubCheck == '审核中') &&
                row.status == '审核中'
              "
              @click="toAudit(row.id)"
            >
              审核
            </span>
            <span v-else @click="toDetail(row.id)">查看</span>
          </span>
          <!-- 第三角色 -->
          <span v-else>
            <span
              v-if="
                (row.peopleClubCheck == null ||
                  row.peopleClubCheck == '' ||
                  row.peopleClubCheck == '审核中') &&
                row.status == '审核中'
              "
              @click="toAudit(row.id)"
            >
              审核
            </span>
            <span v-else @click="toDetail(row.id)">查看</span>
          </span>
        </el-button>
        <el-button type="text" @click="(showAttach = true), toAttach(row.id)">
          附件
        </el-button>
        <el-button type="text" @click="logClick(row)">日志</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <!-- 附件 -->
  <el-dialog v-model="showAttach" width="60%" title="附件列表">
    <el-button
      type="text"
      style="font-size: 16px; font-weight: bold"
      @click="showDialogObjDelDef"
    >
      附件预览
    </el-button>
    <v-table :data="attachList">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="文件名称" prop="fileName"></el-table-column>
      <el-table-column label="类型" prop="type">
        <template #default="{ row }">
          <span v-for="(item, index) in attachType" :key="index">
            {{ item.code == row.type ? item.val : "" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="createDate">
        <template #default="{ row }">
          {{ dayjs(row.createDate).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <div>
            <el-button type="text" @click="handlePreviewClick(row)">
              预览
            </el-button>
            <el-button type="text" @click="getDownload(row)">下载</el-button>
          </div>
        </template>
      </el-table-column>
    </v-table>
  </el-dialog>
  <!-- 2022-07-01 新增日志 wf -->
  <el-dialog v-model="logDialogISshow" width="60%" title="日志">
    <div class="tabs-box">
      <div
        :class="activeIndex == 0 ? 'active-sty' : ''"
        @click="activeIndex = 0"
      >
        租房审核日志
      </div>
      <div
        :class="activeIndex == 1 ? 'active-sty' : ''"
        @click="activeIndex = 1"
      >
        学历审核日志
      </div>
    </div>
    <v-table v-if="activeIndex == 0" :data="logListData">
      <el-table-column label="审核结果" prop="type"></el-table-column>
      <el-table-column label="备注说明" prop="memo"></el-table-column>
      <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
      <el-table-column label="操作账号" prop="auditor"></el-table-column>
      <el-table-column label="所属区划" prop="auditOrg"></el-table-column>
      <el-table-column label="角色" prop="auditRole"></el-table-column>
      <el-table-column label="政策依据" prop="policyBasis"></el-table-column>
    </v-table>

    <v-table v-if="activeIndex == 1" :data="logListData2">
      <el-table-column label="审核结果" prop="type"></el-table-column>
      <el-table-column label="备注说明" prop="memo"></el-table-column>
      <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
      <el-table-column label="操作账号" prop="auditor"></el-table-column>
      <el-table-column label="所属区划" prop="auditOrg"></el-table-column>
      <el-table-column label="角色" prop="auditRole"></el-table-column>
    </v-table>
  </el-dialog>

  <!-- 审核  vs 查看 :title="!itemObj.peopleClubCheck ? '审核' : '查看'"-->
  <VFormDialog
    v-model="dialogTableVisible"
    custom-class="info"
    width="60%"
    :model="shForm"
    title="查看"
    @submit="onSubmitInfo"
  >
    <v-export
      :url="`/rentserver/apartmentLeaseApply/backend/exportWord?id=${itemObj.id}`"
      :filename="`武汉市大学毕业生人才公寓租赁资格申请表-${itemObj.name}.doc`"
    >
      <el-button type="primary" class="exportWord">导出word</el-button>
    </v-export>
    <div class="tx-box">
      <img
        v-if="itemObj.photoId"
        :src="'/images' + itemObj.photoId"
        class="photo"
      />

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
            <td class="infort" style="width: 25%">
              <span id="labName">{{ itemObj.name }}</span>
            </td>
            <td class="infobt">性别</td>
            <td>
              <span id="labGender">
                {{ itemObj.gender == 1 ? "男" : "女" }}
              </span>
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
              <span id="labHouseholdAddress">
                {{ itemObj.houseHoldAddress }}
              </span>
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
            <td colspan="3">
              <span id="weixin">{{ itemObj.weixin }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">通讯地址</td>
            <td colspan="5">
              <span id="mailingAddress">{{ itemObj.mailingAddress }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="5">学历信息</td>
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
              <span v-if="itemObj.specalityType" id="labSpecalityType">
                {{ itemObj.specalityType }}
              </span>
              <span v-else id="labSpecalityType">
                {{ itemObj.specalityXkml }}
              </span>
            </td>
            <td class="infobt">专业名称</td>
            <td colspan="2">
              <span v-if="itemObj.specality" id="labSpecality">
                {{ itemObj.specality }}
              </span>
              <span v-else id="labSpecality">{{ itemObj.specalitySsml }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt">验证码</td>
            <td colspan="5">
              <span id="checkCode">{{ itemObj.checkCode }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="2">创业就业信息</td>
            <td class="infobt">创业就业类型</td>
            <td colspan="2">
              <span>{{ itemObj.type }}</span>
            </td>
            <td class="infobt">所在行业</td>
            <td colspan="2">
              <select
                v-model.trim="itemObj.industryCategory"
                name="ddlIndustryCategory"
                class="form-control"
                :disabled="true"
                :popper-append-to-body="false"
                style="
                  border: none;
                  color: black;
                  -moz-appearance: none;
                  -webkit-appearance: none;
                "
              >
                <option value="">—请选择—</option>
                <option value="3F2A1D06368043EB9884C753F78DF3FC">
                  贸易/消费/制造/营运
                </option>
                <option value="7C45D3287BD64915AEAF079F3FADDD26">
                  广告/媒体
                </option>
                <option value="0F7AB0C8BCBD46DA97BD76F4EA7D7667">
                  计算机/互联网/通信/电子
                </option>
                <option value="8EE2F240899240EC8873A5A7B25DCE2A">服务业</option>
                <option value="3962ED65DDCF4B8FADBE7E796C904754">
                  会计/金融/银行/保险
                </option>
                <option value="A7C41A25EC9E482799984B839087778C">
                  政府/非盈利机构
                </option>
                <option value="486928FDFDC0420A847DD0C245627CD0">
                  制药/医疗
                </option>
                <option value="A6C4408F928F4E388F5BC7F6F0D02CA7">
                  能源/原材料
                </option>
                <option value="9272339EB2C948ACB4E15DEC262C66B">
                  物流/运输
                </option>
                <option value="8A38CAE3D31F45C2933104DF8C68B4E9">
                  房地产/建筑
                </option>
                <option value="8DBC2EC937CD4DAA99421C46B1E7A79F">
                  专业服务/教育/培训
                </option>
                <option value="A9ACC70BAB344056938CA5EBBFF2DADD">其他</option>
              </select>
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
              {{ relationList[item.relation] }}
            </td>
            <td>{{ item.memberName }}</td>
            <td colspan="4">
              {{
                item.zjlx == 0
                  ? "身份证"
                  : item.zjlx == 2
                  ? "港澳台通行证"
                  : "护照"
              }}
              — {{ item.memberIdcard }}
            </td>
          </tr>
          <tr>
            <td class="infobt">配租意向</td>
            <td class="infobt">配租意向区域</td>
            <td colspan="5">
              <span
                v-for="(item, index) in areaList"
                id="labLeaseIntentionArea"
                :key="index"
              >
                {{ item.code == itemObj.leaseIntentionArea ? item.area : "" }}
              </span>
            </td>
          </tr>
          <tr style="height: auto">
            <td class="infobt">备注</td>
            <td colspan="6">
              <div
                id="labRemark"
                style="height: auto; line-height: 24px"
                v-html="itemObj.remark"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="itemObj.status"
      class="info"
      style="margin: 20px 0 0 0; width: 100%"
    >
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="infobt">
            <td style="font-size: 16px" colspan="2">审核结果</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="infobt">房管审核状态</td>
            <td>
              <span id="labStatus">{{ itemObj.fangGuanCheck }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">房管审核意见</td>
            <td>
              <span id="labFinallyOpinion">
                {{ itemObj.fangGuanOpinion }}
              </span>
            </td>
          </tr>

          <tr>
            <td class="infobt">人社审核状态</td>
            <td>
              <span id="labStatus">{{ itemObj.peopleClubCheck }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">人社审核意见</td>
            <td>
              <span id="labFinallyOpinion">
                {{ itemObj.peopleClubOpinion }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </VFormDialog>

  <!-- 2022-06-30   审核中 -->
  <VFormDialog
    v-model="shDialogTableVisible"
    custom-class="info"
    width="60%"
    :model="shForm"
    title="审核"
    @submit="onSubmitInfo2"
  >
    <v-export
      :url="`/rentserver/apartmentLeaseApply/backend/exportWord?id=${itemObj.id}`"
      :filename="`武汉市大学毕业生人才公寓租赁资格申请表-${itemObj.name}.doc`"
    >
      <el-button type="primary" class="exportWord">导出word</el-button>
    </v-export>
    <div class="tx-box">
      <img
        v-if="itemObj.photoId"
        :src="'/images' + itemObj.photoId"
        class="photo"
      />
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
            <td class="infort" style="width: 25%">
              <span id="labName">{{ itemObj.name }}</span>
            </td>
            <td class="infobt">性别</td>
            <td>
              <span id="labGender">
                {{ itemObj.gender == 1 ? "男" : "女" }}
              </span>
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
              <span id="labHouseholdAddress">
                {{ itemObj.houseHoldAddress }}
              </span>
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
            <td colspan="3">
              <span id="weixin">{{ itemObj.weixin }}</span>
            </td>
          </tr>
          <tr>
            <td class="infobt">通讯地址</td>
            <td colspan="5">
              <span id="mailingAddress">{{ itemObj.mailingAddress }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="5">学历信息</td>
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
              <span id="labSpecalityType">{{ itemObj.specalityXkml }}</span>
            </td>
            <td class="infobt">专业名称</td>
            <td colspan="2">
              <span id="labSpecality">{{ itemObj.specalitySsml }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt">验证码</td>
            <td colspan="5">
              <span id="checkCode">{{ itemObj.checkCode }}</span>
            </td>
          </tr>

          <tr>
            <td class="infobt" rowspan="2">创业就业信息</td>
            <td class="infobt">创业就业类型</td>
            <td colspan="2">
              <span>{{ itemObj.type }}</span>
            </td>
            <td class="infobt">所在行业</td>
            <td colspan="2">
              <select
                v-model.trim="itemObj.industryCategory"
                name="ddlIndustryCategory"
                class="form-control"
                :disabled="true"
                :popper-append-to-body="false"
                style="
                  border: none;
                  color: black;
                  -moz-appearance: none;
                  -webkit-appearance: none;
                "
              >
                <option value="">—请选择—</option>
                <option value="3F2A1D06368043EB9884C753F78DF3FC">
                  贸易/消费/制造/营运
                </option>
                <option value="7C45D3287BD64915AEAF079F3FADDD26">
                  广告/媒体
                </option>
                <option value="0F7AB0C8BCBD46DA97BD76F4EA7D7667">
                  计算机/互联网/通信/电子
                </option>
                <option value="8EE2F240899240EC8873A5A7B25DCE2A">服务业</option>
                <option value="3962ED65DDCF4B8FADBE7E796C904754">
                  会计/金融/银行/保险
                </option>
                <option value="A7C41A25EC9E482799984B839087778C">
                  政府/非盈利机构
                </option>
                <option value="486928FDFDC0420A847DD0C245627CD0">
                  制药/医疗
                </option>
                <option value="A6C4408F928F4E388F5BC7F6F0D02CA7">
                  能源/原材料
                </option>
                <option value="9272339EB2C948ACB4E15DEC262C66B">
                  物流/运输
                </option>
                <option value="8A38CAE3D31F45C2933104DF8C68B4E9">
                  房地产/建筑
                </option>
                <option value="8DBC2EC937CD4DAA99421C46B1E7A79F">
                  专业服务/教育/培训
                </option>
                <option value="A9ACC70BAB344056938CA5EBBFF2DADD">其他</option>
              </select>
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
              {{ relationList[item.relation] }}
            </td>
            <td>{{ item.memberName }}</td>
            <td colspan="4">
              {{
                item.zjlx == 0
                  ? "身份证"
                  : item.zjlx == 2
                  ? "港澳台通行证"
                  : "护照"
              }}
              — {{ item.memberIdcard }}
            </td>
          </tr>
          <tr>
            <td class="infobt">配租意向</td>
            <td class="infobt">配租意向区域</td>
            <td colspan="5">
              <span
                v-for="(item, index) in areaList"
                id="labLeaseIntentionArea"
                :key="index"
              >
                {{ item.code == itemObj.leaseIntentionArea ? item.area : "" }}
              </span>
            </td>
          </tr>
          <tr style="height: auto">
            <td class="infobt">备注</td>
            <td colspan="6">
              <div
                id="labRemark"
                style="height: auto; line-height: 24px"
                v-html="itemObj.remark"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="fileList">
      <p class="title">人社审核</p>
      <el-form-item
        label="审核结果"
        prop="status"
        :rules="[{ required: true, message: '请选择审核结果' }]"
      >
        <el-radio-group v-model="shForm.status">
          <el-radio label="通过">通过</el-radio>
          <el-radio label="不通过">不通过</el-radio>
          <el-radio label="退回">退回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="备注（退回/不通过原因）"
        prop="opinion"
        :rules="
          shForm.status == '不通过' || shForm.status == '退回'
            ? [{ required: true, message: '请输入不通过或退回原因' }]
            : []
        "
      >
        <el-input v-model="shForm.opinion" type="textarea"></el-input>
      </el-form-item>
    </div>
  </VFormDialog>
  <!--作废-->
  <VFormDialog
    v-model="zfDialogTableVisible"
    custom-class="info"
    width="60%"
    :model="shForm"
    title="作废"
    @submit="validAla"
  >
    <div class="fileList">
      <el-form-item label="作废原因" prop="opinion">
        <el-input v-model="zfForm.peopleClubOpinion" type="textarea"></el-input>
      </el-form-item>
    </div>
  </VFormDialog>

  <SwiperCom
    :dialog-object="dialogObjDelDef"
    @dialogClose="dialogCloseDef"
    @dialogSuccess="dialogSuccessDef"
  ></SwiperCom>
</template>
<script>
import http from "../../../config/http";
// import VSelect from "/@/components/VSelect.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VTable from "/@/components/VTable.vue";
import dayjs from "dayjs";
import VExport from "/@/components/VExport.vue";
import SwiperCom from "/@/components/SwiperCom.vue";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    VExport,
    SwiperCom,
    // VSelect,
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
      activeIndex: 0,
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
        { code: "4", val: "结婚证或婚姻状况具结书" },
        { code: "5", val: "学位证书" },
        { code: "6", val: "社保缴纳证明或就业合同或其他形式就业证明" },
        { code: "7", val: "营业执照或其他形式创业证明" },
        { code: "8", val: "其他" },
        { code: "9", val: "户口本本人信息页" },
        { code: "10", val: "个人登记照" },
        { code: "11", val: "学历证书或留学生服务中心认证报告" },
        { code: "13", val: "本人身份证正反面" },
        { code: "16", val: "社保卡" },
        { code: "18", val: "父亲身份证正反面" },
        { code: "19", val: "母亲身份证正反面" },
        { code: "20", val: "配偶身份证正反面" },
        { code: "21", val: "单位证明（紧缺工种）" },
        { code: "22", val: "劳动合同复印件" },

        // 旧版
        { code: "0", val: "身份证正反面" },
        { code: "1", val: "父母身份证正反面" },
        { code: "2", val: "配偶身份证正反面" },
        { code: "3", val: "子女身份证正反面" },
        { code: "15", val: "个人就业合同" },
      ],
      itemObj: {},
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
      logListData2: [],
      zfForm: {
        alaId: "",
        studentId: "",
        fangGuanOpinion: "",
        peopleClubOpinion: "",
        type: "ala",
      },
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
            state.itemObj.remark = res.data.remark.includes("\n")
              ? res.data.remark.replace("\n", "<br/>")
              : res.data.remark;
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

    const onSubmitInfo = (params, done) => {
      done();
    };

    // 2022-06-30  WF
    const toAudit = (id) => {
      state.shDialogTableVisible = true;
      state.shForm = {};
      http
        .get(`/rentserver/apartmentLeaseApply/getById?id=${id}`)
        .then((res) => {
          if (res) {
            state.itemObj = res.data;
            state.familyList = Array.from(res.data.studentFamilies);
            state.itemObj.remark = res.data.remark.includes("\n")
              ? res.data.remark.replace("\n", "<br/>")
              : res.data.remark;
          }
        });
    };
    const onSubmitInfo2 = (params, done) => {
      console.log("state.shForm---", state.shForm);
      // done();
      // mask审核角色  目前有两个:房管局(ROLE_HOUSE_MANAGE)    人社局()
      let paramsObj = {};
      if (state.mask == "ROLE_HOUSE_MANAGE") {
        paramsObj = {
          alaId: state.itemObj.id,
          fangGuanCheck: state.shForm.status,
          fangGuanCheckOpinion: state.shForm.opinion,
        };
      } else {
        paramsObj = {
          alaId: state.itemObj.id,
          peopleClubCheck: state.shForm.status,
          peopleClubOpinion: state.shForm.opinion,
        };
      }
      http
        .post("/rentserver/apartmentLeaseApply/setAuditStatus", paramsObj, {
          message: true,
        })
        .then((res) => {
          tableRef.value.onFresh();
          done();
        })
        .catch((err) => {
          done();
        });
    };

    // 日志
    const logClick = (row) => {
      let paramsObj = {
        applyId: row.id,
      };
      http
        .get("/rentserver/auditLog/getByApplyId", paramsObj, {
          message: true,
        })
        .then((res) => {
          state.logListData = res.data.list;
          state.logDialogISshow = true;
        });
      http
        .get("/rentserver/auditLog/getByApplyId", {
          applyId: row.studentId,
        })
        .then((res) => {
          state.logListData2 = res.data.list;
        });
    };

    const zuofei = (row) => {
      state.zfForm.alaId = row.id;
      state.zfForm.studentId = row.studentId;
    };
    // 作废
    const validAla = (id) => {
      let paramsObj = state.zfForm;
      http
        .post("/rentserver/apartmentLeaseApply/alaInvalid", paramsObj, {
          message: true,
        })
        .then((res) => {
          state.zfDialogTableVisible = false;
          state.zfForm.peopleClubOpinion = "";
          tableRef.value.onFresh();
          done();
        })
        .catch((err) => {
          done();
        });
    };

    // pdf预览
    const handlePreviewClick = (row) => {
      console.log("pdf预览", row);
      let fileName = row.fileName;
      let geshi = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (geshi == "doc") {
        // window.open(
        //   api.tool.getReviewUrl() +
        //     "/onlinePreview?url=" +
        //     encodeURIComponent(window.btoa(row.filePath))
        // );
      } else {
        window.open("/images" + row.filePath, "_blank");
      }
    };

    // pdf下载
    const getDownload = (row) => {
      http
        .get(
          `/rentserver/fileStore/backend/downloadFile/${row.id}`,
          {},
          { responseType: "blob" },
          {
            message: true,
          }
        )
        .then((res) => {
          console.log("res---res", res);
          download(res, row.fileName);
        });
    };

    const download = (res, filename) => {
      // 创建blob对象，解析流数据
      const blob = new Blob([res], {
        // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
        type: "application/pdf;chartset=UTF-8",
      });
      const a = document.createElement("a");
      // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
      const URL = window.URL || window.webkitURL;
      // 根据解析后的blob对象创建URL 对象
      const herf = URL.createObjectURL(blob);
      // 下载链接
      a.href = herf;
      // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // 在内存中移除URL 对象
      window.URL.revokeObjectURL(herf);
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
    return {
      ...toRefs(state),
      toDetail,
      onSubmitInfo,
      dayjs,
      toAttach,
      tableRef,
      isOrg,
      // downLoadIt,
      // showIt,
      toAudit,
      onSubmitInfo2,
      logClick,
      handlePreviewClick,
      getDownload,
      download,
      zuofei,
      validAla,
      handleDates,
      dates,
      defaultQuery,
      dialogObjDelDef,
      dialogCloseDef,
      dialogSuccessDef,
      showDialogObjDelDef,
      deleteTimeFun,
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

.tabs-box {
  display: flex;
  margin-bottom: 20px;
  div {
    margin-right: 20px;
    cursor: pointer;
    padding-bottom: 10px;
  }
  .active-sty {
    border-bottom: 2px solid red;
  }
}
</style>
