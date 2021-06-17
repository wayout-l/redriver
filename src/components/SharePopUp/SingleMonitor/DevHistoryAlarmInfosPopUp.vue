<template>
    <div>
        <xu-modal :shown="true"
                  :header-shown="true"
                  :model-style="{marginTop:'150px'}"
                  @close="close">
            <div slot="header">
                <span>#设备的历史报警记录(id始终为1的设备)</span>
            </div>
            <div slot="content">
                <table class="xu-table xu-table-sm xu-table-hover min-width-1000 xu-table-center">
                    <thead class="bg-danger xu-text-level2 xu-text-white-level0">
                    <tr>
                        <th>#ID</th>
                        <th>报警信息</th>
                        <th>报警类型</th>
                        <th>报警开始时间</th>
                        <th>报警结束时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="alarmInfo in historyDataInfos" :key="alarmInfo.id">
                        <td>{{ alarmInfo.id }}</td>
                        <td>{{ alarmInfo.alarmInfo }}</td>
                        <td>{{ alarmInfo.alarmType | alarmTypeFilter}}</td>
                        <td>{{ alarmInfo.createTime }}</td>
                        <td>{{ alarmInfo.endTime }}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="xu-text-center">
                    <xu-page-nav :is-shown="true"
                                 :size="serverData.size"
                                 :now-page="serverData.number"
                                 :total-elements="serverData.totalElements"
                                 :total-page="serverData.totalPages"
                                 @selectedPage="jumpSelectedPage($event)">
                    </xu-page-nav>
                </div>
            </div>
        </xu-modal>
    </div>
</template>

<script>
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  import XuPageNav from "@/components/CommonComponents/XuComponent/XuPageNav";
  export default {
    name: "DevHistoryAlarmInfosPopUp",
    components:{XuModal,XuPageNav},
    props:['deviceId'],
    data(){
      return {
        historyDataInfos: [],//存放设备历史报警记录
        serverData:{},//存放服务器原始数据
      }
    },
    methods:{
      //1 关闭事件
      close:function () {
        this.$emit('close')
      },
      //2 获取某一个设备的报警记录
      getDeviceAlarmInfos:function (page=0) {
        this.$Http['singleMonitor']['getDeviceAlarmInfos'](this.deviceId+'/alarms',{params:{start:page}})//测试为id=1的设备的历史维修记录，正式为this.deviceId
          .then(res => {
            this.historyDataInfos = [];
            this.serverData = res;
            res.content.forEach(ele => {
              this.historyDataInfos.push({
                id:ele.id,
                alarmInfo:ele.alarmInfo,
                alarmType:ele.alarmType,
                createTime:ele.createTime,
                endTime:ele.endTime
              })
            })
          })
      },
      //3.分页器跳转
      jumpSelectedPage:function(selectedPage){
        this.getDeviceAlarmInfos(selectedPage-1)
      },
    },
    filters:{
      alarmTypeFilter:function (value) {
        switch (value) {
          case 0:
            return '数据异常';
          case 1:
            return '设备故障'
        }
      }
    },
    created(){
      this.getDeviceAlarmInfos()
    }
  }
</script>

<style scoped>

</style>