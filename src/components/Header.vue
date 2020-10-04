<template>
  <div class="header">
    <!-- 天气 -->
    <div class="left" v-if="isShow">
      {{ locationData.district }}
      <span class="change-location" @click="isShow = false">[ 切换 ]</span>
      今天 ({{ weeks[new Date(weatherData.reportTime).getDay()] }})：
      {{ weatherData.temperature }}℃
      {{ weatherData.weather }}
    </div>
    <!-- 省市区三级选择 -->
    <div class="selectCity" v-else>
      <!-- 省 -->
      <el-select
        v-model="selectedCityData.provinceIndex"
        placeholder="请选择"
        size="mini"
        class="select"
      >
        <el-option
          v-for="(item, index) in allCitiesData"
          :key="item.name"
          :label="item.name"
          :value="index"
        >
        </el-option>
      </el-select>
      <!-- 市 -->
      <el-select
        v-model="selectedCityData.cityIndex"
        placeholder="请选择"
        size="mini"
        class="select"
      >
        <el-option
          v-for="(item, index) in allCitiesData[selectedCityData.provinceIndex]
            .sub"
          :key="item.name"
          :label="item.name === 0 ? '' : item.name"
          :value="index"
        >
        </el-option>
      </el-select>
      <!-- 区  做一下判断是否是直辖市，如果是直辖市就不显示第三级了-->
      <el-select
        v-model="selectedCityData.districtIndex"
        placeholder="请选择"
        v-if="
          allCitiesData[selectedCityData.provinceIndex].sub[
            selectedCityData.cityIndex
          ].sub
        "
        size="mini"
        class="select"
      >
        <el-option
          v-for="(item, index) in allCitiesData[selectedCityData.provinceIndex]
            .sub[selectedCityData.cityIndex].sub"
          :key="item.name"
          :label="item.name === 0 ? '' : item.name"
          :value="index"
        >
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="changeLocation"
        >确定</el-button
      >
    </div>
    <!-- 右边语录 -->
    <div class="right">
      <transition
        name="fade"
        enter-active-class="animate__animated animate__fadeInUp"
        leave-active-class="animate__animated animate__fadeOutUp"
        :duration="{ enter: 2000, leave: 1000 }"
      >
        <span v-show="wisdomShow" class="text">
          {{ wisdoms[wisdomsIndex] }}
        </span>
      </transition>
      <span class="change-btn" @click="randomWisdom">[ 切换 ]</span>
    </div>
  </div>
</template>

<script>
import AMap from "AMap";
import cityData from "@/assets/jsonData/cityData.json";
import wisdomData from "@/assets/jsonData/wisdomData.js";

export default {
  data() {
    return {
      isShow: true, // true 显示天气;false显示城市的三级选择
      allCitiesData: cityData, // 所有城市的省市区三级数据
      wisdoms: wisdomData, // 名言语录
      wisdomsIndex: 0, // 随机名言语录的随机数
      wisdomShow: false, // 语录是否显示
      wisdomTime: 1000 * 30, // 语录多久随机变一次
      wisdomTimer: null,  // 定时器1
      wisdomTimer1: null, // 定时器2
      wisdomTimer2: null, // 定时器3
      // 省市区的选择的下标值
      selectedCityData: {
        provinceIndex: 0,
        cityIndex: 0,
        districtIndex: 0,
      },
      locationData: {
        province: "", // 省
        city: "", // 市
        district: "", // 县/区
        township: "", // 镇
      },
      //   天气数据
      weatherData: {},
      //   每周
      weeks: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    };
  },
  methods: {

    // 定期随机语录
    randomWisdom() {
      this.wisdomTimer = null;
      this.wisdomTimer1 = null;
      this.wisdomTimer2 = null;
      this.wisdomShow = false;
      let len = this.wisdoms.length;
      let index = Math.floor(Math.random() * (len + 1));
      this.wisdomTimer2 = setTimeout(() => {
        this.wisdomsIndex = index;
        this.wisdomShow = true;
      }, 1000);
      // 每隔一段时间就随机生成下标值，生成新的语录
      this.wisdomTimer = setInterval(() => {
        index = Math.floor(Math.random() * (len + 1));  // 随机下标值
        this.wisdomShow = false;           
        this.wisdomTimer1 = setTimeout(() => {
          this.wisdomsIndex = index;
          this.wisdomShow = true;
        }, 1000);
      }, this.wisdomTime);
    },

    //   定位
    locationWeather() {
      let that = this;
      // 定位
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);

        // 成功
        function onComplete(data) {
          if (data.status === 1) {
            let { province, city, district, township } = data.addressComponent;
            that.locationData = { province, city, district, township };
            that.getWeather();
          }
          // data是具体的定位信息
        }

        function onError(data) {
          // 定位出错
          console.log(data);
        }
      });
    },

    // 获取天气
    getWeather() {
      let that = this;
      //加载天气查询插件
      AMap.plugin("AMap.Weather", function() {
        //创建天气查询实例
        var weather = new AMap.Weather();

        //执行实时天气信息查询
        weather.getLive(that.locationData.district, function(err, data) {
          that.weatherData = data;
        });
      });
    },

    // 切换选择城市
    changeLocation() {
      // 因为有的地方是直辖市，所以第一级就是市不是省
      let district = this.allCitiesData[this.selectedCityData.provinceIndex]
        .sub[this.selectedCityData.cityIndex].sub;
      // 如果district是false说明是直辖市；为true不是直辖市
      if (district) {
        this.locationData.district =
          district[this.selectedCityData.districtIndex].name;
      } else {
        this.locationData.district = this.allCitiesData[
          this.selectedCityData.provinceIndex
        ].sub[this.selectedCityData.cityIndex].name;
      }
      this.getWeather();
      this.isShow = true;
    },
  },
  mounted() {
    this.locationWeather();
    this.randomWisdom();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss";
@font-face {
  font-family: "SourceHanSansCN-Normal";
  src: url("../assets/fonts/SourceHanSansCN-Normal.otf");
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 100%;
  font-size: 12px;
  background-color: $diy-black;
  color: $white;
  font-family: "SourceHanSansCN-Normal";
  // 城市天气
  .left {
    .change-location {
      text-decoration: underline;
      position: relative;
      &:hover {
        cursor: pointer;
        color: $jd-color;
      }
    }
  }
  // 省市区三级选择
  .selectCity {
    .select {
      margin-right: 10px;
    }
  }
  // 右侧语录
  .right {
    .text {
      display: inline-block;
      width: auto;
      height: auto;
    }
    .change-btn {
      text-decoration: underline;
      position: relative;
      &:hover {
        cursor: pointer;
        color: $jd-color;
      }
    }
  }
}
</style>
