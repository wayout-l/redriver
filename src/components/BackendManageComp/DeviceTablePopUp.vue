<template>
    <div>
        <xu-modal :header-shown="true"
                  :footer-shown="true"
                  :shown="true"
                  :model-style="{marginTop:'150px'}"
                  @close="close">
            <div slot="header">
                <span>{{company.name}}-设备详情</span>
            </div>
            <div slot="content">
                <table class="xu-table xu-table-sm xu-table-center xu-table-border xu-table-hover xu-table-strip min-width-1300">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>#ID</th>
                        <th>控制系统编号</th>
                        <th>机型名称</th>
                        <th>北斗卡号</th>
                        <th>最后一次在线时刻</th>
                        <th>出厂日期</th>
                        <th>使用日期</th>
                        <th>服务时长</th>
                        <th>报废时间</th>
                        <th>状态</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="deviceInfo in devicesInfos" :key="deviceInfo.id">
                        <td>{{deviceInfo.id}}</td>
                        <td>{{deviceInfo.csNumber}}</td>
                        <td>{{deviceInfo.model.modelName}}</td>
                        <td>{{deviceInfo.beidouId}}</td>
                        <td>{{deviceInfo.lastTime}}</td>
                        <td>{{deviceInfo.factoryDate}}</td>
                        <td>{{deviceInfo.startDate}}</td>
                        <td>{{deviceInfo.serviceLife | serviceLifeFilter}}</td>
                        <td>{{deviceInfo.scrapTime}}</td>
                        <td>
                            <span class="xu-badge"
                                  :class="{'xu-badge-success':deviceInfo.isOnline,'xu-badge-error':deviceInfo.isOnline === false}">
                                {{deviceInfo.isOnline | isOnlineFilter }}
                            </span>
                            <span
                                class="xu-badge"
                                :class="{'xu-badge-success':deviceInfo.status === 1,
                                         'xu-badge-error':deviceInfo.status === 0,
                                         'xu-badge-warning':deviceInfo.status === 2}">
                                {{deviceInfo.status | statusFilter }}
                            </span>
                        </td>
                        <td>{{deviceInfo.createTime}}</td>
                        <td>
                            <span class="xu-indicator xu-indicator-delete"
                                  @click="delDeviceInfo(deviceInfo.id)">删除</span>
                            <span class="xu-indicator xu-indicator-edit"
                                  @click="showEditDeviceForm(deviceInfo)">修改</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="xu-text-center">
                    <xu-page-nav :is-shown="true"
                                 :size="serverData.size"
                                 :now-page="serverData.number"
                                 :total-elements="serverData.totalElements"
                                 :total-page="serverData.totalPages"
                                 @selectedPage="jumpSelectedPage($event)">
                    </xu-page-nav>
                </div>
            </div>
            <div slot="footer">
                <span class="xu-indicator xu-indicator-add" @click="showAddDeviceForm">添加设备</span>
            </div>
        </xu-modal>
        <xu-form v-if="isFormShown"
                 :is-pop-up="true"
                 :form-title="formTitle"
                 :render-data="formRenderData"
                 :rules="getFormRules()"
                 @submit="submit($event)"
                 @close="isFormShown = false">
        </xu-form>
    </div>
</template>

