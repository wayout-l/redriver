<template>
    <div>
        <xu-modal
            :shown="true"
            :header-shown="true"
            :footer-shown="true"
            :model-style="{marginTop:'120px'}"
            @close="close">
            <div slot="header">{{dataParse.dataName}}-配置</div>
            <div slot="content">
                <table class="xu-table xu-table-sm xu-table-hover xu-table-center min-width-800">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>#ID</th>
                        <th>配置数据名称</th>
                        <th>配置值</th>
                        <th>对应信息</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="configInfo in dataMatchInfos" :key="configInfo.id">
                        <td>{{configInfo.id}}</td>
                        <td>{{configInfo.dataName}}</td>
                        <td>{{configInfo.dataValue}}</td>
                        <td>{{configInfo.infoMatch}}</td>
                        <td>
                            <span class="xu-indicator xu-indicator-delete"
                                  @click="delDataMatchInfo(configInfo.id)">删除</span>
                            <span class="xu-indicator xu-indicator-edit"
                                  @click="editDataMatchInfo(configInfo)">修改</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer">
                <span class="xu-indicator xu-indicator-add" @click="showAddDataConfigForm">添加配置信息</span>
            </div>
        </xu-modal>
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
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";

  export default {
    name: "DataParseMatch",
    components: {XuModal,XuForm},
    props:{
      //1.被选中的数据解析
      dataParse: {
        type:Object
      }
    },
    data:function () {
      return {
        isFormShown:false,//是否显示信息窗口
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedMatch:{},//被选中的数据解析配置
        serverData:{},//从服务器获取的所有数据
        dataMatchInfos:[],//存放获取的数据解析配置的信息
      }
    },
    methods:{
      //1.关闭事件
      close:function () {
        this.$emit('close');
      },
      //2.获取某一条数据解析下的所有的配置信息
      getMachineConfigInfos:function () {
        this.$Http['dataParse']['getMachineConfigInfos'](this.dataParse.id+'/matchs')
          .then(res => {
            this.dataMatchInfos = [];
            res.forEach(ele => {
              const {id,dataName,dataValue,infoMatch} = ele;
              this.dataMatchInfos.push({id,dataName,dataValue,infoMatch})
            });
          })
      },
      //3.修改配置信息
      editDataMatchInfo:function (configInfo) {
        this.selectedMatch = configInfo;
        this.formTitle = '修改配置信息';
        this.submitType = 1;
        this.formRenderData = [
          {content:'配置值：',value:configInfo.dataValue,field:'dataValue',additionalInfo:{type:'number'}},
          {content:'对应信息：',value:configInfo.infoMatch,field:'infoMatch'},
        ];
        this.isFormShown = true;
      },
      //4.删除信息配置信息
      delDataMatchInfo:function (id) {
        this.$Http['dataParse']['delMachineConfigInfo'](id)
          .then(res => {
            res && this.getMachineConfigInfos()
          })
          .catch(error => {})
      },
      //5.显示添加数据配置表单
      showAddDataConfigForm:function () {
        this.formTitle = '添加配置信息';
        this.submitType = 0;
        this.formRenderData = [
          {content:'配置值：',value:'',field:'dataValue',additionalInfo:{type:'number'}},
          {content:'对应信息：',value:'',field:'infoMatch'},
        ];
        this.isFormShown = true;
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        switch (this.submitType) {
          //添加数据解析信息
          case 0:
            formData['parse'] = {id:this.dataParse.id};//存在外键的情况下添加数据
            formData['dataName'] = this.dataParse.dataName;
            // console.log(formData);
            this.$Http['dataParse']['postMachineConfigInfo'](formData)
              .then( res => {
                res && this.getMachineConfigInfos()
              })
              .catch(error => {});
            break;
          //修改数据解析信息
          case 1:
            formData['id'] = this.selectedMatch.id;
            formData['dataName'] = this.selectedMatch.dataName;
            formData['parse'] = {id:this.dataParse.id};//存在外键的情况下添加数据
            // console.log(formData);
            this.$Http['dataParse']['editMachineConfigInfo'](formData)
              .then( res => {
                res && this.getMachineConfigInfos()
              })
              .catch(error => {});
            break;
        }
      },
    },
    created(){
      this.getMachineConfigInfos()
    }
  }
</script>

<style scoped>
    .min-width-800 {
        min-width: 800px;
    }
</style>