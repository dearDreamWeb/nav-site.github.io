<template>
  <div id="app">
    <el-container class="container">
      <!-- 左侧导航栏 -->
      <el-aside class="aside" width="140px">
        <img src="@/assets/images/logo.png" alt="logo" class="logo" />
        <el-tabs
          tab-position="left"
          v-model="tabIndex"
          @tab-click="scrollToCategory"
          style="width: 100%;margin-top:20px"
        >
          <el-tab-pane
            v-for="(item, index) in navArr"
            :key="index"
            :label="item"
          >
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <!-- 右侧 -->
      <el-container>
        <!-- 头部 -->
        <el-header style="height:auto">
          <v-header />
        </el-header>
        <!-- 内容区 -->
        <el-main>
          <!-- 滚动 -->
          <el-backtop target="#main"></el-backtop>
          <main class="main" id="main" ref="main" @scroll="watchScrollTop">
            <!-- 搜索 -->
            <div class="search" ref="search">
              <el-input
                class="search-input"
                autofocus
                v-model="searchVal"
                :placeholder="searchSites[searchIndex].text"
                size="normal"
                @keydown.enter.native="jumpSearch"
              >
                <i
                  class="el-icon-search el-input__icon icon"
                  slot="suffix"
                  @click="jumpSearch"
                >
                </i>
              </el-input>
              <!-- 搜索类型 -->
              <ul class="search-type">
                <li
                  v-for="(item, index) in searchSites"
                  class="item-box"
                  :key="index"
                >
                  <div
                    @click="searchIndex = index"
                    :class="[
                      'search-item',
                      index === searchIndex ? 'selected' : ''
                    ]"
                  >
                    {{ item.title }}
                  </div>
                  <div
                    :class="[
                      'setting-default',
                      index === defaultSearchIndex
                        ? 'setting-default-selected'
                        : ''
                    ]"
                    @click="settingDefault(index)"
                  >
                    设置为默认
                  </div>
                </li>
              </ul>
            </div>
            <!-- 主要区域 -->
            <div class="nav-content">
              <!-- 遍历导航的所有分类 -->
              <div v-for="(item, index) in navDataArr" :key="index" ref="item">
                <h1 class="title">
                  <i class="el-icon-price-tag icon"></i>{{ navArr[index] }}
                </h1>
                <el-row :gutter="20" class="item">
                  <!-- 遍历每个分类中的数据 -->
                  <el-col
                    v-for="(item_sub, index_sub) in item"
                    :key="index_sub"
                    :lg="4"
                    :sm="6"
                    :xs="12"
                    :title="
                      item_sub.description
                        ? item_sub.description
                        : item_sub.title
                    "
                    class="item-sub-wrap"
                    @click.native="jumpLink(index, index_sub)"
                  >
                    <div class="item-sub">
                      <el-image
                        :src="item_sub.imageSrc"
                        :title="item_sub.title"
                        class="img-item"
                        lazy
                      >
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                      <span class="text">{{ item_sub.title }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="bsz">
              <span id="busuanzi_container_site_pv"
                >本站总访问量<span id="busuanzi_value_site_pv"></span>次</span
              >
              <span id="busuanzi_container_site_uv">
                本站访客数<span id="busuanzi_value_site_uv"></span>人
              </span>
            </div>
          </main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import typeConfig from "@/assets/jsonData/typeConfig.json"; // 类型
import navJsonData from "@/assets/jsonData/navJsonData.json"; // 类型

export default {
  data() {
    return {
      navArr: Object.values(typeConfig), // 导航区的内容
      navDataArr: Object.values(navJsonData), // 导航区的内容
      itemsHeight: [], // 每块区域的高度
      tabIndex: "0", // 选择的标签页的下标值
      oldActiveName: "",
      searchVal: "",
      // 搜索选项
      searchSites: [
        {
          title: "百度",
          text: "百度一下",
          link: "https://www.baidu.com/s?wd="
        },
        {
          title: "Google",
          text: "Google搜索",
          link: "https://www.google.com/search?q="
        },
        {
          title: "Bing",
          text: "微软Bing搜索",
          link: "https://cn.bing.com/search?q="
        },
        {
          title: "知乎",
          text: "知乎搜索",
          link: "https://www.zhihu.com/search?type=content&q="
        },
        {
          title: "GitHub",
          text: "GitHub搜索",
          link: "https://github.com/search?q="
        }
      ],
      searchIndex: 0, // 搜索项的下标值
      defaultSearchIndex: 0 // 默认搜索项的下标值
    };
  },
  methods: {
    // 通过resize时间来更新数据，节流操作
    resizeChangeData() {
      let flag = true;
      window.onresize = () => {
        if (!flag) return false;
        flag = false;
        setTimeout(() => {
          this.initHeight();
          flag = true;
        }, 500);
      };
    },

    //  初始化每块区域的高度
    initHeight() {
      let searchTop = this.$refs.search.getBoundingClientRect().top; // 搜索区域上面的高度
      let itemsArr = this.$refs.item;
      this.itemsHeight = [];
      // 遍历导航区域，每个区域高度都要减去搜索区域上的高度才行
      itemsArr.forEach(item => {
        this.itemsHeight.push(item.getBoundingClientRect().top - searchTop);
      });
    },
    // 跳转到搜索引擎
    jumpSearch() {
      if (this.searchVal) {
        window.open(this.searchSites[this.searchIndex].link + this.searchVal);
      }
    },
    // 跳转链接
    jumpLink(index, index_sub) {
      window.open(this.navDataArr[index][index_sub].link);
    },

    // tab变化时滚动到指定分类的高度
    scrollToCategory(tab) {
      let main = this.$refs.main;
      let start = main.scrollTop; // 滚动条开始的位置（起点）
      let end = this.itemsHeight[tab.index]; // 滚动条要移动到的位置（终点）
      clearInterval(timer);
      let speed = parseFloat(Math.abs(start - end) / 3); // 每次移动的距离
      // 设置定时器，每次移动speed距离
      let timer = setInterval(() => {
        if (start > end) {
          start -= speed;
          start = start <= end ? parseInt(end) : parseFloat(start);
        } else if (start < end) {
          start += speed;
          start = start >= end ? parseInt(end) : parseFloat(start);
        } else {
          clearInterval(timer);
        }
        main.scrollTop = start;
      }, 10);
    },

    // 实时监听滚动条的高度
    watchScrollTop() {
      let main = this.$refs.main;
      let nowMainScollTop = Math.round(main.scrollTop); // 当前滚动条的高度
      let len = this.itemsHeight.length;
      let newIndex = 0;
      for (let i = 0; i < len; i++) {
        if (
          nowMainScollTop >= this.itemsHeight[i] &&
          nowMainScollTop < this.itemsHeight[i + 1]
        ) {
          newIndex = i;
          break;
        }
      }
      this.tabIndex = newIndex.toString();
    },
    // 设置默认搜索引擎
    settingDefault(index) {
      this.defaultSearchIndex = index;
      window.localStorage.setItem("defaultSearch", index);
    },
    /**
     * 获取默认搜索引擎
     */
    getDefaultSearch() {
      const index = Number(window.localStorage.getItem("defaultSearch")) || 0;
      this.searchIndex = index;
      this.defaultSearchIndex = index;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDefaultSearch();
      this.initHeight();
      this.resizeChangeData();
    });
  },
  components: {
    vHeader: Header
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss";
@font-face {
  font-family: "SourceHanSansCN-Normal";
  src: url("./assets/fonts/SourceHanSansCN-Normal.otf");
}
#app {
  width: 100vw;
  background-color: $bg-gray;
  font-family: "SourceHanSansCN-Normal";
  .container {
    // 左侧导航栏
    .aside {
      height: 100vh;
      background-color: $white;
      &::-webkit-scrollbar {
        display: none;
      }
      .logo {
        display: block;
        width: 100%;
        padding: 10px 10%;
      }
    }
    // 右侧
    .main {
      margin-left: 5%;
      width: 90%;
      height: calc(100vh - 60px);
      overflow: auto;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      &::-webkit-scrollbar {
        display: none;
      }
      // 搜索区域
      .search {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        padding: 40px 20px;
        background-color: $jd-color;
        border-radius: 5px;
        // 搜索框
        .search-input {
          width: 50%;
          .icon {
            padding-right: 20px;
            font-size: 20px;
            font-weight: bold;
            &:hover {
              cursor: pointer;
            }
          }
        }
        // 搜索类型
        .search-type {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          width: 40%;
          color: $diy-black;
          .item-box {
            position: relative;
            .search-item {
              position: relative;
              z-index: 1;
              &:hover {
                cursor: pointer;
                transform: scale(1.1);
              }
            }
            &:hover {
              .setting-default {
                display: block;
              }
            }
            .setting-default {
              display: none;
              position: absolute;
              left: 50%;
              top: 0;
              padding-top: 24px;
              transform: translateX(-50%);
              font-size: 12px;
              width: 60px;
              cursor: pointer;
              &.setting-default-selected {
                color: $white;
              }
            }
          }

          .selected {
            position: relative;
            color: $white;
            text-shadow: 0px 0px 4px #32f3c6;
            &::before {
              content: "▼";
              position: absolute;
              display: block;
              text-align: center;
              top: -15px;
              width: 100%;
              color: $white;
              text-shadow: none;
            }
          }
        }
      }
      // 导航内容
      .nav-content {
        .title {
          margin: 20px 0;
          font-size: 20px;
          .icon {
            margin-right: 10px;
            transform: rotateZ(90deg);
          }
        }
        .item {
          .item-sub-wrap {
            padding: 15px 5px;
            .item-sub {
              display: flex;
              align-items: center;
              padding: 10px 5px;
              height: 40px;
              border-radius: 5px;
              background-color: $white;
              box-shadow: 0 0 3px #e8e8e8;
              .img-item {
                margin-right: 10px;
                width: 25px;
                height: 25px;
                border-radius: 50%;
              }
              .text {
                display: block;
                height: 100%;
                line-height: 1.2;
                word-break: keep-all;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              &:hover {
                cursor: pointer;
                box-shadow: 0 0 3px #b9b8b8;
                animation: zoom 0.8s ease-in-out;
              }
              @keyframes zoom {
                50% {
                  transform: translateY(-10px);
                }
                100% {
                  transform: translateY(0);
                }
              }
            }
          }
        }
      }
      .bsz {
        display: block !important;
        margin: 20px 0;
        padding: 15px 0;
        text-align: center;
        border-radius: 5px;
        background-color: #efefef;
        box-shadow: 0 0 1px 1px #dcd9d9;
        #busuanzi_container_site_pv {
          padding-right: 20px;
          #busuanzi_value_site_pv {
            padding: 0 10px;
            color: #f78055;
          }
        }
        #busuanzi_container_site_uv {
          // padding-right: 20px;
          #busuanzi_value_site_uv {
            padding: 0 10px;
            color: #f78055;
          }
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    .container {
      display: flex;
      flex-direction: column;
      .aside {
        position: fixed;
        top: 60px;
        left: 0;
        width: 100vw !important;
        height: 60px;
        .logo {
          display: none;
        }
      }
      .main {
        margin: 120px 0 0 0;
        height: calc(100vh - 120px);
        width: 100vw;
        .search {
          .search-input {
            width: 100%;
          }
          .search-type {
            width: 90%;
          }
        }
        .nav-content {
          margin: 0 10px;
        }
        #busuanzi_container_site_pv {
          display: block !important;
          padding-bottom: 10px;
        }
      }
    }
  }
}
</style>
