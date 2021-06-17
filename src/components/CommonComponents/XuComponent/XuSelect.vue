<template>
    <div class="xu-select-wrapper" :style="styleObj">
        <label :class="{'span-shrink':!isSpread,'span-spread':isSpread}" @click="onclick" class="span-area">
            <input type="text" class="xu-select-value"
                   :value="selectValue"
                   @blur="onblur"
                   readonly>
        </label>
        <ul class="xu-select-option-wrapper scrollBar-style slideInDown" v-if="isSpread">
            <!--这里只能使用mousedown事件，使用click事件会导致先执行blur事件而无法选中元素-->
            <li v-for="option in prefixOptions" class="xu-select-option" @mousedown="select(option)">{{ option }}</li>
            <li v-for="option in options" class="xu-select-option" @mousedown="select(option)">{{ option }}</li>
        </ul>

    </div>
</template>

<script>
  export default {
    name: "XuSelect",
    props:{
      //1 使用v-model必须使用的
      value:{
        type:String
      },
      //2 接收可选项
      options:{
        type:Array,
        default:() => []
      },
      //3 可选项的前面添加的东西
      prefixOptions:{
        type:Array,
        default:() => []
      },
      //4 整体样式--控制下拉框的宽度
      styleObj:{
        type:Object
      }
    },

    data(){
      return {
        isSpread:false,
        selectValue:this.value,
      }
    },
    methods:{
      onclick:function() {
        this.isSpread = !this.isSpread;
      },
      select:function (option) {
        this.isSpread = false;
        this.selectValue = option;
        this.$emit('input',option)
      },
      onblur:function () {
        this.isSpread = false;
      }
    }
  }
</script>

<style scoped>
    .xu-select-wrapper {
        position: relative;
        display: inline-block;
        /* max-width: 150px; */
    }
    .xu-select-wrapper .span-area {
        width: 100%;
    }
    .xu-select-wrapper .span-shrink::before {
        content: '\25BC';
        position: absolute;
        padding: 5px 0 6px 0;
        /*line-height: 1;*/
        font-size: 1em;
        top: 0;
        right: 8px;
        bottom: 8px;
        cursor: pointer;
        color: #d4d7de;
        /*border: 1px solid black;*/
        pointer-events: none;/*不让伪元素捕获点击事件，使得事件穿透到下面*/
        transition: transform .3s;
    }
    .xu-select-wrapper .span-spread::before {
        content: '\25BC';
        position: absolute;
        padding: 5px 0 6px 0;
        /*line-height: 1;*/
        font-size: 1em;
        top: 0;
        right: 8px;
        bottom: 8px;
        cursor: pointer;
        color: #d4d7de;
        pointer-events: none;
        /*border: 1px solid black;*/
        transform: rotate(180deg);
        transition: transform .3s;
    }
    .xu-select-wrapper .xu-select-value {
        display: block;
        width: 100%;
        padding: 6px 25px 6px 10px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 1em;
        line-height: 1em;
        cursor: pointer;
    }
    .xu-select-wrapper .xu-select-value:focus {
        outline: none;
        border: 1px solid #48a8ff !important;
        border-radius: 4px;
    }
    .xu-select-wrapper .xu-select-option-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        padding: 5px 0;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        background-color: #ffffff;
        max-height: 200px;
        z-index: 1000;
    }
    .xu-select-wrapper .xu-select-option {
        display: block;
        padding: 0 25px 5px 6px;
        height: 1.8em;
        line-height: 1.8em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .xu-select-wrapper .xu-select-option:hover {
        cursor: pointer;
        background-color: #28a745;
        color: #ffffff;
    }
    /*滚动条样式*/
    .scrollBar-style{
        overflow: auto;
        -ms-scrollbar-face-color: #e3e3e3;/*IE滚动部分的颜色*/
        -ms-scrollbar-track-color: #bcbcbc;/*IE滚动槽部分的颜色*/
    }
    /*webkit样式*/
    .scrollBar-style::-webkit-scrollbar {/*滚动槽部分的样式*/
        width: 5px;
        border-radius: 2px;
        background-color: #e6e6e6;
    }

    .scrollBar-style::-webkit-scrollbar-thumb{/*滚动部分的样式*/
        background-color: #9a9a9a;
        border-radius: 3px;
    }
    .scrollBar-style::-webkit-scrollbar-thumb:hover {
        background-color: #808080;
    }
    .slideInDown {
        transform-origin: center top;
        animation: .15s ease-in slideInDown;
    }
    @keyframes slideInDown {
        0% {
            transform: scaleY(0);
        }
        25% {
            transform: scaleY(0.25);
        }
        50% {
            transform: scaleY(0.5);
        }
        75% {
            transform: scaleY(0.75);
        }
        100% {
            transform: scaleY(1);
        }
    }
</style>