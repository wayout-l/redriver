<template>
    <div class="xubox">
        <div class="xubox-title">
            <span>设备概况</span>
            <span class="xu-indicator xu-indicator-add xu-float-right" @click="showAddDeviceForm">添加设备</span>
        </div>
        <div class="xubox-content">
            <div style="display:table-cell;vertical-align:middle;">
                <xu-select v-model="selectedField" :options="searchFields">
                </xu-select>
                <span class="comp-input-inter">—</span>
                <xu-select v-if="selectedField === '设备状态'"
                           v-model="selectedValue"
                           :options="['不限','正常','报警','报废']">
                </xu-select>
                <label class="xu-label-text" v-else>
                    <input class="xu-input" type="text" v-model="selectedValue" :placeholder="'请输入'+selectedField">
                </label>
                <button class="xu-btn xu-btn-info ml-integer" @click="searchDevices">搜索</button>
            </div>
            <table class="xu-table xu-table-hover xu-table-center xu-table-strip">
                <thead class="xu-bg-silver">
                <tr>
                    <th>状态</th>
                    <th>设备编号</th>
                    <th>机型名称</th>
                    <th>北斗卡号</th>
                    <th>5G接口</th>
                    <th>公司</th>
                    <th v-if="auth.includes('停止工作') || auth.includes('恢复工作')">启用</th>
                    <th>出厂日期</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="device in deviceInfos" :key="device.id">
                    <td>
                        <span
                            class="xu-badge"
                            :class="{'xu-badge-success':device.status === 1,
                                         'xu-badge-error':device.status === 0,
                                         'xu-badge-warning':device.status === 2}">
                                {{device.status | statusFilter }}
                            </span>
                    </td>
                    <td>{{device.csNumber}}</td>
                    <td>{{device.modelName}}</td>
                    <td>{{device.beidouId}}</td>
                    <td>{{device.ipPort}}</td>
                    <td>{{device.companyName}}</td>
                    <td v-if="auth.includes('停止工作') || auth.includes('恢复工作')">
                        <xu-switch :value="device.rotateStatus | rotateStatusFilter"
                                   :isShowConfirm='true'
                                   @toggle="changeRotateStatus($event,device.id)">
                        </xu-switch>
                    </td>
                    <td>{{device.factoryDate}}</td>
                    <td>
                        <span class="xu-indicator xu-indicator-delete"
                              @click="delDeviceInfo(device.id)">删除</span>
                        <span class="xu-indicator xu-indicator-edit"
                              @click="showEditDeviceForm(device)">修改</span>
                        <span class="xu-indicator xu-indicator-check" 
                              @click="showSingleMonitor(device)" 
                              v-if="auth.includes('单点监控')">单点监控</span>

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
        <single-monitor-pop-up v-if="isSingleMonitorVisible"
                               :device-info="selectedDevice"
                               @close="isSingleMonitorVisible = false">
        </single-monitor-pop-up>
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
  import SingleMonitorPopUp from "@/components/SharePopUp/SingleMonitor/SingleMonitorPopUp";
  import XuPageNav from "@/components/CommonComponents/XuComponent/XuPageNav";
  import XuSelect from "@/components/CommonComponents/XuComponent/XuSelect";
  import XuSwitch from "@/components/CommonComponents/XuComponent/XuSwitch";
  import { XuToastr } from "@/components/CommonComponents/XuComponent/XuToastr/XuToastr";
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";

  
  export default {
    name: "DeviceTable",
    components: {SingleMonitorPopUp,XuPageNav,XuSelect,XuSwitch,XuToastr,XuForm},
    data(){
      return {
        selectedDevice:{},
        isSingleMonitorVisible:false,
        serverData:{},
        deviceInfos:[],
        //用于查询的信息
        searchInfo:{
          csNumberOrFactoryDate:null,//设备编号
          modelName:null,//机型名称
          companyName:null,//公司名称
          factoryDate:null,//出厂日期
          status:null,//设备状态：0：报废 1：正常 2：报警
        },
        //用于搜索的信息
        searchData:[
          {name:'设备编号',field:'csNumberOrFactoryDate'},
          {name:'机型名称',field:'modelName'},
          {name:'公司名称',field:'companyName'},
          {name:'出厂日期',field:'factoryDate'},
          {name:'设备状态',field:'status'},
        ],
        //选择的搜索字段
        selectedField:'设备编号',
        selectedValue:'',
        searchFields:['设备编号','机型名称','公司名称','出厂日期','设备状态'],
        //权限
        auth:this.$store.getters['getLoginInfo']['auth']['buttonAuthList'],
        //所有的机型信息
        modelInfos:[],
        //所有的公司信息
        companyInfos:[],
        isFormShown:false,//是否显示信息窗口
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedDeviceInfo:[]
      }
    },
    filters:{
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
      rotateStatusFilter: function (value) {
        switch (value) {
          case 0:
            return false;
          case 1:
            return true;
          default:
            return true
        }
      },
    },
    methods:{
      //1.显示单点监控界面
      showSingleMonitor:function (device) {
        this.selectedDevice = {
          id:device.id,
          modelName:device.modelName,
          companyName:device.companyName,
          rotateStatus:device.rotateStatus,
        };
        this.isSingleMonitorVisible = true;
      },
      //2.获取数据
      getTableData:function (page=0) {
        this.deviceInfos = [];
        this.$Http['deviceManage']['searchDevices'](this.searchInfo,{},'?start='+page)
        .then(res => {
          // console.log(res);
          // const {devices:tableData} = res;
          // console.log(this.searchInfo)
          this.serverData = res;
          const {content} = res;
          // console.log(content);
          content.forEach(ele => {
            this.deviceInfos.push({
              id:ele.id,
              companyName:ele['company']['name'],
              modelNumber:ele['model']['modelNumber'],
              modelName:ele['model']['modelName'],
              csNumber:ele['csNumber'],
              beidouId:ele['beidouId'],
              factoryDate:ele['factoryDate'],
              status:ele['status'],
              rotateStatus:ele['rotateStatus'],
              ipPort:ele['ipPort'] === null ? '暂无' : ele['ipPort'],
              model:ele['model'],
              company:ele['company'],
              startDate:ele['startDate'],
              scrapTime:ele['scrapTime'] ? ele['scrapTime'].split(' ')[0] : ''
            })
          })
        })
      },
      //3.分页器跳转
      jumpSelectedPage:function(selectedPage){
        this.getTableData(selectedPage-1)
      },
      //4.搜索
      searchDevices:function () {
        //状态还原
        this.searchInfo = {
          csNumberOrFactoryDate:null,
          modelName:null,
          companyName:null,
          factoryDate:null,
          status:null,
        }
        const searchInfo = {field:this.selectedField,value:this.selectedValue};
        let value ='';
        if (searchInfo.field === '设备状态'){
          switch (searchInfo.value) {
            case "报废":
              value = 0;
              break;
            case "正常":
              value = 1;
              break;
            case "报警":
              value = 2;
              break;
            case "不限":
              value = null;
              break;
          }
          searchInfo.value = value;
        }
        this.searchData.forEach(ele => {
          if (ele['name'] === searchInfo.field){
            this.searchInfo[ele['field']] = searchInfo.value;
            this.selectedValue = '';
            this.getTableData()
          }
        });
      },
      //5 停止或者恢复发动机工作
      changeRotateStatus:function (status,deviceId) {
        const tranData = {id:deviceId};
        console.log(`改变发动机状态为${status}`)
        switch (status) {
          case true:
            this.$Http['deviceManage']['enableEngine'](tranData)
              .then(res => {
                // console.log(res)
                if(!res){
                  this.getTableData();
                }
                // this.getTableData();
            }).catch(e => {
              this.getTableData();
            });
            break;
          case false:
            this.$Http['deviceManage']['disableEngine'](tranData)
              .then(res => {
                // console.log(res)
                if(!res){
                  this.getTableData();
                }
                // this.getTableData();
            }).catch(e => {
              this.getTableData();
            });
        }
      },
      //6.删除一台设备
      delDeviceInfo:function(deviceInfoId){
        this.$Http['backendManage']['delDeviceInfo'](deviceInfoId)
          .then( res => {
            res && this.getTableData()
          })
          .catch(error => {});
      },
      //7.获取所有已知机型数据
      getModelInfos:function(){
        this.$Http['dataParse']['getMachineModelInfos']()
          .then(res => {
            this.modelInfos = [];
            res.forEach(ele => {
              this.modelInfos.push({id:ele.id,modelName:ele.modelName,modelNumber:ele.modelNumber})
            })
          })
      },
      //8.获取所有已知公司数据
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
      //9 表单渲染规则
      getFormRules:function(){
        return [
          {field:'scrapTime',limitBy:{field:'status',value:'否',rule:'disable'}},
        ]
      },
      //10.新建一台设备
      showAddDeviceForm:function(){
        const selectModel = this.modelInfos.map(value => 'ID#' + value.id + '—' + value.modelName);
        const companyArray = this.companyInfos.map(value => 'ID#' + value.id + '—' + value.name)
        this.formTitle = '添加设备';
        this.submitType = 0;
        this.formRenderData = [
          {content:'选择公司：',value:'',field:'companyName',additionalInfo:{type:'select',optional:companyArray}},
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
      //11.修改一台设备
      showEditDeviceForm:function(deviceInfo){
        const selectModel = this.modelInfos.map(value => 'ID#' + value.id + '—' + value.modelName);//构造机型信息用于表单的下拉选择
        const companyArray = this.companyInfos.map(value => 'ID#' + value.id + '—' + value.name)
        const isScrap = deviceInfo.status === 0 ? '是':'否';
        this.selectedDeviceInfo = deviceInfo;
        this.formTitle = '修改设备信息';
        this.submitType = 1;
        this.formRenderData = [
          {content:'选择公司：',value:'ID#' + deviceInfo.company.id + '—' + deviceInfo.company.name,field:'companyName',additionalInfo:{type:'select',optional:companyArray}},
          {content:'选择机型：',value:'ID#' + deviceInfo.model.id + '—' + deviceInfo.model.modelName,field:'modelName',additionalInfo:{type:'select',optional:selectModel}},
          {content:'控制系统编号：',value:deviceInfo.csNumber,field:'csNumber'},
          {content:'北斗编号：',value:deviceInfo.beidouId,field:'beidouId',canEmpty:true},
          {content:'出厂日期：',value:deviceInfo.factoryDate,field:'factoryDate',additionalInfo:{type:'date'}},
          {content:'使用时期：',value:deviceInfo.startDate,field:'startDate',additionalInfo:{type:'date'}},
          {content:'是否报废：',value:isScrap,field:'status',additionalInfo:{type:'radio',optional:['是','否']}},
          {content:'报废时间：',value:deviceInfo.scrapTime,field:'scrapTime',additionalInfo:{type:'date'}},
        ];
        this.isFormShown = true
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        const reg= /(\d+)(?=—)/;
        const modelId = formData.modelName.match(reg)[0];
        const companyId = formData.companyName.match(reg)[0];
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
        formData['company'] = {id:companyId};
        switch (this.submitType) {
          //添加设备信息
          case 0:
            // console.log(formData);
            this.$Http['backendManage']['postDeviceInfo'](formData)
              .then( res => {
                res && this.getTableData()
              })
              .catch(error => {});
            break;
          //修改设备信息
          case 1:
            // console.log(formData);
            formData['id'] = this.selectedDeviceInfo.id;
            this.$Http['backendManage']['editDeviceInfo'](formData)
              .then( res => {
                res && this.getTableData()
              })
              .catch(error => {});
            break;
        }
      }
    },
    created(){
      this.getTableData();
      this.getModelInfos();
      this.getCompanyInfos()
    }
  }
</script>

<style scoped>
    .comp-input-inter {
        color: #d4d7de;
        padding: 0 10px;
    }
</style>