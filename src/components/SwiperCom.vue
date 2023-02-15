<template>
  <div class="lz-dialog">
    <el-dialog
      v-model="dialogShow"
      :title="obj.dialogTitle"
      :width="obj.dialogWidth"
      :before-close="close"
      draggable
    >
      <swiper
        class="swiper-container"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }"
        :pagination="{ clickable: true }"
        :autoplay="{ autoplay: false }"
        loop
      >
        <swiper-slide
          v-for="(item, i) in obj.imgs"
          :key="i"
          class="swiper-slide"
        >
          <img v-if="checkItem(item)" :src="item" alt="" />
          <iframe v-else :src="item" width="800px" height="2400px"></iframe>
        </swiper-slide>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
        <!-- 如果需要导航按钮 左右箭头。如果放置在swiper-container外面，需要自定义样式。-->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <!-- 如果需要滚动条 -->
        <!--        <div class="swiper-scrollbar"></div>-->
      </swiper>
      <template #footer>
        <span v-if="obj.dialogIsFooter" class="dialog-footer">
          <el-button class="btn-mixins-clear-default" @click="close">
            {{ obj.dialogCloseBtnText }}
          </el-button>
          <el-button class="btn-mixins dia-suc" @click="success">
            {{ obj.dialogSuccessBtnText }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import { computed } from "vue";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

export default {
  name: "SwiperCom",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    imgs: {
      type: String,
      default: "",
    },
    dialogObject: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  emits: ["dialogClose", "dialogSuccess"],
  setup(props, ctx) {
    console.log("props--imgs", props);
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
      console.log("slide change");
    };
    const dialogShow = computed({
      get() {
        return props.dialogObject.dialogVisible;
      },
      set(val) {
        return val;
      },
    });
    const obj = {
      dialogTitle: props.dialogObject.title || "标题",
      dialogWidth: props.dialogObject.width || "60%",
      dialogCloseBtnText: props.dialogObject.closeBtnText || "取消",
      dialogSuccessBtnText: props.dialogObject.successBtnText || "成功",
      dialogIsFooter: props.dialogObject.isFooter || false,
      imgs: props.dialogObject.imgs,
    };
    const close = () => {
      ctx.emit("dialogClose", false, "close");
    };
    const success = () => {
      ctx.emit("dialogSuccess", false, "success");
    };
    const checkItem = (item) => {
      let reg = /\.(PDF|pdf)$/;
      let regStatus = reg.test(item);
      return !regStatus;
    };

    return {
      onSwiper,
      onSlideChange,
      modules: [Navigation, Pagination, Scrollbar, A11y],
      obj,
      dialogShow,
      close,
      success,
      checkItem,
    };
  },
};
</script>

<style scoped>
.swiper-container {
  /*width: 7.1rem;*/
  /*height: 3rem;*/
  /*border-radius: 0.1rem;*/
  /*--swiper-theme-color: #ff6600;*/
  /*--swiper-pagination-color: #248cc0;*/
  /*--swiper-navigation-color: #248cc0;*/
  /*--swiper-navigation-size: 20px;*/
}
.swiper-slide img {
  /*width: 100%;*/
}

::v-deep .swiper-container {
  height: 500px;
  overflow-y: scroll;
}
.swiper-container img {
  height: 100% !important;
}
</style>
