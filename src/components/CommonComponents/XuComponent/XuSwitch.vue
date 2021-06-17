<template>
  <div class="xu-swi-wrapper" @click="toggle()" :class="{'on':selValue,'off':!selValue}">
    <span class="toggle-circle"></span>
  </div>
</template>

<script>
  import { XuToastr } from "@/components/CommonComponents/XuComponent/XuToastr/XuToastr";
  export default {
    name: "XuSwitch",
    components:{XuToastr},
    props:{
      //1 v-model必须的传递参数
      value:{
        type:Boolean
      },
      //2 是否需要弹出确认提示框
      isShowConfirm:{
        type:Boolean,
        default:false
      },
      //3 是否需要改变状态的反馈
      feedback:{
        type:Boolean,
        default:true,
      },
      //提示框显示的内容
      tips:{
        type:Array,
        default:() => ['确认启用?','确认停用?']
      }
    },
    data:function () {
      return {
        selValue:this.value,//组件内部选择的值
      }
    },
    methods:{
      toggle(){
        if(!this.isShowConfirm){
          this.operate()
        } else {
          switch (this.selValue){
            case false://原来是false，即将变为true
              XuToastr(this.tips[0],() => {
                this.operate()
              })
              break;
            case true://原来是true，即将变为false
              XuToastr(this.tips[1],() => {
                this.operate()
              })
              break;
          }
        } 
      },
      operate(){
        this.selValue = !this.selValue
        this.$emit('input',this.selValue)
        this.$emit('toggle',this.selValue)
      }
    },
  }
</script>

<style scoped>
  /* .wrapper {
    width: 36px;
    height: 20px;
    border-radius: 11px;
    position: relative;
    display: inline-block;
    padding: 2px;
    box-sizing: border-box;
    cursor: pointer;
    text-align: start;
    vertical-align: text-bottom;
  }
  .switch-on {
    background-color: #1aa6ff;
    transition: background-color 0.2s ease 0s;
  }

  .switch-off {
    background-color: #dcdfe6;
    transition: background-color 0.2s ease 0s;
  }

  .toggle-circle {
    position: absolute;
    display: inline-block;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: #f2f6fc;
  }
  .go-on {
    left: 2px;
    top: 2px;
    transform: translateX(0px);
    transition: transform 0.2s ease 0s;
  }
  .go-off {
    top: 2px;
    transform: translateX(16px);
    transition: transform 0.2s ease 0s;
  } */
  .xu-swi-wrapper{
  display: inline-block;
  position: relative;
  width: 48px;
  height: 24px;
  border-radius: 12px;
  cursor: pointer;
  vertical-align: bottom;
  transition: background-color 0.2s;
  text-align: left;
}
.on {
  background-color: #1aa6ff;
}
.on > .toggle-circle {
  transform: translateX(1px);
}
.off {
  background-color: #999999;
}
.off > .toggle-circle {
  transform: translateX(23px);
}
.toggle-circle {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #eeeeee;
  transition: transform 200ms ease-in 0s;
}
</style>
