<template>
    <div>
       <xu-modal :shown="true"
                 :header-shown="true"
                 :model-style="{marginTop:'150px'}"
                 @close="close">
           <div slot="header">
               <span>#设备的历史维修记录(id始终为1的设备)</span>
           </div>
           <div slot="content">
               <table class="xu-table xu-table-sm xu-table-hover min-width-1000 xu-table-center">
                   <thead class="bg-warning xu-text-level2 xu-text-white-level0">
                   <tr>
                       <th>#ID</th>
                       <th>零件名称</th>
                       <th>数量</th>
                       <th>类型</th>
                       <th>维修人</th>
                       <th>维修时间</th>
                       <th>备注</th>
                   </tr>
                   </thead>
                   <tbody>
                   <tr v-for="repairInfo in historyDataInfos" :key="repairInfo.id">
                       <td>{{ repairInfo.id }}</td>
                       <td>{{ repairInfo.partsName }}</td>
                       <td>{{ repairInfo.partsNumber }}</td>
                       <td>{{ repairInfo.replacementType }}</td>
                       <td>{{ repairInfo.repairMan }}</td>
                       <td>{{ repairInfo.repairDate }}</td>
                       <td>{{ repairInfo.remark }}</td>
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
    name: "DevHistoryRepairInfosPopUp",
    components: {XuModal,XuPageNav},
    props:['deviceId'],
    data(){
      return {
        historyDataInfos: [],//存放设备历史维修记录
        serverData:{},//存放服务器原始数据
      }
    },
    methods:{
      //1 关闭事件
      close:function () {
        this.$emit('close')
      },
      //2 获取某一个设备的维修记录
      getOneDeviceRepairInfos:function (page=0) {
        this.$Http['singleMonitor']['getOneDeviceRepairInfos'](this.deviceId+'/repairs',{params:{start:page}})//测试为id=1的设备的历史维修记录
          .then(res => {
            this.historyDataInfos = [];
            this.serverData = res;
            res.content.forEach(ele => {
              this.historyDataInfos.push({
                id:ele.id,
                partsName:ele.partsName,
                partsNumber: ele.partsNumber,
                replacementType: ele.replacementType,
                repairMan: ele.repairman,
                repairDate: ele.repairDate,
                remark:ele.remark
              })
            })
          })
      },
      //3.分页器跳转
      jumpSelectedPage:function(selectedPage){
        this.getOneDeviceRepairInfos(selectedPage-1)
      },
    },
    created(){
      this.getOneDeviceRepairInfos()
    }
  }
</script>

<style scoped>

</style>