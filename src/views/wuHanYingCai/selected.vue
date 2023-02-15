<template>
  <v-table
    url="/talentserver/backend/talent/city/getByConditionQuery"
    :parse="true"
  >
    <template #query="{ query }">
      <el-form-item label="入选年度">
        <v-select v-model="query.applyYear" :options="applyYearList"></v-select>
      </el-form-item>
      <el-form-item label="区/开发区">
        <v-select v-model="query.region" :options="regionList"></v-select>
      </el-form-item>
      <el-form-item label="类型">
        <v-select v-model="query.type" :options="typeList"></v-select>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-input v-model="query.companyName"></el-input>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="query.mobile"></el-input>
      </el-form-item>
    </template>

    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column label="姓名" prop="name" align="center"></el-table-column>
    <el-table-column
      label="入选年度"
      prop="applyYear"
      align="center"
    ></el-table-column>
    <el-table-column label="类型" prop="type" align="center"></el-table-column>
    <el-table-column
      label="单位名称"
      prop="companyName"
      align="center"
    ></el-table-column>
    <el-table-column
      label="区/开发区"
      prop="region"
      align="center"
    ></el-table-column>
    <el-table-column
      label="联系方式"
      prop="mobile"
      align="center"
    ></el-table-column>
    <el-table-column
      label="证件号"
      prop="idNumber"
      align="center"
    ></el-table-column>
  </v-table>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from "vue";
import VTable from "/@/components/VTable.vue";
import VSelect from "/@/components/VSelect.vue";

export default defineComponent({
  components: {
    VTable,
    VSelect,
  },
  setup() {
    const state = reactive({
      applyYearList: [{ label: "2019", value: "2019" }],
      regionList: [
        { label: "东湖高新区", value: "东湖高新区" },
        { label: "武汉开发区", value: "武汉开发区" },
        { label: "临空港开发区", value: "临空港开发区" },
        { label: "江岸区", value: "江岸区" },
        { label: "江汉区", value: "江汉区" },
        { label: "硚口区", value: "硚口区" },
        { label: "汉阳区", value: "汉阳区" },
        { label: "武昌区", value: "武昌区" },
        { label: "青山区", value: "青山区" },
        { label: "洪山区", value: "洪山区" },
        { label: "江夏区", value: "江夏区" },
        { label: "黄陂区", value: "黄陂区" },
        { label: "新洲区", value: "新洲区" },
        { label: "蔡甸区", value: "蔡甸区" },
      ],
      typeList: [
        { label: "产业领军人才创业类", value: "产业领军人才创业类" },
        { label: "优秀青年人才名校博士类", value: "优秀青年人才名校博士类" },
        { label: "优秀青年人才单位举荐类", value: "优秀青年人才单位举荐类" },
        { label: "战略科技人才", value: "战略科技人才" },
        { label: "产业领军人才创新类", value: "产业领军人才创新类" },
        { label: "优秀青年人才创新创业类", value: "优秀青年人才创新创业类" },
      ],
    });

    const examine = () => {
      console.log("examine");
    };
    const check = () => {
      console.log("check");
    };
    const log = () => {
      console.log("log");
    };

    return {
      ...toRefs(state),
      examine,
      check,
      log,
    };
  },
});
</script>

<style></style>
