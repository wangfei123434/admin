<template>
  <V-Table
    :ref="(dom) => (tableRef = dom)"
    url="/cmsserver/cms/article/getList?categoryId=a1962bca-011e-11ea-b4ac-e82a444382df"
    method="get"
  >
    <!-- url="/cmsserver/cms/article/getList?categoryId=1ce386d3-567e-435f-83f4-cdcaeref8237" -->
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column label="标题" prop="title" align="center"></el-table-column>
    <el-table-column
      label="点击次数"
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
        <span>{{ row.audit ? "已审核" : "未审核" }}</span>
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
</template>
<script>
import dayjs from "dayjs";
import VTable from "/@/components/VTable.vue";
import VImport from "/@/components/VImport.vue";
import VFormDialog from "/@/components/VFormDialog.vue";
import http from "../../config/http";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default defineComponent({
  components: {
    VTable,
    VFormDialog,
    QuillEditor,
  },
  setup() {
    const tableRef = ref();
    const quillEditorRef = ref();
    const state = reactive({
      showDialog: false,
      model: {},
      editOrAdd: false,
      fileList: [],

      contentType: "html",
      options: {
        placeholder: "请输入...",
        theme: "snow",
      },
    });
    const onEditShow = (row) => {
      state.showDialog = row.id;
      state.editOrAdd = row.id;
      http.get(`/cmsserver/cms/article/${row.id}`).then((res) => {
        if (res && res.data) {
          state.model = res.data;
          quillEditorRef.value.setHTML(res.data.contents);
        }
      });
    };
    const onAddShow = () => {
      state.model = {};
      state.showDialog = true;
      quillEditorRef.value.setHTML("");
    };
    const onAudit = () => {
      console.log("audit");
    };
    // 新增或编辑 editOrAdd == showDialog 编辑
    const onSubmit = (params, done) => {
      let obj = {
        hits: 0,
        version: 1,
        categoryId: "1ce386d3-567e-435f-83f4-cdcaeref8237",
      };
      if (state.editOrAdd == state.showDialog) {
        obj.hits = state.model.hits;
        obj.id = state.model.id;
      }
      state.model = Object.assign({}, obj, state.model);
      let formData = new FormData();
      for (let key in state.model) {
        formData.append(key, state.model[key]);
      }
      http
        .post("/cmsserver/cms/article/save", formData, { message: true })
        .then((res) => {
          done();
        })
        .catch(() => {
          done();
        });
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
    const onEditChange = (e) => {
      state.model.contents = e.html;
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
