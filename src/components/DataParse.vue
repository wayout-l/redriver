<!--数据解析配置路由界面-->
<template>
    <div class="vue-views-wrapper">
        <machine-model-manage></machine-model-manage>
    </div>
</template>

<script>
  import MachineModelManage from "@/components/DataParseComp/MachineModelManage";
  export default {
    name: "DataParse",
    components: {MachineModelManage},
    data:function () {
      return {
      }
    },
  }
</script>

<style scoped>

</style>