<template>
    <div class="alert-wrapper fadeIn" v-if="isShown" :class="infoStyle">
        {{ content }}
    </div>
</template>

<script>
  export default {
    name: "AlertComp"
  }
</script>

<style scoped>
    .alert-wrapper {
        text-align: center;
        font-size: 14px;
        padding: 10px;
        border-radius: 5px;
        position: fixed;
        top: 20px;
        left: 0;
        right: 0;
        width: 450px;
        margin: auto;
        z-index: 1100;
    }
    .success {
        background-color: #f0f9eb;
        border: 1px #bff9d3 solid;
        color: #90c156;
    }
    .error {
        background-color: #fef0f0;
        border: 1px #fed1ce solid;
        color: #c18471;
    }
</style>