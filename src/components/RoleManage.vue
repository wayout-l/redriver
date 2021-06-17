<template>
    <div class="vue-views-wrapper">
        <div class="xu-row">
            <div class="xu-col-12">
                <role-detail-table>
                </role-detail-table>
            </div>
        </div>
    </div>
</template>

<script>
  import RoleDetailTable from "@/components/RoleManageComp/RoleDetailTable";
  export default {
    name: "RoleManage",
    components: {RoleDetailTable},
    methods:{

    },
    created(){

    }
  }
</script>

<style scoped>

</style>