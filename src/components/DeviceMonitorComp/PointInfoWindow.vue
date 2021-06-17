<template>
    <div class="info-window-wrapper">
        <div class="explain-container">
            <div class="left">
                <p>设备控制系统编号：</p>
                <p>北斗卡号：</p>
                <p>5G接口：</p>
                <p>状态：</p>
            </div>
            <div class="right">
                <p>{{ pointInfo.data.csNumber }}</p>
                <p>{{ pointInfo.data.beidouId  }}</p>
                <p>{{ pointInfo.data.ipPort  }}</p>
                <p>{{ pointInfo.data.status  }}</p>
            </div>
        </div>
        <div class="data-container">
            <div class="data-item">
                <p>转速</p>
                <p>{{ pointInfo.data.rotateSpeed + 'rpm' }}</p>
            </div>
            <div class="data-item">
                <p>滑油压力</p>
                <p>{{ pointInfo.data.greasePressure + 'kpa' }}</p>
            </div>
            <div class="data-item">
                <p>冷却水</p>
                <p>{{ pointInfo.data.coolingWater + '℃' }}</p>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "PointInfoWindow",
    props:{
      pointInfo:Object
    },
    data(){
      return {

      }
    },
    mounted(){
      let div = document.getElementsByClassName('info-window-wrapper')[0];
      div.style.top = this.pointInfo.y + 'px';
      div.style.left = this.pointInfo.x + 'px';
    }
  }
</script>

<style scoped>
    .info-window-wrapper {
        position: fixed;
        background-color: #ffffff;
        border: 1px solid #cccccc;
        padding: 14px 10px;
        font-size: 14px;
        border-radius: 5px;
    }
    .explain-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .left {
        text-align: right;
    }
    .data-container {
        display: flex;
        justify-content: space-between;
    }
    .data-item {
        padding: 5px 0;
        text-align: center;
        min-width: 75px;
        background-color: #53bee6;
        color: white;
        border-radius: 5px;
    }
    .alert {
        color: #ed5565;
    }
    .normal {
        color: #23c6c8;
    }
</style>