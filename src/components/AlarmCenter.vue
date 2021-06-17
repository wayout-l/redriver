<!--报警中心路由界面-->
<template>
    <div class="vue-views-wrapper">
        <div class="xubox">
            <div class="xubox-title">
                <span>报警记录</span>
            </div>
            <div class="xubox-content">
                <div class="mb-integer xu-text-level3">
                    <label class="xu-label-text">
                        <span>控制系统编号：</span>
                        <input type="text" class="xu-input" v-model="searchInfo.csNumber" placeholder="请输入控制系统编号">
                    </label>
                    <button class="xu-btn xu-btn-info ml-integer"
                            :disabled="searchInfo.csNumber === ''"
                            @click="searchAlarmInfos()">搜索</button>
                </div>
                <table class="xu-table xu-table-center xu-table-hover xu-table-strip">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>#ID</th>
                        <th>控制系统编号</th>
                        <th>信息</th>
                        <th>类型</th>
                        <th>报警时间</th>
                        <th>结束时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="alarmInfo in alarmInfos" :key="alarmInfo.id">
                        <td>{{ alarmInfo.id }}</td>
                        <td>{{ alarmInfo.csNumber }}</td>
                        <td>{{ alarmInfo.alarmInfo }}</td>
                        <td>
                            <span class="xu-badge" :class="{'xu-badge-error':alarmInfo.alarmType === 0,
                                                      'xu-badge-warning':alarmInfo.alarmType === 1}">
                                {{ alarmInfo.alarmType | alarmTypeFilter }}
                            </span>
                        </td>
                        <td>{{ alarmInfo.createTime }}</td>
                        <td>{{ alarmInfo.endTime }}</td>
                        <td>
                            <span class="xu-indicator xu-indicator-delete"
                                  @click="delAlarmInfo(alarmInfo.id)">删除</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-if="alarmInfos.length === 0" class="hint-text">暂无记录</div>
                <div class="xu-text-center">
                    <xu-page-nav :is-shown="alarmInfos.length !== 0"
                                 :size="serverData.size"
                                 :now-page="serverData.number"
                                 :total-elements="serverData.totalElements"
                                 :total-page="serverData.totalPages"
                                 @selectedPage="jumpSelectedPage($event)">
                    </xu-page-nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import XuPageNav from "@/components/CommonComponents/XuComponent/XuPageNav";

  export default {
    name: "AlarmCenter",
    components:{XuPageNav},
    data(){
      return {
        searchInfo:{
          csNumber:''
        },//用来搜索的信息
        serverData:{},//从服务器获取的所有数据
        alarmInfos:[],//存放获取的报警记录
        isSearch:false,//控制分页的内容是否为搜索的结果，默认不是搜索的结果
      }
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
    methods:{
      //1 获取报警记录
      getAlarmInfos: function (page=0) {
        this.isSearch = false;
        this.$Http['alarmCenter']['getAlarmInfos']('',{params:{start:page}})
          .then(res => {
            this.alarmInfos = [];
            this.serverData = res;
            const {content} = res;
            content && content.forEach(ele => {
              this.alarmInfos.push({
                id:ele.id,
                csNumber:ele.device.csNumber,
                alarmInfo:ele.alarmInfo,
                alarmType:ele.alarmType,
                createTime:ele.createTime,
                endTime:ele.endTime
              })
            })
          })
      },
      //2 删除一条报警记录
      delAlarmInfo: function (alarmInfoId) {
        this.$Http['alarmCenter']['delAlarmInfo'](alarmInfoId)
          .then( res => {
            res && this.getAlarmInfos()
          })
      },
      //3.分页器跳转
      jumpSelectedPage:function(selectedPage){
        if (this.isSearch){
          this.searchAlarmInfos(selectedPage-1)
        } else {
          this.getAlarmInfos(selectedPage-1)
        }
      },
      //4.搜索报警记录
      searchAlarmInfos: function (page=0) {
        this.isSearch = true;
        this.$Http['alarmCenter']['searchAlarmInfos']('',{params:{str:this.searchInfo.csNumber,start: page}})
        .then(res => {
          this.alarmInfos = [];
          this.serverData = res;
          const {content} = res;
          content && content.forEach(ele => {
            this.alarmInfos.push({
              id:ele.id,
              csNumber:ele.device.csNumber,
              alarmInfo:ele.alarmInfo,
              alarmType:ele.alarmType,
              createTime:ele.createTime,
              endTime:ele.endTime
            })
          })
        })
      }
    },
    watch:{
      'searchInfo.csNumber':function (value) {
        if (value === ''){
          this.getAlarmInfos()
        }
      }
    },
    created(){
      this.getAlarmInfos()
    }
  }
</script>

<style scoped>

</style>