<template>
    <div>
        <div class="xubox mb-integer">
            <div class="xubox-title">
                <span>机型管理</span>
                <span class="xu-indicator xu-indicator-add xu-float-right" @click="showAddMachineModelForm">添加机型</span>
            </div>
            <div class="xubox-content">
                <table class="xu-table xu-table-hover xu-table-center xu-table-strip">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>#ID</th>
                        <th>机型名称</th>
                        <th>机型编号</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="machineModel in machineModelInfos" :key="machineModel.id">
                        <td>{{machineModel.id}}</td>
                        <td>{{machineModel.modelName}}</td>
                        <td>{{machineModel.modelNumber}}</td>
                        <td>
                            <span class="xu-indicator xu-indicator-delete"
                                  @click="delMachineModelInfo(machineModel.id)">删除</span>
                            <span class="xu-indicator xu-indicator-edit"
                                  @click="editMachineModelInfo(machineModel)">修改</span>
                            <span class="xu-indicator xu-indicator-check"
                                  @click="showMachineDataParse(machineModel)">数据解析管理</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <xu-form v-if="isFormShown"
                 :is-pop-up="true"
                 :form-title="formTitle"
                 :render-data="formRenderData"
                 @submit="submit($event)"
                 @close="isFormShown = false">

        </xu-form>
        <machine-data-parse-pop-up :machine-model="selectedMachineModel"
                            @close="isMachineDataParseShown = false"
                            v-if="isMachineDataParseShown">
        </machine-data-parse-pop-up>
    </div>
</template>

<script>
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";
  import MachineDataParsePopUp from "@/components/DataParseComp/MachineDataParsePopUp";
  import {notice} from "@/plugins/toastrConfig";

  export default {
    name: "MachineModelManage",
    components: {XuForm,MachineDataParsePopUp},
    data:function () {
      return {
        isFormShown:false,//是否显示信息窗口
        isMachineDataParseShown:false,//是否显示机型数据解析表
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedMachineModel:{},//被选中的公司
        // serverData:{},//从服务器获取的所有数据
        machineModelInfos:[],////存放获取的机型表的信息
      }
    },
    methods:{
      //1.获取所有机型信息
      getMachineModelInfos: function (page=0) {
        this.$Http['dataParse']['getMachineModelInfos']('',{params:{start:page}})
          .then(res => {
            this.machineModelInfos = [];
            res.forEach(ele => {
              this.machineModelInfos.push({id:ele.id,modelName:ele.modelName,modelNumber:ele.modelNumber})
            })
          })
      },
      //2.显示添加机型信息窗口
      showAddMachineModelForm:function () {
        this.formTitle = '添加机型信息';
        this.submitType = 0;
        this.formRenderData = [
          {content:'机型名称：',value:'',field:'modelName'},
          {content:'机型编号：',value:'',field:'modelNumber'},
        ];
        this.isFormShown = true;
      },
      //3.删除机型
      delMachineModelInfo:function(machineModelId){
        this.$Http['dataParse']['delMachineModelInfo'](machineModelId)
          .then( res => {
            res && this.getMachineModelInfos()
          })
          .catch(error => {});
      },
      //4.修改机型
      editMachineModelInfo:function(machineModel){
        this.formTitle = '修改机型信息';
        this.submitType = 1;
        this.selectedMachineModel = machineModel;
        this.formRenderData = [
          {content:'公司名称：',value:machineModel.modelName,field:'modelName'},
          {content:'公司地址：',value:machineModel.modelNumber,field:'modelNumber'},
        ];
        this.isFormShown = true
      },
      //5.显示机型的数据解析
      showMachineDataParse:function(machineModel){
        this.selectedMachineModel = machineModel;
        this.isMachineDataParseShown = true;
      },

      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        switch (this.submitType) {
          //post事件类型
          case 0:
            this.$Http['dataParse']['postMachineModelInfo'](formData)
              .then( res => {
                res && this.getMachineModelInfos()
              })
              .catch(error => {});
            break;
          case 1:
            formData['id'] = this.selectedMachineModel.id;
            this.$Http['dataParse']['editMachineModelInfo'](formData)
              .then( res => {
                res && this.getMachineModelInfos()
              })
              .catch(error => {});
            break;
        }
      },
    },
    created(){
      this.getMachineModelInfos()
    }
  }
</script>

<style scoped>

</style>