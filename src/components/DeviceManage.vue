<!--设备管理路由界面-->
<template>
    <div class="vue-views-wrapper">
        <div class="xu-row mb-integer">
            <div class="xu-col-6">
                <chart-statics :chart-data="forChartData"/>
            </div>
            <div class="xu-col-3">
                <about-company :model-infos-in-company="modelInfosInCompany"/>
            </div>
            <div class="xu-col-3">
                <about-model :company-infos-in-model="companyInfosInModel"/>
            </div>
        </div>
        <div class="xu-row mb-integer">
            <div class="xu-col-4">
                <div class="comp-static-wrapper">
                    <p class="static-item">{{ minMaxStatistical.averageLife | msFilter }}</p>
                    <p>报废设备平均使用寿命</p>
                </div>
            </div>
            <div class="xu-col-4">
                <div class="comp-static-wrapper">
                    <p>{{ minMaxStatistical.minLife | msFilter }}</p>
                    <p>最小使用寿命</p>
                    <p>设备编号：{{minMaxStatistical.minLifeDeviceCsNumber}}</p>
                </div>
            </div>
            <div class="xu-col-4">
                <div class="comp-static-wrapper">
                    <p>{{ minMaxStatistical.maxLife | msFilter }}</p>
                    <p>最大使用寿命</p>
                    <p>设备编号：{{minMaxStatistical.maxLifeDeviceCsNumber}}</p>
                </div>
            </div>
        </div>
        <div class="xu-row">
            <div class="xu-col-12">
                <device-table>
                </device-table>
            </div>
        </div>
    </div>
</template>

<script>
  import ChartStatics from "@/components/DeviceManageComp/ChartStatics";
  import AboutCompany from "@/components/DeviceManageComp/AboutCompany";
  import AboutModel from "@/components/DeviceManageComp/AboutModel";
  import DeviceTable from "@/components/DeviceManageComp/DeviceTable";
  export default {
    name: "DeviceManage",
    components:{
      ChartStatics,
      AboutCompany,
      AboutModel,
      DeviceTable,
    },
    data(){
      return {
        //异步数据请求完成标志
        asyncFlag:false,
        //曲线部分数据
        forChartData:{
          x:[],//时间轴
          y:[],//设备总数量
          y1:[],//在线设备数量
          y2:[],//正常设备数量`
          y3:[],//报废设备数量
          y4:[],//报警设备数量
        },
        //每个公司对应相应机型的数据
        modelInfosInCompany:[],
        //每个机型对应相应公司的数据
        companyInfosInModel:[],
        //最大最小值统计
        minMaxStatistical:{},
        //处理表格数据--默认20条（放在子组件中获取）
        // tableData:[],
        timer:null,
        interval:2*60*1000,
      }
    },
    methods:{
      //1.获取设备管理界面的所有数据
      getCollectionInfos: function () {
        this.$Http['deviceManage']['getCollectionInfos']()
        .then(res => {
          // console.log(res);
          const {StatisticalInfo:chartData,aboutCompany,aboutModel,scrapDeviceLife} = res;
          
          //1.处理曲线部分的数据
          // console.log(chartData);
          this.forChartData = {'x':[],'y':[],'y1':[],'y2':[],'y3':[],'y4':[]}
          for (const key in chartData){
            if (chartData.hasOwnProperty(key)){
              this.forChartData['x'].push(key);
              this.forChartData['y'].push(chartData[key]['totalNum']);
              this.forChartData['y1'].push(chartData[key]['onlineNum']);
              this.forChartData['y2'].push(chartData[key]['normalNum']);
              this.forChartData['y3'].push(chartData[key]['scrapNumber']);
              this.forChartData['y4'].push(chartData[key]['alarmNum']);
            }
          }
          // this.asyncFlag = true;
          //2.处理每个公司对应相应机型的数据
          // console.log(aboutCompany);
          this.modelInfosInCompany = []
          for (const companyName in aboutCompany){
            if (aboutCompany.hasOwnProperty(companyName)){
              const {totalNumber,deviceChange} = aboutCompany[companyName];
              delete aboutCompany[companyName]['totalNumber'];
              delete aboutCompany[companyName]['deviceChange'];
              const modelInfos = [];
              const monthlyInfos = {x:[],y:[]};
              //2.1 处理该公司下的机型信息
              for (const modelName in aboutCompany[companyName]){
                if (aboutCompany[companyName].hasOwnProperty(modelName)){
                  modelInfos.push({modelName:modelName,modelNum:aboutCompany[companyName][modelName]})
                }
              }
              //2.2 处理该公司下的月份信息{x:月份数组,y:对应的设备数目}
              for (const date in deviceChange){
                if (deviceChange.hasOwnProperty(date)){
                  monthlyInfos['x'].push(date);
                  monthlyInfos['y'].push(deviceChange[date]);
                }
              }
              this.modelInfosInCompany.push({
                companyName:companyName,
                totalModelNum:totalNumber,
                modelInfos:modelInfos,
                monthlyModel:monthlyInfos
              })
            }

          }
          // console.log(this.modelInfosInCompany);
          //3.每个机型对应相应公司的数据
          // console.log(aboutModel);
          this.companyInfosInModel = []
          for(const modelName in aboutModel){
            if (aboutModel.hasOwnProperty(modelName)){
              const {totalNumber} = aboutModel[modelName];
              delete aboutModel[modelName]['totalNumber'];
              const companyInfos = [];
              //3.1 处理
              for (const companyName in aboutModel[modelName]){
                if (aboutModel[modelName].hasOwnProperty(companyName)){
                  companyInfos.push({companyName:companyName,companyNum:aboutModel[modelName][companyName]})
                }
              }
              this.companyInfosInModel.push({
                modelName:modelName,
                totalCompanyNum:totalNumber,
                companyInfos:companyInfos
              })
            }

          }
          // console.log(this.companyInfosInModel);
          //4.最大值最小值统计
          // console.log(scrapDeviceLife);
          this.minMaxStatistical['averageLife'] = scrapDeviceLife['平均寿命'];
          this.minMaxStatistical['minLife'] = scrapDeviceLife['最小使用寿命'];
          this.minMaxStatistical['minLifeDeviceCsNumber'] = scrapDeviceLife['使用寿命最小的报废设备编号'];
          this.minMaxStatistical['maxLife'] = scrapDeviceLife['最大使用寿命'];
          this.minMaxStatistical['maxLifeDeviceCsNumber'] = scrapDeviceLife['使用寿命最大的报废设备编号'];
          //5.处理表格数据
          // console.log(tableData);

        })
      }
    },
    filters:{
      msFilter:function (value) {
        if (value <= 0){
          return '无'
        } else {
          const day = Math.floor(value / 86400000);
          const hour = Math.floor(value % 86400000 / 3600000 );
          const min = Math.floor(value % 86400000 % 3600000 / 60000 );
          let result = '';
          day ? result = result + day + '天':result = result + '';
          hour ? result = result + hour + '小时':result = result + '';
          min ? result = result + min + '分钟':result = result + '';
          return result
        }
      },
    },
    created(){
      this.getCollectionInfos();
      this.timer = setInterval(this.getCollectionInfos,this.interval)
    },
    beforeDestroy(){
      clearInterval(this.timer)
    }
  }
</script>

<style scoped>
    .comp-static-wrapper {
        text-align: center;
        font-size: 17px;
        background-color: #ffffff;
        border: 1px solid #dcdfe6;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        height: 100px;
        border-radius: 5px;
        color: #4d5875;
        font-weight: 900;

    }
</style>