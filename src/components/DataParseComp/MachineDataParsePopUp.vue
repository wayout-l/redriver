<template>
    <div>
        <xu-modal :shown="true"
                  :header-shown="true"
                  :footer-shown="true"
                  :model-style="{marginTop:'150px'}"
                  @close="close">
            <div slot="header">
                <span>#{{machineModel.id}}-{{machineModel.modelName}}的机型数据解析</span>
            </div>
            <div slot="content">
                <table class="xu-table xu-table-sm xu-table-hover min-width-1000">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>#ID</th>
                        <th>名称</th>
                        <th>标识符</th>
                        <th>解析规则</th>
                        <th>起始字节</th>
                        <th>结束字节</th>
                        <th>最小值</th>
                        <th>最大值</th>
                        <th>是否匹配</th>
                        <th>是否显示</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="dataParse in dataParseInfos" :key="dataParse.id">
                        <td>{{dataParse.id}}</td>
                        <td>{{dataParse.dataName}}</td>
                        <td>{{dataParse.dataIdentifier}}</td>
                        <td>{{dataParse.parseRule}}</td>
                        <td>{{dataParse.byteStart}}</td>
                        <td>{{dataParse.byteEnd}}</td>
                        <td>{{dataParse.minValue}}</td>
                        <td>{{dataParse.maxValue}}</td>
                        <td>{{dataParse.isMatch}}</td>
                        <td>{{dataParse.isDisplay}}</td>
                        <td>
                            <span class="xu-indicator xu-indicator-delete"
                                  @click="delDataParseInfo(dataParse.id)">删除</span>
                            <span class="xu-indicator xu-indicator-edit"
                                  @click="showEditDataParseForm(dataParse)">修改</span>
                            <span class="xu-indicator xu-indicator-check"
                                  @click="showDataParseMatch(dataParse)" v-if="dataParse.isMatch === true">查看匹配信息</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer">
                <span class="xu-indicator xu-indicator-add" @click="showAddDataParseForm">添加数据解析</span>
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
        <data-parse-match-pop-up
            v-if="isDataParseMatchShown"
            @close="isDataParseMatchShown = false"
            :data-parse="selectedDataParse">
        </data-parse-match-pop-up>
    </div>
</template>

