<template>
  <V-Table :data="allData" label-width="100px">
    <template #query="{ query }">
      <el-form-item label="登记意向区域">
        <el-select v-model="query.djyxqy" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in djyxqyArr"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人才类型">
        <el-select v-model="query.rclx" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in rclxArr"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最高学历">
        <el-select v-model="query.zgxl" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in zgxlArr"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技能等级">
        <el-select v-model="query.jndj" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in jndjArr"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人才工程">
        <el-select v-model="query.rcgc" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in rcgcArr"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配租状态">
        <el-select v-model="query.pzzt" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in pzztArr"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
    </template>
    <el-table-column label="人才类型" prop="rclx"></el-table-column>
    <el-table-column label="申请人" prop="sqr"></el-table-column>
    <el-table-column label="最高学历" prop="zgxl"></el-table-column>
    <el-table-column label="毕业时间" prop="bysj"></el-table-column>
    <el-table-column label="技能等级" prop="jndj"></el-table-column>
    <el-table-column label="人才工程" prop="rcgc"></el-table-column>
    <el-table-column label="性别" prop="xb"></el-table-column>
    <el-table-column label="联系电话" prop="lxdh"></el-table-column>
    <el-table-column label="登记意向区域" prop="djyxqy"></el-table-column>
    <el-table-column label="提交时间" prop="tjsj"></el-table-column>
    <el-table-column label="配租状态" prop="pzzt"></el-table-column>
    <el-table-column label="更新时间" prop="gxsj"></el-table-column>
    <el-table-column label="操作" prop="name">
      <template #default="{ row }">
        <span style="color: #69baff; cursor: pointer" @click="pzFun(row)">
          配租
        </span>
      </template>
    </el-table-column>
  </V-Table>
  <el-dialog v-model="popIsShow" width="80%" title="配租">
    <div>租配人信息</div>
    <v-table :data="pzrData" :pagination="false">
      <el-table-column label="人才类型" prop="rclx"></el-table-column>
      <el-table-column label="申请人" prop="sqr"></el-table-column>
      <el-table-column label="最高学历" prop="zgxl"></el-table-column>
      <el-table-column label="毕业时间" prop="bysj"></el-table-column>
      <el-table-column label="技能等级" prop="jndj"></el-table-column>
      <el-table-column label="人才工程" prop="rcgc"></el-table-column>
      <el-table-column label="性别" prop="xb"></el-table-column>
      <el-table-column label="联系电话" prop="lxdh"></el-table-column>
      <el-table-column label="登记意向区域" prop="djyxqy"></el-table-column>
      <el-table-column label="提交时间" prop="tjsj"></el-table-column>
      <el-table-column label="配租状态" prop="pzzt"></el-table-column>
      <el-table-column label="更新时间" prop="gxsj"></el-table-column>
    </v-table>
    <div style="margin: 20px 0">请选择配租房源</div>
    <div style="display: flex; margin: 20px 0">
      <div style="margin-right: 20px">项目名称</div>
      <div>
        <el-select v-model="xmName" clearable placeholder="请选择">
          <el-option
            v-for="(item, index) in choseStatus"
            :key="index"
            :label="item.value"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div>
      <v-table :data="fyData">
        <el-table-column type="selection" width="55"></el-table-column>
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
      </v-table>
    </div>
    <div class="btn-box">
      <div class="btn1" @click="popIsShow = false">取消</div>
      <div class="btn2" @click="popIsShow = false">确认</div>
    </div>
  </el-dialog>
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
      djyxqyArr: [
        { code: "1F8C8A6C-0322-4210-90AB-534ED4668B8A", value: "洪山区" },
        { code: "3E3ECD5E-9976-4A74-9BA1-73A1CF5D2624", value: "东西湖区" },
        { code: "41050CBE-264E-4E56-9585-4F49F0D5CF5C", value: "蔡甸区" },
        { code: "58B27BE0-E1EE-4F0B-A070-634AB8931871", value: "江夏区" },
        { code: "689E478A-F499-428E-9340-F18FD11199C3", value: "黄陂区" },
        { code: "9A4FAA76-4C40-4CD0-A6B3-A8F3ECDF2DED", value: "新洲区" },
        {
          code: "5DA2D683-161D-4357-8ECB-C3519BD9E571",
          value: "东湖新技术开发区",
        },
        {
          code: "42403F88-4D60-4980-90C1-BC4BD124581C",
          value: "武汉经济技术开发区（汉南区）",
        },
        { code: "88FF32FB-8D80-483E-84AE-AF61FCB4EC6A", value: "江岸区" },
        { code: "9BE15342-BC28-45D4-A358-9C614349A03F", value: "江汉区" },
        { code: "B16CA8CB-636C-4FF1-8211-EF6B51CDAA27", value: "硚口区" },
        { code: "D1D5782A-6369-4766-AFCB-9F58668EBF43", value: "汉阳区" },
        { code: "EB5285A8-C841-4F7C-A39F-3F31FD332C12", value: "武昌区" },
        { code: "1988F7F5-4FE9-4992-9662-9F64344744B1", value: "青山区" },
      ],
      rclxArr: [
        { code: "0", value: "高校毕业生" },
        { code: "1", value: "高层次人才" },
        { code: "2", value: "高技能人才" },
      ],
      zgxlArr: [
        { code: "0", value: "博士" },
        { code: "1", value: "硕士" },
        { code: "2", value: "本科" },
        { code: "3", value: "大专" },
      ],
      jndjArr: [
        { code: "1", value: "高级技师" },
        { code: "2", value: "高级工" },
        { code: "3", value: "技师" },
      ],
      rcgcArr: [
        { code: "1", value: "国家级" },
        { code: "2", value: "省级" },
        { code: "3", value: "市级" },
        { code: "4", value: "区级" },
      ],
      pzztArr: [
        { code: "1", value: "未配租" },
        { code: "2", value: "已配租" },
      ],
      choseStatus: [
        { code: "0", value: "项目一" },
        { code: "1", value: "项目二" },
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

      allData: [
        {
          rclx: "高校毕业生",
          sqr: "张三",
          zgxl: "硕士",
          bysj: "2021-06-30",
          jndj: "A级",
          rcgc: "国家级",
          xb: "女",
          lxdh: "13985845845",
          djyxqy: "武昌区",
          tjsj: "2022-06-27 14:12:00",
          pzzt: "已配租",
          gxsj: "2022-06-12",
        },
        {
          rclx: "高校毕业生2",
          sqr: "张三2",
          zgxl: "硕士",
          bysj: "2021-06-30",
          jndj: "A级2",
          rcgc: "市级",
          xb: "男",
          lxdh: "13985845845",
          djyxqy: "武昌区2",
          tjsj: "2022-06-27 14:12:00",
          pzzt: "已配租2",
          gxsj: "2022-06-12",
        },
      ],
      popIsShow: false,
      xmName: "",
      pzrData: [
        {
          rclx: "高校毕业生",
          sqr: "张三",
          zgxl: "硕士",
          bysj: "2021-06-30",
          jndj: "A级",
          rcgc: "",
          xb: "女",
          lxdh: "13985845845",
          djyxqy: "武昌区",
          tjsj: "2022-06-27 14:12:00",
          pzzt: "已配租",
          gxsj: "2022-06-12",
        },
      ],
      fyData: [
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
          zt: "已发布",
          cjsj: "2022-6-27 12:00",
        },
      ],
    });
    const pzFun = (row) => {
      state.popIsShow = true;
    };
    return {
      ...toRefs(state),
      dayjs,
      isOrg,
      pzFun,
    };
  },
});
</script>
<style lang="scss" scoped>
a,
a:hover {
  color: $main-color;
}

.btn-box {
  display: flex;
  margin-left: 75%;
  margin-top: 30px;
  div {
    width: 150px;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
  }
  .btn1 {
    color: #000;
    border: 1px solid #ccc;
    margin-right: 20px;
  }
  .btn2 {
    background: #169bd5;
    color: #fff;
  }
}
</style>
