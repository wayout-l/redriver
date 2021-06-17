<template>
    <div>
        <div class="row">
            <div class="col-3">
                <div class="statics-info-container dev-total">
                    <span class="statics-icon"><span class="fa fa-desktop"></span></span>
                    <span class="statics-info">
                            <span class="statics-number">
                                {{statisticalData.totalNum }}
                            </span><br>
                            <span class="statics-explain">设备总数</span>
                        </span>
                </div>
            </div>
            <div class="col-3">
                <div class="statics-info-container dev-online">
                        <span class="statics-icon"><span class="fa fa-laptop"></span></span>
                        <span class="statics-info">
                            <span class="statics-number">
                                {{statisticalData.onlineNum }}
                            </span><br>
                            <span class="statics-explain">在线设备数目</span>
                        </span>
                </div>
            </div>
            <div class="col-3">
                <div class="statics-info-container dev-normal">
                    <span class="statics-icon"><span class="fa fa-calendar-check-o"></span></span>
                    <span class="statics-info">
                            <span class="statics-number">
                                {{statisticalData.normalNum }}
                            </span><br>
                            <span class="statics-explain">正常设备数目</span>
                        </span>
                </div>
            </div>
            <div class="col-3">
                <div class="statics-info-container dev-alert">
                    <span class="statics-icon"><span class="fa fa-lightbulb-o"></span></span>
                    <span class="statics-info">
                            <span class="statics-number">
                                {{statisticalData.alarmNum }}
                            </span><br>
                            <span class="statics-explain">报警设备数目</span>
                        </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ECUStaticsInfo",
    props:{
      statisticalData:{
        type:Object,
      }
    },
    data:function () {
      return {

      }
    },
    filters:{
      httpError:function (value) {
        if (value === undefined){
          return '--'
        }
      }
    },
  }
</script>

<style scoped>
    .statics-info-container{
        padding: 10px 30px;
        color: white;
        height:98px;
        border-radius: 5px;
    }
    .statics-icon {
        font-size: 50px;
        float: left;
        line-height: 78px;
    }
    .statics-info{
        float: right;
        display: inline-block;
    }
    .statics-number{
        float: right;
        font-size: 40px;
    }
    .statics-explain{
       float: right;
        font-size: 12px;
    }
    .dev-total {
        background-color: #28a745;
    }
    .dev-online{
        background-color: #1ab394;
    }
    .dev-normal {
        background-color: #23c6c8;
    }
    .dev-alert{
        background-color: #ed5565;
    }
</style>