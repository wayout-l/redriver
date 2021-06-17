import Vue from 'vue'
import router from './router'
import App from './App.vue'

//第三方插件
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'font-awesome/css/font-awesome.min.css'
import { DatePicker } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//自己写的插件
import '@/plugins/XuCSS.css'
import '@/plugins/shareCSS.css'
import commonJS from "@/plugins/commonJS"
import Http from "@/service/Http";
import {store} from "@/store/store";




// import 'babel-polyfill'

Vue.config.productionTip = false;
Vue.prototype.extendJS = commonJS;
Vue.prototype.$Http = Http;
Vue.use(DatePicker)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
