<template>
    <div>
        <div class="xubox mb-integer">
            <div class="xubox-title">
                <span>客户公司详情</span>
                <span class="xu-indicator xu-indicator-add xu-float-right" @click="showAddCompanyForm">添加公司</span>
            </div>
            <div class="xubox-content">
                <table class="xu-table xu-table-hover xu-table-center xu-table-strip">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>#ID</th>
                        <th>公司名称</th>
                        <th>公司地址</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="company in companyInfos" :key="company.id">
                        <td>{{company.id}}</td>
                        <td>{{company.name}}</td>
                        <td>{{company.address}}</td>
                        <td>
                            <span class="xu-indicator xu-indicator-delete"
                                  @click="deleteCompanyInfo(company.id)">删除</span>
                            <span class="xu-indicator xu-indicator-edit"
                                  @click="showEditCompanyForm(company)">修改</span>
                            <span class="xu-indicator xu-indicator-check"
                                  @click="showDeviceTable(company)">查看设备</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <device-table-pop-up
            v-if="isDeviceTableShown"
            :company="selectedCompany"
            @close="isDeviceTableShown = false">
        </device-table-pop-up>
        <xu-form v-if="isFormShown"
                 :is-pop-up="true"
                 :form-title="formTitle"
                 :render-data="formRenderData"
                 @submit="submit($event)"
                 @close="isFormShown = false">
        </xu-form>
    </div>
</template>

<script>
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";
  import DeviceTablePopUp from "@/components/BackendManageComp/DeviceTablePopUp";

  export default {
    name: "CompanyManage",
    components:{
      XuForm,
      DeviceTablePopUp
    },
    data:function () {
      return {
        isFormShown:false,//是否显示信息窗口
        isDeviceTableShown:false,//是否显示公司设备管理表格
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedCompany:{},//被选中的公司
        companyInfos:[//存放获取的公司表的信息
          {id:1,name:'重庆大学',address:'沙正街117号'},
          {id:2,name:'重庆大学',address:'沙正街117号'},
          {id:3,name:'重庆大学',address:'沙正街117号'},
          {id:4,name:'重庆大学',address:'沙正街117号'},
          {id:5,name:'重庆大学',address:'沙正街117号'},
          {id:6,name:'重庆大学',address:'沙正街117号'},
        ]
      }
    },
    methods:{
      //1.获取所有客户公司信息
      getCompanyInfos:function () {
        this.$Http['backendManage']['getCompanyInfos']()
          .then( res => {
            this.companyInfos = [];
            // console.log(this.serverData);
            // const { content } = res;
            res.forEach(ele => {
              this.companyInfos.push({id:ele.id,name:ele.name,address:ele.address})
            });
          })
          .catch( error => {})
      },
      //2.显示添加公司表单
      showAddCompanyForm:function () {
        this.formTitle = '添加客户公司信息';
        this.submitType = 0;
        this.formRenderData = [
          {content:'公司名称：',value:'',field:'name'},
          {content:'公司地址：',value:'',field:'address'},
        ];
        this.isFormShown = true
      },
      //3.删除公司信息
      deleteCompanyInfo:function (companyId) {
        this.$Http['backendManage']['delCompanyInfo'](companyId)
          .then( res => {
              res && this.getCompanyInfos();
          })
          .catch(error => {});
      },
      //4.显示修改客户公司信息窗口
      showEditCompanyForm:function(company){
        this.formTitle = '修改客户公司信息';
        this.submitType = 1;
        this.selectedCompany = company;
        this.formRenderData = [
          {content:'公司名称：',value:company.name,field:'name'},
          {content:'公司地址：',value:company.address,field:'address'},
        ];
        this.isFormShown = true
      },
      //5.分页器跳转
      jumpSelectedPage:function(selectedPage){
        this.getCompanyInfos(selectedPage-1)
      },
      //6.显示公司设备管理表格
      showDeviceTable:function(company){
        this.selectedCompany = company;
        this.isDeviceTableShown = true;
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        switch (this.submitType) {
          //添加公司信息
          case 0:
            this.$Http['backendManage']['postCompanyInfo'](formData)
              .then( res => {
                res && this.getCompanyInfos()
              })
              .catch(error => {});
            break;
          //修改公司信息
          case 1:
            formData['id'] = this.selectedCompany.id;
            this.$Http['backendManage']['editCompanyInfo'](formData)
              .then( res => {
                res && this.getCompanyInfos()
              })
              .catch(error => {});
            break;
        }
      }
    },
    created(){
      // this.getCompanyInfos()
    },
    mounted(){
      this.getCompanyInfos()
    }
  }
</script>

<style scoped>

</style>