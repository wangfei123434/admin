<template>
  <V-Table :data="allData" label-width="100px">
    <template #query="{ query }">
      <el-form-item label="房源区域">
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
      </el-form-item>
      <el-form-item label="项目名称">
        <el-select v-model="query.selectStatus" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in choseStatus"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出租形式">
        <el-select v-model="query.talentType" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in czxs"
            :key="index"
            :label="item.dict_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户型">
        <el-select v-model="query.hx" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in hxArr"
            :key="index"
            :label="item.dict_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房源状态">
        <el-select v-model="query.ftzt" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in fyztArr"
            :key="index"
            :label="item.dict_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房源筹集性质">
        <el-select v-model="query.fycjxz" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in fycjxzArr"
            :key="index"
            :label="item.dict_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房源性质">
        <el-select v-model="query.fyxz" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in fyxzArr"
            :key="index"
            :label="item.dict_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="租金范围">
        <el-select v-model="query.zjfw" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in zjfwArr"
            :key="index"
            :label="item.dict_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
    <!-- <el-table-column type="selection" width="55"></el-table-column> -->
    <el-table-column label="房源编号" prop="fybh"></el-table-column>
    <el-table-column label="区域" prop="qy"></el-table-column>
    <el-table-column label="项目名称" prop="xmmc"></el-table-column>
    <el-table-column label="房源" prop="fy"></el-table-column>
    <el-table-column label="出租形式" prop="czxs"></el-table-column>
    <el-table-column label="户型" prop="hx"></el-table-column>
    <el-table-column label="计租面积" prop="jzmj"></el-table-column>
    <el-table-column label="总楼层" prop="zlc"></el-table-column>
    <el-table-column label="物业费" prop="wyf"></el-table-column>
    <el-table-column label="租金" prop="zj"></el-table-column>
    <el-table-column label="房源筹集性质" prop="fycjxz"></el-table-column>
    <el-table-column label="房源性质" prop="fyxz"></el-table-column>
    <el-table-column label="状态" prop="zt"></el-table-column>
    <el-table-column label="创建时间" prop="cjsj"></el-table-column>
    <el-table-column label="操作" prop="name">
      <template #default="{ row }">
        <span style="color: #69baff; cursor: pointer" @click="edFun(row)">
          编辑
        </span>
      </template>
    </el-table-column>

    <!-- <el-table-column label="项目名称" prop="gender">
      <template #default="{ row }">
        {{ row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column> -->
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
        { code: "0", value: "雄楚春天" },
        { code: "1", value: "龙湖冠寓武汉丁字桥店" },
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
      czxs: [
        { id: "1", dict_name: "整租" },
        { id: "2", dict_name: "合租" },
      ],
      hxArr: [
        { id: "3", dict_name: "一室一厅" },
        { id: "4", dict_name: "两室一厅" },
        { id: "5", dict_name: "三室一厅" },
        { id: "6", dict_name: "两室两厅" },
        { id: "7", dict_name: "三室两厅" },
        { id: "8", dict_name: "四室两厅" },
      ],
      fyztArr: [
        { id: "3", dict_name: "未发布" },
        { id: "4", dict_name: "已发布" },
        { id: "5", dict_name: "已选中" },
        { id: "3", dict_name: "已签约" },
        { id: "4", dict_name: "已入驻" },
      ],
      fycjxzArr: [
        { id: "3", dict_name: "存量可用" },
        { id: "4", dict_name: "新筹集" },
      ],
      fyxzArr: [
        { id: "3", dict_name: "配建无偿移交" },
        { id: "4", dict_name: "配建企业自持" },
      ],
      zjfwArr: [
        { id: "3", dict_name: "2000-3000" },
        { id: "4", dict_name: "3000-5000" },
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

      allData: [
        {
          fybh: "001",
          qy: "武昌区",
          xmmc: "雄楚春天",
          fy: "1-1-802",
          czxs: "整租",
          hx: "一室一厅",
          jzmj: "59",
          zlc: 17,
          wyf: 130,
          zj: 1246,
          fycjxz: "存量可用",
          fyxz: "政府产权",
          zt: "已发布",
          cjsj: "2022-6-27 12:00",
        },
        {
          fybh: "002",
          qy: "武昌区2",
          xmmc: "雄楚春天2",
          fy: "1-1-802",
          czxs: "整租2",
          hx: "一室一厅",
          jzmj: "59",
          zlc: 17,
          wyf: 130,
          zj: 1246,
          fycjxz: "存量可用",
          fyxz: "政府产权",
          zt: "已发布",
          cjsj: "2022-6-27 12:00",
        },
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
