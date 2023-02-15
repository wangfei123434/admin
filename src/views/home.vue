<template>
  <div>
    <!-- <img :src="Mybg2" class="bg" /> -->
    <img src="../images/mybg2.png" class="bg" />
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    return {};
  },
});
</script>
<style lang="scss" scoped>
div {
  flex: 1;
  margin: -20px;
  overflow: hidden;
}
.bg {
  width: 100%;
  height: 100%;
}
</style>
