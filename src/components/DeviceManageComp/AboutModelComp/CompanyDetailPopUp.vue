<template>
    <div>
        <xu-modal :shown="true"
                  :header-shown="true"
                  :model-style="{marginTop:'150px',width:'400px'}"
                  @close="close">
            <div slot="header">
                <span>{{title}}-公司详情</span>
            </div>
            <div slot="content">
                <div class="scrollBar-style comp-fix">
                    <table class="xu-table xu-table-hover xu-table-sm xu-table-center">
                        <thead class="bg-info xu-text-white-level0">
                        <tr>
                            <th>公司名称</th>
                            <th>机型数量</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="info in companyInfos">
                            <td>{{info.companyName}}</td>
                            <td>{{info.companyNum}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </xu-modal>
    </div>
</template>

<script>
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  export default {
    name: "CompanyDetailPopUp",
    components: {XuModal},
    props:{
      //0.弹窗标题
      title:{type:String,default:''},
      //1.机型详情列表
      companyInfos:{type:Array,default:() => {return []}},

    },
    methods:{
      //1.关闭事件
      close:function () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
    .comp-fix {

        max-height: 500px;
    }
</style>