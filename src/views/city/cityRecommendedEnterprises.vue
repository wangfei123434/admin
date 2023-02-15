<template>
  <el-tabs class="tabs">
    <el-tab-pane label="待认定" :lazy="true">
      <V-Table
        url="accountserver/backend/enterprisePool/list"
        method="post"
        :query="{
          status: '1',
          year: '2019',
        }"
      >
        <template #query="{ query }">
          <el-form-item label="企业名称">
            <el-input v-model="query.nameLike"></el-input>
          </el-form-item>
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
          label="单位联系人手机号码"
          prop="contactorMobile"
        ></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
        <el-table-column
          label="上次修改时间"
          prop="lastUpdated"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="onPersonDetailShow(row)">
              详情
            </el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template>
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="未通过" :lazy="true">
      <V-Table
        url="accountserver/backend/enterprisePool/list"
        method="post"
        :query="{
          status: '3',
          year: '2019',
        }"
      >
        <template #query="{ query }">
          <el-form-item label="企业名称">
            <el-input v-model="query.nameLike"></el-input>
          </el-form-item>
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
          label="单位联系人手机号码"
          prop="contactorMobile"
        ></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
        <el-table-column
          label="上次修改时间"
          prop="lastUpdated"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="onPersonDetailShow(row)">
              详情
            </el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template>
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="已退回" :lazy="true">
      <V-Table
        url="accountserver/backend/enterprisePool/list"
        method="post"
        :query="{
          status: '4',
          year: '2019',
        }"
      >
        <template #query="{ query }">
          <el-form-item label="企业名称">
            <el-input v-model="query.nameLike"></el-input>
          </el-form-item>
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
          label="单位联系人手机号码"
          prop="contactorMobile"
        ></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
        <el-table-column
          label="上次修改时间"
          prop="lastUpdated"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="onPersonDetailShow(row)">
              详情
            </el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template>
        </el-table-column>
      </V-Table>
    </el-tab-pane>
    <el-tab-pane label="已认定" :lazy="true">
      <V-Table
        url="accountserver/backend/enterprisePool/list"
        method="post"
        :query="{
          status: '2',
          year: '2019',
        }"
      >
        <template #query="{ query }">
          <el-form-item label="企业名称">
            <el-input v-model="query.nameLike"></el-input>
          </el-form-item>
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
          label="单位联系人手机号码"
          prop="contactorMobile"
        ></el-table-column>
        <el-table-column label="创建时间" prop="dateCreated"></el-table-column>
        <el-table-column
          label="上次修改时间"
          prop="lastUpdated"
          align="center"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="onPersonDetailShow(row)">
              详情
            </el-button>
            <el-button type="text" @click="onFileSHow(row)">附件</el-button>
          </template>
        </el-table-column>
      </V-Table>
    </el-tab-pane>
  </el-tabs>

  <v-form-dialog
    v-model="personDetailVisible"
    v-model:model="model"
    :fetch-loading="!model.id"
    label-position="top"
    title="详情"
    @submit="(_, done) => done()"
  >
    <template #default="{ model }">
      <hr />
      <div class="row">
        <el-form-item label="企业名称">
          <el-input v-model="model.name" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="单位类型">
          <el-input v-model="model.type" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="单位地址">
          <el-input v-model="model.address" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="单位联系人">
          <el-input v-model="model.contactor" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="单位联系人手机号">
          <el-input v-model="model.contactorMobile" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="法人代表">
          <el-input v-model="model.represent" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="单位注册时间">
          <el-input v-model="model.registerDate" :readonly="true"></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="实际注册资金（万元）">
          <el-input
            v-model="model.registerCapitcal"
            :readonly="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否上市">
          <el-input
            :readonly="true"
            :value="model.isOnsale == false ? '否' : '是'"
          ></el-input>
          <!-- :value="model.isOnsale ? '是' : '否'" -->
          <!-- <el-input v-model="model.isOnsale" :readonly="true"></el-input> -->
        </el-form-item>
        <el-form-item label="是否为高新企业或高品备案企业">
          <el-input
            :readonly="true"
            :value="model.isHighTech ? '是' : '否'"
          ></el-input>
          <!-- <el-input v-model="model.isHighTech" :readonly="true"></el-input> -->
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="主营业务">
          <el-input
            v-model="model.major"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="是否在中国证券投资基金业协会备案">
          <el-input
            v-model="model.isRecord"
            type="text"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <span style="flex: 0.3">年份</span>
        <span>{{ new Date().getFullYear() - 3 }}年（万元）</span>
        <span>{{ new Date().getFullYear() - 2 }}年（万元）</span>
        <span>{{ new Date().getFullYear() - 1 }}年（万元）</span>
      </div>
      <div class="row">
        <span style="flex: 0.3">收入</span>
        <el-input v-model="model.agoSale" :readonly="true"></el-input>
        <el-input v-model="model.blastSale" :readonly="true"></el-input>
        <el-input v-model="model.lastSale" :readonly="true"></el-input>
      </div>
      <div class="row">
        <span style="flex: 0.3">净利润</span>
        <el-input v-model="model.agoProfit" :readonly="true"></el-input>
        <el-input v-model="model.blastProfit" :readonly="true"></el-input>
        <el-input v-model="model.lastProfit" :readonly="true"></el-input>
      </div>
      <div class="row">
        <span style="flex: 0.3">研发投入</span>
        <el-input v-model="model.agoDev" :readonly="true"></el-input>
        <el-input v-model="model.blastDev" :readonly="true"></el-input>
        <el-input v-model="model.lastDev" :readonly="true"></el-input>
      </div>
      <div class="row">
        <span style="flex: 0.3">纳税</span>
        <el-input v-model="model.agoTax" :readonly="true"></el-input>
        <el-input v-model="model.blastTax" :readonly="true"></el-input>
        <el-input v-model="model.lastTax" :readonly="true"></el-input>
      </div>
      <div class="row">
        <span style="flex: 0.3">其他成本</span>
        <el-input v-model="model.agoOthers" :readonly="true"></el-input>
        <el-input v-model="model.blastOthers" :readonly="true"></el-input>
        <el-input v-model="model.lastOthers" :readonly="true"></el-input>
      </div>
      <div class="row">
        <el-form-item label="人员情况">
          <el-input
            v-model="model.team"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="单位简介">
          <el-input
            v-model="model.memo"
            type="textarea"
            :autosize="true"
            :readonly="true"
          ></el-input>
        </el-form-item>
      </div>
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
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from "vue";
import VTable from "/@/components/VTable.vue";
import http from "../../config/http";
import VExport from "/@/components/VExport.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
export default defineComponent({
  components: {
    // NotFoundPage,
    VTable,
    VFormDialog,
    VExport,
  },
  setup() {
    const model = ref({});
    const fileVsisible = ref(false);
    const fileState = reactive({
      id: "",
      list: [],
    });
    const state = reactive({
      personDetailVisible: false,
    });
    const onFileSHow = (row) => {
      fileVsisible.value = true;
      fileState.id = "";
      http
        .get(`talentserver/backend/attachment/getAttachmentList/${row.id}`)
        // .get(`/talentserver/backend/attachment/getAttachments/${row.id}`, {})
        .then((res) => {
          fileState.id = row.id;
          fileState.list = res.data;
        });
    };
    const onPersonDetailShow = (row) => {
      state.personDetailVisible = true;
      model.value = {};
      http
        .get(`/accountserver/backend/enterprisePool/get/${row.id}`)
        .then((res) => {
          model.value = res.data;
        });
    };
    const translateAttachType = (v) => {
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
    return {
      onFileSHow,
      onPersonDetailShow,
      ...toRefs(state),
      model,
      fileVsisible,
      fileState,
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
.iconRight {
  display: flex;
  justify-content: flex-end;
}
</style>
