<template>
    <div class="xubox">
        <div class="xubox-title">
            <span>公司-机型概况</span>
        </div>
        <div class="xubox-content">
            <div class="scrollBar-style comp-about-company-table-wrapper">
                <table class="xu-table xu-table-sm xu-table-hover xu-table-strip">
                    <thead class="xu-bg-silver">
                    <tr>
                        <th>公司名称</th>
                        <th>机型数量</th>
                    </tr>
                    </thead>
                    <tbody class="comp-about-company-small">
                    <tr v-for="info in modelInfosInCompany">
                        <td>{{info.companyName}}</td>
                        <td>
                            <span>{{info.totalModelNum}}</span>
                            <span class="xu-indicator xu-indicator-check"
                                  @click="showDetailPopUp(info.companyName,info.modelInfos,info.monthlyModel)"
                                  v-if="info.totalModelNum > 0">详情</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <detail-pop-up v-if="isDetailPopUpShow"
                       :title="selectedCompanyName"
                       :model-infos="selectedModelInfos"
                       :monthly-model="selectedMonthlyModel"
                       @close="isDetailPopUpShow = false">
        </detail-pop-up>
    </div>
</template>

<script>
  import DetailPopUp from "./AboutCompanyComp/ModelDetailPopUp";
  export default {
    name: "AboutCompany",
    components: {DetailPopUp},
    props:{
      modelInfosInCompany: {
        type:Array,
        default:() => {return []}
      }
    },
    data(){
      return {
        isDetailPopUpShow:false,
        selectedCompanyName:'',
        selectedModelInfos:[],
        selectedMonthlyModel:{}
      }
    },
    methods:{
      //1.显示详情弹窗
      showDetailPopUp:function (companyName,modelInfos,monthlyModel) {
        this.selectedCompanyName = companyName;
        this.selectedModelInfos = modelInfos;
        this.selectedMonthlyModel = monthlyModel;
        this.isDetailPopUpShow = true
      }
    }
  }
</script>

<style scoped>
    .comp-about-company-table-wrapper {
        height: 250px;
    }
    .comp-about-company-small {
        font-size: 14px;
    }
</style>