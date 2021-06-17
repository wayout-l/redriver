<template>
    <div class="xubox">
        <div class="xubox-title">
            <span>机型-公司概况</span>
        </div>
        <div class="xubox-content">
            <div class="scrollBar-style comp-about-model-table-wrapper">
                <table class="xu-table xu-table-sm xu-table-hover xu-table-strip">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>机型名称</th>
                        <th>公司数量</th>
                    </tr>
                    </thead>
                    <tbody class="comp-about-company-small">
                    <tr v-for="info in companyInfosInModel">
                        <td>{{info.modelName}}</td>
                        <td>
                            <span>{{info.totalCompanyNum}}</span>
                            <span class="xu-indicator xu-indicator-check"
                                  @click="showDetailPopUp(info.modelName,info.companyInfos)"
                                  v-if="info.totalCompanyNum > 0">详情</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <company-detail-pop-up v-if="isDetailPopUpShow"
                               :title="selectedModel"
                               :company-infos="selectedCompanyInfos"
                               @close="isDetailPopUpShow = false">
        </company-detail-pop-up>
    </div>
</template>

<script>
  import CompanyDetailPopUp from "@/components/DeviceManageComp/AboutModelComp/CompanyDetailPopUp";
  export default {
    name: "AboutModel",
    components: {CompanyDetailPopUp},
    props:{
      companyInfosInModel: {
        type:Array,
        default:() => {return []}
      }
    },
    data(){
      return {
        isDetailPopUpShow:false,
        selectedModel:'',
        selectedCompanyInfos:[]
      }
    },
    methods:{
      //1.显示详情弹窗
      showDetailPopUp:function (modelName,companyInfos) {
        this.selectedModel = modelName;
        this.selectedCompanyInfos = companyInfos;
        this.isDetailPopUpShow = true
      }
    }
  }
</script>

<style scoped>
    .comp-about-model-table-wrapper {
        height: 250px;
    }
</style>