<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/rentserver/student/queryOld"
    :parse="true"
  >
    <template #query="{ query }">
      <el-form-item label="审核状态">
        <el-select v-model="query.status" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="在读状态">
        <el-select v-model="query.isGraduate" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in isRead"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" class="keyword" label="姓名">
        <el-input v-model="query.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="idCard" class="keyword" label="身份证号">
        <el-input v-model="query.idCard" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="school" class="keyword" label="学校">
        <el-input v-model="query.school" placeholder="请输入"></el-input>
      </el-form-item>
    </template>
    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column label="性别" prop="gender">
      <template #default="{ row }">
        {{ row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column
      label="身份证号"
      prop="idCard"
      width="140px"
    ></el-table-column>
    <el-table-column label="联系电话" prop="phoneNumber"></el-table-column>
    <el-table-column label="是否在读" prop="isGraduate" align="center">
      <template #default="{ row }">
        {{ row.isGraduate == 0 ? "否" : "是" }}
      </template>
    </el-table-column>
    <el-table-column label="毕业/就读学校" prop="school"></el-table-column>
    <el-table-column label="状态" prop="status">
      <template #default="{ row }">
        <span v-for="(item, index) in checkList" :key="index">
          {{ row.status == item.value ? item.label : "" }}
        </span>
      </template>
    </el-table-column>
  </V-Table>

  <!-- 审核 vs 查看   -->
  <VFormDialog
    v-model="check"
    :title="itemObj.status == 1 ? '审核' : '查看'"
    width="60%"
    :model="shForm"
    @submit="onSubmitInfo"
  >
    <div v-loading="!itemObj.id" class="checkTop">
      <img :src="itemObj.photoId" class="photo" />
      <table border="1px" class="inner-table">
        <tbody>
          <tr>
            <td>学生姓名</td>
            <td>{{ itemObj.name }}</td>
            <td>毕业（就读）学校</td>
            <td>{{ itemObj.school }}</td>
          </tr>
          <tr>
            <td>性别</td>
            <td>{{ itemObj.gender == 1 ? "男" : "女" }}</td>
            <td>专业名称</td>
            <td>{{ itemObj.specality }}</td>
          </tr>

          <tr>
            <td>民族</td>
            <td>{{ itemObj.nation }}</td>
            <td>专业类别</td>
            <td>{{ itemObj.specalityXkml }}-{{ itemObj.specalitySsml }}</td>
          </tr>

          <tr>
            <td>身份证号</td>
            <td>{{ itemObj.idCard }}</td>
            <td>毕业时间</td>
            <td>
              {{ itemObj.graduateDate ? formDate(itemObj.graduateDate) : "" }}
            </td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{ itemObj.phoneNumber }}</td>
            <td>最高学历</td>
            <td>
              <span v-for="(item, index) in educationList" :key="index">
                {{ item.code == itemObj.education ? item.level : "" }}
              </span>
            </td>
          </tr>
          <tr>
            <td>电子邮箱</td>
            <td>{{ itemObj.email }}</td>
            <td>学位</td>
            <td>
              <span v-for="(item, index) in degreeList" :key="index">
                {{ item.code == itemObj.degree ? item.degree : "" }}
              </span>
            </td>
          </tr>

          <tr>
            <td>是否在读</td>
            <td>{{ itemObj.isGraduate == 0 ? "否" : "是" }}</td>
            <td>毕业证号/学籍号</td>
            <td>{{ itemObj.educationCard }}</td>
          </tr>
          <tr>
            <td>学信网验证码</td>
            <td class="yz">
              {{ itemObj.checkCode }}
              <br />
              <a
                :href="`https://www.chsi.com.cn/xlcx/bg.do?vcode=${itemObj.checkCode}&srcid=bgcx`"
              >
                点击前往认证
              </a>
            </td>
            <td>人才类型</td>
            <td>{{ itemObj.talentLevel }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="title">附件列表</p>
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
          {{ row.createDate ? formDate(row.createDate) : "" }}
        </template>
      </el-table-column>
    </v-table>
    <div
      v-if="itemObj.status == 2 || itemObj.status == 3"
      class="info"
      style="margin: 20px 0 0 0"
    >
      <table
        class="attachTable"
        width="100%"
        border="0px"
        cellspacing="0"
        cellpadding="0"
      >
        <thead>
          <tr class="infobt">
            <td style="font-size: 16px" colspan="2">审核结果</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="infobt">审核状态</td>
            <td>
              <span id="labStatus">
                {{ itemObj.status == 2 ? "通过" : "不通过" }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="infobt">审核意见</td>
            <td>
              <span id="labFinallyOpinion">
                {{ itemObj.opinion }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div class="fileList">
      <p class="title">留学生服务中心认证报告</p>
      <ul v-if="fileList.length > 0">
        <li></li>
      </ul>
      <div v-else-if="fileList.length == 0" class="wei">无</div>
    </div> -->
    <div v-if="itemObj.status == 1" class="fileList">
      <p class="title">个人信息审核</p>
      <el-form-item
        label="审核结果"
        prop="status"
        :rules="[{ required: true, message: '请选择审核结果' }]"
      >
        <el-radio-group v-model="shForm.status">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="shForm.status == 2"
        label="人才类型"
        :rules="[{ required: true, message: '请选择人才类型' }]"
      >
        <el-cascader
          v-model="shForm.value"
          :options="options"
          prop="type"
          clearable
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="备注（不通过原因）">
        <el-input v-model="shForm.opinion" type="textarea"></el-input>
      </el-form-item>
    </div>
  </VFormDialog>
</template>
<script>
import http from "../../config/http";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import dayjs from "dayjs";
import VSelect from "/@/components/VSelect.vue";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    // VSelect,
  },

  setup() {
    const tableRef = ref();
    let validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        let reg = /^[\u4e00-\u9fa5]{2,10}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的姓名"));
        }
      }
    };
    let validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        let reg = /^1[0-9]{10}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的手机号"));
        }
      }
    };
    let checkidCard = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号码"));
      } else {
        let reg =
          /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的身份证号"));
        }
      }
    };
    let checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式的密码"));
        }
      }
    };
    const state = reactive({
      options: [
        {
          value: "高层次人才",
          label: "高层次人才",
          children: [
            {
              value: "A",
              label: "高层次人才",
            },
          ],
        },
        {
          value: "大学生人才",
          label: "大学生人才",
          children: [
            {
              value: "A",
              label: "博士研究生",
            },
            {
              value: "B",
              label: "硕士研究生",
            },
            {
              value: "C",
              label: "本科及以下",
            },
          ],
        },
        {
          value: "高技能人才",
          label: "高技能人才",
          children: [
            {
              value: "A",
              label: "高级技师",
            },
            {
              value: "B",
              label: "技师",
            },
            {
              value: "C",
              label: "紧缺人才或高级工",
            },
          ],
        },
      ],
      checkList: [
        { label: "待审核", value: 1 },
        { label: "通过", value: 2 },
        { label: "不通过", value: 3 },
      ],
      isRead: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      formInline: {
        audit: "",
        read: "",
        keyword: "",
      },
      check: false,
      // showAttach: false,
      itemObj: {},
      attachList: [],
    });
    const table = reactive({
      tableData: [],
      fileList: [],
      logData: [],
      showChange: false,
      showLog: false,
      check: false,
      pass: "",
      changeForm: {},
      logId: "",
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        idCard: [{ validator: checkidCard, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
      },
      shForm: {},
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
    // 信息审核

    const onSubmitInfo = (params, done) => {
      http
        .get(
          "/rentserver/setStudentStatus",
          {
            id: state.itemObj.id,
            status: table.shForm.status,
            opinion: table.shForm.opinion,
            talentLevel: table.shForm.type,
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
    const handleChange = (value) => {
      table.shForm.value = value ? value[1] : "";
    };
    return {
      validateName,
      validatePhone,
      checkidCard,
      checkPassword,
      ...toRefs(state),
      ...toRefs(table),
      // changeInfo,
      onSubmitInfo,
      formDate(date) {
        return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      },
      //   checkInfo,
      tableRef,
      //   onFileSHow,
      handleChange,
    };
  },
});
</script>
<style lang="scss" scoped>
a,
a:hover {
  color: $main-color;
  text-decoration: none;
}
.keywoord {
  :deep(.el-input--small .el-input__inner) {
    width: 280px;
  }
}
.tip {
  margin-top: 10px;
  font-size: 12px;
  color: #aaaaaa;
}
.checkTop {
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 0 20px;
  .photo {
    width: 180px;
    object-fit: contain;
    margin-right: 10px;
  }
  .inner-table {
    width: calc(100% - 180px);
    box-sizing: content-box;
    tbody {
      width: 100%;
    }
    display: flex;
    flex-wrap: wrap;
    tr {
      width: 100%;
      display: flex;
      border: 0;
      td {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 30px;
      }
      td.yz {
        flex-direction: column;
        a,
        a:hover {
          color: $main-color;
          text-decoration: none;
        }
      }
    }
  }
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
a,
a:hover {
  color: $main-color;
}
/*info样式开始*/
.info {
  width: 100%;
  margin: 10px auto 0px auto;
  // border: solid 1px #cbd4da;
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
  // border-right: solid 1px #cbd4da;
}
.info td {
  height: 40px;
}
.info th {
  // border-bottom: solid 1px #cbd4da;
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
:deep(.tableWrapper) {
  margin: 10px;
}
.attachTable {
  border: 1px solid #e1e4eb;
  border-radius: 6px;
}
.infobt {
  background-color: #f1f4f9;
  font-weight: bold;
  width: 12%;
  height: 40px;
}
.infobt1 {
  background-color: #f1f4f9;
  font-weight: bold;
  width: 10%;
  height: 40px;
  text-align: center;
}
.infobt2 {
  background-color: #f1f4f9;
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
    width: 100%;
    resize: none;
  }
}
:deep(.el-cascader) {
  width: 300px !important;
  display: block;
}
.fileList {
  :deep(.el-form-item) {
    width: 100%;
  }
  :deep(.el-el-cascader) {
    width: 25% !important;
  }
  :deep(.el-el-cascader) {
    width: 25% !important;
  }
  :deep(.el-input__inner) {
    width: 100% !important;
  }
}
.title {
  font-size: 16px;
  font-weight: bold;
  line-height: 50px;
}
</style>
