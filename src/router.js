import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import MainContent from "@/views/MainContent";
import {XuAlert} from "@/components/CommonComponents/XuComponent/XuAlert/XuAlert";

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta:{
      title:'登录页'
    }
  },
  {
    path: '/device-monitor',
    component: MainContent,
    children:[
      {
        path:'',
        name:'DeviceMonitorComp',
        component:() => import('./components/DeviceMonitor.vue'),
        meta:{
          title:'实时监控'
        }
      },
      {
        path:'/device-manage',
        name:'DeviceManageComp',
        component:() => import('./components/DeviceManage.vue'),
        meta:{
          title:'设备管理'
        }
      },
      {
        path:'/data-parse',
        component:() => import('./components/DataParse.vue'),
        meta:{
          title:'数据解析'
        }
      },
      {
        path:'/backend-manage',
        component: () => import('./components/BackendManage.vue'),
        meta:{
          title:'客户管理'
        }
      },
      {
        path:'/repair-center',
        component:() => import('./components/RepairCenter.vue'),
        meta:{
          title:'维修中心'
        }
      },
      {
        path:'/alarm-center',
        component:() => import('./components/AlarmCenter.vue'),
        meta:{
          title:'报警中心'
        }
      },
      {
        path:'/role-manage',
        component:() => import('./components/RoleManage.vue'),
        meta:{
          title:'角色管理'
        }
      },
      {
        path:'/account-manage',
        component:() => import('./components/AccountManage.vue'),
        meta:{
          title:'账号管理'
        }
      }
    ]
  }
];



const router = new Router({
  routes: routes
});

//添加导航守卫
router.beforeEach(((to, from, next) => {
  const path = to.path;
  const title = to.meta['title'];
  //如果是登录页，直接进入，并且不执行后续的操作
  if (path === '/'){
    next();
    document.title = title;
    return;
  }

  const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo')) || {auth:{}};
  const { token,auth:{menuList} } = loginInfo;
  // console.log(loginInfo);
  if (token === null ){//是否登录过
    XuAlert('请登录后访问','error');
    next('/')
  } else {
    if (menuList.includes(title)){//是否有权限访问该界面
      document.title = title;
      next()
    } else {
      XuAlert('该账户没有权限访问，请联系管理员','error');
    }
  }

}));

export default router