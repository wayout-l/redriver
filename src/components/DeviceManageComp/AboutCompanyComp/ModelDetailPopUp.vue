<template>
    <div>
        <xu-modal :shown="true"
                  :header-shown="true"
                  :model-style="{marginTop:'150px',width:'1000px'}"
                  @close="close">
            <div slot="header">
                <span>{{title}}-机型详情</span>
            </div>
            <div slot="content">
                <div class="xu-row">
                    <div class="xu-col-4">
                        <div class="scrollBar-style comp-fix-height">
                            <table class="xu-table xu-table-hover xu-table-sm xu-table-center">
                                <thead class="xu-bg-silver">
                                <tr>
                                    <th>机型名称</th>
                                    <th>机型数量</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="info in modelInfos">
                                    <td>{{info.modelName}}</td>
                                    <td>{{info.modelNum}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="xu-col-8">
                        <div class="xubox">
                            <div class="xubox-title">
                                <span class="xu-text-level2">月份新增设备统计</span>
                            </div>
                            <div class="xubox-content">
                                <xu-chart :type="'bar'"
                                          :chart-style="{height:'250px'}"
                                          :y-axis="{type:'value',name:'设备数量',nameLocation:'middle',nameGap:25}"
                                          :x-axis="{type:'category'}"
                                          :data="monthlyModel">
                                </xu-chart>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </xu-modal>
    </div>
</template>

<script>
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  import XuChart from "@/components/CommonComponents/XuComponent/XuChart";
  export default {
    name: "DetailPopUp",
    components: {XuModal,XuChart},
    props:{
      //0.弹窗标题
      title:{type:String,default:''},
      //1.机型详情列表
      modelInfos:{type:Array,default:() => {return []}},
      //2.条形图数据
      monthlyModel:{type: Object,default:() => {return {}}}
    },
    methods:{
      //1.关闭事件
      close:function () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
    .comp-fix-height {
        max-height: 300px;
    }
</style>