<script>
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  import XuPageNav from "@/components/CommonComponents/XuComponent/XuPageNav";
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";
  import {notice} from "@/plugins/toastrConfig";

  export default {
    name: "DeviceTablePopUp",
    components:{XuModal,XuPageNav,XuForm},
    props:{
      //1.哪个公司
      company:{
        type:Object
      }
    },
    data(){
      return {
        isFormShown:false,//是否显示信息窗口
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedDeviceInfo:{},//被选中的数据解析
        serverData:{},//从服务器获取的所有数据
        devicesInfos:[],//存放获取的公司设备信息
        modelInfos:[],//存放所有机型的信息
      }
    },
    filters:{
      isOnlineFilter:function (value) {
        switch (value) {
          case true:
            return '在线';
          case false:
            return '离线';
          default:
            return '未知'
        }
      },
      statusFilter: function (value) {
        switch (value) {
          case 0:
            return '报废';
          case 1:
            return '正常';
          case 2:
            return '报警';
          default:
            return '未知'
        }
      },
      serviceLifeFilter:function (value) {
        const hours = Math.floor(value / 3600000);
        const minutes = Math.floor(value % 3600000 / 60000);
        return `${hours}h${minutes}min`
      }
    },
    methods:{
      //0 关闭事件
      close:function(){
        this.$emit('close');
      },
      //0.1 表单渲染规则
      getFormRules:function(){
        return [
          {field:'scrapTime',limitBy:{field:'status',value:'否',rule:'disable'}},
        ]
      },
      //1 获取一个公司的所有设备
      getDeviceInfos: function (page=0) {
        this.$Http['backendManage']['getDeviceInfos'](this.company.id + '/devices',{params:{start:page}})
          .then(res => {
            this.devicesInfos = [];
            // console.log(res.data);
            this.serverData = res;
            const {content} = res;
            content.forEach(ele => {
              this.devicesInfos.push({
                id:ele.id,
                csNumber: ele.csNumber,
                beidouId:ele.beidouId,
                factoryDate:ele.factoryDate,
                startDate:ele.startDate,
                serviceLife:ele.serviceLife,
                lastTime:ele.lastTime,
                createTime:ele.createTime,
                scrapTime:ele.scrapTime,
                isOnline:ele.online,
                status:ele.status,
                model:ele.model
              })
            })
          });
        this.$Http['dataParse']['getMachineModelInfos']()
          .then(res => {
            this.modelInfos = [];
            res.forEach(ele => {
              this.modelInfos.push({id:ele.id,modelName:ele.modelName,modelNumber:ele.modelNumber})
            })
          })
      },
      //2.新建一台设备
      showAddDeviceForm:function(){
        const selectModel = this.modelInfos.map(value => 'ID#' + value.id + '—' + value.modelName);
        this.formTitle = '添加设备';
        this.submitType = 0;
        this.formRenderData = [
          {content:'选择机型：',value:'',field:'modelName',additionalInfo:{type:'select',optional:selectModel}},
          {content:'控制系统编号：',value:'',field:'csNumber'},
          {content:'北斗编号：',value:'',field:'beidouId',canEmpty:true},
          {content:'出厂日期：',value:'',field:'factoryDate',additionalInfo:{type:'date'}},
          {content:'使用时期：',value:'',field:'startDate',additionalInfo:{type:'date'}},
          {content:'是否报废：',value:'否',field:'status',additionalInfo:{type:'radio',optional:['是','否']}},
          {content:'报废时间：',value:'',field:'scrapTime',additionalInfo:{type:'date'}},
        ];
        this.isFormShown = true
      },
      //3.修改一台设备
      showEditDeviceForm:function(deviceInfo){
        const selectModel = this.modelInfos.map(value => 'ID#' + value.id + '—' + value.modelName);//构造机型信息用于表单的下拉选择
        const isScrap = deviceInfo.status === 0 ? '是':'否';
        const scrapTime = deviceInfo.scrapTime ? deviceInfo.scrapTime.split(' ')[0] : ''
        this.selectedDeviceInfo = deviceInfo;
        this.formTitle = '修改设备信息';
        this.submitType = 1;
        this.formRenderData = [
          {content:'选择机型：',value:'ID#' + deviceInfo.model.id + '—' + deviceInfo.model.modelName,field:'modelName',additionalInfo:{type:'select',optional:selectModel}},
          {content:'控制系统编号：',value:deviceInfo.csNumber,field:'csNumber'},
          {content:'北斗编号：',value:deviceInfo.beidouId,field:'beidouId',canEmpty:true},
          {content:'出厂日期：',value:deviceInfo.factoryDate,field:'factoryDate',additionalInfo:{type:'date'}},
          {content:'使用时期：',value:deviceInfo.startDate,field:'startDate',additionalInfo:{type:'date'}},
          {content:'是否报废：',value:isScrap,field:'status',additionalInfo:{type:'radio',optional:['是','否']}},
          {content:'报废时间：',value:scrapTime,field:'scrapTime',additionalInfo:{type:'date'}},
        ];
        this.isFormShown = true
      },
      //4.删除一台设备
      delDeviceInfo:function(deviceInfoId){
        this.$Http['backendManage']['delDeviceInfo'](deviceInfoId)
          .then( res => {
            res && this.getDeviceInfos()
          })
          .catch(error => {});
      },

      //5.分页器跳转
      jumpSelectedPage:function(selectedPage){
        this.getDeviceInfos(selectedPage-1)
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        const reg= /(\d+)(?=—)/;
        const modelId = formData.modelName.match(reg)[0];
        if(formData['status'] === '否'){
          formData.status = 1;
          delete formData.scrapTime;
        } else {
          formData.status = 0;
          formData.scrapTime += ' 00:00:00';//修复报废时间，和后端接口对应。
        }
        delete formData.modelName;
        //添加外键信息
        formData['model'] = {id:modelId};
        formData['company'] = {id:this.company.id};
        switch (this.submitType) {
          //添加设备信息
          case 0:
            // console.log(formData);
            this.$Http['backendManage']['postDeviceInfo'](formData)
              .then( res => {
                res && this.getDeviceInfos()
              })
              .catch(error => {});
            break;
          //修改设备信息
          case 1:
            // console.log(formData);
            formData['id'] = this.selectedDeviceInfo.id;
            this.$Http['backendManage']['editDeviceInfo'](formData)
              .then( res => {
                res && this.getDeviceInfos()
              })
              .catch(error => {});
            break;
        }
      }
    },
    created(){
      this.getDeviceInfos()
    }
  }
</script>

<style scoped>
    .min-width-1300 {
        min-width: 1300px;
    }
</style>