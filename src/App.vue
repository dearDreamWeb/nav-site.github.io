<template>
  <div id="app">
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-container>
        <el-header>
          <v-header />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
export default {
  mounted() {},
  components: {
    vHeader: Header,
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss";
#app {
  height: 100vh;
  width: 100vw;
  background-color: $bg-gray;
  .aside {
    height: 100vh;
    background-color: $white;
  }
}
</style>
