<template>
  <div class="notFoundBox">
    <div class="notFound">
      <div class="font">404</div>
      <div class="font1">Page not found</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.notFoundBox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .notFound {
    .font {
      font-size: 100px;
      font-weight: bold;
      letter-spacing: 20px;
    }
    .font1 {
      font-size: 30px;
    }
  }
}
</style>
