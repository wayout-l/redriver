<template>
    <div class="main-map-wrapper">
       <div class="row">
           <div class="col-12">
               <div class="info-filter-wrapper clear">
                   <div class="left xu-float-left">
                       <div class="mb-integer">
                           <input type="text" class="xu-input" placeholder="请输入控制系统编号/出厂日期20190812" v-model="searchData.csNumberOrFactoryDate">
                           <label class="xu-label-choose">
                               <input type="checkbox" class="xu-choose xu-checkbox" v-model="searchData.status" :value="2">
                               <span>报警</span>
                           </label>

                       </div>
                       <div>
                           <span>机型名称：</span>
                           <xu-select v-model="searchData.modelName"
                                      :options="modelNamesDropdown"
                                      :prefix-options="['不限']">
                           </xu-select>
                           <span class="ml-integer">公司名称：</span>
                           <xu-select v-model="searchData.companyName"
                                      :style-obj="{width:'220px'}"
                                      :options="companyNamesDropdown"
                                      :prefix-options="['不限']">
                           </xu-select>
                       </div>
                   </div>
                   <div class="right xu-float-right">
                       <button class="xu-btn xu-btn-lg xu-btn-primary" @click="searchDevices">查找</button>
                   </div>
               </div>
               <baidu-map class="map-wrapper"
                          ak="HMsRLrPGidU6hIisM4HYgx0APRKhpm6p"
                          :center="mapCenter"
                          :zoom="mapInitZoom"
                          :scroll-wheel-zoom="true">
                    <!--添加比例尺子组件-->
                   <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{top:'5px',left:'5px'}"></bm-scale>
                   <!--添加缩放控件-->
                   <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-navigation>
                   <!--添加点-->
                   <div v-for="marker in mapDeviceInfos">
                       <bm-marker v-if="marker.isAlert === 1"
                                  :position="marker.coordinate"
                                  :icon="icon.iconNormal"
                                  @mouseover="showInfoWindow($event,marker.infoWindowData)"
                                  @mouseout="closeInfoWindow"
                                  @click="showSingleModal(marker)">

                       </bm-marker>
                       <bm-marker v-else
                                  :position="marker.coordinate"
                                  :icon="icon.iconAlert"
                                  @mouseover="showInfoWindow($event,marker.infoWindowData)"
                                  @mouseout="closeInfoWindow"
                                  @click="showSingleModal(marker)">

                       </bm-marker>
                   </div>
                   <!--信息窗口-->
                   <point-info-window :point-info="propsToInfoWindow" v-if="isInfoWindowVisible"></point-info-window>
               </baidu-map>
               <div class="map-change-wrapper">
                   <button class="btn btn-world" @click.stop="exChangeMap(3,'重庆')" v-show="!isWorldMap"><span class="fa fa-exchange"></span>  世界地图</button>
                   <button class="btn btn-china" @click.stop="exChangeMap(6,'武汉')" v-show="isWorldMap"><span class="fa fa-exchange"></span>  中国地图</button>
               </div>
           </div>
       </div>
       <!--单点监控-->
       <single-monitor-modal @close="closeSingleModal"
                             v-if="isSingleMonitorVisible"
                             :device-info="propsToSingleMonitorModal">
       </single-monitor-modal>
    </div>
</template>

