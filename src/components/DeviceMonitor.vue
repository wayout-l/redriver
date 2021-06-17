
<!--实时监控主路由界面-->
<template>
    <div class="vue-views-wrapper">
        <e-c-u-statics-info :statistical-data="statisticalData">
        </e-c-u-statics-info>
        <main-map :map-device-infos="mapDeviceInfos"
                  :company-names-dropdown="companyNamesDropdown"
                  :model-names-dropdown="modelNamesDropdown"
                  @searchInputDone="getSearchResults($event)">
        </main-map>
    </div>
</template>

<script>
  import ECUStaticsInfo from "@/components/DeviceMonitorComp/ECUStaticsInfo";
  import MainMap from "@/components/DeviceMonitorComp/MainMap";
  export default {
    name: "DeviceMonitor",
    components:{
      ECUStaticsInfo,
      MainMap
    },
    data:function() {
      return {
        statisticalData:{},//四个统计数据值
        mapDeviceInfos:[],//用来地图上显示的设备
        modelNamesDropdown:[],//机型名下拉列表
        companyNamesDropdown:[],//客户公司名下拉列表
        timer:null,
        interval:2*60*1000
      }
    },
    methods:{
      //1 获取整个页面所需数据
      getCollection: function () {
        this.statisticalData = {};
        this.mapDeviceInfos = [];
        this.modelNamesDropdown = [];
        this.companyNamesDropdown = [];
        this.$Http['deviceMonitor']['getCollection']()
          .then(res => {
            const { statistical,devices } = res;
            // console.log(statistical);
            // console.log(devices);
            this.statisticalData = {
              totalNum:statistical.totalNum,
              onlineNum:statistical.onlineNum,
              normalNum:statistical.normalNum,
              alarmNum:statistical.alarmNum
            };
            //只有在线设备才会传到devices中
            devices && devices.forEach(ele => {
              //处理地图显示数据
              this.mapDeviceInfos.push({
                id:ele.id,
                rotateStatus:ele.rotateStatus,
                isAlert:ele.status,//2--报警,1--正常,0--报废(不会出现，报废就离线了)
                modelName:ele.model.modelName,
                companyName:ele.company.name,
                //用于信息窗口
                infoWindowData:{
                  isAlert:ele.status,
                  status:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].status,//设备的文字提示信息
                  csNumber:ele.csNumber,
                  beidouId: ele.beidouId,
                  ipPort:ele.ipPort === null ? '暂无' : ele['ipPort'],
                  rotateSpeed:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].speed,
                  greasePressure:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].greasePressure,
                  coolingWater:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].waterTemp,
                },
                //坐标信息
                coordinate:{
                  lng:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].longitude,
                  lat:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].latitude
                },
              });
              //处理机型名下拉列表数据
              if (!this.modelNamesDropdown.includes(ele.model.modelName)){
                this.modelNamesDropdown.push(ele.model.modelName);
              }
              //处理客户公司名下拉列表数据
              if (!this.companyNamesDropdown.includes(ele.company.name)) {
                this.companyNamesDropdown.push(ele.company.name)
              }
            });
            // console.log(this.mapDeviceInfos);
            // console.log(this.modelNamesDropdown);
            // console.log(this.companyNamesDropdown);
            // this.mapDeviceInfos.map(value => {console.log(value.coordinate.lng,value.coordinate.lat)})
            // this.mapDeviceInfos.map(value => {console.log(value.isAlert)})
          })
      },
      //2 搜索事件
      getSearchResults:function (searchInfo) {
        // console.log(searchInfo)
        this.mapDeviceInfos = [];
        this.$Http['deviceMonitor']['searchDevices'](searchInfo)
          .then(res => {
            const { statistical,devices } = res;
            // console.log(statistical);
            // console.log(devices);
            this.statisticalData = {
              totalNum:statistical.totalNum,
              onlineNum:statistical.onlineNum,
              normalNum:statistical.normalNum,
              alarmNum:statistical.alarmNum
            };

            devices.forEach(ele => {
              //处理地图显示数据
              // console.log(ele.dataDevices);
              this.mapDeviceInfos.push({
                id:ele.id,
                isAlert:ele.status,//2--报警,1--正常,0--报废(不会出现，报废离线)
                modelName:ele.model.modelName,
                companyName:ele.company.name,
                infoWindowData:{
                  isAlert:ele.status,
                  status:ele.dataDevices.length === 0? '': ele.dataDevices[0].status,//设备的文字提示信息
                  csNumber:ele.csNumber,
                  beidouId: ele.beidouId,
                  rotateSpeed:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].speed,
                  greasePressure:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].greasePressure,
                  coolingWater:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].waterTemp,
                },
                coordinate:{
                  lng:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].longitude,
                  lat:ele.dataDevices.length === 0 ? '': ele.dataDevices[0].latitude
                },
              });
            });
            // console.log(this.mapDeviceInfos);
          })
      }
    },
    created(){
      this.getCollection();
      this.timer = setInterval(this.getCollection,this.interval)
    },
    beforeDestroy(){
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>

</style>