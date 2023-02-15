<template>
  <V-Table
    url="/rentserver/backend/studentHouse/selectHouseList"
    :parse="true"
    label-width="100px"
  >
    <template #query="{ query }">
      <el-form-item label="登记意向区域">
        <template v-if="!isOrg">
          <el-select v-model="query.xyRegion" clearable placeholder="请选择">
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
              v-model="query.xyRegion"
              disabled
              :placeholder="item.area"
            ></el-input>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="选房状态">
        <el-select v-model="query.selectStatus" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in choseStatus"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人才类型">
        <el-select v-model="query.talentType" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in talentJson"
            :key="index"
            :label="item.dict_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="query.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="idCard" label="身份证号" class="idcard">
        <el-input v-model="query.idCard" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="applyNo" label="申请单号">
        <el-input v-model="query.applyNo" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item prop="projectName" label="房源信息">
        <el-input v-model="query.projectName" placeholder="请输入"></el-input>
      </el-form-item>
    </template>
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column label="ID" type="index"></el-table-column>
    <el-table-column label="姓名" prop="name"></el-table-column>
    <el-table-column label="性别" prop="gender">
      <template #default="{ row }">
        {{ row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column
      label="身份证号"
      prop="idCard"
      width="160px"
      align="center"
    ></el-table-column>
    <el-table-column label="申请单号" prop="applyNo"></el-table-column>
    <el-table-column label="意向区域" prop="xyRegion">
      <template #default="{ row }">
        <div v-for="(item, index) in areaList" :key="index">
          {{ item.code == row.xyRegion ? item.area : "" }}
        </div>
      </template>
    </el-table-column>

    <el-table-column label="人才类型" prop="talentType" align="center">
      <template #default="{ row }">
        <div v-for="(item, index) in talentJson" :key="index">
          {{ item.id == row.talentType ? item.dict_name : "" }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="选房状态" prop="selectStatus" align="center">
      <template #default="{ row }">
        {{ choseStatus[row.selectStatus].value }}
      </template>
    </el-table-column>

    <el-table-column label="房源信息" prop="houseInfo">
      <template #default="{ row }">
        <span>{{ row.houseInfo }}</span>
        <span>{{ row.houseNum ? "-" + row.houseNum : "" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="提交时间" prop="createdDate">
      <template #default="{ row }">
        {{ dayjs(row.createdDate).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default>
        <span style="color: #69baff; cursor: pointer" @click="pzFun(row)">
          立即确认
        </span>
      </template>
    </el-table-column>
  </V-Table>
</template>
<script>
import http from "../../config/http";
import VTable from "/@/components/VTable.vue";
import dayjs from "dayjs";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  components: {
    VTable,
  },
  setup() {
    const isOrg = ref(
      localStorage.getItem("orgId") ? localStorage.getItem("orgId") : false
    );
    const state = reactive({
      checkList: ["成功", "失败"],
      choseStatus: [
        { code: "0", value: "选房中" },
        { code: "1", value: "选房成功" },
        // "选房失败",
        { code: "3", value: "过期失效" },
        { code: "4", value: "选房成功超时未签约" },
        { code: "5", value: "选房成功签约成功" },
      ],
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
      ],
      talentJson: [
        { id: "60ba401b-c9ef-11eb-9b43-286ed488ccfe", dict_name: "高层次人才" },
        { id: "69fd538c-c9ef-11eb-9b43-286ed488ccfe", dict_name: "高级技师" },
        { id: "aa06de38-c9ee-11eb-9b43-286ed488ccfe", dict_name: "博士研究生" },
        { id: "b59d6078-c9ef-11eb-9b43-286ed488ccfe", dict_name: "技师" },
        {
          id: "bc3dac29-c9ef-11eb-9b43-286ed488ccfe",
          dict_name: "紧缺人才或高级工",
        },
        { id: "cfb19cf0-c9ee-11eb-9b43-286ed488ccfe", dict_name: "硕士研究生" },
        { id: "d58b29b1-c9ee-11eb-9b43-286ed488ccfe", dict_name: "本科及以下" },
      ],
    });
    return {
      ...toRefs(state),
      dayjs,
      isOrg,
    };
  },
});
</script>
<style lang="scss" scoped>
a,
a:hover {
  color: $main-color;
}
</style>
