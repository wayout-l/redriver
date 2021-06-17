<template>
    <div class="vue-views-wrapper">
        <account-detail-table>
        </account-detail-table>
        <div class="xu-row mt-integer">
          <div class="xu-col-12">
            <login-record-table></login-record-table>
          </div>
        </div>
        <div class="xu-row mt-integer">
          <div class="xu-col-12">
            <operation-record-table></operation-record-table>
          </div>
        </div>
    </div>
</template>

<script>
  import AccountDetailTable from "@/components/AccountManage/AccountDetailTable";
  import LoginRecordTable from "@/components/AccountManage/LoginRecordTable"
  import OperationRecordTable from "@/components/AccountManage/OperationRecordTable"
  export default {
    name: "AccountManage",
    components: {AccountDetailTable,LoginRecordTable,OperationRecordTable},
  }
</script>

<style scoped>

</style>