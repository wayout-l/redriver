<template>
    <div class="xubox">
    <div class="xubox-title">
      用户操作日志
    </div>
    <div class="xubox-content">
      <table class="xu-table xu-table-center xu-table-hover">
        <thead class="xu-bg-silver">
          <tr>
            <th>用户名</th>
            <th>操作</th>
            <th>操作方法</th>
            <th>请求参数</th>
            <th>请求时长</th>
            <th>操作IP</th>
            <th>操作时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in serverData.content" :key="item.id">
            <td>{{ item.username }}</td>
            <td>{{ item.operation }}</td>
            <td>{{ item.method }}</td>
            <td>{{ item.params }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.ip }}</td>
            <td>{{ item.createDate }}</td>
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
      this.$Http['accountManage']['getOperationRecord']('',{params:{start:page}})
      .then(res => {
        this.serverData = res
      })
      .catch(e => {
        console.log('操作日志数据解析出错')
      })
    },
    //2.跳转到指定的页面
    jumpSelectedPage(page){
      this.getData(page - 1)
    }
  }
}
</script>

<style scoped>

</style>