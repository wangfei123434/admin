<template>
  <V-Table
    :ref="(dom) => (personTableRef = dom)"
    url="/talentserver/backend/talent/city/list"
    method="post"
    :query="{ types: [], typeName: 'yxqn', year: '2019' }"
  >
    <template #query="{ query }">
      <el-form-item label="审核状态">
        <v-select v-model="query.status" :options="statusOptions"></v-select>
      </el-form-item>
      <el-form-item label="申报类型">
        <v-select
          v-model="query.types"
          :options="queryTypes"
          :multiple="true"
        ></v-select>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input v-model="query.nameLike"></el-input>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-input v-model="query.companyName"></el-input>
      </el-form-item>
    </template>
    <template #default>
      <el-table-column
        label="申请人"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column label="申报类型" prop="type">
        <template #default="{ row }">{{ translateType(row.type) }}</template>
      </el-table-column>
      <el-table-column label="性别" prop="gender">
        <template #default="{ row }">
          {{ row.gender == "female" ? "女" : "男" }}
        </template>
      </el-table-column>
      <el-table-column label="工作单位" prop="companyName"></el-table-column>
      <el-table-column label="所在区域" prop="org"></el-table-column>
      <el-table-column label="申请时间" prop="dateCreated">
        <template #default="{ row }">
          {{ formDate(row.dateCreated) }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="status">
        <template #default="{ row }">
          <span :color="row.status == 3 ? '#333' : 'red'">
            {{ translateStatus(row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="onPersonDetailShow(row)">
            详情
          </el-button>
          <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          <el-button type="text" @click="onLogSHow(row)">日志</el-button>
        </template>
      </el-table-column>
    </template>
  </V-Table>

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
      <el-form-item label="人员情况" prop="team">
        <el-input
          v-model="model.team"
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
                  ? '?' + (url = encodeURIComponent(row.url))
                  : '/' + row.id
              }`"
              type="preview-target"
              :file-type="
                row.fileType == 'doc'
                  ? 'application/msword;'
                  : row.fileType == 'docx'
                  ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
          受理
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
          不受理
        </el-button>
        <el-button @click="done">取消</el-button>
      </div>
    </template>
  </v-form-dialog>
  <v-form-dialog
    v-model="logVisible"
    title="日志"
    :footer="null"
    :destroy-on-close="true"
  >
    <template #default="{ done }">
      <V-Table
        :ref="(dom) => (logTableRef = dom)"
        :url="`/talentserver/auditLog/getAuditLogs/${logState.id}`"
        method="get"
      >
        <el-table-column label="审核意见" prop="memo"></el-table-column>
        <el-table-column label="审核部门" prop="auditOrg"></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated">
          <template #default="{ row }">
            {{ formDate(row.dateCreated) }}
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
        :url="`/talentserver/backend/talent/city/downloadDetail?talentId=${model.id}`"
        :filename="model.name + '.doc'"
        file-type="application/msword"
      >
        <el-button type="primary" class="exportWord">下载申请书</el-button>
      </v-export>
      <el-tabs>
        <el-tab-pane label="申报简表">
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
              <el-input v-model="model.phone" :readonly="true"></el-input>
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
            <el-form-item label="电子邮件">
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
          <el-form-item label="备注">
            <el-input
              v-model="model.memo"
              type="textarea"
              :autosize="true"
              :readonly="true"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </template>
  </v-form-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref, toRefs, nextTick } from "vue";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VExport from "/@/components/VExport.vue";
import VDelete from "/@/components/VDelete.vue";
import VSelect from "/@/components/VSelect.vue";
import http from "../../config/http";
import { Canceler } from "axios";
import dayjs from "dayjs";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    // VDelete,
    VExport,
    VSelect,
  },
  setup() {
    const tableRef = ref<HTMLElement>();
    const logTableRef = ref<HTMLElement>();
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
        "区委组织部",
        "化工园区",
        "区教育局",
        "区科经局",
        "区商务局",
        "区卫健局",
        "开发区",
      ].map((value) => ({ label: value, value })),
      statusOptions: [
        { label: "草稿", value: "0" },
        { label: "区级审核中", value: "1" },
        { label: "市级审核中", value: "2" },
        { label: "已通过线上审核", value: "3" },
        { label: "区级审核未通过", value: "4" },
        { label: "市级审核未通过", value: "5" },
        { label: "待区级受理", value: "6" },
        { label: "自荐审核中", value: "100" },
        { label: "单位审核中", value: "101" },
        { label: "单位审核未通过", value: "102" },
        { label: "区级不受理", value: "103" },
        { label: "区级已退回", value: "104" },
      ],
      queryTypes: [
        { label: "海内外知名高校博士类", value: "a1" },
        { label: "获得省级以上荣誉优秀毕业生类", value: "a2" },
        { label: "入选青年科技创新人才榜单类", value: "b1" },
        { label: "获得市级以上创业赛事大奖类", value: "b2" },
        { label: "创投机构举(推)荐类", value: "b3" },
        { label: "用人单位举(推)荐类", value: "c" },
      ],
      personVerifyVisible: false,
      personDetailVisible: false,
      logVisible: false,
      logState: {
        id: "",
      },
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
      http
        .get(`/talentserver/backend/talent/city/get/${row.id}`)
        .then((res) => {
          model.value = res.data;
        });
    };
    //日志
    const onLogSHow = (row: Record<string, any>) => {
      state.logVisible = true;
      state.logState = { id: row.id };
    };
    const translateType = (v: any) => {
      let res = "";
      switch (v) {
        case "a1":
          res = "海内外知名高校博士类";
          break;
        case "a2":
          res = "获得省级以上荣誉优秀毕业生类";
          break;
        case "b1":
          res = "入选青年科技创新人才榜单类";
          break;
        case "b2":
          res = "获得市级以上创业赛事大奖类";
          break;
        case "b3":
          res = "创投机构举(推)荐类";
          break;
        case "c":
          res = "用人单位举(推)荐类";
          break;
      }
      return res;
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
          res = "在汉连续缴纳6个月社保或个人所得税证明";
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
    const translateStatus = (v: any) => {
      let d: any = state.statusOptions.find((e: any) => e.value == v);
      return d?.label;
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
      translateType,
      translateStatus,
      logTableRef,
      formDate(date: any) {
        return date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "";
      },
      translateAttachType,
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
</style>
