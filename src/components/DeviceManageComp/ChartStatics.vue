<template>
    <div class="xubox">
        <div class="xubox-title">
            <span>趋势分析</span>
        </div>
        <div class="xubox-content">
            <xu-chart :type="'line'"
                      :legend="{show:true,orient:'vertical',top:5,right:0,textStyle:{fontSize:11}}"
                      :chart-style="{height:'250px'}"
                      :y-axis="{type:'value',name:'设备数量',nameLocation:'middle',nameGap:25}"
                      :x-axis="{type:'category'}"
                      :series-name="{y:'设备总数',y1:'在线设备',y2:'正常设备',y3:'报废设备',y4:'报警设备'}"
                      :data="chartData">
            </xu-chart>
        </div>
    </div>
</template>

<script>
  import XuChart from "@/components/CommonComponents/XuComponent/XuChart";
  export default {
    name: "ChartStatics",
    components:{XuChart},
    props:{
      chartData:{
        type:Object,
        default:() => {}
      }
    },
    data:function () {
      return {

      }
    },
  }
</script>

<style scoped>
    .chart-head {
        padding: 15px 0;
        display: flex;
        justify-content: space-between;
    }
    .chart-body {
        height: 250px;
    }
    #line-chart{
        height: 300px;
    }
    #pie-chart {
        height: 300px;
    }
    .dev-normal{
        color: #0098d9;
    }
    .dev-alert{
        color: #c12e34;
    }
    .chart-title {
        padding: 0 5px;
        font-weight: 600;
    }
    .item-label{
        font-size: 14px;
        font-weight: 100;
        padding-right: 20px;
    }
</style>