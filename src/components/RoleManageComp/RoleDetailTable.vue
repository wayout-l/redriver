<template>
    <div class="xubox">
        <div class="xubox-title">
            <span>角色情况</span>
            <span class="xu-indicator xu-indicator-add xu-float-right" @click="addNewRole">新增角色</span>
        </div>
        <div class="xubox-content">
            <table class="xu-table xu-table-center xu-table-hover xu-table-strip">
                <thead class="xu-bg-silver">
                <tr>
                    <th>#ID</th>
                    <th>角色名称</th>
                    <th>可查看</th>
                    <th>创建时间</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="role in roleInfos" :key="role.roleId">
                    <td>{{role.roleId}}</td>
                    <td>{{role.roleName}}</td>
                    <td>{{role.menuList}}</td>
                    <td>{{role.createTime}}</td>
                    <td>{{role.remark}}</td>
                    <td>
                        <span class="xu-indicator xu-indicator-edit" @click="editRole(role)">修改</span>
                        <span class="xu-indicator xu-indicator-delete" @click="delRoleInfo(role.roleId)">删除</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <xu-form v-if="isFormShown"
                 :is-pop-up="true"
                 :form-title="formTitle"
                 :render-data="formRenderData"
                 @submit="submit($event)"
                 @close="isFormShown = false">
        </xu-form>
    </div>
</template>

<script>
  import XuForm from "@/components/CommonComponents/XuComponent/XuForm";
  export default {
    name: "RoleDetailTable",
    components: {XuForm},
    data(){
      return {
        roleInfos:[],//存放获取的角色信息
        menuInfos:[],//存放获取的菜单项目
        isFormShown:false,//是否显示信息窗口
        formRenderData:[],//用于表单渲染的数据
        formTitle:'',//信息窗口标题
        submitType:0,//信息窗口提交事件的类型，0-post，1-put
        selectedRole:null,//被选中的角色
      }
    },
    methods:{
      //1.获取所有数据
      getRoleCollectionInfos: function () {
        this.$Http['roleManage']['getRoleInfos']()
          .then(res => {
            this.roleInfos = [];
            // console.log(res);
            res.forEach(ele => {
              const {menuList} = ele;
              this.roleInfos.push({
                roleId:ele['id'],
                roleName:ele['roleName'],
                menuList:menuList.map(value => {return value['id'] +'-'+ value['name']}).join('，') || '无任何权限',
                remark:ele['remark'] || '无',
                createTime:ele['createTime']
              })
            });
            // console.log(this.roleInfos);
          })
      },
      //2.获取所有菜单项目
      getMenuInfos: function () {
        this.menuInfos = [];
        this.$Http['roleManage']['getMenuInfos']()
          .then(res => {
            // console.log(res);
            res.forEach(ele => {
              if (true || ele['type'] === 1){//type表示菜单的类型
                this.menuInfos.push({
                  menuId:ele['id'],
                  menuName:ele['name']
                })
              }
            });
            // console.log(this.menuInfos)
          })
      },
      //3.新建一个角色
      addNewRole:function () {
        // console.log();
        this.formTitle = '添加角色';
        this.submitType = 0;
        this.formRenderData = [
          {content:'角色名称：',value:'',field:'roleName'},
          {content:'权限：',
           value:[],field:'menuList',
           additionalInfo:{type:'checkbox',optional:this.menuInfos.map(value => value['menuName'])}},
          {content:'备注：',value:'无',field:'remark',additionalInfo:{type:'textarea'}},
        ];
        this.isFormShown = true;
      },
      //4.删除一个角色
      delRoleInfo: function(roleId){
        this.$Http['roleManage']['delRoleInfo'](roleId)
        .then(res => {
          res && this.getRoleCollectionInfos()
        })
      },
      //5.修改一个角色
      editRole:function(role){
        // console.log(role['menuList']);
        this.selectedRole = role;
        let menuList;
        if (role['menuList'] === '无任何权限'){
          menuList = []
        } else {
          menuList = role['menuList'].split('，').map(value => value.split('-')[1])
        }
        this.formTitle = '修改角色信息';
        this.submitType = 1;
        this.formRenderData = [
          {content:'角色名称：',value:role['roleName'],field:'roleName'},
          {content:'权限：',
           value:menuList,
           field:'menuList',
           additionalInfo:{type:'checkbox',optional:this.menuInfos.map(value => value['menuName'])},
          },
          {content:'备注：',value:role['remark'],field:'remark',additionalInfo:{type:'textarea'}},
        ];
        this.isFormShown = true;
      },
      //*.信息窗口的提交按钮事件
      submit:function (formData) {
        // console.log(formData['menuList']);
        formData['menuList'] = formData['menuList'].map(value => {
          let menuId = 0;
          this.menuInfos.forEach(ele => {
            if (ele['menuName'] === value){
              menuId = ele['menuId']
            }
          });
          return {id:menuId}
        });
        // formData['menuList'] = fixedMenuList;
        switch (this.submitType) {
          //添加角色
          case 0:
            // console.log(formData);
            this.$Http['roleManage']['postRoleInfo'](formData)
            .then(res => {
              res && this.getRoleCollectionInfos()
            });
            break;
          //修改角色
          case 1:
            console.log(formData);
            formData['id'] = this.selectedRole['roleId'];
            this.$Http['roleManage']['editRoleInfo'](formData)
            .then(res => {
              // console.log(res);
              res && this.getRoleCollectionInfos();
            });
            break;
        }
      }
    },
    created(){
      this.getRoleCollectionInfos();
      this.getMenuInfos();
    }
  }
</script>

<style scoped>

</style>