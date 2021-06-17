<template>
    <div class="vue-views-wrapper">
        <div class="xubox">
            <div class="xubox-title">
                <span>维修记录</span>
            </div>
            <div class="xubox-content">
                <div class="mb-integer xu-text-level3">
                    <label class="xu-label-text">
                        <span>控制系统编号：</span>
                        <input type="text" class="xu-input" v-model="searchInfo.csNumber" placeholder="请输入控制系统编号">
                    </label>
                    <button class="xu-btn xu-btn-info ml-integer"
                            :disabled="searchInfo.csNumber === ''"
                            @click="searchRepairInfos()">搜索</button>
                </div>
                <table class="xu-table xu-table-sm xu-table-border xu-table-center xu-table-hover xu-table-strip">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>#ID</th>
                        <th>控制系统编号</th>
                        <th>零件名称</th>
                        <th>数量</th>
                        <th>类型</th>
                        <th>维修人</th>
                        <th>维修时间</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="repairInfo in repairInfos" :key="repairInfo.id">
                        <td>{{repairInfo.id}}</td>
                        <td>{{repairInfo.csNumber}}</td>
                        <td>{{repairInfo.partsName}}</td>
                        <td>{{repairInfo.partsNumber}}</td>
                        <td>{{repairInfo.replacementType}}</td>
                        <td>{{repairInfo.repairMan}}</td>
                        <td>{{repairInfo.repairDate}}</td>
                        <td>{{repairInfo.remark}}</td>
                        <td>
                            <span class="xu-indicator xu-indicator-delete" @click="delRepairInfo(repairInfo.id)">删除</span>
                            <span class="xu-indicator xu-indicator-edit" @click="showEditForm(repairInfo)">修改</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div v-if="repairInfos.length === 0" class="hint-text">暂无记录</div>
                <div class="xu-text-center">
                    <xu-page-nav :is-shown="repairInfos.length !== 0"
                                 :size="serverData.size"
                                 :now-page="serverData.number"
                                 :total-elements="serverData.totalElements"
                                 :total-page="serverData.totalPages"
                                 @selectedPage="jumpSelectedPage($event)">
                    </xu-page-nav>
                </div>
            </div>
        </div>
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
  import XuPageNav from "@/components/CommonComponents/XuComponent/XuPageNav";

  export default {
    name: "RepairCenter",
    components:{XuForm,XuPageNav},
    data(){
      return {
        searchInfo:{
          csNumber:''
        },//用来搜索的信息
        isFormShown:false,//是否显示信息窗口
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedRepairInfo:{},//被选中的维修记录
        serverData:{},//从服务器获取的所有数据
        repairInfos:[],//存放获取的维修表的信息
        isSearch:false,//控制分页的内容是否为搜索的结果，默认不是搜索的结果
      }
    },
    methods:{
      //1. 获取所有维修记录
      getRepairInfos: function (page=0) {
        this.isSearch = false;
        this.$Http['repairCenter']['getRepairInfos']('',{params:{start:page}})
          .then(res => {
            // console.log(res.data);
            this.repairInfos = [];
            this.serverData = res;
            const {content} = res;
            content && content.forEach(ele => {
              this.repairInfos.push({
                id:ele.id,
                csNumber:ele.device.csNumber,
                did:ele.device.id,
                partsName:ele.partsName,
                partsNumber:ele.partsNumber,
                replacementType:ele.replacementType,
                repairMan:ele.repairman,
                repairDate:ele.repairDate,
                remark:ele.remark,
              })
            })
          })
      },
      //2. 修改维修记录
      showEditForm:function (repairInfo) {
        this.selectedRepairInfo = repairInfo;
        this.formTitle = '修改维修记录';
        this.submitType = 1;
        this.formRenderData = [
          {content:'零件名称：',value:repairInfo.partsName,field:'partsName'},
          {content:'数量：',value:repairInfo.partsNumber,field:'partsNumber',additionalInfo:{type:'number'}},
          {content:'类型：',value:repairInfo.replacementType,field:'replacementType'},
          {content:'维修人：',value:repairInfo.repairMan,field:'repairman'},
          {content:'维修时间：',value:repairInfo.repairDate,field:'repairDate',additionalInfo:{type:'date'}},
          {content:'备注：',value:repairInfo.remark,field:'remark',additionalInfo:{type:'textarea'}},
        ];
        this.isFormShown = true;
      },
      //3. 删除维修记录
      delRepairInfo:function(id){
        this.$Http['repairCenter']['delRepairInfo'](id)
          .then( res => {
            res && this.getRepairInfos()
          })
          .catch(error => {});
      },
      //4.分页器跳转
      jumpSelectedPage:function(selectedPage){
        if (this.isSearch){
          this.searchRepairInfos(selectedPage-1)
        } else {
          this.getRepairInfos(selectedPage-1)
        }
      },
      //5.通过控制系统编号进行搜索
      searchRepairInfos: function(page=0){
        this.isSearch = true;
        this.$Http['repairCenter']['searchRepairInfos']('',{params:{str:this.searchInfo.csNumber,start: page}})
        .then(res => {
          this.repairInfos = [];
          this.serverData = res;
          const {content} = res;
          content && content.forEach(ele => {
            this.repairInfos.push({
              id:ele.id,
              csNumber:ele.device.csNumber,
              did:ele.device.id,
              partsName:ele.partsName,
              partsNumber:ele.partsNumber,
              replacementType:ele.replacementType,
              repairMan:ele.repairman,
              repairDate:ele.repairDate,
              remark:ele.remark,
            })
          })
        })
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        formData['id'] = this.selectedRepairInfo.id;
        formData['device'] = {id:this.selectedRepairInfo.did};
        // console.log(formData)
        this.$Http['repairCenter']['editRepairInfo'](formData)
          .then( res => {
            res && this.getRepairInfos()
          })
          .catch(error => {});
      },
    },
    watch:{
      'searchInfo.csNumber':function (value) {
        if (value === ''){
          this.getRepairInfos()
        }
      }
    },
    created(){
      this.getRepairInfos()
    }
  }
</script>

<style scoped>

</style>