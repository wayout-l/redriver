<template>
    <div class="xubox">
        <div class="xubox-title">
            <span>账号情况</span>
            <span class="xu-indicator xu-indicator-add xu-float-right" @click="addNewAccount">添加账号</span>
        </div>
        <div class="xubox-content">
            <table class="xu-table xu-table-center xu-table-hover">
                <thead class="xu-bg-silver">
                <tr>
                    <th>#账号ID</th>
                    <th>用户名</th>
                    <th>角色</th>
                    <th>手机号</th>
                    <th>所属公司</th>
                    <th>启用</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="account in accountInfos" :key="account.accountId">
                    <td>{{account.accountId}}</td>
                    <td>{{account.username}}</td>
                    <td>{{account.role.roleName}}</td>
                    <td>{{account.mobile}}</td>
                    <td>{{account.company.companyName}}</td>
                    <td>
                        <xu-switch :value="account.status | statusFilter"
                                   :isShowConfirm='true'
                                   @toggle="enableAccount($event,account)">
                        </xu-switch>
                    </td>
                    <td>{{account.createTime}}</td>
                    <td>
                        <span class="xu-indicator xu-indicator-edit" @click="editAccount(account)">修改</span>
                        <span class="xu-indicator xu-indicator-delete" @click="delAccount(account.accountId)">删除</span>
                        <span class="xu-indicator xu-indicator-basic" @click="showEditPasswordForm(account)">修改密码</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <xu-form v-if="isFormShown"
                 :is-pop-up="true"
                 :form-title="formTitle"
                 :render-data="formRenderData"
                 @submit="submit($event)"
                 @close="isFormShown = false">
        </xu-form>
        <modify-password-pop-up v-if="isPasswordModalShown"
                                @changePsw="changePsw($event)"
                                @close="isPasswordModalShown = false">
        </modify-password-pop-up>
    </div>
</template>

