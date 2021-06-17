
import Vue from 'vue'
import ToastrComp from "./ToastrComp";


export const XuToastr = function(content,callback) {
  const constructor = Vue.extend(ToastrComp);
  let inst = new constructor({
    el:document.createElement('div'),
    data(){
      return {
        isShown: true,
        content:content
      }
    },
    methods:{
      confirm:function () {
        this.isShown = false;
        document.body.removeChild(inst.$el);
        callback()
      },
      cancel:function () {
        this.isShown = false;
        document.body.removeChild(inst.$el);
      }
    }
  });
  document.body.appendChild(inst.$el);
};

