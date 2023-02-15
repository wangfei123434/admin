<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/cmsserver/cms/article/backend/getByConditionQuery"
    :parse="true"
    :query="{
      audit: '',
      title: '',
      categoryId: '2828a91a-5328-46ba-8639-acd1de490cec',
    }"
  >
    <template #query="{ query }">
      <el-form-item label="审核状态">
        <v-select v-model="query.audit" :options="statusOptions"></v-select>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="query.title"></el-input>
      </el-form-item>
    </template>
    <template #button="{ selection }">
      <el-button type="primary" @click="onAddShow">新增</el-button>
      <el-button
        type="primary"
        :disabled="!selection.length"
        @click="onAudit(selection)"
      >
        审核
      </el-button>
      <V-Delete
        :url="`/cmsserver/cms/article/backend/batchDelete?${selection
          .map(
            (item, index) =>
              ids + item.id + (index == selection.length - 1 ? '' : '&')
          )
          .join('')}`"
        :disabled="!selection.length"
        method="post"
        @finish="tableRef.onFresh()"
      ></V-Delete>
    </template>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column label="标题" prop="title" align="center"></el-table-column>
    <el-table-column
      label="浏览次数"
      prop="hits"
      align="center"
    ></el-table-column>
    <el-table-column label="发布时间" align="center">
      <template #default="{ row }">
        <span>{{ row.postDate ? formDate1(row.postDate) : "" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center">
      <template #default="{ row }">
        <span>{{ row.dateCreated ? formDate(row.dateCreated) : "" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="更新时间" prop="lastUpdated" align="center">
      <template #default="{ row }">
        <span>{{ row.lastUpdated ? formDate(row.lastUpdated) : "" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="审核状态" align="center">
      <template #default="{ row }">
        <span>{{ row.audit == 1 ? "已审核" : "未审核" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="onEditShow(row)">修改</el-button>
      </template>
    </el-table-column>
  </V-Table>
  <v-form-dialog
    v-model="showDialog"
    v-model:model="model"
    :title="editOrAdd == showDialog ? '编辑' : '新增'"
    @submit="onSubmit"
  >
    <template #default="{ model }">
      <el-form-item label="标题" prop="title">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subTitle">
        <el-input v-model="model.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input v-model="model.source"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="model.author"></el-input>
      </el-form-item>
      <el-form-item label="发布日期" prop="postDate">
        <el-date-picker
          v-model="model.postDate"
          format="YYYY-MM-DD"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="上传附件" prop="file">
        <input
          :ref="(dom) => (uploadInput = dom)"
          type="file"
          class="dl-none"
          name="icon"
          @change="dealfilechange"
        />
      </el-form-item>
      <el-form-item label="" prop="contents">
        <QuillEditor
          :ref="(dom) => (quillEditorRef = dom)"
          :options="options"
          :content="model.contents || ''"
          :content-type="contentType"
          toolbar="full"
          @update:content="updateContent"
        />
      </el-form-item>
    </template>
  </v-form-dialog>

  <!-- 审核 -->
  <el-dialog v-model="showCheck" width="30%" title="提示">
    <span>确定要审核选定的数据项吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelCheck">取 消</el-button>
        <el-button type="primary" @click="sureCheck">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import dayjs from "dayjs";
import VTable from "/@/components/VTable.vue";
import VDelete from "/@/components/VDelete.vue";
import VImport from "/@/components/VImport.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import VSelect from "/@/components/VSelect.vue";
import http from "../../config/http";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default defineComponent({
  components: {
    VTable,
    VDelete,
    VFormDialog,
    QuillEditor,
    VSelect,
  },
  setup(props) {
    const quillEditorRef = ref();
    const tableRef = ref(null);
    const state = reactive({
      ids: "ids=",
      showDialog: false,
      showCheck: false,
      model: {},
      editOrAdd: false,
      fileList: [],
      selection: [],
      statusOptions: [
        { label: "全部", value: "" },
        { label: "已审核", value: true },
        { label: "未审核", value: false },
      ],
      contentType: "html",
      options: {
        placeholder: "请输入...",
        theme: "snow",
      },
    });
    const onEditShow = (row) => {
      console.log(row);
      state.showDialog = row.id;
      state.editOrAdd = row.id;
      http
        .get(`/cmsserver/cms/article/${row.id}`)
        .then((res) => {
          if (res && res.data) {
            state.model = res.data;

            quillEditorRef.value.setHTML(res.data.contents);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const onAddShow = () => {
      state.model = {};
      state.showDialog = true;
      quillEditorRef.value.setHTML("");
    };
    const onEditChange = (e) => {
      state.model.contents = e.html;
    };

    // 新增或编辑 editOrAdd == showDialog 编辑
    const onSubmit = (params, done) => {
      let obj = {
        hits: 0,
        version: 1,
        categoryId: "2828a91a-5328-46ba-8639-acd1de490cec",
      };
      if (state.editOrAdd == state.showDialog) {
        obj.hits = state.model.hits;
        obj.id = state.model.id;
      }

      state.model = Object.assign({}, obj, state.model);
      let formData = new FormData();
      for (let key in state.model) {
        // formData.append(key, state.model[key]);
        if (key == "postDate") {
          formData.append(
            key,
            dayjs(state.model.postDate).format("YYYY-MM-DD")
          );
        } else {
          formData.append(key, state.model[key]);
        }
      }
      http
        .post("/cmsserver/cms/article/save", formData, { message: true })
        .then((res) => {
          tableRef.value.onFresh();
          done();
        })
        .catch(() => {
          done();
        });
    };
    // 审核
    const onAudit = (selection) => {
      state.showCheck = true;
      state.selection = selection;
    };
    const sureCheck = (params, done) => {
      state.showCheck = false;
      state.selection = state.selection.map((item) => item.id);
      http
        .post(
          `/cmsserver/cms/article/backend/batchReview?ids=${state.selection}`,
          { message: true }
        )
        .then((res) => {
          tableRef.value.onFresh();
          done();
        })
        .catch(() => {
          done();
        });
    };

    const cancelCheck = () => {
      state.showCheck = false;
      state.selection = [];
      // localStorage.removeItem("selection");
    };
    const uploadInput = ref(null);
    const dealfilechange = (e) => {
      const input = e.target;
      let files = input.files;
      if (files) {
        state.model.file = files[0];
      }
    };

    // 上传
    const uploadgogo = () => {
      let oBtn = uploadInput.value;
      oBtn.click();
    };
    const updateContent = (d) => {
      state.model.contents = d;
    };
    return {
      tableRef,
      ...toRefs(state),
      onEditShow,
      onAddShow,
      onAudit,
      dealfilechange,
      onEditChange,
      onSubmit,
      uploadgogo,
      uploadInput,
      formDate(date) {
        return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      },
      formDate1(date) {
        return dayjs(date).format("YYYY-MM-DD");
      },
      sureCheck,
      cancelCheck,
      updateContent,
      quillEditorRef,
    };
  },
});
</script>
<style lang="scss">
.ql-editor {
  height: 400px;
}
.el-form-item__content {
  height: 100%;
}
</style>
