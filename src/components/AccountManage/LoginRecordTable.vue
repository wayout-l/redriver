<template>
  <div class="xubox">
    <div class="xubox-title">
      登录日志
    </div>
    <div class="xubox-content">
      <table class="xu-table xu-table-center xu-table-hover">
        <thead class="xu-bg-silver">
          <tr>
            <th>用户名</th>
            <th>登录时间</th>
            <th>在线时长</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in serverData.content" :key="item.id">
            <td>{{ item.userName }}</td>
            <td>{{ item.loginTime }}</td>
            <td>{{ item.onlineTime | msFilter }}</td>
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
  </div>
</template>

<script>
import XuPageNav from "@/components/CommonComponents/XuComponent/XuPageNav";
export default {
  components:{XuPageNav},
  data(){
    return {
      serverData:{}
    }
  },
  created(){
    this.getData()
  },
  methods:{
    //1.获取登录日志的分页器数据
    getData(page=0){
      this.$Http['accountManage']['getUserLoginRecord']('',{params:{start:page}})
      .then(res => {
        this.serverData = res
      })
      .catch(e => {
        console.log('登录日志数据解析出错')
      })
    },
    //2.跳转到指定的页面
    jumpSelectedPage(page){
      this.getData(page - 1)
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
  }
}
</script>

<style scoped>

</style>>