<script>
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";
  import DataParseMatchPopUp from "@/components/DataParseComp/DataParseMatchPopUp";
  import {notice} from "@/plugins/toastrConfig";

  export default {
    name: "MachineDataParsePopUp",
    components: {XuModal,XuForm,DataParseMatchPopUp},
    props:{
      //1.显示的机型
      machineModel:{
        default:{},
        type:Object,
      }
    },
    data:function () {
      return {
        isFormShown:false,//是否显示信息窗口
        isDataParseMatchShown:false,//是否显示数据解析配置表
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedDataParse:{},//被选中的数据解析
        // serverData:{},//从服务器获取的所有数据
        dataParseInfos:[],//存放获取的数据解析的信息
      }
    },
    methods:{
      //0.表单渲染规则
      getFormRules:function(){
        return [
          {field:'minValue',limitBy:{field:'match',value:'true',rule:'disable'}},
          {field:'maxValue',limitBy:{field:'match',value:'true',rule:'disable'}},
        ]
      },
      //1.关闭事件
      close:function () {
        this.$emit('close')
      },
      //2.获取某一个机型的数据解析表
      getDataParseInfos:function () {
        this.$Http['dataParse']['getDataParseInfos'](this.machineModel.id+'/parses')
          .then(res => {
            this.dataParseInfos = [];
            // this.serverData = res.data;
            res.forEach(ele => {
              this.dataParseInfos.push({
                id:ele.id,
                dataName:ele.dataName,
                dataIdentifier:ele.dataIdentifier,
                parseRule:ele.parseRule,
                byteStart:ele.byteStart,
                byteEnd:ele.byteEnd,
                minValue:ele.minValue,
                maxValue:ele.maxValue,
                isMatch:ele.match,
                isDisplay:ele.display
              });
            })
          })
      },
      //3.显示添加数据解析表单
      showAddDataParseForm:function () {
        this.formTitle = '添加数据解析';
        this.submitType = 0;
        this.formRenderData = [
          {content:'名称：',value:'',field:'dataName'},
          {content:'标识符：',value:'',field:'dataIdentifier'},
          {content:'解析规则：',value:'unsignedShort',field:'parseRule',additionalInfo:{type:'select',optional:['unsignedShort','unsignedInt','float']}},
          {content:'起始字节：',value:'',field:'byteStart',additionalInfo:{type:'number'}},
          {content:'结束字节：',value:'',field:'byteEnd',additionalInfo:{type:'number'}},
          {content:'最小值：',value:'',field:'minValue',additionalInfo:{type:'number'}},
          {content:'最大值：',value:'',field:'maxValue',additionalInfo:{type:'number'}},
          {content:'是否匹配：',value:'true',field:'match',additionalInfo:{type:'radio',optional:['true','false']}},
          {content:'是否显示：',value:'true',field:'display',additionalInfo:{type:'radio',optional:['true','false']}},
        ];
        this.isFormShown = true
      },
      //4.删除一条数据解析
      delDataParseInfo:function (dataParseId) {
        this.$Http['dataParse']['delDataParseInfo'](dataParseId)
          .then(res => {
            res && this.getDataParseInfos()
          })
          .catch(error => {})
      },
      //5.显示修改数据解析表单
      showEditDataParseForm:function(dataParse){
        this.formTitle = '修改数据解析';
        this.submitType = 1;
        this.selectedDataParse = dataParse;
        this.formRenderData = [
          {content:'名称：',value:dataParse.dataName,field:'dataName'},
          {content:'标识符：',value:dataParse.dataIdentifier,field:'dataIdentifier'},
          {content:'解析规则：',value:dataParse.parseRule,field:'parseRule',additionalInfo:{type:'select',optional:['unsignedShort','unsignedInt','float']}},
          {content:'起始字节：',value:dataParse.byteStart,field:'byteStart',additionalInfo:{type:'number'}},
          {content:'结束字节：',value:dataParse.byteEnd,field:'byteEnd',additionalInfo:{type:'number'}},
          {content:'最小值：',value:dataParse.minValue,field:'minValue',additionalInfo:{type:'number'}},
          {content:'最大值：',value:dataParse.maxValue,field:'maxValue',additionalInfo:{type:'number'}},
          {content:'是否匹配：',value:dataParse.isMatch,field:'match',additionalInfo:{type:'radio',optional:['true','false']}},
          {content:'是否显示：',value:dataParse.isDisplay,field:'display',additionalInfo:{type:'radio',optional:['true','false']}},
        ];
        this.isFormShown = true
      },
      //6.查看数据解析的匹配信息
      showDataParseMatch:function(dataParse){
        this.selectedDataParse = dataParse;
        this.isDataParseMatchShown = true;
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        switch (this.submitType) {
          //添加数据解析信息
          case 0:
            formData['model'] = {id:this.machineModel.id};//存在外键的情况下添加数据
            // console.log(formData);
            this.$Http['dataParse']['postDataParseInfo'](formData)
              .then( res => {
                res && this.getDataParseInfos()
              })
              .catch(error => {});
            break;
          //修改数据解析信息
          case 1:
            formData['id'] = this.selectedDataParse.id;
            formData['model'] = {id:this.machineModel.id};//存在外键的情况下修改数据
            // console.log(formData);
            this.$Http['dataParse']['editDataParseInfo'](formData)
              .then( res => {
                res && this.getDataParseInfos()
              })
              .catch(error => {});
            break;
        }
      },
    },
    created(){
      this.getDataParseInfos();
    }
  }
</script>

<style scoped>

</style>