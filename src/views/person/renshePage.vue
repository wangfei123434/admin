<template>
  <div class="tabs-box">
    <div :class="activeIndex == 0 ? 'active-sty' : ''" @click="activeIndex = 0">
      大学毕业生
    </div>
    <div :class="activeIndex == 1 ? 'active-sty' : ''" @click="activeIndex = 1">
      高技能人才
    </div>
  </div>
  <DxbysPage v-if="activeIndex == 0"></DxbysPage>
  <JnxrcPage v-if="activeIndex == 1"></JnxrcPage>
</template>
<script>
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import DxbysPage from "./renshePageComponents/dxbys.vue";
import JnxrcPage from "./renshePageComponents/jnxrc.vue";
export default defineComponent({
  components: {
    DxbysPage,
    JnxrcPage,
  },
  setup() {
    const state = reactive({
      activeIndex: 0,
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
.tabs-box {
  display: flex;
  margin-bottom: 20px;
  div {
    margin-right: 20px;
    cursor: pointer;
    padding-bottom: 10px;
  }
  .active-sty {
    border-bottom: 2px solid red;
  }
}
</style>
