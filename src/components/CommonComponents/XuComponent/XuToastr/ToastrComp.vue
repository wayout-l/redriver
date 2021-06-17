<template>
    <div class="xu-toastr-backdrop" v-if="isShown">
        <div class="xubox fadeIn">
            <div class="xubox-content xu-toastr-wrapper">
                <div class="xu-toastr-icon">
                    <span class="fa fa-warning"></span>
                </div>
                <div class="xu-toastr-content">
                    <span>{{ content }}</span>
                </div>
                <div class="xu-toastr-footer">
                    <button class="xu-btn xu-btn-lg xu-btn-primary mr-integer"
                            @click="confirm">确认</button>
                    <button class="xu-btn xu-btn-lg xu-btn-cancel"
                            @click="cancel">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ToastrComp",
  }
</script>

<style scoped>
    .xu-toastr-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1040;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .xu-toastr-wrapper {
        min-width: 300px;
    }
    .xu-toastr-icon {
        margin: 20px 0 5px 0;
        text-align: center;
        font-size: 60px;
        color: #f48978;
    }
    .xu-toastr-content {
        margin: 5px 0 20px 0;
        text-align: center;
        font-size: 27px;
        color: rgba(0,0,0,0.65);
    }
    .xu-toastr-footer {
        margin: 10px 0;
        text-align: center;
    }
</style>