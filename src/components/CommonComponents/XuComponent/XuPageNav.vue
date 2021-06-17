<template>
    <div v-if="isShown" class="wrapper">
      <ul class="x-page-nav-wrapper">
        <li class="x-page-item x-page-number"  @click="previousPage">上一页</li>
        <li :class="{'x-page-number':pageNumber !== '...','active':pageNumber === selectPage}"
            class="x-page-item"
            v-for="pageNumber in pageNumbers"
            @click="getPage(pageNumber)">
          {{ pageNumber }}
        </li>
        <li class="x-page-item x-page-number"  @click="nextPage">下一页</li>
        <li class="x-page-item">
          共{{ totalElements }}条记录
        </li>
        <li class="x-page-item">
          <span>跳到第</span>
          <input type="number" v-model="chosenPage" min="1" :max="totalPage" class="choose-page xu-input">
          <span>页</span>
        </li>
        <li class="x-page-item">
          <button class="xu-btn nav-btn" @click="choosePage">确定</button>
        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    name: "XuPageNav",
    props:{
      //1.该组件是否显示，默认不显示
      isShown:{
        type:Boolean,
        default:false,
      },
      //2.每一页有多少元素
      size:{
        type:Number,
      },
      //3.一共多少元素
      totalElements:{
        type:Number,
      },
      //4.一共多少页
      totalPage:{
        type: Number,
      },
      //5.当前页
      nowPage:{
        type: Number,
      }
    },
    data:function () {
      return {
        selectPage:1,//当前选择的页码
        chosenPage:'',//跳转输入的页码
        pageNumbers:[],//分页器显示出来的页码
      }
    },
    methods:{
      // 给定一个范围产生一个序列（包括首尾）
      getArray:function(min,max){
        let array = [];
        let range = max-min;
        if (range < 0) {
          return -1;
        } else {
          for (let i=0;i<=range;i++){
            array[i] = min + i
          }
          return array;
        }
      },
      // 产生用于显示的数字
      initPageNumbers:function () {
        if (this.totalPage <= 6 && this.totalPage >= 1){//最大页码在4页之内
          this.pageNumbers = this.getArray(1,this.totalPage);
        } else if (this.totalPage === 0){
          this.pageNumbers = [0]
        } else { //最大页码超过了6页
          this.pageNumbers = [1,2,3,4,5,'...',this.totalPage];
        }
      },
      //根据选择的页码调整显示的页码
      adjustPageNumbers:function (selectPage) {
        if (this.totalPage >= 7){//只有最大页码大于等于7才会出现这种情况
          if (selectPage === 1 || selectPage === 2 || selectPage === 3){
            this.pageNumbers = [1,2,3,4,5,'...',this.totalPage];
          } else if (selectPage === this.totalPage - 2 || selectPage === this.totalPage - 1 || selectPage === this.totalPage){
            this.pageNumbers = [1,'...',this.totalPage-4,this.totalPage-3,this.totalPage-2,this.totalPage-1,this.totalPage];
          } else {
            this.pageNumbers = [1,'...',selectPage-1,selectPage,selectPage+1,'...',this.totalPage];
          }
        }
      },
      //点击页码跳转
      getPage:function (pageNumber) {
        if (pageNumber !== '...'){
          this.selectPage = pageNumber;
          this.adjustPageNumbers(this.selectPage);
          this.$emit('selectedPage',this.selectPage);
        }
      },
      //点击上一页跳转
      previousPage:function () {
        if (this.selectPage > 1){
          this.selectPage = this.selectPage - 1;
          this.adjustPageNumbers(this.selectPage);
          this.$emit('selectedPage',this.selectPage);
        }
      },
      //点击下一页跳转
      nextPage:function () {
        if (this.selectPage < this.totalPage){
          this.selectPage = this.selectPage + 1;
          this.adjustPageNumbers(this.selectPage);
          this.$emit('selectedPage',this.selectPage);
        }
      },
      //点击页码选择跳转
      choosePage:function () {
        //限定页码的范围才能进行点击
        if (Number(this.chosenPage) > 0 &&
            Number(this.chosenPage) <= this.totalPage &&
            this.selectPage !== Number(this.chosenPage)){
          this.selectPage = Number(this.chosenPage);
          this.adjustPageNumbers(this.selectPage);
          this.chosenPage = '';
          this.$emit('selectedPage',this.selectPage);
        }
      },
      //打印获取的数据--父组件向子组件异步传递数据的测试
      propsData:function () {
        console.log('1.isShown:',this.isShown);
        console.log('2.size:',this.size);
        console.log('3.totalElements:',this.totalElements);
        console.log('4.totalPage:',this.totalPage);
        console.log('5.nowPage:',this.nowPage);
      }
    },
    watch:{
      totalElements:function () {
        this.initPageNumbers();
        this.selectPage = this.nowPage + 1;
      }
    },
  }
</script>

<style scoped>
  .wrapper {
    margin-top: 10px;
    display: inline-block;
  }
  .x-page-nav-wrapper {
    font-size: 12px;
    color:#4d5875;
  }
  .x-page-number {
    border: 1px solid #00a1d6;
    border-radius: 3px;
    margin: 0 5px;
  }
  .x-page-number:hover{
    cursor: pointer;
    background-color: #00a1d6;
  }
  .x-page-item {
    display: inline-block;
    padding: 2px 8px;
    margin: 0 5px;
  }
  .active {
    background-color: #00a1d6;
    color:#ffffff;
  }
  .choose-page {
    width: 45px;
  }
  .nav-btn {
      background-color: #00a1d6;
      color: #ffffff;
      border: 1px solid  #00a1d6;
  }
  .nav-btn:hover{
      background-color: #00a1d6;
      border: 1px solid #00a1d6;
  }
    .hidden {
        visibility: hidden;
    }
</style>
