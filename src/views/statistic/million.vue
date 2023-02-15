<template>
  <div>
    <div class="info">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td class="infobt1" colspan="16">
              {{ dayjs(new Date()).format("YYYY-MM-DD") }}统计报表
            </td>
          </tr>
          <tr>
            <td class="infobt1" rowspan="2">人数/政策类别</td>
            <td class="infobt1" colspan="2">学生注册</td>
            <td class="infobt1" colspan="2">人才落户</td>
            <td class="infobt1" colspan="2">人才公寓</td>
            <td class="infobt1" colspan="2">见习实习</td>
            <td class="infobt1" colspan="2">创业工位</td>
            <td class="infobt1">主题社区</td>
            <td class="infobt1">基层就业</td>
            <td class="infobt1">创业培训</td>
            <td class="infobt1">创业融资</td>
            <td class="infobt1">创业环境</td>
          </tr>
          <tr>
            <td class="infobt2">注册数</td>
            <td class="infobt2">审核数</td>
            <td class="infobt2">申请数</td>
            <td class="infobt2">办结数</td>
            <td class="infobt2">申请数</td>
            <td class="infobt2">办结数</td>
            <td class="infobt2">申请数</td>
            <td class="infobt2">办结数</td>
            <td class="infobt2">申请数</td>
            <td class="infobt2">办结数</td>
            <td class="infobt2">浏览数</td>
            <td class="infobt2">浏览数</td>
            <td class="infobt2">浏览数</td>
            <td class="infobt2">浏览数</td>
            <td class="infobt2">浏览数</td>
          </tr>
          <tr>
            <td>当日数</td>
            <td>{{ obj.daycount }}</td>
            <td>64</td>
            <td>-</td>
            <td>-</td>
            <td>{{ obj.dayStatusCountAla }}</td>
            <td>{{ obj.dayCountAla }}</td>
            <td>{{ obj.dayCountJobApplty }}</td>
            <td>{{ obj.dayStatusCountJobApplty }}</td>
            <td>{{ obj.dayStatusCountBla }}</td>
            <td>{{ obj.dayCountBla }}</td>
            <td rowspan="3">9196</td>
            <td rowspan="3">9957</td>
            <td rowspan="3">10608</td>
            <td rowspan="3">28479</td>
            <td rowspan="3">8290</td>
          </tr>
          <tr>
            <td>累计数</td>
            <td>{{ obj.count }}</td>
            <td>42944</td>
            <td>-</td>
            <td>-</td>
            <td>{{ obj.countAla }}</td>
            <td>{{ obj.statusCountAla }}</td>
            <td>{{ obj.countJobApplty }}</td>
            <td>{{ obj.statusCountJobApplty }}</td>
            <td>{{ obj.countBla }}</td>
            <td>{{ obj.statusCountBla }}</td>
          </tr>
          <tr>
            <td>浏览数</td>
            <td colspan="2">-</td>
            <td colspan="2">55601</td>
            <td colspan="2">0</td>
            <td colspan="2">7703</td>
            <td colspan="2">17005</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import http from "../../config/http";
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      obj: {},
    });
    const getData = () => {
      let r1 = http.get("/accountserver/backend/account/screen/userStatics");
      let r2 = http.get("/rentserver/backend/rent/screen/rentStatics");
      Promise.all([r1, r2]).then((res) => {
        state.obj = Object.assign({}, res[0].data, res[1].data);
      });
    };
    onMounted(() => {
      getData();
    });
    return {
      ...toRefs(state),
      dayjs,
      getData,
    };
  },
});
</script>
<style lang="scss" scoped>
/*info样式开始*/
.info {
  width: 97%;
  margin: 10px auto 0px auto;
  border: solid 1px #cbd4da;
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
  border-right: solid 1px #cbd4da;
}
.info td {
  height: 40px;
}
.info th {
  border-bottom: solid 1px #cbd4da;
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
.infobt {
  background-color: #ededed;
  font-weight: bold;
  width: 12%;
  height: 40px;
}
.infobt1 {
  background-color: #ededed;
  font-weight: bold;
  width: 10%;
  height: 40px;
  text-align: center;
}
.infobt2 {
  background-color: #ededed;
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
</style>
