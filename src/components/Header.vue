<template>
  <div class="header">
    <div class="left">
      {{ locationData.district }} 
      今天
      ({{
        weeks[new Date(weatherData.reportTime).getDay()]
      }})：
      {{ weatherData.temperature }}℃ 
      {{ weatherData.weather }}
    </div>
  </div>
</template>

<script>
import AMap from "AMap";
export default {
  data() {
    return {
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
    //   定位和天气
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

            //加载天气查询插件
            AMap.plugin("AMap.Weather", function() {
              //创建天气查询实例
              var weather = new AMap.Weather();

              //执行实时天气信息查询
              weather.getLive(that.locationData.district, function(err, data) {
                that.weatherData = data;
              });
            });
          }
          // data是具体的定位信息
        }

        function onError(data) {
          // 定位出错
          console.log(data);
        }
      });
    },
  },
  mounted() {
    this.locationWeather();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss";
@font-face {
  font-family: "方正报宋简体";
  src: url("../assets/fonts/方正报宋简体.ttf");
}
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 100%;
  background-color: $diy-black;
  color: $white;
  font-family: "方正报宋简体";
}
</style>
