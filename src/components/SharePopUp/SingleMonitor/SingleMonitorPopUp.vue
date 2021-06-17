<template>
    <div>
        <xu-modal :shown="true"
                  :header-shown="true"
                  :model-style="{'marginTop':'25px'}"
                  :header-style="{'backgroundColor':'#354052','color':'#fcfcfc'}"
                  @close="close">
            <div slot="header">#{{deviceInfo.id}} 单点监控模式</div>
            <div slot="content">
                <div class="box-title">
                    <div class="xu-row mb-integer">
                        <div class="xu-col-5">
                            <span>客户公司：{{ deviceInfo.companyName }}</span>
                        </div>
                        <div class="xu-col-5">
                            <span>机型名称：{{ deviceInfo.modelName }}</span>
                        </div>
                        <!-- <div class="xu-col-2">
                            <span v-if="auth.includes('停止工作') || auth.includes('恢复工作')">
                                <span>启用：</span>
                                <xu-switch 
                                   :value="deviceInfo.rotateStatus | rotateStatusFilter"
                                   :isShowConfirm='true'
                                   @toggle="changeRotateStatus($event,deviceInfo.id)">
                                </xu-switch>
                            </span>
                        </div> -->
                    </div>

                </div>
                <div class="box-content">
                    <div class="xu-row mb-integer">
                        <!--charts部分-->
                        <div class="xu-col-7">
                            <!--转速曲线图-->
                            <xu-chart :type="'line'"
                                      :chart-style="{height:'100px'}"
                                      :y-axis="{type:'value',name:'转速/rpm',nameLocation:'middle',nameGap:40,splitLine:{show:false}}"
                                      :x-axis="{type:'category',show:false,boundaryGap: false}"
                                      :grid="{containLabel: false, left:'70px', right:'0px', top:'15px', bottom:'5px'}"
                                      :data="{x:deviceHistoryRecord.time,y:deviceHistoryRecord.rotateSpeed}"/>
                            <!--滑油压力曲线图-->
                            <xu-chart :type="'line'"
                                      :chart-style="{height:'100px'}"
                                      :y-axis="{type:'value',name:'滑油压力/kpa',nameLocation:'middle',nameGap:40,splitLine:{show:false}}"
                                      :x-axis="{type:'category',show:false,boundaryGap: false}"
                                      :grid="{containLabel: false, left:'70px', right:'0px', top:'15px', bottom:'5px'}"
                                      :data="{x:deviceHistoryRecord.time,y:deviceHistoryRecord.greasePressure}"/>
                            <!--冷却水曲线图-->
                            <xu-chart :type="'line'"
                                      :chart-style="{height:'100px'}"
                                      :y-axis="{type:'value',name:'冷却水温度/℃',nameLocation:'middle',nameGap:40,splitLine:{show:false}}"
                                      :x-axis="{type:'category',boundaryGap: false}"
                                      :grid="{containLabel: false, left:'70px', right:'0px', top:'5px', bottom:'25px'}"
                                      :data="{x:deviceHistoryRecord.time,y:deviceHistoryRecord.coolingWaterTemperature}"/>
                        </div>
                        <!--运行轨迹图-->
                        <div class="xu-col-5">
                            <baidu-map class="map-container"
                                       ak="HMsRLrPGidU6hIisM4HYgx0APRKhpm6p"
                                       :center="trackInfos[0]"
                                       :scroll-wheel-zoom="true"
                                       v-if="trackInfos[0]"
                                       :zoom="7">
                                <bm-polyline :path="trackInfos"
                                             :stroke-weight="2"
                                             stroke-color="red"/>
                                <!--使用v-if是因为position绑定的是异步数据，初次渲染的时候还没有数据，会报错-->
                                <bm-label content="开始" :position="trackInfos[0]"/>
                                <bm-label content="结束" :position="trackInfos[trackInfos.length-1]"/>
                                <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{top:'5px',left:'5px'}"/>
                                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"/>
                            </baidu-map>
                        </div>
                    </div>
                    <!--统计指标-->
                    <div class="statics-info-wrapper mb-integer">
                        <div class="statics-item bg-light border">
                            <span>累计在线时间：</span><span>{{ devStatisticsInfos.totalOnlineTime | msFilter }}</span>
                        </div>
                        <div class="statics-item bg-light border">
                            <span>累计正常时间：</span><span>{{ devStatisticsInfos.totalNormalTime | msFilter }}</span>
                        </div>
                        <div class="statics-item bg-light border">
                            <span>累计报警时间：</span><span>{{ devStatisticsInfos.totalAlarmTime | msFilter }}</span>
                        </div>
                    </div>
                    <div class="table-container clearfix">
                        <div class="table-title">
                            <label class="xu-label-text">
                                <span>选择时段:</span>
                                <el-date-picker
                                 v-model="startTime"
                                 type="datetime"
                                 placeholder="选择开始时间"
                                 default-time="12:00:00"
                                 size="small"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                >
                                </el-date-picker>
                                <!-- <input type="date" name="startTime" class="xu-input" v-model="startTime"> -->
                                <span>&nbsp;-&nbsp;</span>
                                <el-date-picker
                                 v-model="endTime"
                                 type="datetime"
                                 placeholder="选择开始时间"
                                 default-time="12:00:00"
                                 size="small"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                >
                                </el-date-picker>
                                <!-- <input type="date" name="endTime" class="xu-input" v-model="endTime"> -->
                            </label>
                            <button class="xu-btn xu-btn-info ml-integer" @click="export2Excel()">
                              <span class="fa fa-file-excel-o"/>&nbsp;导出Excel
                            </button>
                            <button class="xu-btn xu-btn-primary xu-float-right mt-integer" @click="showForm">添加维修记录</button>
                        </div>
                        <!--历史数据表格-->
                        <div class="history-table scrollBar-style">
                            <table class="xu-table xu-table-center xu-table-sm xu-table-hover">
                                <thead class="xu-text-white-level0">
                                <tr class="bg-info">
                                    <th v-for="thead in theadContents">
                                        {{ thead }}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in historyDataInfos" :key="index">
                                    <td>{{ item.time }}</td>
                                    <td>{{ item.rotateSpeed }}</td>
                                    <td>{{ item.greasePressure }}</td>
                                    <td>{{ item.coolingWaterTemperature }}</td>
                                    <td>{{ item.status }}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div v-if="historyDataInfos.length === 0" class="hint-text">暂无记录</div>
                        </div>
                        <!--月份在线率数据表格-->
                        <div class="online-rate-table">
                            <table class="xu-table xu-table-center xu-table-border xu-table-sm xu-table-hover">
                                <thead class="bg-success xu-text-white-level0">
                                <tr>
                                    <th>月份</th>
                                    <th>在线率</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(value,key) in monthlyOnlineRateInfos">
                                    <td>{{key | monthFilter}}</td>
                                    <td>{{value | rateFilter }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--报警数据表格-->
                        <div class="warn-maintain-table">
                            <div class="warn-table mb-integer scrollBar-style">
                                <table class="xu-table xu-table-center xu-table-sm xu-table-hover">
                                    <thead class="xu-text-white-level0">
                                    <tr class="bg-danger">
                                        <th>信息</th>
                                        <th>类型</th>
                                        <th>报警时间</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(alarm,index) in alarmInfos" :key="index">
                                        <td>{{alarm.alarmInfo}}</td>
                                        <td>
                                            <span class="xu-badge" :class="{'xu-badge-error':alarm.alarmType === 0,
                                                      'xu-badge-warning':alarm.alarmType === 1}">
                                                {{ alarm.alarmType | alarmTypeFilter }}
                                            </span>
                                        </td>
                                        <td>{{alarm.alarmTime}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div class="look-more-text" v-if="alarmInfos.length !== 0" @click="showAlarmInfosPopUp">查看更多</div>
                                <div v-if="alarmInfos.length === 0" class="hint-text">暂无记录</div>
                            </div>
                            <!--维修记录数据表格-->
                            <div class="maintain-table scrollBar-style">
                                <table class="xu-table xu-table-center xu-table-sm xu-table-hover">
                                    <thead class="xu-text-white-level0">
                                    <tr class="bg-warning">
                                        <th>维修零件名称</th>
                                        <th>维修人</th>
                                        <th>维修时间</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(repair,index) in repairInfos" :key="index">
                                        <td>{{ repair.partsName }}</td>
                                        <td>{{ repair.repairman }}</td>
                                        <td>{{ repair.repairDate }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div class="look-more-text" v-if="repairInfos.length !== 0" @click="showRepairInfosPopUp">查看更多</div>
                                <div v-if="repairInfos.length === 0" class="hint-text">暂无记录</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </xu-modal>
        <dev-history-repair-infos-pop-up v-if="showDevHistoryRepairInfosPopUp"
                                         :device-id="deviceInfo.id"
                                         @close="showDevHistoryRepairInfosPopUp = false">
        </dev-history-repair-infos-pop-up>
        <dev-history-alarm-infos-pop-up v-if="showDevHistoryAlarmInfosPopUp"
                                        :device-id="deviceInfo.id"
                                        @close="showDevHistoryAlarmInfosPopUp = false">
        </dev-history-alarm-infos-pop-up>
        <xu-form v-if="isFormShown"
                 :is-pop-up="true"
                 :form-title="formTitle"
                 :render-data="formRenderData"
                 @submit="submit($event)"
                 @close="isFormShown = false">
        </xu-form>
    </div>
</template>

<script>
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  import { BaiduMap,BmScale,BmNavigation,BmPolyline,BmLabel } from 'vue-baidu-map'
  import XuCSS from "@/plugins/XuCSS";
  import XuChart from "@/components/CommonComponents/XuComponent/XuChart";
  import DevHistoryRepairInfosPopUp from "./DevHistoryRepairInfosPopUp";
  import DevHistoryAlarmInfosPopUp from "@/components/SharePopUp/SingleMonitor/DevHistoryAlarmInfosPopUp";
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";
  import XuSwitch from "@/components/CommonComponents/XuComponent/XuSwitch";
  import { XuAlert } from "@/components/CommonComponents/XuComponent/XuAlert/XuAlert";



  export default {
    name: "SingleMonitorModal",
    components:{
      XuForm,
      XuModal,
      BaiduMap,
      BmNavigation,
      BmScale,
      BmLabel,
      BmPolyline,
      XuChart,
      DevHistoryRepairInfosPopUp,
      DevHistoryAlarmInfosPopUp,
      XuSwitch,
      XuAlert
    },
    props:{
      deviceInfo:Object,
    },
    data(){
      return {
        theadContents:['监测时间','转速/rpm','滑油压力/kpa','冷却水温度/℃','状态'],
        alarmInfos:[],//存放设备报警记录信息
        repairInfos:[],//存放设备维修记录信息
        historyDataInfos:[],//存放设备历史传感器数据
        trackInfos:[],//轨迹信息
        startTime:'',//Excel开始时间
        endTime:'',//Excel结束时间
        monthlyOnlineRateInfos:{},//月份在线率信息
        devStatisticsInfos:{},//月份在线率信息
        showDevHistoryRepairInfosPopUp:false,//是否显示设备历史维修记录弹窗
        showDevHistoryAlarmInfosPopUp:false,//是否显示设备历史报警记录弹窗
        isFormShown:false,//是否显示信息窗口
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        //权限
        auth:this.$store.getters['getLoginInfo']['auth']['buttonAuthList']
      }
    },
    computed:{
      //1.提取历史传感器数据
      deviceHistoryRecord:function () {
        let rotateSpeed = [],
            greasePressure = [],
            coolingWaterTemperature = [],
            time = [];
        let len=this.historyDataInfos.length;
        for (let i=0;i<len;i++){
          rotateSpeed.push(this.historyDataInfos[i].rotateSpeed);
          greasePressure.push(this.historyDataInfos[i].greasePressure);
          coolingWaterTemperature.push(this.historyDataInfos[i].coolingWaterTemperature);
          time.push(this.historyDataInfos[i].time);
        }

        return {
          rotateSpeed:rotateSpeed,
          greasePressure:greasePressure,
          coolingWaterTemperature:coolingWaterTemperature,
          time:time,
        }
      },
    },
    methods:{
      //1.关闭单点监控界面
      close:function () {
        this.$emit('close')
      },
      //2.获取整个界面的所需数据
      getSingleDeviceCollectionInfos:function(){
        this.$Http['singleMonitor']['getSingleDeviceCollectionInfos'](this.deviceInfo.id)//注意这里测试才传入1的,正式为this.deviceInfo.id
          .then(res => {
            const {alarms,datas:data,DeviceTime,repairs,monthOnlineRate:rate,locationChange:location} = res;
            //1.处理维修信息
            // console.log(res);
            // console.log(repairs);
            repairs && repairs.forEach(ele => {
              this.repairInfos.push({
                partsName:ele.partsName,
                // replacementType: ele.replacementType,
                repairman:ele.repairman,
                repairDate:ele.repairDate
              })
            });
            //2.处理报警信息
            alarms && alarms.forEach(ele => {
              this.alarmInfos.push({
                alarmInfo: ele.alarmInfo,
                alarmType: ele.alarmType,
                alarmTime:ele.createTime
              })
            });
            //3.处理设备历史传感器数据
            data && data.forEach(ele => {
              this.historyDataInfos.push({
                rotateSpeed:ele.speed,
                greasePressure:ele.greasePressure,
                coolingWaterTemperature:ele.waterTemp,
                time:ele.createTime,
                status:ele.status,
              });
            });
            //console.log(data)
            //4.处理轨迹信息
            location && location.forEach(ele => {
              this.trackInfos.push({
                lat:ele.latitude,
                lng:ele.longitude
              })
            });
            //4.1处理轨迹为空的情况
            // console.log(this.trackInfos);
            //5.处理在线率信息
            // console.log(rate);
            this.monthlyOnlineRateInfos = rate;
            //6.处理设备统计信息
            // console.log(DeviceTime);
            this.devStatisticsInfos = DeviceTime ? DeviceTime : {}
          })
          .catch(e => {
            console.log('单点监控解析数据有错！')
          });
        // console.log(this.trackInfos)
      },
      //3.显示一台设备的维修记录表格
      showRepairInfosPopUp: function () {
        this.showDevHistoryRepairInfosPopUp = true;
      },
      //4.显示一台设备的报警记录表格
      showAlarmInfosPopUp: function () {
        this.showDevHistoryAlarmInfosPopUp = true;
      },
      //5.显示添加设备报警记录表单
      showForm:function () {
        this.formTitle = '添加维修记录';
        this.formRenderData = [
          {content:'零件名称：',value:'',field:'partsName'},
          {content:'零件数量：',value:'',field:'partsNumber',additionalInfo:{type:'number'}},
          {content:'类型：',value:'',field:'replacementType'},
          {content:'维修人：',value:'',field:'repairman'},
          {content:'维修时间：',value:'',field:'repairDate',additionalInfo:{type:'date'}},
          {content:'备注：',value:'',field:'remark',additionalInfo:{type:'textarea'}},
        ];
        this.isFormShown = true;
      },
      //6 停止或者恢复发动机工作
      changeRotateStatus:function (status,deviceId) {
        const tranData = {id:deviceId};
        switch (status) {
          case true:
            this.$Http['deviceManage']['enableEngine'](tranData)
              .then(res => {
                // console.log(res)
                // this.getTableData();
            });
            break;
          case false:
            this.$Http['deviceManage']['disableEngine'](tranData)
              .then(res => {
                // console.log(res)
                // this.getTableData();
            });
        }
      },
      //7 导出为excel表格
      export2Excel(){
        if(!this.startTime || !this.endTime){
          XuAlert('请选择时间段','error')
          return
        }
        const tranData = {
          id:this.deviceInfo.id,
          startTime:this.startTime,
          endTime:this.endTime,
        }
        console.log('开始下载文件',tranData)
        this.$Http['singleMonitor']['exportExcel'](tranData,{responseType:'blob'})
        .then(res => {
          // console.log(res)
          const blob = new Blob([res.data],{type:'application/vnd.ms-excel'})
          console.log( blob)
          const fileName = res.headers['content-disposition'].split('#')[1]
          //兼容IE
          if('msSaveOrOpenBlob' in navigator){
            window.navigator.msSaveOrOpenBlob(blob,fileName)
            return
          }
          let link = document.createElement('a')
          link.download = decodeURIComponent(fileName) //给文件命名
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        formData['device'] = {id:this.deviceInfo.id};//正式为this.deviceInfo.id
        // console.log(formData);
        this.$Http['singleMonitor']['postRepairInfo'](formData)
          .then( res => {
            if (res){
              this.repairInfos.unshift({
                partsName: formData.partsName,
                repairman: formData.repairman,
                repairDate: formData.repairDate});
              this.repairInfos.pop();
            }
          })
          .catch(error => {});
      },
    },
    filters:{
      //1.报警类型过滤
      alarmTypeFilter:function (value) {
        switch (value) {
          case 0:
            return '数据异常';
          case 1:
            return '设备故障'
        }
      },
      //2.设备在线时长、报警时长过滤
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
      //3.设备在线率过滤
      rateFilter:function (value) {
        const regValue = value*100;
        return regValue.toFixed(2) + '%'
      },
      //4.设备在线率月份过滤
      monthFilter:function (value) {
        const reg = /-(\d+)-/;
        const year = value.match(/^\d+(?=-)/)[0];
        const month = value.match(reg)[1] ? value.match(reg)[1] : '00';
        return year + '年' + month + '月'
      },
      rotateStatusFilter: function (value) {
        switch (value) {
          case 0:
            return false;
          case 1:
            return true;
          default:
            return true
        }
      }
    },
    created(){
      this.getSingleDeviceCollectionInfos()
    },
    mounted(){
      // console.log(this.deviceHistoryRecord.coordinates)

    },
    //异步数据更新后执行
    updated(){
      // XuCSS.fixTableThead()
    }
  }
</script>

<style scoped>
    .box-title {
        background-color: transparent;
        width: 1400px;
        font-size: 16px;
    }
    .map-container {
        border: 1px solid black;
        height: 300px;
    }
    .statics-info-wrapper {
        display: flex;
        color: #4d5875;
        font-weight: 900;
        font-size: 18px;
        justify-content: space-between;
    }
    .statics-item {
        padding: 15px 20px;
        border-radius: 5px;
        width: 450px;
        text-align: center;
    }
    .history-table {
        width: 650px;
        height: 350px;
        float: left;
    }
    .online-rate-table {
        margin-left: 25px;
        float: left;
        height: 350px;
        width: 200px;
        border: 1px solid #dcdfe6;
    }
    .table-title {
        padding: 10px 0;
    }
    .warn-maintain-table {
        float: right;
        height: 350px;
        width: 500px;
    }
    .warn-table {
        height: 170px;
        outline: 1px solid #cccccc;
    }
    .maintain-table {
        height: 170px;
        outline: 1px solid #cccccc;
    }
    .hint-text {
        text-align: center;
        color: #999999;
        margin-top: 50px;
    }
    .look-more-text {
        cursor: pointer;
        text-align: center;
        color: #999999;
        margin-top: 15px;
        font-size: 13px;
    }
    .look-more-text:hover {
        color: #848484;
    }
</style>