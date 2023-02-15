<template>
  <el-tabs :ref="(dom) => (tabsRef = dom)" v-model="activeName" class="tabs">
    <el-tab-pane label="举荐单位审核" name="举荐单位审核" label-width="120px">
      <v-table
        :ref="(dom) => (tableRef = dom)"
        url="accountserver/backend/enterprisePool/list"
        method="post"
        :query="{ cityEnterpriseTypes: ['4'] }"
      >
        <!-- :query="{ cityEnterpriseTypes: ['3', '4'], districtName: onlyOrg }" -->
        <template #query="{ query }">
          <!-- <el-form-item v-if="!isOrg" label="区/开发区">
            <v-select
              v-model="query.districtName"
              url="/systemserver/system/org/per"
              method="get"
              :custom="true"
            ></v-select>
          </el-form-item>
          <el-form-item v-else label="区/开发区">
            <el-input v-model="query.districtName" disabled></el-input>
          </el-form-item> -->
          <el-form-item label="区/开发区">
            <v-select
              v-model="query.districtName"
              url="/systemserver/system/org/per"
              method="get"
              :custom="true"
            ></v-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <v-select
              v-model="query.status"
              :options="[
                { label: '待审核', value: '1' },
                { label: '通过', value: '2' },
                { label: '不通过', value: '3' },
                { label: '退回', value: '4' },
              ]"
            ></v-select>
          </el-form-item>

          <!-- <el-form-item label="类型">
            <v-select
              v-model="query.representType"
              :options="[
                { label: '创投机构', val: '1' },
                { label: '非创投机构', val: '2' },
              ]"
              field-value="val"
              field-label="label"
            ></v-select>
          </el-form-item> -->
          <el-form-item label="单位类型">
            <!-- { label: '重点高校', val: '3' }, -->
            <v-select
              v-model="query.cityEnterpriseType"
              :options="[{ label: '湖北实验室/国家重点实验室', val: '4' }]"
              field-value="val"
              field-label="label"
            ></v-select>
            <!-- { label: '湖北实验室/国家重点实验室/新型研发机构', val: '4' }, -->
          </el-form-item>
          <el-form-item label="单位名称">
            <el-input v-model="query.nameLike"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="query.mobile"></el-input>
          </el-form-item>
        </template>
        <template #button="{ query }">
          <v-export
            url="/accountserver/backend/enterprisePool/export"
            method="post"
            :query="{
              cityEnterpriseTypes: ['4'],
              districtName: query.districtName,
              status: query.status,
              nameLike: query.nameLike,
              mobile: query.mobile,
            }"
            filename="市级举荐单位表.xlsx"
          >
            <el-button type="primary">导出</el-button>
          </v-export>
        </template>
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column
          label="单位名称"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="区/开发区"
          prop="districtName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="单位类型"
          prop="cityEnterpriseType"
          align="center"
        ></el-table-column>
        <el-table-column
          label="人事部门负责人"
          prop="contactor"
          align="center"
        ></el-table-column>
        <el-table-column
          label="联系方式"
          prop="contactorMobile"
          align="center"
        ></el-table-column>
        <el-table-column label="审核状态" prop="status" align="center">
          <template #default="{ row }">
            <span :class="row.status == '1' && 'red'">
              {{
                row.status == "0"
                  ? "保存"
                  : row.status == "1"
                  ? "待审核"
                  : row.status == "2"
                  ? "通过"
                  : row.status == "3"
                  ? "不通过"
                  : row.status == "4"
                  ? "退回"
                  : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="上次修改时间"
          prop="lastUpdated"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <!-- <el-button
              v-if="row.status == '2' && userName == 'super_admin'"
              type="text"
              @click="changeStatus(row)"
            >
              修改状态
            </el-button> -->
            <el-button v-if="row.status == 1" type="text" @click="examine(row)">
              审核
            </el-button>

            <el-button type="text" @click="onPersonDetailShow(row)">
              查看
            </el-button>
            <el-button
              type="text"
              @click="
                log(row);
                model = row;
              "
            >
              日志
            </el-button>
          </template>
        </el-table-column>
      </v-table>
    </el-tab-pane>

    <el-tab-pane
      label="人才申报审核"
      label-width="100px"
      :lazy="true"
      name="人才申报审核"
    >
      <v-table
        :ref="(dom) => (tableRef2 = dom)"
        url="/talentserver/talent/backend/getByCityTalent"
        :parse="true"
      >
        <template #query="{ query }">
          <el-form-item label="区/开发区">
            <v-select
              v-model="query.org"
              url="/systemserver/system/org/per"
              method="get"
              :custom="true"
            ></v-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <v-select
              v-model="query.status"
              :options="statusOptions"
            ></v-select>
          </el-form-item>
          <el-form-item label="人才类型">
            <v-select v-model="query.type" :options="typeList"></v-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="query.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="query.mobile"></el-input>
          </el-form-item>
          <el-form-item label="单位类型">
            <v-select
              v-model="query.cityEnterpriseType"
              :options="[
                { label: '企业', val: '1' },
                { label: '重点实验室', val: '2' },
                { label: '重点高校', val: '3' },
                { label: '湖北实验室/国家重点实验室', val: '4' },
              ]"
              field-value="val"
              field-label="label"
            ></v-select>
          </el-form-item>
          <el-form-item label="单位名称">
            <el-input v-model="query.companyName"></el-input>
          </el-form-item>
        </template>
        <template #button="{ query }">
          <v-export
            url="/talentserver/talent/backend/exportCity"
            filename="市级人才申报表.xlsx"
            method="post"
            :query="{
              org: query.org,
              type: query.type,
              status: query.status,
              name: query.name,
              mobile: query.mobile,
              cityEnterpriseType: query.cityEnterpriseType,
              companyName: query.companyName,
            }"
          >
            <el-button type="primary">导出</el-button>
          </v-export>
        </template>
        <el-table-column
          label="姓名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="人才类型" prop="type" align="center">
          <template #default="{ row }">
            <span>{{ translateType(row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template #default="{ row }">
            <span>{{ row.gender == "male" ? "男" : "女" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="单位名称"
          prop="companyName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="单位类型"
          prop="cityEnterpriseType"
          align="center"
        >
          <template #default="{ row }">
            <span>{{ translateCompanyType(row.cityEnterpriseType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="mobile"
          align="center"
        ></el-table-column>
        <el-table-column
          label="区/开发区"
          prop="org"
          align="center"
        ></el-table-column>
        <el-table-column label="审核状态" prop="status" align="center">
          <template #default="{ row }">
            <span :class="{ red: row.status == 1 || row.status == 2 }">
              {{ translateStatus(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="提交时间"
          prop="dateCreated"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <!-- <el-button
              v-if="row.status == '3' && userName == 'super_admin'"
              type="text"
              @click="changeStatus(row)"
            >
              修改状态
            </el-button> -->
            <el-button
              v-if="row.status == 2"
              type="text"
              @click="
                examine1(row);
                onPersonDetailShow1(row, true);
              "
            >
              审核
            </el-button>
            <el-button type="text" @click="onPersonDetailShow1(row, false)">
              查看
            </el-button>
            <el-button type="text" @click="log(row)">日志</el-button>
          </template>
        </el-table-column>
      </v-table>
    </el-tab-pane>
  </el-tabs>
  <!-- 查看日志 -->
  <v-form-dialog
    v-model="showLog"
    v-model:model="model"
    title="日志"
    label-width="80px"
    :fetch-loading="!model.id"
    :footer="false"
  >
    <div v-if="model.id">
      <V-Table :ref="(dom) => (tableRef1 = dom)" :data="logData" method="get">
        <el-table-column label="审核结果" prop="type"></el-table-column>
        <el-table-column label="备注说明" prop="memo"></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated">
          <template #default="{ row }">
            <span>
              {{ row.dateCreated ? formDate(row.dateCreated) : "" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作账号" prop="auditor"></el-table-column>
      </V-Table>
    </div>
  </v-form-dialog>
  <!-- 详情 -->
  <v-form-dialog
    v-model="personDetailVisible"
    v-model:model="model"
    label-position="top"
    :title="checkIn ? '审核' : '查看详情'"
    :footer="false"
    :fetch-loading="!model.id"
    :destroy-on-close="true"
  >
    <template #default="{ model }">
      <!-- 下载申请书
      -->
      <v-export
        v-if="activeName == '人才申报审核'"
        :url="`/talentserver/backend/talent/district/accept/downloadFull/${model.id}/2`"
        :filename="model.name"
        file-type="application/pdf"
      >
        <!--
          :url="`/talentserver/talent/downloadPDF/${model.id}`"

          :url="`/talentserver/backend/talent/district/accept/download?talentId=${model.id}`" -->
        <el-button type="primary" class="exportWord">下载申请书</el-button>
      </v-export>

      <div v-if="activeName == '举荐单位审核'">
        <div class="row">
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="model.name" :readonly="true"></el-input>
          </el-form-item>
          <!-- <el-form-item label="单位性质" prop="type">
            <el-input v-model="model.type" :readonly="true"></el-input>
          </el-form-item> -->
          <el-form-item
            v-if="model.cityEnterpriseType == 1 && model.representType == 1"
            label="推荐创投机构（知名创业投资人）"
            prop="investName"
          >
            <el-input v-model="model.investName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item v-else label="单位性质" prop="type">
            <el-input v-model="model.type" :readonly="true"></el-input>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="法人代表" prop="represent">
            <el-input v-model="model.represent" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="单位地址" prop="address">
            <el-input v-model="model.address" :readonly="true"></el-input>
          </el-form-item>
        </div>
        <div
          v-if="
            (model.cityEnterpriseType == 1 && model.representType == 2) ||
            model.cityEnterpriseType != 1
          "
          class="row"
        >
          <el-form-item label="人事部门负责人" prop="contactor">
            <el-input v-model="model.contactor" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactorMobile">
            <el-input
              v-model="model.contactorMobile"
              :readonly="true"
            ></el-input>
          </el-form-item>
        </div>
        <div class="row">
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
          <el-form-item label="是否为高新企业" prop="isHighTech">
            <el-input
              :model-value="model.isHighTech ? '是' : '否'"
              :readonly="true"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="主营业务" prop="major">
          <el-input
            v-model="model.major"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
          <!-- <QuillEditor
            ref="quillEditorRef5"
            theme="snow"
            :content="model.major || ''"
            :content-type="contentType"
            :options="{
              modules: {
                toolbar: [],
              },
            }"
          /> -->
        </el-form-item>
        <div class="row">
          <span>年份</span>
          <span>{{ year - 2 }}年（万元）</span>
          <span>{{ year - 1 }}年（万元）</span>
          <span>{{ year }}年--申报当月（万元）</span>
        </div>
        <div class="row">
          <span>主营业务收入</span>
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
        <div
          v-if="model.cityEnterpriseType == 1 && model.representType == 1"
          class="row"
        >
          <span>其他投入</span>
          <span>{{ model.agoOthers }}</span>
          <span>{{ model.blastOthers }}</span>
          <span>{{ model.lastOthers }}</span>
        </div>
        <div class="row">
          <span>纳税</span>
          <span>{{ model.agoTax }}</span>
          <span>{{ model.blastTax }}</span>
          <span>{{ model.lastTax }}</span>
        </div>
        <el-form-item label="人才规模" prop="teamDetail">
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
          <!-- <QuillEditor
            ref="quillEditorRef6"
            theme="snow"
            :content="model.memo || ''"
            :content-type="contentType"
            :options="{
              modules: {
                toolbar: [],
              },
            }"
          /> -->
        </el-form-item>

        <el-form-item
          v-if="model.cityEnterpriseType == 1 && model.representType == 1"
          label="知名投资机构A轮投资情况"
          prop="ainvest"
        >
          <el-input
            v-model="model.ainvest"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
          <!-- <QuillEditor
            ref="quillEditorRef11"
            theme="snow"
            :content="model.ainvest || ''"
            :content-type="contentType"
            :options="{
              modules: {
                toolbar: [],
              },
            }"
          /> -->
        </el-form-item>
        <el-form-item
          v-if="model.cityEnterpriseType == 1 && model.representType == 1"
          label="团队核心成员情况"
          prop="team"
        >
          <el-input
            v-model="model.team"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
          <!-- <QuillEditor
            ref="quillEditorRef12"
            theme="snow"
            :content="model.team || ''"
            :content-type="contentType"
            :options="{
              modules: {
                toolbar: [],
              },
            }"
          /> -->
        </el-form-item>
        <el-form-item
          v-if="model.cityEnterpriseType == 1 && model.representType == 1"
          label="资本构成和股权结构"
          prop="struct"
        >
          <el-input
            v-model="model.struct"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
          <!-- <QuillEditor
            ref="quillEditorRef13"
            theme="snow"
            :content="model.struct || ''"
            :content-type="contentType"
            :options="{
              modules: {
                toolbar: [],
              },
            }"
          /> -->
        </el-form-item>
        <el-form-item
          v-if="model.cityEnterpriseType == 1 && model.representType == 1"
          label="2019年以来投资机构投资实际到位资金（万元）"
          prop="talentIncome"
        >
          <el-input
            v-model="model.talentIncome"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="
            (model.cityEnterpriseType == 1 && model.representType == 2) ||
            model.cityEnterpriseType != 1
          "
          label="创新实力"
          prop="idea"
        >
          <el-input
            v-model="model.idea"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
          <!-- <QuillEditor
            ref="quillEditorRef7"
            theme="snow"
            :content="model.idea || ''"
            :content-type="contentType"
            :options="{
              modules: {
                toolbar: [],
              },
            }"
          /> -->
        </el-form-item>

        <!-- <el-form-item
          v-if="model.cityEnterpriseType != 1 || model.representType != 1"
          label="引进人才工资性年收入（万元）"
          prop="talentIncome"
        >
          <el-input v-model="model.talentIncome" :readonly="true"></el-input>
        </el-form-item> -->
        <V-Table v-loading="dwfj" :data="model.filelist">
          <el-table-column label="附件名称" prop="name"></el-table-column>
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
                    ? 'text/html;'
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
        <el-form-item label="审核意见" prop="status">
          <el-radio-group
            v-model="model.status"
            :disabled="checkIn ? false : true"
          >
            <el-radio :label="activeName == '举荐单位审核' ? '4' : '7'">
              退回
            </el-radio>
            <el-radio :label="activeName == '举荐单位审核' ? '2' : '3'">
              通过
            </el-radio>
            <el-radio :label="activeName == '举荐单位审核' ? '3' : '5'">
              不通过
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注说明" prop="memo">
          <el-input
            v-model="model.memo1"
            type="textarea"
            :autosize="true"
            :readonly="checkIn ? false : true"
          ></el-input>
        </el-form-item>
        <div v-if="checkIn" class="checkin">
          <el-button @click="personDetailVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmitInfo(model)">
            确定
          </el-button>
        </div>
      </div>
      <el-tabs
        v-else
        :ref="(dom) => (tabsRef1 = dom)"
        v-model="activeName1"
        class="tabs"
      >
        <el-tab-pane label="申报人基本情况" name="申报人基本情况">
          <div class="row">
            <div class="headTop">
              <img :src="avarta ? '/images' + avarta : ''" class="photo" />
              <div class="top">
                <el-form-item label="姓名">
                  <el-input v-model="model.name" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-input
                    :model-value="model.gender == 'male' ? '男' : '女'"
                    :readonly="true"
                  ></el-input>
                </el-form-item>
                <el-form-item label="国籍">
                  <el-input
                    v-model="model.nationality"
                    :readonly="true"
                  ></el-input>
                </el-form-item>
                <el-form-item label="出生年月">
                  <el-input
                    v-model="model.birthday"
                    :readonly="true"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="row">
            <el-form-item label="政治面貌">
              <el-input v-model="model.politic" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="证件号码">
              <el-input v-model="model.idNumber" :readonly="true"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="联系电话">
              <el-input v-model="model.mobile" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="电子邮件">
              <el-input v-model="model.email" :readonly="true"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="毕业院校">
              <el-input v-model="model.school" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item label="专业">
              <el-input v-model="model.field" :readonly="true"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="学位">
              <el-input v-model="model.degree" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="技术职称">
              <el-input v-model="model.techTitle" :readonly="true"></el-input>
            </el-form-item>
          </div>
          <div class="row">
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
            <!-- <QuillEditor
              ref="quillEditorRef1"
              theme="snow"
              :content="model.edu || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <el-form-item label="工作经历">
            <el-input
              v-model="model.work"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef"
              theme="snow"
              :content="model.work || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <el-form-item
            v-if="model.type == 'lj1' || model.type == 'YXQNRC'"
            label="创新能力业绩贡献"
          >
            <el-input
              v-model="model.contrib"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef3"
              theme="snow"
              :content="model.contrib || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <el-form-item v-else label="成果荣誉">
            <el-input
              v-model="model.honor"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef4"
              :content="model.honor || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <div class="row">
            <el-form-item
              label="您是否存在知识产权纠纷、竞业禁止、保密约定等情况，如有，请列出："
            >
              <el-radio-group
                v-model="model.hasOtherAgreement"
                :disabled="true"
              >
                <el-radio :label="false">无</el-radio>
                <el-radio :label="true">有</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="禁止协议">
            <el-input
              v-model="model.otherAgreement"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="model.type == 'YXQNRC' || model.type == 'lj1'"
            label="引进人才工资性年收入（万元）"
            prop="enterprise.income"
          >
            <el-input v-model="model.assign.income" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item
            v-if="model.type == 'YXQNRC'"
            label="支持举措"
            prop="enterprise.talentIncome"
          >
            <el-input
              v-model="model.assign.support"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <V-Table v-loading="sbrfj" :data="filelist1">
            <el-table-column label="附件名称" prop="name"></el-table-column>
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
                      ? 'text/html;'
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
          <el-form-item label="审核意见" prop="status">
            <el-radio-group
              v-model="model.status"
              :disabled="checkIn ? false : true"
            >
              <el-radio :label="7">退回</el-radio>
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="5">不通过</el-radio>
              <!-- <el-radio :label="activeName == '举荐单位审核' ? '4' : '7'">
                退回
              </el-radio>
              <el-radio :label="activeName == '举荐单位审核' ? '2' : '3'">
                通过
              </el-radio>
              <el-radio :label="activeName == '举荐单位审核' ? '3' : '5'">
                不通过
              </el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注说明" prop="opinion">
            <el-input
              v-model="model.opinion"
              type="textarea"
              :autosize="true"
              :readonly="checkIn ? false : true"
            ></el-input>
          </el-form-item>
          <div v-if="checkIn" class="checkin">
            <el-button @click="personDetailVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmitInfo(model)">
              确定
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="单位基本情况" name="单位基本情况" :lazy="true">
          <div class="row">
            <el-form-item
              label="单位名称"
              :prop="model.enterprise ? 'enterprise.name' : ''"
            >
              <el-input
                v-if="model.enterprise"
                v-model="model.enterprise.name"
                :readonly="true"
              ></el-input>
              <el-input v-else :readonly="true"></el-input>
            </el-form-item>
            <el-form-item
              v-if="
                model.enterprise &&
                model.enterprise.cityEnterpriseType == 1 &&
                (model.enterprise && model.enterprise.representType) == 1
              "
              label="推荐创投机构（知名创业投资人）"
              prop="investName"
            >
              <el-input
                v-model="model.enterprise.investName"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item v-else label="单位性质" prop="type">
              <el-input
                v-model="model.enterprise.type"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item
              label="单位性质"
              :prop="model.enterprise ? 'enterprise.type' : ''"
            >
              <el-input
                v-if="model.enterprise"
                v-model="model.enterprise.type"
                :readonly="true"
              ></el-input>
              <el-input v-else :readonly="true"></el-input>
            </el-form-item> -->
          </div>
          <div class="row">
            <el-form-item label="法人代表" prop="enterprise.represent">
              <el-input
                v-model="model.enterprise.represent"
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
          <!-- <el-form-item label="产业领域">
            <el-input v-model="model.industry" :readonly="true"></el-input>
          </el-form-item> -->
          <div
            v-if="
              (model.enterprise &&
                model.enterprise.cityEnterpriseType == 1 &&
                model.enterprise.representType == 2) ||
              model.enterprise.cityEnterpriseType != 1
            "
            class="row"
          >
            <el-form-item label="人事部门负责人" prop="enterprise.contactor">
              <el-input
                v-model="model.enterprise.contactor"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="enterprise.contactorMobile">
              <el-input
                v-model="model.enterprise.contactorMobile"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="单位注册时间" prop="enterprise.registerDate">
              <el-input
                v-model="model.enterprise.registerDate"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="实到注册资金(万元)"
              prop="enterprise.registerCapitcal"
            >
              <el-input
                v-model="model.enterprise.registerCapitcal"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="是否上市" prop="enterprise.isOnsale">
              <el-input
                :model-value="model.enterprise.isOnsale ? '是' : '否'"
                :readonly="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否为高新企业" prop="enterprise.isHighTech">
              <el-input
                :model-value="model.enterprise.isHighTech ? '是' : '否'"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="主营业务" prop="enterprise.major">
            <el-input
              v-model="model.enterprise.major"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef8"
              theme="snow"
              :content="model.enterprise.major || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <div class="row">
            <span>年份</span>
            <span>{{ year - 2 }}年（万元）</span>
            <span>{{ year - 1 }}年（万元）</span>
            <span>{{ year }}年--申报当月（万元）</span>
          </div>
          <div class="row">
            <span>收入</span>
            <span>{{ model.enterprise && model.enterprise.agoSale }}</span>
            <span>{{ model.enterprise && model.enterprise.blastSale }}</span>
            <span>{{ model.enterprise && model.enterprise.lastSale }}</span>
          </div>
          <div class="row">
            <span>净利润</span>
            <span>{{ model.enterprise && model.enterprise.agoProfit }}</span>
            <span>{{ model.enterprise && model.enterprise.blastProfit }}</span>
            <span>{{ model.enterprise && model.enterprise.lastProfit }}</span>
          </div>
          <div class="row">
            <span>研发投入</span>
            <span>{{ model.enterprise && model.enterprise.agoDev }}</span>
            <span>{{ model.enterprise && model.enterprise.blastDev }}</span>
            <span>{{ model.enterprise && model.enterprise.lastDev }}</span>
          </div>
          <div
            v-if="
              model.enterprise &&
              model.enterprise.cityEnterpriseType == 1 &&
              model.enterprise.representType == 1
            "
            class="row"
          >
            <span>其他成本</span>
            <span>{{ model.enterprise && model.enterprise.agoOthers }}</span>
            <span>{{ model.enterprise && model.enterprise.blastOthers }}</span>
            <span>{{ model.enterprise && model.enterprise.lastOthers }}</span>
          </div>
          <div class="row">
            <span>纳税</span>
            <span>{{ model.enterprise && model.enterprise.agoTax }}</span>
            <span>{{ model.enterprise && model.enterprise.blastTax }}</span>
            <span>{{ model.enterprise && model.enterprise.lastTax }}</span>
          </div>
          <el-form-item label="人才规模" prop="enterprise.teamDetail">
            <el-input
              v-model="model.enterprise.teamDetail"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位简介" prop="enterprise.memo">
            <el-input
              v-model="model.enterprise.memo"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef9"
              theme="snow"
              :content="model.enterprise.memo || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>

          <el-form-item
            v-if="
              model.enterprise &&
              model.enterprise.cityEnterpriseType == 1 &&
              model.enterprise &&
              model.enterprise.representType == 1
            "
            label="知名投资机构A轮投资情况"
            prop="enterprise.ainvest"
          >
            <el-input
              v-model="model.enterprise.ainvest"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef14"
              theme="snow"
              :content="model.enterprise.ainvest || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <el-form-item
            v-if="
              model.enterprise &&
              model.enterprise.cityEnterpriseType == 1 &&
              model.enterprise &&
              model.enterprise.representType == 1
            "
            label="团队核心成员情况"
            prop="enterprise.team"
          >
            <el-input
              v-model="model.enterprise.team"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef15"
              theme="snow"
              :content="model.enterprise.team || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <el-form-item
            v-if="
              model.enterprise &&
              model.enterprise.cityEnterpriseType == 1 &&
              model.enterprise &&
              model.enterprise.representType == 1
            "
            label="资本构成和股权结构"
            prop="enterprise.struct"
          >
            <el-input
              v-model="model.enterprise.struct"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef16"
              theme="snow"
              :content="model.enterprise.struct || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>
          <el-form-item
            v-if="
              model.enterprise &&
              model.enterprise.cityEnterpriseType == 1 &&
              model.enterprise &&
              model.enterprise.representType == 1
            "
            label="2019年以来投资机构投资实际到位资金（万元）"
            prop="enterprise.talentIncome"
          >
            <el-input
              v-model="model.enterprise.talentIncome"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="
              (model.enterprise &&
                model.enterprise.cityEnterpriseType == 1 &&
                model.enterprise.representType == 2) ||
              model.enterprise.cityEnterpriseType != 1
            "
            label="创新实力"
            prop="enterprise.idea"
          >
            <el-input
              v-model="model.enterprise.idea"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
            <!-- <QuillEditor
              ref="quillEditorRef10"
              theme="snow"
              :content="model.enterprise.idea || ''"
              :content-type="contentType"
              :options="{
                modules: {
                  toolbar: [],
                },
              }"
            /> -->
          </el-form-item>

          <!-- <el-form-item label="创新实力" prop="enterprise.idea">
            <el-input
              v-model="model.enterprise.idea"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item> -->
          <!-- <el-form-item
            v-if="
              model.enterprise.cityEnterpriseType != 1 ||
              model.enterprise.representType != 1
            "
            label="引进人才工资性年收入（万元）"
            prop="enterprise.talentIncome"
          >
            <el-input
              v-model="model.enterprise.talentIncome"
              :readonly="true"
            ></el-input>
          </el-form-item> -->
          <V-Table v-loading="sbrdwfj" :data="filelist2">
            <el-table-column label="附件名称" prop="name"></el-table-column>
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
                      ? 'text/html;'
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
        </el-tab-pane>
      </el-tabs>
    </template>
  </v-form-dialog>
  <!-- 修改弹窗 -->
  <v-form-dialog
    v-model="showChange"
    v-model:model="model"
    title="修改状态"
    :footer="false"
  >
    <template #default="{ model, done }">
      <el-form-item label="当前状态:" prop="status">
        <p style="line-height: 30px">通过</p>
      </el-form-item>
      <el-form-item label="修改状态为:" prop="status">
        <el-radio-group v-model="model.status">
          <el-radio :label="activeName == '举荐单位审核' ? '4' : '104'">
            退回
          </el-radio>
          <el-radio :label="activeName == '举荐单位审核' ? '3' : '4'">
            不通过
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="备注说明:"
        prop="memo1"
        :rules="[{ required: true, message: '备注不能为空' }]"
      >
        <el-input
          v-model="model.memo1"
          type="textarea"
          :autosize="true"
        ></el-input>
      </el-form-item>
      <div class="checkin">
        <el-button @click="showChange = false">取消</el-button>
        <el-button type="primary" @click="onSubmitInfo(model, done)">
          确定
        </el-button>
      </div>
    </template>
  </v-form-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, nextTick } from "vue";
import dayjs from "dayjs";
import VTable from "/@/components/VTable.vue";
import VSelect from "/@/components/VSelect.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VExport from "/@/components/VExport.vue";
import http from "../../config/http";
// import { QuillEditor } from "@vueup/vue-quill";
// import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default defineComponent({
  components: {
    VTable,
    VSelect,
    VFormDialog,
    VExport,
    // QuillEditor,
  },
  setup: function () {
    const tableRef = ref();
    const tableRef1 = ref();
    const tableRef2 = ref();
    const tabsRef = ref();
    const tabsRef1 = ref();
    // const quillEditorRef = ref(null);
    // const quillEditorRef1 = ref(null);
    // const quillEditorRef2 = ref(null);
    // const quillEditorRef4 = ref(null);
    // const quillEditorRef5 = ref(null);
    // const quillEditorRef6 = ref(null);
    // const quillEditorRef7 = ref(null);
    // const quillEditorRef8 = ref(null);
    // const quillEditorRef9 = ref(null);
    // const quillEditorRef10 = ref(null);
    // const quillEditorRef11 = ref(null);
    // const quillEditorRef12 = ref(null);
    // const quillEditorRef13 = ref(null);
    // const quillEditorRef14 = ref(null);
    // const quillEditorRef15 = ref(null);
    // const quillEditorRef16 = ref(null);
    const state = reactive({
      option: [],
      checkIn: false,
      showLog: false,
      showChange: false,
      personDetailVisible: false,
      model: {},
      logData: [],
      districtOptions: [{}],

      statusOptions: [
        { label: "市级通过", value: "3" },
        { label: "市级退回", value: "7" },
        { label: "市级审核中", value: "2" },
        { label: "市级不通过", value: "5" },
        // { label: "区级审核中", value: "1" },
        // { label: "区级审核未通过", value: "4" },
        // { label: "待区级受理", value: "6" },
        // { label: "自荐审核中", value: "100" },
        // { label: "投资机构审核中", value: "101" },
        // { label: "单位审核未通过", value: "102" },
        // { label: "区级不受理", value: "103" },
        // { label: "区级已退回", value: "104" },
      ],
      // regionList: [
      //   { label: "东湖高新区", value: "东湖高新区" },
      //   { label: "武汉开发区", value: "武汉开发区" },
      //   { label: "临空港开发区", value: "临空港开发区" },
      //   { label: "江岸区", value: "江岸区" },
      //   { label: "江汉区", value: "江汉区" },
      //   { label: "硚口区", value: "硚口区" },
      //   { label: "汉阳区", value: "汉阳区" },
      //   { label: "武昌区", value: "武昌区" },
      //   { label: "青山区", value: "青山区" },
      //   { label: "洪山区", value: "洪山区" },
      //   { label: "江夏区", value: "江夏区" },
      //   { label: "黄陂区", value: "黄陂区" },
      //   { label: "新洲区", value: "新洲区" },
      //   { label: "蔡甸区", value: "蔡甸区" },
      // ],
      typeList: [
        { label: "产业领军创新类", value: "lj1" },
        { label: "产业领军创业类", value: "lj2" },
        { label: "优秀青年人才", value: "YXQNRC" },
      ],
      activeName1: "申报人基本情况",
      activeName: "举荐单位审核",
      filelist1: [],
      filelist2: [],
      avarta: "",
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
      onlyOrg: "",
      dwfj: false,
      sbrfj: false,
      sbrdwfj: false,
      // contentType: "html",
      // options1: {
      //   placeholder: "请输入...",
      //   theme: "snow",
      // },
    });

    const examine = (row) => {
      state.checkIn = true;
      state.personDetailVisible = true;
      state.dwfj = true;
      state.model = {};
      state.beginTime = "";
      http
        .get(`/accountserver/backend/enterprisePool/get/${row.id}`)
        .then((res) => {
          if (res.data) {
            state.model = res.data;
            state.beginTime = res.data.dateCreated.slice(0, 4);
            console.log("申报的年份:" + state.beginTime);
            // const { major, memo, idea, ainvest, team, struct } = res.data;
            // quillEditorRef5.value?.setHTML(major ? major : "");
            // quillEditorRef6.value?.setHTML(memo ? memo : "");
            // quillEditorRef7.value?.setHTML(idea ? idea : "");
            // quillEditorRef11.value?.setHTML(ainvest ? ainvest : "");
            // quillEditorRef12.value?.setHTML(team ? team : "");
            // quillEditorRef13.value?.setHTML(struct ? struct : "");
          }
        })
        .then(() => {
          http
            .post(
              `/talentserver/backend/attachment/getAttachmentsByCondition`,
              {
                id: row.id,
                beginTime: state.beginTime,
              }
            )
            .then((res) => {
              state.model.filelist = res.data;
              state.dwfj = false;
            });
        });
    };
    const log = (row) => {
      state.showLog = true;
      state.beginTime = row.dateCreated.slice(0, 4);
      http
        .post(`/talentserver/auditLog/getTalentAuditLogByCondition`, {
          id: row.id,
          beginTime: state.beginTime,
          auditType: "1",
        })
        .then((res) => {
          if (res.code == 200) {
            state.logData = res.data;
          }
        })
        .catch((err) => {
          state.showLog = false;
        });
    };
    const formDate = (date) => {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    };
    //详情
    //附件
    const fileVsisible = ref(false);
    const fileState = reactive({
      id: "",
      list: [],
    });
    // 举荐单位查看
    const onPersonDetailShow = (row) => {
      state.personDetailVisible = true;
      state.checkIn = false;
      state.dwfj = true;
      state.model = {};
      state.beginTime = "";
      http
        .get(`/accountserver/backend/enterprisePool/get/${row.id}`)
        .then((res) => {
          if (res.data) {
            state.model = res.data;
            state.model.memo1 = res.data.map?.auditLog?.memo;
            state.beginTime = res.data.dateCreated.slice(0, 4);
            console.log("申报的年份:" + state.beginTime);
            // const { major, memo, idea, ainvest, team, struct } = res.data;
            // quillEditorRef5.value?.setHTML(major ? major : "");
            // quillEditorRef6.value?.setHTML(memo ? memo : "");
            // quillEditorRef7.value?.setHTML(idea ? idea : "");
            // quillEditorRef11.value?.setHTML(ainvest ? ainvest : "");
            // quillEditorRef12.value?.setHTML(team ? team : "");
            // quillEditorRef13.value?.setHTML(struct ? struct : "");
          }
        })
        .then(() => {
          http
            .post(
              `/talentserver/backend/attachment/getAttachmentsByCondition`,
              {
                id: row.id,
                beginTime: state.beginTime,
              }
            )
            .then((res) => {
              fileState.id = row.id;
              state.model.filelist = res.data;
              state.dwfj = false;
            });
        });
      fileVsisible.value = true;
      fileState.id = "";
    };
    // 信息审核

    const onSubmitInfo = (params) => {
      const { id, status, memo1, opinion } = params;
      let p = {
        id,
        status,
        type:
          status == 4
            ? "退回"
            : status == 2
            ? "通过"
            : status == 3
            ? "不通过"
            : "",
        opinion: memo1,
      };
      let url = "/accountserver/backend/enterprisePool/Audit2";
      if (tabsRef.value.currentName == "人才申报审核") {
        url = "/talentserver/talent/backend/auditTalent";
        p = {
          id,
          status,
          opinion,
          type:
            status == 7
              ? "市级退回"
              : status == 3
              ? "市级通过"
              : status == 5
              ? "市级不通过"
              : "",
        };
      }
      http
        .get(url, p, {
          message: true,
        })
        .then((res) => {
          state.checkIn = false;
          state.personDetailVisible = false;
          state.showChange = false;
          if (state.activeName == "举荐单位审核") {
            tableRef.value.onFresh();
          } else if (state.activeName == "人才申报审核") {
            tableRef2.value.onFresh();
          }
        })
        .catch((err) => {
          state.checkIn = false;
          state.personDetailVisible = false;
          state.showChange = false;
        });
    };

    const examine1 = (row) => {
      state.checkIn = true;
      state.personDetailVisible = true;
      state.model = {};
      http
        .get(`/talentserver/talent/district/getDetail/${row.id}`)
        .then((res) => {
          if (res.data) {
            state.model = res.data;
          }
        });
    };
    // 人才申报审核查看
    const onPersonDetailShow1 = (row, checkIn) => {
      state.personDetailVisible = true;
      state.activeName1 = "申报人基本情况";
      state.checkIn = checkIn;
      state.model = {};
      state.beginTime = "";
      fileVsisible.value = true;
      state.sbrfj = true;
      state.sbrdwfj = true;
      fileState.id = "";
      http
        .get(`/talentserver/talent/district/getDetail/${row.id}`)
        .then((res) => {
          if (res.data) {
            state.model = res.data;
            state.beginTime = res.data.dateCreated.slice(0, 4);
            console.log("申报的年份:" + state.beginTime);
            if (checkIn) {
              state.model.opinion = "";
            }
            // const { work, edu, contrib, honor } = res.data;
            // const { ainvest, team, struct, memo, idea, major } =
            //   res.data?.enterprise;
            // nextTick(() => {
            //   quillEditorRef1.value?.setHTML(edu ? edu : "");
            //   quillEditorRef.value?.setHTML(work ? work : "");
            //   quillEditorRef2.value?.setHTML(contrib ? contrib : "");
            //   quillEditorRef4.value?.setHTML(honor ? honor : "");
            //   quillEditorRef8.value?.setHTML(major ? major : "");
            //   quillEditorRef9.value?.setHTML(memo ? memo : "");
            //   quillEditorRef10.value?.setHTML(idea ? idea : "");
            //   quillEditorRef14.value?.setHTML(ainvest ? ainvest : "");
            //   quillEditorRef15.value?.setHTML(team ? team : "");
            //   quillEditorRef16.value?.setHTML(struct ? struct : "");
            // });
          }
        })
        .then(() => {
          http
            .post(
              `/talentserver/backend/attachment/getAttachmentsByCondition`,
              { id: state.model?.enterprise?.id, beginTime: state.beginTime }
            )
            .then((res) => {
              state.filelist2 = res.data;
              state.sbrdwfj = false;
            });
        })
        .then(() => {
          http
            .post(
              `/talentserver/backend/attachment/getAttachmentsByCondition`,
              {
                id: row.id,
                beginTime: state.beginTime,
              }
            )
            .then((res) => {
              state.filelist1 = res.data.filter((e) => e.type != "HEADER");
              state.sbrfj = false;
              state.avarta =
                res.data.length > 0
                  ? res.data.filter((item) => item.type == "HEADER")[0].url
                  : "";
            });
        });
      // .then((res) => {
      //   http
      //     .post(
      //       `/talentserver/backend/attachment/getAttachmentsByCondition`,
      //       { id: res?.data?.enterprise?.id, beginTime: "2021" }
      //     )
      //     .then((res) => {
      //       state.filelist2 = res.data;
      //       state.sbrdwfj = false;
      //     });
      // });
    };

    const translateType = (v) => {
      let res = "";
      switch (v) {
        case "lj1":
          res = "产业领军创新类";
          break;
        case "lj2":
          res = "产业领军创业类";
          break;
        case "YXQNRC":
          res = "优秀青年人才";
          break;
      }
      return res;
    };
    const translateCompanyType = (v) => {
      let res = "";
      switch (v) {
        case "1":
          res = "企业";
          break;
        case "2":
          res = "重点实验室";
          break;
        case "3":
          res = "重点高校";
          break;
        case "4":
          res = "湖北实验室/国家重点实验室";
          break;
      }
      return res;
    };
    const translateStatus = (v) => {
      let res = "";
      switch (v) {
        case 1:
          res = "区级审核中";
          break;
        case 2:
          res = "市级审核中";
          break;
        case 3:
          res = "市级通过";
          break;
        case 4:
          res = "区级不通过";
          break;
        case 5:
          res = "市级不通过";
          break;
        case 7:
          res = "市级退回";
          break;
        case 104:
          res = "区级退回";
          break;
      }
      return res;
    };

    const isOrg = ref(
      localStorage.getItem("orgId") ? localStorage.getItem("orgId") : ""
    );
    if (isOrg.value) {
      let org = state.areaList.find((e) => e.code == isOrg.value);
      state.onlyOrg = org.area;
    }
    // 修改状态
    const changeStatus = (row) => {
      state.showChange = true;
      state.model = { id: row.id };
    };
    // 当前用户
    const userName = localStorage.getItem("user");
    return {
      // quillEditorRef,
      // quillEditorRef1,
      // quillEditorRef2,
      // quillEditorRef4,
      // quillEditorRef5,
      // quillEditorRef6,
      // quillEditorRef7,
      // quillEditorRef8,
      // quillEditorRef9,
      // quillEditorRef10,
      // quillEditorRef11,
      // quillEditorRef12,
      // quillEditorRef13,
      // quillEditorRef14,
      // quillEditorRef15,
      // quillEditorRef16,
      ...toRefs(state),
      fileState,
      examine,
      log,
      formDate,
      tableRef,
      tableRef1,
      fileVsisible,
      onPersonDetailShow,
      year: new Date().getFullYear(),
      onSubmitInfo,
      translateType,
      translateStatus,
      examine1,
      onPersonDetailShow1,
      tabsRef,
      tabsRef1,
      tableRef2,
      translateCompanyType,
      // changeStatus,
      userName,
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
.red {
  color: red;
}
.checkin {
  text-align: right;
}

.headTop {
  display: flex;
  width: calc(100% - 180px);
  flex-wrap: wrap;
  .photo {
    height: 180px;
    object-fit: contain;
    margin-right: 10px;
  }
  .top {
    flex: 3;
    display: flex;
    flex-wrap: wrap;
    :deep(.el-form-item) {
      width: 45%;
      margin-right: 20px;
    }
    :deep(.el-form-item:last-child) {
      margin-right: 0px;
    }
  }
}
// .ql-editor {
//   height: 400px;
// }
:deep(.el-form-item__content) {
  .ql-toolbar.ql-snow {
    border: 0;
    border-bottom: 1px solid #d1d5db;
    padding: 0;
  }
}
</style>
