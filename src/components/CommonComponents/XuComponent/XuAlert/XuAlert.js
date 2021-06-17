
import Vue from 'vue'
import AlertComp from "./AlertComp";

export const XuAlert = function (content,infoStyle='success') {
  const constructor = Vue.extend(AlertComp);
  let inst = new constructor({
    el:document.createElement('div'),
    data(){
      return {
        isShown:true,
        content:content,
        infoStyle:infoStyle
      }
    },
    methods:{
      disappear:function () {
        setTimeout(()=>{
          this.isShown = false;
          document.body.removeChild(inst.$el);
        },2000);
      }
    },
    mounted() {
      // 页面都加载好了，执行disappear函数
      this.disappear()
    },
  });
  // 在最后添加一个子节点
  document.body.appendChild(inst.$el);
};