
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    'loginInfo':JSON.parse(sessionStorage.getItem('loginInfo')),
  },
  getters:{
    getLoginInfo:function(state){
      return state['loginInfo']
    },
  },
  mutations:{
    //#.写入登录页的信息
    addLoginInfo:function(state,payload){
      state['loginInfo'] = payload;
      sessionStorage.setItem('loginInfo',JSON.stringify(payload))
    },
  },
  actions:{

  }
});

export { store }