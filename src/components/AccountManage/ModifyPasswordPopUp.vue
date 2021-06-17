<template>
    <xu-modal :shown="true"
              :header-shown="true"
              :footer-shown="true"
              :header-style="{backgroundColor:'#00a8b3',color:'#ffffff'}"
              @close="close">
        <div slot="header">
            <span>修改密码</span>
        </div>
        <div slot="content">
            <div class="xu-form-control">
                <label class="xu-label-text">
                    <span>新的密码：</span>
                    <input type="password" class="xu-input" :class="{'xu-illegal-border':!isValidate}" v-model="password">
                </label> 
            </div>
            <div class="xu-form-control">
                <label class="xu-label-text">
                    <span>确认密码：</span>
                    <input type="password" class="xu-input" :class="{'xu-illegal-border':!isValidate}" v-model="passwordAgain">
                </label>
                <p class="xu-illegal-text" v-if="!isValidate">{{ invalidStr }}</p>
            </div>
        </div>
        <div slot="footer">
            <div class="xu-text-center">
                <button class="xu-btn xu-btn-primary mr-integer" @click="submit">确认</button>
                <button class="xu-btn xu-btn-cancel mb-integer" @click="close">取消</button>
            </div>
        </div>
    </xu-modal>
</template>

<script>
  import XuModal from "@/components/CommonComponents/XuComponent/XuModal";
  export default {
    name: "ModifyPasswordPopUp",
    components:{XuModal},
    data(){
      return {
        password:'',
        passwordAgain:'',
        isValidate:true,
        invalidStr:''
      }
    },
    methods:{
      close:function () {
        this.$emit('close')
      },
      submit:function () {
        let reg = /^\w{8,12}$/; //这里边界很重要
        this.isValidate = reg.test(this.password) && this.password === this.passwordAgain;
        if (this.isValidate){//合法
          this.$emit('changePsw',this.password)
        } else {//不合法
          if(this.password !== this.passwordAgain){
            this.invalidStr = '密码前后不一致'
          } else {
            this.invalidStr = '密码只能是8到12位的数字或者字母'
          }
        }
      },

    }
  }
</script>

<style scoped>

</style>