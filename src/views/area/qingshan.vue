<template>
  <el-tabs class="tabs">
    <el-tab-pane label="企业审核">
      <V-Table
        :ref="(dom) => (tableRef = dom)"
        url="/accountserver/backend/enterprisePool/index3"
        method="get"
      >
        <template #query="{ query }">
          <el-form-item label="企业名称">
            <el-input v-model="query.nameLike"></el-input>
          </el-form-item>
          <el-form-item label="主管部门">
            <v-select v-model="query.deptName" :options="options"></v-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <v-select
              v-model="query.districtStatus"
              :options="districtOptions"
            ></v-select>
          </el-form-item>
          <el-form-item label="申报时间">
            <v-select v-model="query.year" :options="timeArr()"></v-select>
          </el-form-item>
          <!-- <el-form-item label="申报时间" class="data-box">
            <v-date
              v-model:start="query.startDate"
              v-model:end="query.endDate"
            ></v-date>
          </el-form-item> -->
        </template>
        <template #button="{ selection, query }">
          <v-export
            :url="`/accountserver/backend/enterprisePool/index3Export?year=${
              query.year || ''
            }&ids=${selectionFun(selection)}`"
            filename="企业审核数据统计.xlsx"
          >
            <el-button type="primary">数据导出</el-button>
          </v-export>
        </template>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="企业名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="单位联系人"
          prop="contactor"
          align="center"
        ></el-table-column>
        <el-table-column
          label="单位联系人手机号"
          prop="contactorMobile"
        ></el-table-column>
        <el-table-column label="主管部门" prop="deptName"></el-table-column>
        <el-table-column
          label="产业领军"
          prop="industryLeadingCount"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          label="优秀青年"
          prop="outstandingYouthCount"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          label="钢城工匠"
          prop="craftsmanCount"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
        <el-table-column label="更新时间" prop="lastUpdated"></el-table-column>
        <el-table-column label="审核状态" prop="districtStatus" align="center">
          <template #default="{ row }">
            <font
              :color="
                row.districtStatus == '0' || row.districtStatus == '1'
                  ? 'red'
                  : '#333'
              "
            >
              <span v-if="row.districtStatus == '0'">已保存</span>
              <span v-else-if="row.districtStatus == '1'">审核中</span>
              <span v-else-if="row.districtStatus == '2'">通过</span>
              <span v-else-if="row.districtStatus == '3'">不通过</span>
              <span v-else-if="row.districtStatus == '4'">退回</span>
              <span v-else>未提交</span>
            </font>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              v-if="
                row.districtStatus != '2' &&
                row.districtStatus != '3' &&
                row.districtStatus != '4'
              "
              type="text"
              @click="onVerifyShow(row)"
            >
              认定
            </el-button>
            <el-button type="text" @click="onDetailShow(row)">详情</el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template>
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="人才审核" :lazy="true">
      <V-Table
        :ref="(dom) => (personTableRef = dom)"
        url="/talentserver/backend/talent/district/accept/leaderList"
        :query="{ talentType: '0' }"
        :parse="false"
      >
        <template #top="{ query, onQuery }">
          <el-radio-group
            v-model="query.talentType"
            style="margin-bottom: 22px"
            @change="myFun(query, onQuery)"
          >
            <el-radio-button label="0">全部</el-radio-button>
            <el-radio-button label="1">产业领军</el-radio-button>
            <el-radio-button label="2">优秀青年</el-radio-button>
            <el-radio-button label="3">钢城工匠</el-radio-button>
          </el-radio-group>
        </template>
        <template #query="{ query }">
          <el-form-item label="举(推)荐类型" label-width="100px">
            <v-select
              v-model="query.types"
              :options="queryTypes[query.talentType]"
            ></v-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <v-select
              v-model="query.status"
              :options="statusOptions"
            ></v-select>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="query.nameLike"></el-input>
          </el-form-item>
          <el-form-item label="主管部门">
            <v-select
              v-model="query.deptName"
              :multiple="true"
              :options="options"
            ></v-select>
          </el-form-item>
          <!-- <el-form-item label="申报时间" class="data-box">
            <v-date
              v-model:start="query.startDate"
              v-model:end="query.endDate"
            ></v-date>
          </el-form-item> -->
          <el-form-item label="申报时间">
            <v-select v-model="query.year" :options="timeArr()"></v-select>
          </el-form-item>
        </template>
        <template #button="{ selection, query }">
          <el-button
            type="success"
            :disabled="!selection.length"
            @click="onPassIn(selection.map((item) => item.id))"
            @finish="personTableRef.onFresh()"
          >
            入选
          </el-button>
          <el-button
            type="danger"
            :disabled="!selection.length"
            @click="onRejectOut(selection.map((item) => item.id))"
            @finish="personTableRef.onFresh()"
          >
            未入选
          </el-button>
          <v-export
            :url="`/talentserver/backend/talent/district/accept/leaderListExport`"
            filename="人才审核数据统计.xlsx"
            :query="{
              year: query.year || '',
              ids: selectionFun(selection) || '',
            }"
            method="post"
          >
            <el-button type="primary">数据导出</el-button>
          </v-export>
        </template>
        <template #default="{}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            label="申请人"
            prop="name"
            align="center"
          ></el-table-column>
          <el-table-column label="举(推)荐类型" prop="type">
            <template #default="{ row }">
              <!-- {{
                queryTypes[query.talentType]?.find(
                  (item) => item.value == row.type
                )?.label
              }} -->
              {{ typeFun(row.type) }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="举(推)荐类型"
            prop="isAgree"
          ></el-table-column> -->
          <el-table-column label="性别" prop="gender">
            <template #default="{ row }">
              {{ row.gender == "female" ? "女" : "男" }}
            </template>
          </el-table-column>
          <el-table-column
            label="工作单位"
            prop="companyName"
          ></el-table-column>
          <el-table-column label="主管部门" prop="deptName"></el-table-column>
          <el-table-column label="所在区域" prop="org"></el-table-column>
          <el-table-column
            label="申请时间"
            prop="dateCreated"
          ></el-table-column>
          <el-table-column label="审核状态" prop="status">
            <template #default="{ row }">
              <span :color="row.status == 3 ? '#333' : 'red'">
                {{
                  row.status == 3
                    ? "已通过"
                    : row.status == 1
                    ? "待审核"
                    : row.status == 1002
                    ? "已入选"
                    : row.status == 1003
                    ? "未入选"
                    : row.status == 104
                    ? "退回"
                    : row.status == 4
                    ? "不受理"
                    : ""
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100px">
            <template #default="{ row }">
              <!-- v-if="row.status != 3" -->
              <el-button
                v-if="row.status == 1"
                type="text"
                @click="onPersonVerifyShow(row)"
              >
                受理
              </el-button>
              <el-button type="text" @click="onPersonDetailShow(row)">
                详情
              </el-button>
              <el-button type="text" @click="onFileSHow(row)">附件</el-button>
              <el-button type="text" @click="onLogSHow(row)">日志</el-button>
            </template>
          </el-table-column>
        </template>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="企业人才汇总统计表" :lazy="true">
      <eliteStatistic></eliteStatistic>
    </el-tab-pane>
    <el-tab-pane label="企业人才明细情况" :lazy="true">
      <eliteDetail></eliteDetail>
    </el-tab-pane>
  </el-tabs>

  <v-form-dialog
    v-model="verifyVisible"
    v-model:model="model"
    title="认定"
    label-width="80px"
    :footer="false"
  >
    <template #default="{ model, done }">
      <el-form-item label="意见" prop="memo">
        <el-input
          v-model="model.memo"
          type="textarea"
          :rows="5"
          placeholder="请输入意见"
        ></el-input>
      </el-form-item>
      <div style="padding: 20px 0; display: flex; justify-content: flex-end">
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          :loading="loading"
          @click="onPass(model, done)"
        >
          认定
        </el-button>
        <el-button
          type="warning"
          :loading="loading"
          icon="el-icon-circle-close"
          @click="onReturn(model, done)"
        >
          退回
        </el-button>
        <el-button
          type="warning"
          :loading="loading"
          icon="el-icon-circle-close"
          @click="onNopass(model, done)"
        >
          不认定
        </el-button>
        <el-button @click="done">取消</el-button>
      </div>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="detailVisible"
    v-model:model="model"
    :fetch-loading="!model.id"
    label-position="top"
    title="详细信息"
    @submit="(_, done) => done()"
  >
    <template #default="{ model }">
      <div class="row">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="model.name" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="单位类型" prop="type">
          <el-input v-model="model.type" :readonly="true"></el-input>
        </el-form-item>
      </div>

      <el-form-item label="单位地址" prop="address">
        <el-input v-model="model.address" :readonly="true"></el-input>
      </el-form-item>
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
        <el-form-item label="实到注册资金(万元)" prop="registerCapitcal">
          <el-input
            v-model="model.registerCapitcal"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="是否上市" prop="isOnsale">
          <el-input
            :model-value="model.isOnsale ? '是' : '否'"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否在中国证券投资基金业协会备案" prop="isRecord">
          <el-input
            :model-value="model.isRecord ? '是' : '否'"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="是否为高新企业或高品备案企业" prop="isHighTech">
        <el-input
          :model-value="model.isHighTech ? '是' : '否'"
          :readonly="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="主营业务" prop="major">
        <el-input
          v-model="model.major"
          type="textarea"
          :autosize="true"
          :readonly="true"
        ></el-input>
      </el-form-item>
      <div class="row">
        <span>年份</span>
        <span>{{ year - 3 }}年（万元）</span>
        <span>{{ year - 2 }}年（万元）</span>
        <span>{{ year - 1 }}年（万元）</span>
      </div>
      <div class="row">
        <span>收入</span>
        <span>{{ model.agoSale }}</span>
        <span>{{ model.blastSale }}</span>
        <span>{{ model.lastSale }}</span>
      </div>
      <div class="row">
        <span>净利润</span>
        <span>{{ model.agoProfit }}</span>
        <span>{{ model.blastProfit }}</span>
        <span>{{ model.lastProfit }}</span>
      </div>
      <div class="row">
        <span>研发投入</span>
        <span>{{ model.agoDev }}</span>
        <span>{{ model.blastDev }}</span>
        <span>{{ model.lastDev }}</span>
      </div>
      <div class="row">
        <span>纳税</span>
        <span>{{ model.agoTax }}</span>
        <span>{{ model.blastTax }}</span>
        <span>{{ model.lastTax }}</span>
      </div>
      <div class="row">
        <span>其他成本</span>
        <span>{{ model.agoOthers }}</span>
        <span>{{ model.blastOthers }}</span>
        <span>{{ model.lastOthers }}</span>
      </div>
      <el-form-item label="人员情况" prop="teamDetail">
        <el-input
          v-model="model.teamDetail"
          type="textarea"
          :autosize="true"
          :readonly="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="单位简介" prop="memo">
        <el-input
          v-model="model.memo"
          type="textarea"
          :autosize="true"
          :readonly="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="创新实力说明" prop="idea">
        <el-input
          v-model="model.idea"
          type="textarea"
          :autosize="true"
          :readonly="true"
        ></el-input>
      </el-form-item>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="fileVsisible"
    title="附件列表"
    :footer="false"
    :fetch-loading="!fileState.id"
  >
    <template #default="{ done }">
      <V-Table :data="fileState.list">
        <el-table-column label="文件名" prop="name"></el-table-column>
        <el-table-column label="文件类型" prop="type" width="150">
          <template #default="{ row }">
            {{ translateAttachType(row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <v-export
              :url="`/talentserver/backend/attachment/review${
                row.fileType == 'doc' || row.fileType == 'docx'
                  ? 'Word'
                  : row.fileType == 'pdf' || row.fileType == 'PDF'
                  ? 'Pdf'
                  : row.fileType == 'jpg' ||
                    row.fileType == 'JPG' ||
                    row.fileType == 'png' ||
                    row.fileType == 'PNG' ||
                    row.fileType == 'JPEG' ||
                    row.fileType == 'jpeg' ||
                    row.fileType == 'BMP' ||
                    row.fileType == 'bmp'
                  ? 'Pic'
                  : ''
              }${
                row.fileType == 'doc' || row.fileType == 'docx'
                  ? '?url=' + encodeURIComponent(row.url)
                  : '/' + row.id
              }`"
              type="preview-target"
              :file-type="
                row.fileType == 'doc'
                  ? 'text/html'
                  : row.fileType == 'docx'
                  ? 'text/html'
                  : row.fileType == 'pdf' || row.fileType == 'PDF'
                  ? 'application/pdf'
                  : row.fileType == 'jpg'
                  ? 'image/jpeg'
                  : ''
              "
            >
              <el-button v-if="row.fileType != 'zip'" type="text">
                预览
              </el-button>
              <!-- <template #preview="{ file }">{{ file }}</template> -->
            </v-export>
            <v-export
              :url="`/talentserver/backend/attachment/download/${row.id}`"
              :filename="row.name"
            >
              <el-button type="text">下载</el-button>
            </v-export>
          </template>
        </el-table-column>
      </V-Table>
      <div style="padding: 20px 0; display: flex; justify-content: flex-end">
        <el-button @click="done">取消</el-button>
      </div>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="personVerifyVisible"
    v-model:model="model"
    title="受理"
    label-width="80px"
    :footer="false"
  >
    <template #default="{ model, done }">
      <el-form-item label="意见" prop="opinion">
        <el-input
          v-model="model.opinion"
          type="textarea"
          :rows="5"
          placeholder="请输入意见"
        ></el-input>
      </el-form-item>
      <div style="padding: 20px 0; display: flex; justify-content: flex-end">
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          :loading="loading"
          @click="onPersonPass(model, done)"
        >
          <!-- 受理 -->
          通过
        </el-button>
        <el-button
          type="warning"
          :loading="loading"
          icon="el-icon-circle-close"
          @click="onPersonReturn(model, done)"
        >
          退回
        </el-button>
        <el-button
          type="warning"
          :loading="loading"
          icon="el-icon-circle-close"
          @click="onPersonNopass(model, done)"
        >
          <!-- 不受理 -->
          不通过
        </el-button>
        <el-button @click="done">取消</el-button>
      </div>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="logVisible"
    title="日志"
    :destroy-on-close="true"
    :footer="null"
  >
    <template #default="{ done }">
      <V-Table
        :url="`/talentserver/auditLog/getAuditLogs/${logState.id}`"
        method="get"
      >
        <el-table-column label="审核意见" prop="memo"></el-table-column>
        <el-table-column label="审核部门" prop="auditOrg"></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated">
          <template #default="{ row }">
            <span>{{ row.dateCreated ? formDate(row.dateCreated) : "" }}</span>
          </template>
        </el-table-column>
      </V-Table>
      <div style="padding: 20px 0; display: flex; justify-content: flex-end">
        <el-button @click="done">取消</el-button>
      </div>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="personDetailVisible"
    v-model:model="model"
    :fetch-loading="!model.id"
    label-position="top"
    title="人才详情"
    @submit="(_, done) => done()"
  >
    <template #default="{ model }">
      <!-- 下载申请书 -->
      <v-export
        :url="`/talentserver/backend/talent/district/accept/downloadFull/${model.id}/1`"
        :filename="model.name"
        file-type="application/pdf"
      >
        <!-- :url="`/talentserver/backend/talent/district/accept/download?talentId=${model.id}`" -->
        <el-button type="primary" class="exportWord">下载申请书</el-button>
      </v-export>
      <el-tabs v-model="activeName">
        <el-tab-pane label="申报简表" name="申报简表">
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
            <el-form-item label="国籍">
              <el-input v-model="model.nationality" :readonly="true"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="证件类型">
              <el-input v-model="model.idName" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="证件编号">
              <el-input v-model="model.idNumber" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-input v-model="model.politic" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="model.mobile" :readonly="true"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="毕业院校">
              <el-input v-model="model.school" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="毕业时间">
              <el-input
                v-model="model.graduationDate"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="model.field" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="专业技术职务">
              <el-input
                v-model="model.techPosition"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="最高学历">
              <el-input v-model="model.education" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="最高学位">
              <el-input v-model="model.degree" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="社会兼职">
              <el-input
                v-model="model.hasSocialFunction"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="岗位性质">
              <el-input v-model="model.postNature" :readonly="true"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="电子邮箱">
              <el-input v-model="model.email" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="任职关系">
              <el-input v-model="model.appointment" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="现任职务">
              <el-input v-model="model.post" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="任职时间">
              <el-input
                v-model="model.currentPostDate"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="产业领域">
            <el-input v-model="model.industry" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="教育经历">
            <el-input
              v-model="model.edu"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="工作经历">
            <el-input
              v-model="model.work"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="主持参与过的主要项目">
            <el-input
              v-model="model.project"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="主要成果">
            <el-input
              v-model="model.contrib"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <div class="row">
            <el-form-item label="是否和其他单位签订过仍然有效的竞业协议">
              <el-input
                :model-value="model.hasOtherAgreement ? '是' : '否'"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="禁止协议">
              <el-input
                v-model="model.otherAgreement"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="model.enterprise"
          label="单位情况"
          name="单位情况"
          :lazy="true"
        >
          <div class="row">
            <el-form-item label="企业名称" prop="enterprise.name">
              <el-input
                v-model="model.enterprise.name"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="单位地址" prop="enterprise.address">
              <el-input
                v-model="model.enterprise.address"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="单位电话" prop="enterprise.contactorMobile">
              <el-input
                v-model="model.enterprise.contactorMobile"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item
              v-if="model.companyReqDTOs"
              label="单位传真"
              prop="companyReqDTOs.fax"
            >
              <el-input
                v-model="model.companyReqDTOs.fax"
                :readonly="true"
              ></el-input>
            </el-form-item> -->
          </div>
          <div class="row">
            <span>年份</span>
            <span>{{ year - 3 }}年（万元）</span>
            <span>{{ year - 2 }}年（万元）</span>
            <span>{{ year - 1 }}年（万元）</span>
          </div>
          <div class="row">
            <span>收入</span>
            <span>{{ model.enterprise.agoSale }}</span>
            <span>{{ model.enterprise.blastSale }}</span>
            <span>{{ model.enterprise.lastSale }}</span>
          </div>
          <div class="row">
            <span>净利润</span>
            <span>{{ model.enterprise.agoProfit }}</span>
            <span>{{ model.enterprise.blastProfit }}</span>
            <span>{{ model.enterprise.lastProfit }}</span>
          </div>
          <div class="row">
            <span>研发投入</span>
            <span>{{ model.enterprise.agoDev }}</span>
            <span>{{ model.enterprise.blastDev }}</span>
            <span>{{ model.enterprise.lastDev }}</span>
          </div>
          <div class="row">
            <span>纳税</span>
            <span>{{ model.enterprise.agoTax }}</span>
            <span>{{ model.enterprise.blastTax }}</span>
            <span>{{ model.enterprise.lastTax }}</span>
          </div>
          <div class="row">
            <span>其他成本</span>
            <span>{{ model.enterprise.agoOthers }}</span>
            <span>{{ model.enterprise.blastOthers }}</span>
            <span>{{ model.enterprise.lastOthers }}</span>
          </div>
          <el-form-item label="单位简介" prop="enterprise.memo">
            <el-input
              v-model="model.enterprise.memo"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="创新实力说明" prop="enterprise.idea">
            <el-input
              v-model="model.enterprise.idea"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="selectVisible"
    v-model:model="model"
    :title="selectTitle"
    label-width="80px"
    :footer="false"
  >
    <template #default="{ model, done }">
      <el-form-item label="备注">
        <el-input
          v-model="model.opinion"
          type="textarea"
          :placeholder="`请输入${selectTitle}理由...`"
        ></el-input>
      </el-form-item>
      <div class="iconRight">
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          :loading="loading"
          @click="sureSelect(model, done)"
        >
          确定
        </el-button>
        <el-button @click="done">取消</el-button>
      </div>
    </template>
  </v-form-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref, toRefs } from "vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VExport from "/@/components/VExport.vue";
import VDelete from "/@/components/VDelete.vue";
import VSelect from "/@/components/VSelect.vue";
import http from "../../config/http";
import { Canceler } from "axios";
import eliteStatistic from "/@/views/statistic/eliteStatistic.vue";
import eliteDetail from "/@/views/statistic/eliteDetail.vue";
import dayjs from "dayjs";
// import VDate from "/@/components/VDate.vue";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    // VDelete,
    VExport,
    VSelect,
    eliteStatistic,
    eliteDetail,
    // VDate,
  },
  setup() {
    const tableRef = ref<HTMLElement>();
    const model = ref({});
    const detailVisible = ref(false);
    const cancels: Canceler[] = [];
    const onDetailShow = (row: Record<string, any>) => {
      detailVisible.value = true;
      model.value = {};
      http
        .get(
          `/accountserver/backend/enterprisePool/get/${row.id}`,
          {},
          { aborts: cancels }
        )
        .then((res) => {
          if (res && res.data) {
            model.value = res.data;
          }
        });
    };
    const verifyVisible = ref(false);
    const loading = ref(false);
    const onVerifyShow = (row: Record<string, any>) => {
      model.value = {
        enterpriseId: row.id,
      };
      verifyVisible.value = true;
    };
    //认定
    const onPass = (params: Record<string, any>, done: () => void) => {
      loading.value = true;
      http
        .post("/accountserver/backend/account/affirm/pass", params, {
          message: true,
        })
        .then((res) => {
          loading.value = false;
          done();
          (tableRef.value as any).onFresh();
        })
        .catch((res) => {
          loading.value = false;
        });
    };
    //不认定
    const onNopass = (params: Record<string, any>, done: () => void) => {
      loading.value = true;
      http
        .post("/accountserver/backend/account/affirm/noPass", params, {
          message: true,
        })
        .then((res) => {
          loading.value = false;
          done();
          (tableRef.value as any).onFresh();
        })
        .catch((res) => {
          loading.value = false;
        });
    };
    //退回
    const onReturn = (params: Record<string, any>, done: () => void) => {
      loading.value = true;
      http
        .post("/accountserver/backend/account/affirm/return", params, {
          message: true,
        })
        .then((res) => {
          loading.value = false;
          done();
          (tableRef.value as any).onFresh();
        })
        .catch((res) => {
          loading.value = false;
        });
    };
    //附件
    const fileVsisible = ref(false);
    const fileState = reactive({
      id: "",
      list: [],
    });
    const onFileSHow = (row: Record<string, any>) => {
      fileVsisible.value = true;
      fileState.id = "";
      http
        .get(`/talentserver/backend/attachment/getAttachments/${row.id}`, {})
        .then((res) => {
          fileState.id = row.id;
          fileState.list = res.data;
        });
    };
    const state = reactive({
      options: [
        {
          label: "区委组织部",
          value: "区委组织部",
        },
        {
          label: "化工园区",
          value: "化工园区",
        },
        {
          label: "区教育局",
          value: "区教育局",
        },
        {
          label: "区科经局",
          value: "区科经局",
        },
        {
          label: "区商务局",
          value: "区商务局",
        },
        {
          label: "区卫健局",
          value: "区卫健局",
        },
        {
          label: "开发区",
          value: "开发区",
        },
      ],
      // options: [
      //   "区委组织部",
      //   "化工园区",
      //   "区教育局",
      //   "区科经局",
      //   "区商务局",
      //   "区卫健局",
      //   "开发区",
      // ].map((value) => ({ label: value, value })),
      statusOptions: [
        { label: "待审核", value: "1" },
        { label: "已通过", value: "3" },
        { label: "不受理", value: "4" },
        { label: "退回", value: "104" },
        { label: "已入选", value: "1002" },
        { label: "未入选", value: "1003" },
      ],
      districtOptions: [
        { label: "已认定", value: "2" },
        { label: "未通过", value: "3" },
        { label: "已退回", value: "4" },
        // { label: "待认定", value: `${"0" || "1"}` },
        { label: "审核中", value: "1" },
      ],
      queryTypes: {
        1: [
          { label: "产业领军人才1类", value: "qs_leaders_innovation" },
          { label: "产业领军人才2类", value: "qs_leaders_startup" },
          { label: "产业领军人才3类", value: "cylj3" },
        ],
        2: [
          { label: "优秀青年人才1类", value: "qs_excellentYouth_doctor" },
          { label: "优秀青年人才2类", value: "qs_excellentYouth_recommend" },
          { label: "优秀青年人才3类", value: "qs_excellentYouth_startup" },
        ],
        3: [
          { label: "钢城铁匠1类", value: "qs_qingshanElite_craftsman" },
          { label: "钢城铁匠2类", value: "gcjj2" },
        ],
      },
      personVerifyVisible: false,
      personDetailVisible: false,
      logVisible: false,
      selectVisible: false,
      selectTitle: "",
      logState: {
        id: "",
      },
      activeName: "申报简表",
    });
    const personTableRef = ref();
    const onPersonVerifyShow = (row: Record<string, any>) => {
      state.personVerifyVisible = true;
      model.value = {
        id: row.id,
      };
    };
    //受理
    const onPersonPass = (params: Record<string, any>, done: () => void) => {
      loading.value = true;
      http
        .post(
          `/talentserver/backend/talent/district/accept/qingshan/accept`,
          params,
          {
            message: true,
          }
        )
        .then((res) => {
          loading.value = false;
          done();
          (personTableRef.value as any).onFresh();
        })
        .catch((res) => {
          loading.value = false;
        });
    };
    //退回
    const onPersonReturn = (params: Record<string, any>, done: () => void) => {
      loading.value = true;
      http
        .post(
          `/talentserver/backend/talent/district/accept/qingshan/goBack`,
          params,
          {
            message: true,
          }
        )
        .then((res) => {
          loading.value = false;
          done();
          (personTableRef.value as any).onFresh();
        })
        .catch((res) => {
          loading.value = false;
        });
    };
    //不受理
    const onPersonNopass = (params: Record<string, any>, done: () => void) => {
      loading.value = true;
      http
        .post(
          `/talentserver/backend/talent/district/accept/qingshan/noAccept`,
          params,
          {
            message: true,
          }
        )
        .then((res) => {
          loading.value = false;
          done();
          (personTableRef.value as any).onFresh();
        })
        .catch((res) => {
          loading.value = false;
        });
    };
    //人才详情
    const onPersonDetailShow = (row: Record<string, any>) => {
      state.personDetailVisible = true;
      model.value = {};
      state.activeName = "申报简表";
      http
        .get(
          `/talentserver/backend/talent/district/accept/qingshan/get/${row.id}`
        )
        .then((res) => {
          if (res.data) {
            model.value = res.data;
          }
        });
    };
    //日志
    const onLogSHow = (row: Record<string, any>) => {
      state.logVisible = true;
      state.logState = { id: row.id };
    };
    const selectionIds = ref();
    // 入选
    const onPassIn = (selection: any) => {
      state.selectVisible = true;
      state.selectTitle = "入选";
      selectionIds.value = selection;
    };
    // 未入选
    const onRejectOut = (selection: any) => {
      state.selectVisible = true;
      state.selectTitle = "未入选";
      selectionIds.value = selection;
    };
    // 确定是否入选
    const sureSelect = (params: Record<string, any>, done: () => void) => {
      loading.value = true;
      http
        .post(
          `/talentserver/backend/talent/district/accept/qingshan/selected`,
          {
            opinion: params.opinion,
            id: selectionIds.value.join(","),
            status: state.selectTitle == "入选" ? 1002 : 1003,
          },
          {
            message: true,
          }
        )
        .then((res) => {
          loading.value = false;
          model.value = {};
          done();
          (personTableRef.value as any).onFresh();
        })
        .catch((res) => {
          loading.value = false;
        });
    };
    const translateAttachType = (v: any) => {
      let res = "";
      switch (v) {
        case "HEADER":
          res = "头像";
          break;
        case "FRONT":
          res = "身份证前面";
          break;
        case "BACK":
          res = "身份证背面";
          break;
        case "DIPLOMA":
          res = "最高学历证书";
          break;
        case "QUALIFICATIONS":
          res = "最高学位证书";
          break;
        case "CERTIFICATE":
          res = "学历验证报告";
          break;
        case "REPLENISH":
          res = "附件";
          break;
        case "QYZZ":
          res = "营业执照";
          break;
        case "GDZM":
          res = "股东证明";
          break;
        case "JYZM":
          res = "就业证明";
          break;
        case "SBZM":
          res = "社保证明";
          break;
        case "CGZM":
          res = "成果证明";
          break;
        case "YJZM":
          res = "业绩证明";
          break;
        case "SJRYZM":
          res = "省级荣誉证明";
          break;
        case "BDZM":
          res = "人才榜单证明";
          break;
        case "HJZM":
          res = "创业赛事获奖证明";
          break;
        case "LDZM":
          res = "获奖项目落地证明";
          break;
        case "RKZM":
          res = "团队成员认可证明";
          break;
        case "RZZM":
          res = "融资证明";
          break;
        case "SNDQYCWBB":
          res = "上年度企业财务报表";
          break;
        case "TZJGTJH":
          res = "投资机构推荐函";
          break;
        case "TZJGZM":
          res = "创业投资机构证明";
          break;
        case "XMJJ":
          res = "项目简介";
          break;
        case "PUBLICINSTITUTION":
          res = "市属企事业单位及高校院所证明";
          break;
        case "AFS":
          res = "上年度企业财务报表";
          break;
        case "SHAREHOLDINGSTRUCT":
          res = "股东结构证明";
          break;
        case "FOUNDERPROOF":
          res = "创办企业证明";
          break;
        case "TAXSTATEMENT":
          res = "税收证明";
          break;
        case "ADDITIONAL":
          res = "其他";
          break;
        case "RECOMMENDATIONLETTER":
          res = "企业举（推）荐意见书";
          break;
        case "NVQ":
          res = "国家职业资格证书";
          break;
        case "SDTQKZM":
          res = "师带徒情况证明";
          break;
        case "HKB":
          res = "户口本";
          break;
        case "CONTRACT":
          res = "劳动合同";
          break;
        default:
          res = v;
          break;
      }
      return res;
    };
    // 申报时间下拉框数据
    const timeArr = () => {
      let arr = [];
      for (var i = 0; i <= 10; i++) {
        const bb = new Date();
        bb.setFullYear(bb.getFullYear() - i);
        let str = bb.toLocaleDateString();
        let year = str.split("/")[0];
        arr.push(year);
      }
      let arr2 = arr.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      return arr2;
    };
    const myFun = (query: any, onQuery: any) => {
      // 切换tabs(全部、产业领军、优秀青年、钢领工匠)将举荐类型参数置空再搜索
      query.types = "";
      onQuery();
    };
    const selectionFun = (selection: any) => {
      let arr = selection.map((item: any) => item.id);
      return arr.join(",");
    };
    // 人才审核表格举荐类型转换
    const typeFun = (type: any) => {
      let res = "";
      switch (type) {
        case "qs_leaders_innovation":
          res = "产业领军人才1类";
          break;
        case "qs_leaders_startup":
          res = "产业领军人才2类";
          break;
        case "cylj3":
          res = "产业领军人才3类";
          break;
        case "qs_excellentYouth_doctor":
          res = "优秀青年人才1类";
          break;
        case "qs_excellentYouth_recommend":
          res = "优秀青年人才2类";
          break;
        case "qs_excellentYouth_startup":
          res = "优秀青年人才3类";
          break;
        case "gcjj2":
          res = "钢城工匠人才2类";
          break;
        case "qs_qingshanElite_craftsman":
          res = "钢城工匠人才1类";
          break;
        default:
          res = type;
          break;
      }
      return res;
    };
    return {
      tableRef,
      model,
      detailVisible,
      onDetailShow,
      verifyVisible,
      onVerifyShow,
      loading,
      onPass,
      onNopass,
      onReturn,
      year: new Date().getFullYear(),
      fileVsisible,
      fileState,
      onFileSHow,
      ...toRefs(state),
      personTableRef,
      onPersonVerifyShow,
      onPersonPass,
      onPersonNopass,
      onPersonReturn,
      onPersonDetailShow,
      onLogSHow,
      translateAttachType,
      onPassIn,
      onRejectOut,
      sureSelect,
      selectionIds,
      formDate(date: any) {
        return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      },
      timeArr,
      myFun,
      selectionFun,
      typeFun,
    };
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  height: 100%;
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
.exportWord {
  position: absolute;
  top: 60px;
  right: 20px;
}
.iconRight {
  display: flex;
  justify-content: flex-end;
}
.data-box ::v-deep .el-date-editor {
  width: 300px !important;
}
</style>
