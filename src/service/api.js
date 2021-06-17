
const API = {
  //PopUp01、单点监控部分
  singleMonitor:{
    //1 获取整体所有数据
    getSingleDeviceCollectionInfos:{
      method:'get',
      url:'/forSingleDevice/' // '/forSingleDevice/{did}'
    },
    //2 获取某一台设备的历史维修记录
    getOneDeviceRepairInfos:{
      method:'get',
      url:'/devices/' // '/devices/{device_id}/repairs'
    },
    //3 获取一台设备的所有报警记录
    getDeviceAlarmInfos:{
      method:'get',
      url:'/devices/' // '/devices/{device_id}/alarms'
    },
    //4 创建一条维修记录
    postRepairInfo:{
      method:'post',
      url:'/repairs'
    },
    //5 使发动机停止工作
    disableEngine:{
      method:'put',
      url:'/forDeviceWorkS'
    },
    //6 使发动机恢复工作
    enableEngine:{
      method:'put',
      url:'/forDeviceWorkR'
    },
    //7 导出为excel表
    exportExcel:{
      method:'post',
      url:'/exportExcel'
    }
  },
  //#、退出登录部分
  loginOut:{
    //1.上传退出登录时的相关信息
    postLoginDuration:{
      method:'post',
      url:'/logout'
    }
  },
  //一、实时监控部分
  deviceMonitor:{
    //1 获取整体所有数据
    getCollection:{
      method:'get',
      url:'/forehome'
    },
    //2 搜索功能
    searchDevices:{
      method:'post',
      url:'/foresearch'
    }
  },
  //二、设备管理界面
  deviceManage:{
    //1.获取设备管理界面的所需数据
    getCollectionInfos:{
      method:'get',
      url:'/forDeviceManagement'
    },
    //2.获取表格中的数据
    getTableData:{
      method:'get',
      url:'/forDeviceManagementSearch'
    },
    //3.搜索功能
    searchDevices: {
      method:'post',
      url:'/forDeviceManagementSearch'
    },
    //4 使发动机停止工作
    disableEngine:{
      method:'put',
      url:'/forDeviceWorkS'
    },
    //5 使发动机恢复工作
    enableEngine:{
      method:'put',
      url:'/forDeviceWorkR'
    },
  },
  //三、后台管理部分
  backendManage:{
    //1.获取所有客户公司信息
    getCompanyInfos:{
      method:'get',
      url:'/companys'
    },

    //2.获取客户公司信息
    getCompanyInfo:{
      method:'get',
      url:'/companys/' //'/companys/{id}'
    },

    //3.提交一份客户公司信息
    postCompanyInfo:{
      method:'post',
      url:'/companys'
    },

    //4.删除客户公司信息
    delCompanyInfo:{
      method:'delete',
      url:'/companys/' //'/companys/{id}'
    },

    //5.编辑客户公司信息
    editCompanyInfo:{
      method:'put',
      url:'/companys'
    },

    //6.获取某一公司的所有设备
    getDeviceInfos:{
      method:'get',
      url:'/companys/' // '/companys/{cid}/devices'
    },

    //7.获取某一台设备
    getDeviceInfo:{
      method:'get',
      url:'/devices/', // '/devices/{id}'
    },

    //8.提交一台设备信息
    postDeviceInfo:{
      method:'post',
      url:'/devices',
    },

    //9.删除一台设备信息
    delDeviceInfo:{
      method:'delete',
      url:'/devices/' // '/devices/{id}'
    },

    //10.修改一台设备
    editDeviceInfo:{
      method:'put',
      url:'/devices',
    }
  },
  //四、数据解析部分
  dataParse:{
    //1.获取所有机型
    getMachineModelInfos:{
      method:'get',
      url:'/models'
    },

    //2.获取机型
    getMachineModelInfo:{
      method:'get',
      url:'/models/' //'/models/{id}'
    },

    //3.提交一份机型数据
    postMachineModelInfo:{
      method:'post',
      url:'/models'
    },

    //4.删除一份机型数据
    delMachineModelInfo:{
      method:'delete',
      url:'/models/', //'/models/{id}'
    },

    //5.编辑一份机型数据
    editMachineModelInfo:{
      method:'put',
      url:'/models'
    },

    //6.获取某一机型的数据解析表
    getDataParseInfos:{
      method:'get',
      url:'/models/' //'/models/{model_id}/parses'
    },
    //7.获取某一条机型解析数据
    getDataParseInfo:{
      method:'get',
      url:'/parses/' //'/models/{id}'
    },
    //8.提交一条机型解析数据
    postDataParseInfo:{
      method:'post',
      url:'/parses'
    },
    //9.删除某一条机型解析数据
    delDataParseInfo:{
      method:'delete',
      url:'/parses/' //'/parses/{id}'
    },
    //10.修改一条机型解析数据
    editDataParseInfo:{
      method:'put',
      url:'/parses'
    },

    //11.获取某一条数据解析下的所有的配置信息
    getMachineConfigInfos:{
      method:'get',
      url:'/parses/' //'/parses/{pid}/matchs'
    },
    //12.获取某一条配置信息
    getMachineConfigInfo:{
      method:'get',
      url:'/matchs/' // '/matchs/{id}'
    },
    //13.提交一条配置信息
    postMachineConfigInfo:{
      method:'post',
      url:'/matchs'
    },
    //14.删除某一条配置信息
    delMachineConfigInfo:{
      method:'delete',
      url:'/matchs/' // '/matchs/{id}'
    },
    //15.修改一条配置信息
    editMachineConfigInfo:{
      method:'put',
      url:'/matchs'
    },
  },
  //五、维修中心部分
  repairCenter:{
    //1 获取某一设备的所有维修记录
    getOneDeviceRepairInfos:{
      method:'get',
      url:'/devices/' // '/devices/{device_id}/repairs'
    },
    //2 获取所有维修记录
    getRepairInfos:{
      method:'get',
      url:'/repairs'
    },
    //3 获取一条维修记录
    getRepairInfo:{
      method:'get',
      url:'/repairs/' // '/repairs/{id}'
    },
    //4 提交一条维修记录
    postRepairInfo:{
      method:'post',
      url:'/repairs'
    },
    //5 删除一条维修记录
    delRepairInfo:{
      method:'delete',
      url:'/repairs/', // '/repairs/{id}'
    },
    //6 修改一条维修记录
    editRepairInfo:{
      method:'put',
      url:'/repairs'
    },
    //7 通过控制系统编号搜索维修记录
    searchRepairInfos:{
      method:'get',
      url:'/devices/repairs'
    }
  },
  //六、报警中心
  alarmCenter:{
    //1 获取所有设备的报警记录
    getAlarmInfos:{
      method:'get',
      url:'/alarms',
    },
    //2 获取一条报警记录
    getAlarmInfo:{
      method:'get',
      url:'/alarms/' // '/alarms/{id}'
    },
    //3 获取一台设备的所有报警记录
    getDeviceAlarmInfos:{
      method:'get',
      url:'/devices/' // '/devices/{device_id}/alarms'
    },
    //4 删除一条报警记录
    delAlarmInfo:{
      method:'delete',
      url:'/alarms/' // '/alarms/{id}'
    },
    //5 通过控制系统编号搜索报警记录
    searchAlarmInfos:{
      method:'get',
      url:'/devices/alarms'
    }
  },
  //七、角色管理部分
  roleManage:{
    //1.获取所有角色数据
    getRoleInfos:{
      method:'get',
      url:'/roles'
    },
    //2.获取所有菜单信息
    getMenuInfos:{
      method:'get',
      url:'/menus'
    },
    //3.新建一个角色
    postRoleInfo:{
      method:'post',
      url:'/roles'
    },
    //4.删除一个角色
    delRoleInfo:{
      method:'delete',
      url:'/roles/' // /roles/{id}
    },
    //5.修改一个角色
    editRoleInfo:{
      method:'put',
      url:'/roles'
    },
    //6.获得单个角色
    getRoleInfo:{
      method:'get',
      url:'/roles/' // /roles/{id}
    }
  },
  //八、账号管理部分
  accountManage:{
    //1.获取整体数据
    getAccountInfos:{
      method:'get',
      url:'/users'
    },
    //2.新建一个账号
    postAccountInfo:{
      method:'post',
      url:'/users'
    },
    //3.删除一个账号
    delAccountInfo:{
      method:'delete',
      url:'/users/' // /users/{id}
    },
    //4.修改一个账号
    editAccountInfo:{
      method:'put',
      url:'/users'
    },
    //5.获得一个账号
    getAccountInfo:{
      method:'get',
      url:'/users/' // /users/{id}
    },
    //6.修改密码
    modifyPassword:{
      method:'post',
      url:'/users/psw'
    },
    //7.获取登录日志信息
    getUserLoginRecord:{
      method:'get',
      url:'/userLoginTimeRecord'
    },
    //8.获取操作日志信息
    getOperationRecord:{
      method:'get',
      url:'/sysLogs'
    }
  }
};

export default API

