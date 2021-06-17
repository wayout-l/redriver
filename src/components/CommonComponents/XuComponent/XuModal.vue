<template>
    <div class="xu-modal-backdrop" v-if="shown" @click.self="close">
        <div class="xu-modal" :class="{fadeIn:shown}" :style="modelStyle">
            <div class="xu-modal-header" :style="headerStyle" v-if="headerShown">
                <div class="modal-title-wrapper">
                    <!--弹出框标题部分-->
                    <slot name="header"><div>这是模态框标题</div></slot>
                </div>
                <div class="close-icon" @click="close">×</div>
            </div>
            <div class="xu-modal-content">
                <!--弹出框主体部分-->
                <slot name="content" >
                    <div>这是模态框内容</div>
                </slot>
            </div>
            <div  class="xu-modal-footer" v-if="footerShown">
                <!--弹出框尾部部分-->
                <slot name="footer">
                    <div>这是模态框尾部</div>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "xu-modal",
    props:{
      //接收数据1：是否显示
      shown:{
        type:Boolean,
        default:false
      },
      //接收数据2：是否显示头部
      footerShown:{
        type: Boolean,
        default: false
      },
      //接收数据3：是否显示尾部
      headerShown:{
        type:Boolean,
        default:false
      },
      //接收数据4：弹框头部样式（改变弹框头部的样式，比如背景）
      headerStyle:{},
      //接收数据5：整体弹窗框样式（用来改变弹窗在页面的位置）
      modelStyle:{}
    },
    methods:{
      close:function () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
    .xu-modal-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1040;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
    .xu-modal {
        border-radius: 5px;
        position: relative;
        background-color: #ffffff;
        margin-top: 250px;
    }
    .xu-modal-header {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        padding: 10px 15px 5px 15px;
        border-bottom: 1px solid #f2f6fc;
    }
    .modal-title-wrapper {
        height: 20px;
        line-height: 20px;
        font-size: 18px;
        display: inline-block;
    }
    .close-icon {
        float: right;
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        color: #c5ccde;
        margin-left: 30px;
        cursor: pointer;
    }
    .close-icon:hover {
        color: #ced5e7;
    }
    .xu-modal-content {
        padding: 10px 15px 5px 15px;
    }
    .xu-modal-footer {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding: 5px 15px 5px 15px;
        border-top: 1px solid #f2f6fc;
    }
</style>
