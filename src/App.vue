<template>
  <div id="app">
    <el-container>
      <el-aside class="aside" width="140px">
        <img src="@/assets/images/logo.jpg" alt="logo" class="logo" />
        <el-tabs tab-position="right" style="width: 100%;margin-top:20px">
          <el-tab-pane
            v-for="(item, index) in navArr"
            :key="index"
            :label="item"
          >
          </el-tab-pane>
        </el-tabs>
      </el-aside>
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
import typeConfig from "@/assets/jsonData/typeConfig.json";  // 类型

export default {
  data() {
    return {
      navArr: Object.values(typeConfig),
    };
  },
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
    .logo {
      display: block;
      width: 100%;
      padding: 10px 10%;
    }
  }
}
</style>
