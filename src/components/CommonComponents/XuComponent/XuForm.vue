<template>
    <div>
        <xu-modal :shown="true"
                  :header-shown="true"
                  :footer-shown="true"
                  @close="close"
                  :header-style="{backgroundColor:'#00a8b3',color:'#ffffff'}"
                  v-if="isPopUp">
            <span slot="header">{{ formTitle }}</span>
            <div slot="content" class="xu-text-level3">
                <div v-for="formItem in renderData">
                    <!--1.type=radio-->
                    <div class="xu-form-control" v-if="formItem.additionalInfo && formItem.additionalInfo.type === 'radio'">
                        <span class="fix-width-100">{{ formItem.content }}</span>
                        <label class="xu-label-choose mr-integer" v-for="option in formItem.additionalInfo.optional">
                            <input type="radio" class="xu-choose xu-radio" :value="option" v-model="formItem.value">
                            <span>{{ option }}</span>
                        </label>
                    </div>
                    <!--2.type=number-->
                    <div class="xu-form-control" v-else-if="formItem.additionalInfo && formItem.additionalInfo.type === 'number'">
                        <label class="xu-label-text">
                            <span class="fix-width-100">{{ formItem.content }}</span>
                            <input type="number" class="xu-input" v-model="formItem.value"
                                   :disabled="rules.length !== 0 && applyFormRules(formItem.field)">
                        </label>
                    </div>
                    <!--2.select-->
                    <div class="xu-form-control" v-else-if="formItem.additionalInfo && formItem.additionalInfo.type === 'select'">
                        <label class="xu-label-text">
                            <span class="fix-width-100">{{ formItem.content }}</span>
                            <select v-model="formItem.value" class="xu-input">
                                <option v-for="option in formItem.additionalInfo.optional">
                                    {{ option }}
                                </option>
                            </select>
                        </label>
                    </div>
                    <!--3.textarea-->
                    <div class="xu-form-control" v-else-if="formItem.additionalInfo && formItem.additionalInfo.type === 'textarea'">
                        <label class="xu-label-text">
                            <span class="fix-width-100">{{ formItem.content }}</span>
                            <textarea type="text" v-model="formItem.value" class="xu-textarea"
                                      :disabled="rules.length !== 0 && applyFormRules(formItem.field)">
                            </textarea>
                        </label>
                    </div>
                    <!--3.type=date-->
                    <div class="xu-form-control" v-else-if="formItem.additionalInfo && formItem.additionalInfo.type === 'date'">
                        <label class="xu-label-text">
                            <span class="fix-width-100">{{ formItem.content }}</span>
                            <input type="date" class="xu-input" v-model="formItem.value"
                                   :disabled="rules.length !== 0 && applyFormRules(formItem.field)" placeholder="2020-03-04">
                        </label>
                    </div>
                    <!--4.type=checkbox-->
                    <div class="xu-form-control clear" v-else-if="formItem.additionalInfo && formItem.additionalInfo.type === 'checkbox'">
                        <div class="checkbox-left">
                            <span>{{ formItem.content }}</span>
                        </div>
                        <div class="checkbox-right">
                            <label class="xu-label-choose mr-integer" v-for="option in formItem.additionalInfo.optional">
                                <input type="checkbox" class="xu-choose xu-checkbox" :value="option" v-model="formItem.value">
                                <span>{{ option }}</span>
                            </label>
                        </div>
                    </div>
                    <!--*.type=text-->
                    <div class="xu-form-control" v-else>
                        <label class="xu-label-text">
                            <span class="fix-width-100">{{ formItem.content }}</span>
                            <input type="text" class="xu-input" v-model="formItem.value"
                                   :disabled="rules.length !== 0 && applyFormRules(formItem.field)">
                        </label>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="xu-text-center">
                    <button class="xu-btn xu-btn-primary mr-integer" @click="submit">确认</button>
                    <button class="xu-btn xu-btn-cancel mb-integer" @click="close">取消</button>
                </div>
            </div>
        </xu-modal>
        <div v-else>

        </div>
    </div>
