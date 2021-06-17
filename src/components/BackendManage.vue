<!--后台管理(客户公司)路由界面-->
<template>
    <div class="vue-views-wrapper">
        <company-manage></company-manage>
    </div>
</template>

<script>
  import CompanyManage from "@/components/BackendManageComp/CompanyManage";
  export default {
    name: "BackendManage",
    components: {CompanyManage},
  }
</script>

<style scoped>

</style>