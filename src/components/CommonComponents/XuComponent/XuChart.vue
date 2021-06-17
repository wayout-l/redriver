<template>
    <!-- <div> -->
        <div ref="chart" :style="chartStyle"></div>
    <!-- </div> -->
</template>

<script>
  const echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/pie');
  require('echarts/lib/chart/bar');
  require('echarts/lib/chart/line');
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/legend');
  export default {
    name: "XuChart",
    props:{
      //0.绘图类型
      type:{
        type:String
      },
      //1.接收数据项颜色
      color:{
        type:Array,
        default:() => ['#339ca8','#005eaa','#2b821d','#0098d9','#e6b600','#c12e34'],
      },
      //2.接收图例配置，默认不显示
      legend:{
        type: Object,
        default:() => {return {show:false}}
      },
      //3.配置tooltip
      tooltip:{
        type:Object,
        default:() => {return {trigger: 'item'}}
      },
      //4.配置Y轴
      yAxis:{
        type:Object,
        default:() => {return {type:'value'}}
      },
      //5.配置X轴
      xAxis:{
        type:Object,
        default:() => {return {type:'category'}}
      },
      //6.配置网格
      grid:{
        type:Object,
        default:() => {return  {containLabel: true, left:'15px', right:'15px', top:'15px', bottom:'15px'}}
      },
      //7.数据(不同的图形，传递的数据格式不一样)
      //  格式 {x:[],y:[],y1:[],...}
      data:{
        type:Object,
        default:() => {return {}}
      },
      //8.绘图区高度
      chartStyle:{
        type:Object
      },
      //9.曲线和饼图的系列名称
      seriesName: {
        type:Object,
        default: () => {return {}}
      }
    },
    data:function(){
      return {
        chartOption:{},//绘图的配置项
        chartInst:null,//绘图的实例
      }
    },
    methods:{
      getChartOption:function () {
        let dataset = {};
        let series = [];
        let legend = {};
        let seriesName = this.seriesName;
        // console.log(seriesName.y);
        switch (this.type) {
          //1.目前只有line可以有多个系列
          case 'line':
            dataset['source'] = this.data;
            for(const key in this.data){
              key !== 'x' && series.push({type:'line',encode:{x:'x',y:key},name:seriesName[key]})
            }
            break;
          case 'bar':
            dataset['source'] = {
              'x':this.data['x'],
              'y':this.data['y']
            };
            series[0] = {
              type:'bar',
              encode:{
                x:'x',
                y:'y'
              }
            };
            break;
          case 'pie':
            legend = {
              orient: 'vertical',
              top:15,
              right:15,
              textStyle: {
                fontSize: 13,
              },
              selectedMode: true
            };
            dataset['source'] = {
              'x':this.data['x'],
              'y':this.data['y']
            };
            series[0] = {
              type:'pie',
              radius:['0%','70%'],
              center:['35%','50%'],
              hoverAnimation:false,
              label:{
                formatter:'{d}%'
              },
              encode:{
                itemName:'x',
                value:'y'
              }
            };
            break;
        }
        return {
          color:this.color,
          legend:this.type === 'pie' ? legend :this.legend,
          tooltip: this.tooltip,
          yAxis: this.yAxis,
          xAxis: this.xAxis,
          grid: this.grid,
          dataset:dataset,
          series:series
        }
      }
    },
    mounted(){

      this.chartInst = echarts.init(this.$refs.chart);
      this.chartInst.setOption(this.getChartOption());
      this.chartInst.setOption(this.getChartOption());
      window.addEventListener('resize', () => {
        this.chartInst.resize()
      })
    },
    //当数据更新的时候开始绘图
    watch:{
      data:function () {
        this.chartInst.setOption(this.getChartOption());
      }
    },
  }
</script>

<style scoped>

</style>