</template>

<script>
  import XuModal from "./XuModal";
  import {XuAlert} from "@/components/CommonComponents/XuComponent/XuAlert/XuAlert";

  export default {
    name: "XuForm",
    components: {XuModal},
    props:{
      //接收数据1：是否是弹出式，默认为否
      isPopUp:{
        default:false,
        type:Boolean
      },
      //接收数据2：表单标题
      formTitle:{
        default: '表单',
        type: String
      },
      //接收数据3：要渲染的表单数据【重要】
      //格式：[{content:'是否匹配：',value:'true',field:'match',additionalInfo:{type:'radio',optional:['true','false']},canEmpty:undefined}]
      //canEmpty如果为undedined或者为false表示非空
      renderData:{
        default:() => {return [{content:'默认',value:'',field:'',canEmpty:false}]},
        type:Array
      },
      //接收数据4：表单禁用启用规则
      //格式：[{field:'minValue',limitBy:{field:'match',value:'true',rule:'disable'}}]
      rules:{
        default:() => {return []},
        type:Array
      },
      //接收数据5：表单验证规则
      //格式：[{content:'公司名称：',field:'name',isPassAuth:function (value) {return value === 'a';},failAuthMsg:'公司名称不符合要求'}]
      authRules:{
        default:() => {return []},
        type:Array
      },
    },
    data:function(){
      return {

      }
    },
    methods:{
      //1.关闭事件
      close:function () {
        this.$emit('close')
      },
      //2.确认按钮事件
      submit:function () {
        let hasFormEmpty = false;
        const formData = {};
        const canEmptyMap = {};//用来存放表单是否可以为空
        this.renderData.forEach(ele => {
          formData[ele.field] = ele.value;
          canEmptyMap[ele.field] = ele.canEmpty ? true : false
        });

        //1.表单中是否有空值
        for (const key in formData){
          if (!this.applyFormRules(key) && formData[key] === '' && !canEmptyMap[key]){
            hasFormEmpty = true;
            break;
          }
        }
        if (!hasFormEmpty){
          //2 如果没有空值,检验是否合法
          const rulesLen = this.authRules.length;
          let invalid = true;
          for(const key in formData){
            for (let i=0;i<rulesLen;i++){
              if (key === this.authRules[i].field && !this.authRules[i]['isPassAuth'](formData[key])){
                invalid = false;
                XuAlert(this.authRules[i]['failAuthMsg'],'error');
                break;
              }
            }
            if (!invalid){
              break;
            }
          }
          if (invalid){
            // console.log(formData)
            this.$emit('submit',formData);
            this.$emit('close');
          }
        } else {
          XuAlert('请完成所有内容再提交~','error')
        }

      },
      //3.应用表单规则--该字段被禁用返回true
      applyFormRules:function (field) {
        for (let i=0;i<this.rules.length;i++){
          let fieldLimited = this.rules[i].field;
          let fieldToLimit = this.rules[i].limitBy.field;
          let fieldToLimitValue = this.rules[i].limitBy.value;
          let valueLimitedIndex;
          let result = false;
          if (field === fieldLimited) {
            for (let j=0;j<this.renderData.length;j++){
              if (this.renderData[j].field === fieldLimited){
                valueLimitedIndex = j;
                break;
              }
            }
            for (let j=0;j<this.renderData.length;j++){
              if (this.renderData[j].field === fieldToLimit){
                if (String(this.renderData[j].value) === fieldToLimitValue){
                  this.renderData[valueLimitedIndex].value = '';
                  result = true;
                  break;
                }
              }
            }
            return result;
          }
        }
        return false;
      }
    }
  }
</script>

<style scoped>
    .fix-width-100 {
        display: inline-block;
        width: 100px;
        text-align: right;
    }
    .checkbox-left {
        float: left;
        display: inline-block;
        width: 100px;
        text-align: right;
        padding: 5px 0;
    }
    .checkbox-right {
        float: right;
        display: inline-block;
        width: 200px;
    }
</style>