<script>
  import XuSwitch from "@/components/CommonComponents/XuComponent/XuSwitch";
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";
  import ModifyPasswordPopUp from "@/components/AccountManage/ModifyPasswordPopUp";
  export default {
    name: "AccountDetailTable",
    components: {XuSwitch,XuForm,ModifyPasswordPopUp},
    data(){
      return {
        accountInfos:[],//存放账号信息
        optionalRoles:[],//可以选择的角色列表
        optionalCompany:[],//可以选择的公司列表
        isFormShown:false,//是否显示信息窗口
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedAccount:null,//被选中的账号,
        isPasswordModalShown:false
      }
    },
    methods:{
      //1.获取所有账号
      getAccountInfos: function () {
        this.$Http['accountManage']['getAccountInfos']()
          .then(res => {
            this.accountInfos = [];
            // console.log(res);
            res.forEach(ele => {
              const {role,company} = ele;
              this.accountInfos.push({
                accountId:ele.id,
                username:ele.username,
                mobile:ele.mobile,
                status:ele.status,
                role:{
                  roleId:role['id'],
                  roleName:role['roleName']},
                company:{
                  companyId:company['id'],
                  companyName:company['name']},
                createTime:ele.createTime,
              })
            })
          })
      },
      //2.获取所有可以选择的角色列表
      getOptionalRoles:function () {
        this.optionalRoles = [];
        this.$Http['roleManage']['getRoleInfos']()
        .then(res => {
          res.forEach(ele => {
            this.optionalRoles.push({
              roleId:ele['id'],
              roleName:ele['roleName']
            })
          });
          // console.log(this.optionalRoles);
        })
      },
      //3.获取所有可以选择的公司列表
      getOptionalCompany:function () {
        this.optionalCompany = [];
        this.$Http['backendManage']['getCompanyInfos']()
        .then(res => {
          res.forEach(ele => {
            this.optionalCompany.push({
              companyId:ele['id'],
              companyName:ele['name']
            })
          });
          // console.log(this.optionalCompany);
        })
      },
      //4.新建一个账号
      addNewAccount:function () {
        this.formTitle = '新建账号';
        this.submitType = 0;
        this.formRenderData = [
          {content:'用户名：',value:'',field:'username'},
          {content:'密码：',value:'',field:'password'},
          {content:'手机号：',value:'',field:'mobile'},
          {
            content:'选择角色：',
            value:'',
            field:'role',
            additionalInfo:{type:'select',optional:this.optionalRoles.map(value => value['roleName'])}
          },
          {
            content:'选择公司：',
            value:'',
            field:'company',
            additionalInfo:{type:'select',optional:this.optionalCompany.map(value => value['companyName'])}
          }
        ];
        this.isFormShown = true;
      },
      //5.修改一个账号
      editAccount:function(account){
        this.selectedAccount = account;
        // console.log(account);
        this.formTitle = '修改账号信息';
        this.submitType = 1;
        this.formRenderData = [
          {content:'用户名：',value:account['username'],field:'username'},
          // {content:'密码：',value:'null',field:'password'},
          {content:'手机号：',value:account['mobile'],field:'mobile'},
          {
            content:'选择角色：',
            value:account['role']['roleName'],
            field:'role',
            additionalInfo:{type:'select',optional:this.optionalRoles.map(value => value['roleName'])}
          },
          {
            content:'选择公司：',
            value:account['company']['companyName'],
            field:'company',
            additionalInfo:{type:'select',optional:this.optionalCompany.map(value => value['companyName'])}
          }
        ];
        this.isFormShown = true;
      },
      //6.禁用或者启用账号
      enableAccount:function(status,account){
        console.log(status);
        // this.selectedAccount = account;
        const data = {
          id:account['accountId'],
          username: account['username'],
          mobile:account['mobile'],
          status:0,
          role:{id:account['role']['roleId']},
          company:{id:account['company']['companyId']},
        };
        switch (status) {
          case true:
            data['status'] = 1;
            // console.log(data);
            this.$Http['accountManage']['editAccountInfo'](data)
            .then();
            break;
          case false:
            this.$Http['accountManage']['editAccountInfo'](data)
            .then();
            break;
        }
      },
      //7.删除一个账号
      delAccount:function(accountId){
        this.$Http['accountManage']['delAccountInfo'](accountId)
        .then(res => {
          res && this.getAccountInfos();
        })
      },
      //8.显示修改密码表单
      showEditPasswordForm:function(account){
        this.isPasswordModalShown = true;
        this.selectedAccount = account
      },
      //9.修改密码
      changePsw:function(password){
        const data = {
          id:this.selectedAccount['accountId'],
          password:password
        };
        this.isPasswordModalShown = false;
        // console.log(data)
        this.$Http['accountManage']['modifyPassword'](data)
        .then()
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        // console.log(formData);
        for (let i=0;i<this.optionalRoles.length;i++){
          if (this.optionalRoles[i]['roleName'] === formData['role']){
            formData['role'] = {id:this.optionalRoles[i]['roleId']};
            break
          }
        }
        for (let i=0;i<this.optionalCompany.length;i++){
          if (this.optionalCompany[i]['companyName'] === formData['company']){
            formData['company'] = {id:this.optionalCompany[i]['companyId']};
            break
          }
        }
        // formData['menuList'] = fixedMenuList;
        switch (this.submitType) {
          //添加角色
          case 0:
            formData['status'] = 1;
            // console.log(formData);
            this.$Http['accountManage']['postAccountInfo'](formData)
            .then(res => {
              console.log(res);
              res && this.getAccountInfos();
            });
            break;
          //修改角色
          case 1:
            formData['id'] = this.selectedAccount['accountId'];
            formData['status'] = this.selectedAccount['status'];
            console.log(formData);
            this.$Http['accountManage']['editAccountInfo'](formData)
            .then(res => {
              console.log(res)
              res && this.getAccountInfos();
            });
            break;
        }
      }
    },
    filters:{
      statusFilter:function (value) {
        switch (value) {
          case 0:
            return false;
          case 1:
            return true;
          default:
            return true
        }
      }
    },
    created(){
      this.getAccountInfos();
      this.getOptionalRoles();
      this.getOptionalCompany();
    }
  }
</script>

<style scoped>

</style>