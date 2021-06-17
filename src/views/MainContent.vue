<template>
    <div class="main-wrapper">
        <nav class="navbar-default navbar-static-side">
            <ul class="x-nav">
                <li class="nav-header">
                    <img src="../assets/hongjiang_logo.png" alt="" style="width: 150px">
                </li>
                <li v-if="menuList.includes('实时监控')">
                    <router-link tag="a" to="/device-monitor" active-class="active" exact>
                        <span><span class="fa fa-bullseye"/>实时监控</span>
                    </router-link>
                </li>
                <li v-if="menuList.includes('设备管理')">
                    <router-link tag="a" to="/device-manage" active-class="active" exact>
                        <span><span class="fa fa-table"/>设备管理</span>
                    </router-link>
                </li>
                <li v-if="menuList.includes('维修中心')">
                    <router-link tag="a" to="/repair-center" active-class="active" exact>
                        <span><span class="fa fa-briefcase"/>维修中心</span>
                    </router-link>
                </li>
                <li v-if="menuList.includes('报警中心')">
                    <router-link tag="a" to="/alarm-center" active-class="active" exact>
                        <span><span class="fa fa-bell"/>报警中心</span>
                    </router-link>
                </li>
                <li v-if="menuList.includes('数据解析')">
                    <router-link tag="a" to="/data-parse" active-class="active" exact>
                        <span><span class="fa fa-cogs"/>数据解析</span>
                    </router-link>
                </li>
                <li v-if="menuList.includes('客户管理')">
                    <router-link tag="a" to="/backend-manage" active-class="active" exact>
                        <span><span class="fa fa-address-book-o"/>公司管理</span>
                    </router-link>
                </li>
                <li v-if="menuList.includes('角色管理')">
                    <router-link tag="a" to="/role-manage" active-class="active" exact>
                        <span><span class="fa fa-users"/>角色管理</span>
                    </router-link>
                </li>
                <li v-if="menuList.includes('账号管理')">
                    <router-link tag="a" to="/account-manage" active-class="active" exact>
                        <span><span class="fa fa-id-card"/>账号管理</span>
                    </router-link>
                </li>
                <li class="nav-footer" @click="logout()">
                    <a><span><span class="fa fa-sign-out"/>退出</span></a>
                </li>
            </ul>
        </nav>
        <div id="page-wrapper" class="gray-bg">
            <div class="login-duration-wrapper text-right">
                <span><span class="fa fa-clock-o"/> 登录时间：{{ loginTime }}</span>
                <span><span class="fa fa-sun-o"/> 公司：{{ companyName }}</span>
                <span><span class="fa fa-user-o"/> 用户名：{{ username }}</span>
                <span><span class="fa fa-cube"/> 角色：{{ roleName }}</span>
            </div>

            <!--不同菜单栏的入口-->
            <router-view/>

            <div class="row">
                <div class="main-footer">
                    <small class="text-muted">重庆大学微系统研究中心©2019</small>
                    <small class="float-right text-muted">Version 1.0</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {XuAlert} from "@/components/CommonComponents/XuComponent/XuAlert/XuAlert";

  export default {
    name: "MainContent",
    data:function(){
      return {
        loginTime:this.$store.getters['getLoginInfo']['loginTime'],
        username:this.$store.getters['getLoginInfo']['username'],
        roleName:this.$store.getters['getLoginInfo']['roleName'],
        companyName:this.$store.getters['getLoginInfo']['company'],
        menuList:this.$store.getters['getLoginInfo']['auth']['menuList'],
        isClose:false,//是否是页面刷新
      }
    },
    methods:{
      logout:function () {
        let loginTime = new Date(this.loginTime);
        let logoutTime = new Date(this.extendJS.getDate().YYYYMMDDHHMMSS);
        const data = {
          userName:this.username,
          loginTime:this.loginTime,
          onlineTime:logoutTime.getTime() - loginTime.getTime() //单位秒
        };
        this.$Http['loginOut']['postLoginDuration'](data)
        .then(res => {
          const {code,message} = res;
          if (code === 200){
            XuAlert(message);
            sessionStorage.clear();//退出清除所有数据
            this.$router.push('/');
          } else {
            XuAlert('退出失败—' + message,'error')
          }
        })
      },
      test(ev){
        console.log('close page');
        ev.returnValue = '确定关闭';
        return '确定关闭'
      }
    },
    mounted(){
      // window.addEventListener('beforeunload',ev => {
      //   this.test(ev)
      // });
    },
    destroyed(){
      // console.log('destroyed');
      // window.removeEventListener('beforeunload',ev => {
      //   this.test(ev)
      // })
    }
  }
</script>

<style scoped>
    .main-wrapper {
        background-color: #354052;
        width: 100%;
        overflow-x: hidden;
    }
    .navbar-default{
        background-color: transparent;
        border-color: #354052;
    }
    .navbar-static-side{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 220px;
        z-index: 10;
    }
    .x-nav {
        list-style: none;
        display: block;
    }
    #page-wrapper{
        margin: 0 0 0 220px;
        padding: 0 15px 35px 15px;
        position: relative !important;
        /* outline: 1px solid red; */
        min-height: 100vh;
        min-width: 1600px;
    }
    .gray-bg{
        background-color: #edf2f6;
    }
    .main-footer{
        padding: 10px 20px;
        background-color: white;
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .nav-header{
        padding: 33px 0;
        text-align: center;
    }
    .x-nav>li{
        position: relative;
        display: block;
    }
    .x-nav>li>a{
        color:white;
        font-weight: 400;
        position: relative;
        display: block;
        padding: 10px 20px;
        text-decoration: none;
        font-size: 18px;
    }
    .x-nav>li>a:hover{
        background-color: black;
        color: #ffffff;
        cursor: pointer;
    }
    .x-nav>li>a span{
        margin-right: 10px;
    }
    .nav-footer{
        margin-top: 20px;
    }
    .login-duration-wrapper{
        margin-left: -15px;
        margin-right: -15px;
        background-color: #ffffff;
        padding: 5px 15px;
        font-size: 14px;
        font-weight: 100;
        /* outline: 1px solid red; */
    }
    .login-duration-wrapper>span {
        margin-left: 40px;
    }
    .active {
        background-color: black;
    }
</style>