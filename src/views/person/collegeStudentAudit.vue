<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    :query="defaultQuery"
    url="/rentserver/student/query"
    :parse="true"
    @delete-time="deleteTimeFun"
  >
    <template #query="{ query }">
      <el-form-item label="审核状态">
        <el-select v-model="query.status" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in checkList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="在读状态">
        <el-select v-model="query.isGraduate" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in isRead"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" class="keyword" label="姓名">
        <el-input v-model.trim="query.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="idCard" class="keyword" label="身份证号">
        <el-input v-model.trim="query.idCard" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="school" class="keyword" label="学校">
        <el-input v-model.trim="query.school" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber" class="keyword" label="手机号">
        <el-input
          v-model.trim="query.phoneNumber"
          placeholder="请输入"
        ></el-input>
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

    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column label="性别" prop="gender" align="center">
      <template #default="{ row }">
        {{ row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column
      label="身份证号"
      prop="idCard"
      width="150px"
      align="center"
    ></el-table-column>
    <el-table-column
      label="联系电话"
      prop="phoneNumber"
      align="center"
    ></el-table-column>
    <el-table-column
      label="毕业/就读学校"
      prop="school"
      align="center"
    ></el-table-column>
    <el-table-column label="审核状态" prop="status" align="center">
      <template #default="{ row }">
        <span
          v-for="(item, index) in checkList"
          :key="index"
          :style="item.label == '审核中' ? 'color:red' : ''"
        >
          {{ row.status == item.value ? item.label : "" }}
        </span>
        <!-- {{ row.status == 1 ? "待审核" : row.status == 3 ? "不通过" : "通过" }} -->
      </template>
    </el-table-column>
    <el-table-column label="资格审核" prop="alaStatus" align="center">
      <template #default="{ row }">
        <span :style="row.alaStatus == '审核中' ? 'color:red' : ''">
          {{ row.alaStatus }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="提交时间" prop="registerDate" align="center">
      <template #default="{ row }">
        {{
          row.registerDate
            ? dayjs(row.registerDate).format("YYYY-MM-DD HH:mm:ss")
            : ""
        }}
      </template>
    </el-table-column>
    <el-table-column label="审核时间" prop="checkDate" align="center">
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
        <el-button type="text" @click="(check = true), checkInfo(row.id)">
          {{
            row.status == 1 &&
            (row.alaStatus == "审核中" ||
              row.alaStatus == "" ||
              row.alaStatus == null)
              ? "审核"
              : "查看"
          }}
        </el-button>
        <el-button type="text" @click="logClick(row.id)">日志</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <!-- 审核 vs 查看   -->
  <VFormDialog
    v-model="check"
    :title="itemObj.status == 1 ? '审核' : '查看'"
    width="60%"
    :model="shForm"
    :footer="itemObj.status == 1 ? true : false"
    @submit="onSubmitInfo"
  >
    <div v-loading="!itemObj.id" class="checkTop">
      <img
        v-if="itemObj.photoId"
        :src="'/images' + itemObj.photoId"
        class="photo"
      />
      <table border="1px" class="inner-table">
        <tbody>
          <tr>
            <td style="background: #ccc">姓名</td>
            <td>{{ itemObj.name }}</td>
            <td style="background: #ccc">毕业（就读）学校</td>
            <td>{{ itemObj.school }}</td>
          </tr>
          <tr>
            <td style="background: #ccc">性别</td>
            <td>{{ itemObj.gender == 1 ? "男" : "女" }}</td>
            <!-- <td>专业名称</td>
            <td>{{ itemObj.specality }}</td> -->
            <td style="background: #ccc">专业</td>
            <td>{{ itemObj.specality }}</td>
          </tr>

          <tr>
            <td style="background: #ccc">民族</td>
            <td>{{ itemObj.nation }}</td>
            <td style="background: #ccc">毕业时间</td>
            <td>
              {{ itemObj.graduateDate ? formDate(itemObj.graduateDate) : "" }}
            </td>
          </tr>

          <tr>
            <td style="background: #ccc">身份证号</td>
            <td>{{ itemObj.idCard }}</td>
            <!-- <td>学位证号</td>
            <td>{{ itemObj.degreeCard }}</td> -->
            <td style="background: #ccc">学位</td>
            <td>
              <span v-for="(item, index) in degreeList" :key="index">
                {{ item.code == itemObj.degree ? item.degree : "" }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="background: #ccc">联系电话</td>
            <td>{{ itemObj.phoneNumber }}</td>
            <td style="background: #ccc">最高学历</td>
            <td>
              <span v-for="(item, index) in educationList" :key="index">
                {{ item.code == itemObj.education ? item.level : "" }}
              </span>
            </td>
          </tr>

          <tr>
            <td style="background: #ccc">邮箱地址</td>
            <td>{{ itemObj.email }}</td>
            <td style="background: #ccc">毕业证号</td>
            <td>{{ itemObj.educationCard }}</td>
          </tr>
          <tr>
            <td style="background: #ccc">是否在读</td>
            <td>{{ itemObj.isGraduate == 0 ? "否" : "是" }}</td>
            <td style="background: #ccc">学信网验证码</td>
            <td class="yz">
              {{ itemObj.checkCode }}
              <br />
              <a
                :href="`https://www.chsi.com.cn/xlcx/bg.do?vcode=${itemObj.checkCode}&srcid=bgcx`"
                target="_blank"
              >
                点击前往认证
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <p class="title" style="display: inline-block; margin-right: 10px">
        附件列表
      </p>
      <el-button
        type="text"
        style="font-size: 16px; font-weight: bold"
        @click="showDialogObjDelDef"
      >
        附件预览
      </el-button>
    </div>
    <v-table :data="attachList" :page-size="5" :pagination="false">
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
              <span style="line-height: 25px">
                {{ itemObj.opinion }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="itemObj.status == 1" class="fileList">
      <p class="title">学历审核</p>
      <el-form-item
        label="审核结果"
        prop="status"
        :rules="[{ required: true, message: '请选择审核结果' }]"
      >
        <el-radio-group v-model="shForm.status">
          <el-radio :label="2" :value="2">通过</el-radio>
          <el-radio :label="3" :value="3">不通过</el-radio>
          <el-radio :label="4" :value="4">退回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="备注（退回/不通过原因）"
        prop="opinion"
        :rules="
          shForm.status == 3 || shForm.status == 4
            ? [{ required: true, message: '请输入不通过或退回原因' }]
            : []
        "
      >
        <el-input v-model="shForm.opinion" type="textarea"></el-input>
      </el-form-item>
    </div>
  </VFormDialog>

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

  <SwiperCom
    :dialog-object="dialogObjDelDef"
    @dialogClose="dialogCloseDef"
    @dialogSuccess="dialogSuccessDef"
  ></SwiperCom>
</template>
<script>
import http from "../../config/http";
import VTable from "/@/components/VTable.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import dayjs from "dayjs";
import SwiperCom from "/@/components/SwiperCom.vue";
// import VSelect from "/@/components/VSelect.vue";
// import VExport from "/@/components/VExport.vue";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import store from "../../store";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    SwiperCom,
    // VExport,
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

    const store = useStore();
    const props = reactive({
      lazy: true,
      lazyLoad(node, resolve) {
        const { level } = node;
        if (level == 0) {
          http
            .get(`/rentserver/backend/dict/getParentDict?code=talentLevel`, {})
            .then((res) => {
              if (res && res.code == 200) {
                let d = res.data;
                const nodes = d.map((e) => {
                  return {
                    ...e,
                    value: e.id,
                    label: e.dictName,
                    level: 0,
                    leaf: false,
                  };
                });
                resolve(nodes);
              }
            });
        } else if (level == 1) {
          let id = node.data.id;
          http
            .get("/rentserver/backend/dict/getChildrenDict1", {
              fatherId: id,
            })
            .then((res) => {
              if (res && res.code == 200) {
                let d = res.data;
                const nodes = d.map((e) => {
                  return {
                    ...e,
                    value: e.id,
                    label: e.dictName,
                    level: 1,
                    leaf: true,
                  };
                });
                resolve(nodes);
              }
            });
        }
      },
    });
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
      baseUrl: store.state.baseURL,
      options: [],
      checkList: [
        { label: "审核中", value: 1 },
        { label: "通过", value: 2 },
        { label: "不通过", value: 3 },
        { label: "退回", value: 4 },
        { label: "作废", value: 5 },
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
      auditList: ["初始状态", "信息待审核", "已认证通过", "驳回", "作废"],
      logDialogISshow: false,
      logListData: [],
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
        { code: "18", val: "父亲身份证正反面" },
        { code: "19", val: "母亲身份证正反面" },
        { code: "20", val: "配偶身份证正反面" },
        { code: "9", val: "户口本本人信息页" },
        { code: "4", val: "结婚证或婚姻状况具结书" },
        { code: "11", val: "学历证书或留学生服务中心认证报告" },
        { code: "10", val: "个人登记照" },
        { code: "13", val: "本人身份证正反面" },
        { code: "5", val: "学位证书" },
        { code: "7", val: "营业执照或其他形式创业证明" },
        // { code: "6", val: "个人就业合同" },
        { code: "16", val: "社保卡" },
        { code: "0", val: "身份证正反面" },
        { code: "1", val: "父母身份证正反面" },
        { code: "2", val: "配偶身份证正反面" },
        { code: "3", val: "子女身份证正反面" },
        // { code: "4", val: "结婚证" },
        // { code: "5", val: "学历和学位证书" },
        { code: "6", val: "社保缴纳证明或就业合同或其他形式就业证明" },
        // { code: "7", val: "营业执照和股权证明" },
        // { code: "8", val: "其他" },
        // { code: "9", val: "户口本本人信息页" },
      ],
      user: localStorage.getItem("user"),
    });
    // 信息审核

    const onSubmitInfo = (params, done) => {
      http
        .post(
          "/rentserver/setStudentStatus",
          {
            id: state.itemObj.id,
            status: table.shForm.status,
            opinion: table.shForm.opinion,
            // talentLevel: table.shForm.status == 3 ? "" : table.shForm.type[1],
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
    // 查看详情
    const checkInfo = (id) => {
      state.itemObj = {};
      table.shForm = {};
      http
        .get("/rentserver/student/get", { id })
        .then((res) => {
          if (res) {
            state.itemObj = res.data;
            state.attachList = res.data.attachment.filter(
              (e) => e.type != "10"
            );
          }
        })
        .catch(() => {
          state.itemObj = {
            id,
          };
        });
    };

    // 人才类型列表数据
    const handleChange = (value) => {
      table.shForm.value = value ? value[0] : "";
    };

    // 日志
    const logClick = (id) => {
      // state.logDialogISshow = true;
      let paramsObj = {
        applyId: id,
      };
      http.get("/rentserver/auditLog/getByApplyId", paramsObj).then((res) => {
        console.log("日志res---", res);
        state.logListData = res.data.list;
        state.logDialogISshow = true;
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
      validateName,
      validatePhone,
      checkidCard,
      checkPassword,
      ...toRefs(state),
      ...toRefs(table),
      // changeInfo,
      onSubmitInfo,
      formDate(date) {
        return dayjs(date).format("YYYY-MM-DD");
      },
      checkInfo,
      tableRef,
      handleChange,
      props,
      logClick,
      handlePreviewClick,
      getDownload,
      download,
      dayjs,
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

// 底部横向滚动条屏小不显示
::v-deep .el-table__body-wrapper {
  overflow: initial !important;
}
::v-deep .el-table__header-wrapper {
  overflow: initial !important;
}
</style>