<script>
  import { BaiduMap,BmScale,BmNavigation,BmMarker } from 'vue-baidu-map'
  import SingleMonitorModal from "@/components/SharePopUp/SingleMonitor/SingleMonitorPopUp";
  import PointInfoWindow from "./PointInfoWindow";
  import XuSelect from "@/components/CommonComponents/XuComponent/XuSelect";

  export default {
    name: "MainMap",
    components:{
      PointInfoWindow,
      SingleMonitorModal,
      BaiduMap,
      BmMarker,
      BmScale,
      BmNavigation,
      XuSelect
    },
    props:{
      //1.用来地图上显示的设备
      mapDeviceInfos:{
        type:Array,
        default:() => []
      },
      //2.机型下来列表
      modelNamesDropdown:{
        type:Array,
        default:() => []
      },
      //3.客户公司下拉列表
      companyNamesDropdown:{
        type:Array,
        default:() => []
      }
    },
    data:function () {
      return {
        searchData:{
          csNumberOrFactoryDate:'',
          modelName:'不限',
          companyName:'不限',
          status:[]
        },
        mapInitZoom:6,//缩放等级只能是3到19
        mapCenter:'重庆',
        isWorldMap:false,//是否是世界地图
        isSingleMonitorVisible:false,//是否显示单点监控页面
        isInfoWindowVisible:false,//是否显示地图信息窗口
        propsToSingleMonitorModal:{}, //用于向单点监控界面传递的信息
        propsToInfoWindow:{},//用于向地图信息窗口传递信息
        icon:{//地图坐标点图例
          iconNormal:{
            url: require('@/assets/marker.png'),
            size:{width:20,height:20},
            opts:{
              anchor:{top:0,left:0},
              imageSize:{width:20,height:20}
            }
          },
          iconAlert:{
            url: require('@/assets/markerAlert.png'),
            size:{width:20,height:20},
            opts:{
              anchor:{top:0,left:0},
              imageSize:{width:20,height:20}
            }
          },
        }
      }
    },
    methods:{
      //1.改变地图中心
      exChangeMap:function (level,centerCity) {
        this.mapCenter = centerCity;
        this.mapInitZoom = level;
        level === 3?this.isWorldMap = true:this.isWorldMap = false;
      },
      //2.显示单点监控弹窗
      showSingleModal:function(marker){
        this.propsToSingleMonitorModal = {
          id:marker.id,
          modelName:marker.modelName,
          companyName:marker.companyName,
          rotateStatus:marker.rotateStatus
        };
        this.isSingleMonitorVisible = true;
      },
      //3.关闭单点监控弹窗
      closeSingleModal:function(){
        this.isSingleMonitorVisible = false
      },
      //4.鼠标移到坐标点显示小窗口
      showInfoWindow:function(event,infoWindowData){
        let x = event.clientX;
        let y = event.clientY;
        setTimeout(()=>{
          this.isInfoWindowVisible = true;
          this.propsToInfoWindow = {
            data:infoWindowData,
            x:x,
            y:y,
          }
        },100);
      },
      //5.鼠标移出坐标点关闭小窗口
      closeInfoWindow:function(){
        setTimeout(()=>{
          this.isInfoWindowVisible = false
        },150);
      },
      //6.设备搜索
      searchDevices: function () {
        const result = {
          csNumberOrFactoryDate: this.searchData.csNumberOrFactoryDate === '' ? null : this.searchData.csNumberOrFactoryDate,
          modelName: this.searchData.modelName === '不限' ? null :this.searchData.modelName,
          companyName: this.searchData.companyName === '不限' ? null :this.searchData.companyName,
          status: this.searchData.status.length === 0 ? null : this.searchData.status[0]
        };
        this.$emit('searchInputDone',result);
      },
    },
  }
</script>

<style scoped>
    .main-map-wrapper{
        margin: 15px 0;
        background-color: transparent;
    }
    .map-wrapper {
        height: 725px;
        border: solid 1px white;
        position: relative;
    }
    .info-filter-wrapper {
        position: absolute;
        right: 20px;
        top: 5px;
        border-radius: 3px;
        padding: 20px 10px 15px;
        background-color: #ffffff;
        z-index: 100;
        font-size: 14px;
    }
    .info-filter-wrapper label {
        height: 100%;
        margin: 0;
    }
    .left {
        width: 600px;
        /*outline: 1px solid red;*/
    }
    .left  input[type=text] {
        width: 520px;
        margin-right: 20px;
    }
    .left select{
        width: 225px;
    }
    .right{
        text-align: center;
        padding: 16px 0;
        width: 100px;
        /*outline: 1px solid red;*/
    }
    .map-change-wrapper{
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 10px 30px;
        background-color: transparent;
    }
    .btn-world {
        background-color: #41cac0;
        color: white;
    }
    .btn-world:hover{
        background-color: #39b2a9;
    }
    .btn-china {
        background-color: #58c9f3;
        color: white;
    }
    .btn-china:hover {
        background-color: #53bee6;
    }
</style>