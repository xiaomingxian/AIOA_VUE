/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import {filterObj} from '@/utils/util';
import {deleteAction, downFile, getAction, postAction} from '@/api/manage'
import {ACCESS_TOKEN} from "@/store/mutation-types"
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {ntkoBrowser} from './ntkobackground.min.js'


export const taskBth = {
  //接收父组件传值
  props: ['backData', 'busFunction', 'taskMsg', 'opts', 'deptMsg', 'backDataOpt'],
  inject: ['reload'],
  data() {
    return {
      //按钮展示
      btn: [],
      defindBtns: [], //按钮组二
      currentBtn: '',
      currentUserMessage: '',
      dictData: {
        dictUnitId: '', //数据字典-中支id
        dictFunctionId: '', //数据字典-业务id
        modelId: '',//根据字典值查询获取
        table: '', //根据字典值查询获取
        unitName: "", //上报中支名称
        unitId: ''
      },
      insideReadingData: {}, //内部传阅业务数据
      flag: false, //填写环节控制
      isSaveFlag: false, //是否填写
      usersData: [], //传阅收文管理员角色用户
      visibleModel: false, //提示框
      ntko: {},
      fileName: '',
      nextConfirm: false,
      havaOtherProc: false,
      haveEnd: false,//是否已办结
      otherProc: {
        busData: {},
        taskMsg: {}
      },
      clickTotal:0,//点击次数参数
      url: {
        delete: '/oaBus/dynamic/delete', //删除数据
        insert: '/oaBus/dynamic/insert',//动态插入数据
        queryById: '/oaBus/dynamic/queryById',//查询数据
        newPublicFileSend: '/oaouttransdata/oaOutTransData/newPublicFileSend',//新公文传输
        recordFileSend: '/oaouttransdata/oaOutTransData/recordFileSend',//档案系统接口
        //TODO(仅标识) *********************************************    WorkFlow   START   ******************************
        start: '/wf/task/start',//开启流程
        insertDataAndStartPro: '/oaBus/newTask/insertDataAndStartPro',//保存业务同时开启流程
        nextUsers: '/oaBus/taskInAct/nextUserQuery',
        endProUrl: '/wf/task/endProcess',
        showBackAct: '/wf/task/showBackAct',//展示回退/跳转 节点
        currentUserMsg: '/sys/user/getUserSectionInfoByToken',
        currentUserQuery: '/oaBus/taskInAct/currentUserQuery',//查询form信息
        doTask: '/oaBus/taskInAct/doTask',
        doTaskMore: '/oaBus/taskInAct/doTaskMore',
        taskWithDepartSave: '/oaBus/taskInAct/taskWithDepartSave',
        downloadFiles: '/oaBus/oaFile/downloadZipFile',
        queryAllHaveDone: '/wf/task/queryAllHaveDone',//可撤回节点
        reCallTask: 'wf/task/reCallTask',//撤回到上一步
        departFinish: 'wf/task/departFinish',
        lastVersionProc: 'wf/process/lastVersionProc',
        addUserOrDepart: 'oaBus/taskInAct/addUsersQuery',
        doAddUsers: '/oaBus/taskInAct/doAddUsers',
        addUserOrDepartCy: '/oaBus/taskInAct/departChuanYueUser',

        //TODO(仅标识) *********************************************    WorkFlow   END   ********************************
        // downloadFiles: '/oaBus/oaFile/downloadZipFile',
        sendMeetingInform: '/oaBus/meetingInform/sendMeetingInform',  //发送通知
        commitPer: '/oaBus/oaBusdata/commitPer', //发布按钮
        updateBusdata: '/oaBus/dynamic/update', //动态修改数据
        updateData: '/oaBus/dynamic/updateData', //普通修改数据
        busDataAndColums: 'oaBus/oaBusdata/queryBusdataById', //查询业务详情
        isUpdateOpinion: '/oaBus/dynamic/updateOpinion',
        getDictByKey: '/sys/dict/getDictByKeyObj',  //数据字典值获取
        queryByFunctionId: '/oaBus/dynamic/queryModelByFunctionId', //根据functionid查询模块信息
        upSendFile: '/oaBus/dynamic/upSendFile', //上报
      },
      butArrLists: null,    // 按钮组列表
      iisDefend: false,   //默认按钮可点击

    }
  },
  created() {
    //监听页签切换   切换至当前页时刷新底部按钮接口
    var _this = this;
    document.addEventListener('visibilitychange', function () {
      // alert(document.hidden)
      // document.title = document.hidden?'拜拜11111':' 回来啦2222'
      if (document.hidden) {
        _this.showBtn(_this.butArrLists);
      }
    })
  },
  methods: {
    //将起草底稿按钮改为编辑底稿
    /*alertBtnStaus(flagValue,dealBtn){
      alert(flagValue) ;
      let k = -1 ;
      console.log(flagValue)
      for(let i = 0 ; i < this.btn.length ; i ++){
        if(this.btn[i].smethod == flagValue){
          console.log(this.btn[i])
          k = i ;
          break ;
          //alert(k)
        }
      }
      if(k >=0){
        //如果dealBtn为空的话，不插入数据，如果不为空的话，就可以将数据插入到起草底稿的位置
        if(dealBtn == undefined || JSON.stringify(dealBtn) == '{}'){
          this.btn.splice(k,1)
        }else{
          this.btn.splice(k,1,dealBtn)
        }
      }
      //this.btnObj[flagValue] = false ;
    },
*/
    //TODO(仅标识)**********************************************  BASE START   ******************************************
    //方法路由
    method_router(item, index) {
      // console.log(item);
      // console.log( this.$refs.isDefendBtn[index]);
      // console.log( this.$refs.isNotDefendBtn[index]);
      // // console.log( this.$refs.btn[index]);
      this.currentBtn = item;

      /*if (this.$refs.isDefendBtn[index]) {
        if (!item.iisDefend && item.sbtnName == this.$refs.isDefendBtn[index].$el.innerText) {
          this.$refs.isDefendBtn[index].$el.setAttribute('disabled', ture)
        }
      }

      if (this.$refs.isNotDefendBtn) {
        if (this.$refs.isNotDefendBtn[index]) {
          if (!item.iisDefend && item.sbtnName == this.$refs.isNotDefendBtn[index].$el.innerText) {
            this.$refs.isNotDefendBtn[index].$el.setAttribute('disabled', ture)
            this.$refs.isNotDefendBtn[index].$el.style.opacity = '.6'

          }
        }
      }*/
      this[item.smethod]()
    },
    doPost(url, data) {
      postAction(url, data).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    doGet(url, data) {
      getAction(url, data).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //取消关注件
    cImportantObj() {
      this.$emit('cancelImportantObj')
    },
    //关注件--是否重要
    important() {
      this.$emit('iIsImportantObj')
    },
    //销假
    destoryDay() {
      // //console.log("-----------------------")
      this.$emit('destoryObj')
    },
    //确定登记排版
    confimName() {
      const userinfo = JSON.parse(localStorage.getItem('userdata')).userInfo;
      let currentUsername = userinfo.realname;
      let dateTimeNow = new Date().valueOf();
      let param = {currentUsername: currentUsername, dataTimeNow: dateTimeNow}
      console.log(param)
      this.$store.commit('confimeUser', param)
    },
    //排版登记
    paibandengji() {
      let createUser = this.backData.s_create_name;

      const userinfo = JSON.parse(localStorage.getItem('userdata')).userInfo;
      let currentUsername = userinfo.realname;
      this.$refs.paiBanDengJi.show(createUser, currentUsername)
    },
    //保存按钮
    saveBusData() {
      //console.log("业务数据====》", this.backData);
      //console.log("业务配置====》", this.busFunction);
      //校验是否有发布范围、流程
      if (this.busFunction.iisLimits == 0 && this.busFunction.iisProc == 0) {
        let queryParam = {};
        queryParam.i_bus_function_id = this.busFunction.iid;
        queryParam.table = this.backData.table + '_permit'
        queryParam.i_busdata_id = this.backData.i_id;
        postAction(this.url.queryById, queryParam).then(res => {
          if (res.success && res.result == null) {
            queryParam.s_userunit_id = this.backData.s_create_unitid
            postAction(this.url.insert, queryParam).then(res => {
            })
          }
        })
      }
      this.$emit('savaObj');
    },
    //删除按钮
    deleteBusData() {
      let param = {};
      param.table = this.backData.table;
      param.i_id = this.backData.i_id;
      // console.log(JSON.stringify(this.taskMsg))
      if (this.taskMsg.processInstanceId != undefined) {
        param.processInstanceId = this.taskMsg.processInstanceId;
      }
      postAction("/oaBus/dynamic/deleteBusdata", param).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          setTimeout(function () {
            this.close()
          }, 500)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //关闭按钮
    close() {
      // this.$router.go(-1);
      // this.$emit("close")
      window.close()
    },
    //展示按钮
    showBtn(btn) {
      //console.log(btn);
      this.butArrLists = btn;
      this.btn = btn.isNotDefend
      this.defindBtns = btn.isDefend

      getAction(this.url.currentUserMsg).then(res => {
        if (res.success) {
          this.currentUserMessage = res.result
        } else {
          this.$message.error(res.message)
        }
      })

    },
    cancel() {
      //console.log('==>>>>>>取消>>>>>>', JSON.stringify(this.backData))
    },
    reload2() {
      this.reload()
    },
    //按钮校验
    checkBtnBeforeNext(value) {
      switch (value) {
        //判断是否已经起草底稿
        case "qiCao":
          if (this.backData.i_is_draft != 1) {
            this.$message.error("请先起草底稿！！！");
            return false;
            break;
          }
        //判断是否已经正文排版
        case 'zwPaiBan':
          if (undefined && this.backData.i_is_typeset != 1) {
            this.$message.error("请先进行正文排版！！！");
            return false;
            break;
          }
        case 'saveBanWen':
          if (this.backData.i_is_approve != 1) {
            this.$message.error("请先保存办文单！！！");
            return false;
            break;
          }
        default :
          return true;
      }
    },
    //TODO(仅标识)**********************************************   BASE  END   ******************************************

    //TODO(仅标识)***************************************************** 工作流相关 START *********************************
    //追加办理人
    addUserOrDepart() {
      //查询下n个节点 找出其中可追加的
      if (this.taskMsg.hiTaskId == undefined || this.taskMsg.hiTaskId == null) {
        this.$message.error('非已办任务不可追加')
        return
      }
      let hiTaskId = this.taskMsg.hiTaskId
      getAction(this.url.addUserOrDepart + '?taskId=' + hiTaskId).then(res => {
        if (res.success) {
          // this.$refs.addUsersModal
          this.$refs.addUsersModal.showNextUsers(res.result)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //下一任务查询(节点)
    nextTaskQuery() {
      if (this.nextConfirm) {
        this.$message.error('该环节任务已经办理请勿重复点击')
        return
      }
      //
      for (var index in this.opts) {
        //判断意见环节是否匹配
        let td = this.taskMsg.taskDefinitionKey
        for (let i of this.opts[index].taskDefKeys) {
          if (i.key == td) {
            this.backDataOpt.i_id = this.backDataOpt.i_id == '' ? this.opts[index].optId : this.backDataOpt.i_id
            this.backDataOpt.i_order = this.opts[index]['orderId']
            this.backDataOpt.i_opinion_set_id = i.optionSetId
            this.backDataOpt.s_opinion_type = this.opts[index]['type'] //意见类型
            this.flag = true;
            break
          }
        }
      }
      // //校验意见
      if (this.flag) {    //如果要填写意见的话，就进行校验
        if (this.backDataOpt.i_id == "") {  //如果没有填写
          this.$message.error("下一任务前必须填写意见！！！");
          return;
        }
      }

      // //校验意见
      /*if (this.flag) {    //如果要填写意见的话，就进行校验
        if (!this.isSaveFlag) {  //如果没有填写
          this.$message.error("下一任务前必须填写意见！！！");
          return;
        }
      }*/
      // 按钮校验
      if (this.btn != undefined && this.btn.length > 0) {
        console.log(JSON.stringify(this.btn))
        for (let i = 0; i < this.btn.length; i++) {
          //查看是否要校验按钮
          if (this.btn[i].iisCheckbus == 1) {
            let checkFlagBtn = this.checkBtnBeforeNext(this.btn[i].smethod);
            if (!checkFlagBtn) {
              return;
              break;
            }
          }
        }
      }
      this.$emit('checkData')
      this.$emit("nextCheckDataFun")
      //获取store changeCheckDataFlag
      if (this.$store.state.checkDataFlag) {
        this.nextRealQuery()
      }
      // this.nextRealQuery()


    },

    nextRealQuery() {
      if (this.taskMsg.id == undefined && this.taskMsg.hiTaskId != undefined) {
        this.$message.error('已办环节没有下一任务')
        return
      }

      //根据当前节点查到下几个节点再去表里查具体信息
      getAction(this.url.nextUsers, {
        procDefkey: this.backData.s_cur_proc_name,
        drafterId: this.backData.s_create_by,
        taskId: this.taskMsg.id,
        processDefinitionId: this.taskMsg.processDefinitionId,
        taskDefinitionKey: this.taskMsg.taskDefinitionKey,
      }).then(res => {
        //展示数据
        if (res.success) {
          this.$refs.nextUsers.showNextUsers(res.result)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //按钮-共享
    shareFile: function () {
      postAction('oaBus/dynamic/shareFile', this.backData).then(res => {
        if (res.success && res.result == true) {
          this.$message.success("共享完成")
        } else {
          this.$message.error("请检查相关配置是否完善")
        }
      })
    },
    //按钮-内部传阅
    insideReading() {
      //数据字典获取functionID
      getAction(this.url.getDictByKey, {dictKey: 'btn_insideSend'}).then(res => {
        if (res.success && res.result[0].value != undefined) {
          this.dictData.dictUnitId = res.result[0].text //中支id
          this.dictData.dictFunctionId = res.result[0].value //functionid
          //根据functionid查询模块信息
          getAction(this.url.queryByFunctionId, {functionId: this.dictData.dictFunctionId}).then(res => {
            if (res.success) {
              this.dictData.table = res.result.s_busdata_table
              this.dictData.modelId = res.result.i_id

              //查询业务模板是否传阅
              let isRead = {};
              isRead.table = this.dictData.table;
              isRead.i_bigint1 = this.backData.i_id;  //传阅数据id
              isRead.i_bigint2 = this.backData.i_bus_model_id   //传阅业务模块id
              isRead.i_bigint3 = this.backData.i_bus_function_id   //传阅业务id
              isRead.i_is_display = 0       //isRead.i_is_display = 0   // 状态 1临时 0已传阅

              //查询是否已经传阅，获取业务数据；
              postAction(this.url.queryById, isRead).then(res => {
                if (res.success && res.result != null) {
                  //情况1:获取已经传阅业务数据
                  this.insideReadingData = res.result;
                  getAction(this.url.addUserOrDepartCy, {
                    procKey: this.insideReadingData.s_cur_proc_name, // this.backData.s_cur_proc_name,
                    drafterId: this.insideReadingData.s_create_by,
                    procInstId: this.insideReadingData.s_varchar10
                  }).then(res => {
                    //展示数据
                    if (res.success) {
                      this.$refs.addUserCy.title = '内部发送'
                      this.$refs.addUserCy.showNextUsers(res.result)
                    } else {
                      this.$message.error(res.message)
                    }
                  })

                  /**
                   * 查询页面数据详情
                   * 参数1：table
                   * 参数2：i_id
                   */
                  // postAction(this.url.busDataAndColums, {
                  //   tableName: this.dictData.table,
                  //   busdataId: this.insideReadingData.i_id
                  // }).then((res) => {
                  //   if (res.success && res.result != null) {
                  //     //获取详情后---》调用下一任务接口
                  //
                  //   } else {
                  //     this.$message.error("内部传阅业务数据错误！")
                  //   }
                  // })

                } else {
                  //情况2:新建内部传阅业务数据
                  this.havaOtherProc = true
                  //新建
                  let param = {}
                  param.modelId = this.dictData.modelId
                  param.functionId = this.dictData.dictFunctionId   //数据字典取值
                  //初始化数据
                  this.otherProc.busData = {}
                  postAction("/oaBus/oaBusdata/queryNewTaskMsg", param).then(res => {
                    if (res.success) {
                      let insideParam = {};
                      this.otherProc.busData.i_id = res.result.busdataId
                      this.otherProc.busData.table = res.result.tableName
                      this.otherProc.busData.s_title = this.backData.s_title   //标题
                      this.otherProc.busData.s_file_num = this.backData.s_file_num //文件字号
                      this.otherProc.busData.d_sealdate = this.backData.d_sealdate   //封发日期
                      this.otherProc.busData.s_main_dept_names = this.backData.s_main_dept_names  //主送部门
                      this.otherProc.busData.s_create_name = this.backData.s_create_name  //拟稿时间
                      this.otherProc.busData.s_create_dept = this.backData.s_create_dept //
                      this.otherProc.busData.s_main_unit_names = this.backData.s_main_unit_names //主送单位
                      this.otherProc.busData.s_signer = this.backData.s_signer  //签发人
                      this.otherProc.busData.s_varchar1 = this.backData.table //业务数据表
                      this.otherProc.busData.s_varchar7 = '内部传阅' //传阅类别
                      this.otherProc.busData.i_safetylevel = this.backData.i_safetylevel //密级
                      this.otherProc.busData.i_urgency = this.backData.i_urgency //缓急
                      this.otherProc.busData.i_bigint1 = this.backData.i_id   //传阅业务数据id
                      this.otherProc.busData.i_bigint2 = this.backData.i_bus_model_id   //传阅业务模块id
                      this.otherProc.busData.i_bigint3 = this.backData.i_bus_function_id //传阅业务id
                      // this.otherProc.busData.s_create_by = this.backData.s_create_by
                      // this.otherProc.busData.s_create_dept = this.backData.s_create_dept
                      // this.otherProc.busData.s_create_deptid = this.backData.s_create_deptid
                      // this.otherProc.busData.i_create_day = this.backData.i_create_day
                      // this.otherProc.busData.i_create_month = this.backData.i_create_month
                      // this.otherProc.busData.i_create_year = this.backData.i_create_year
                      getAction('/oaBus/oaBusdata/getModelSname', {id: this.otherProc.busData.i_bigint3}).then(res => {
                        if (res.success && res.result != null) {
                          this.otherProc.busData.s_varchar5 = res.result.mName;
                          this.otherProc.busData.s_varchar6 = res.result.fName;
                          // alert(JSON.stringify(this.otherProc.busData))
                          //传阅业务业务id
                          let param = {tableName: res.result.tableName, busdataId: res.result.busdataId};
                          postAction(this.url.updateData, this.otherProc.busData).then(res => {
                            if (res.success) {
                              //查询页面数据详情
                              postAction(this.url.busDataAndColums, {
                                tableName: this.otherProc.busData.table,
                                busdataId: this.otherProc.busData.i_id
                              }).then((res) => {
                                if (res.success) {
                                  //复制发文附件
                                  let fileParam = {};
                                  fileParam.sTable = this.backData.table; //发文业务表
                                  fileParam.iTableId = this.backData.i_id; //发文业务数据id
                                  fileParam.sFileType = '4,6'; //附件类型
                                  fileParam.receiveTable = res.result.oaBusdata.table;
                                  fileParam.receiveId = res.result.oaBusdata.i_id
                                  postAction('/oaBus/oaFile/copyFile', fileParam).then(res => {
                                    if (res.success) {
                                      // this.$message.success(res.message);
                                    } else {
                                      this.$message.error("文件备份失败");
                                    }
                                  })

                                  this.otherProc.busData = res.result.oaBusdata
                                  this.otherProc.busData['iprocSetId'] = res.result.proSetId;
                                  this.otherProc.busData['key'] = res.result.taskDefKey
                                  this.otherProc.busData.act_show = res.result.actShow
                                  //下一任务
                                  getAction(this.url.nextUsers, {
                                    procDefkey: res.result.oaBusdata.s_cur_proc_name, // this.backData.s_cur_proc_name,
                                    drafterId: res.result.oaBusdata.s_create_by
                                  }).then(res => {
                                    //展示数据
                                    if (res.success) {
                                      this.$refs.nextUsers.title = '传阅'
                                      this.$refs.nextUsers.showNextUsers(res.result)
                                    } else {
                                      this.$message.error(res.message)
                                    }
                                  })


                                } else {
                                  this.$message.error("详情数据格式错误")
                                  return
                                }

                              })
                            } else {
                              this.$message.error("更新数据错误")
                              return
                            }
                          })
                        } else {
                          this.$message.error("业务配置错误")
                          return
                        }
                      })
                    } else {
                      this.$message.error("初始化数据错误")
                      return
                    }
                  })
                }
              })
            } else {
              this.$message.error('请检查对应模块配置是否正确')
              return
            }
          })
        } else {
          this.$message.error('请配置内部传阅数据字典值')
          return
        }

      })

    },
    //按钮-省会-->地市(收文流程)
    provinceToCityReceviceSend() {
      this.$refs.selectCityModel.title = "选择地市";
      this.$refs.selectCityModel.show(this.backData, 1);
    },
    //按钮-省会-->地市(传阅不带流程)
    provinceToCityInsideSend() {
      this.$refs.selectCityModel.title = "选择地市";
      this.$refs.selectCityModel.show(this.backData, 2);
    },
    //按钮-上报
    upSendFile() {
      postAction(this.url.upSendFile, this.backData).then(res => {
        if (res.success && res.result["unitTables"].length != 0) {
          this.dictData.table = res.result["unitTables"][0].btable;
          this.dictData.dictFunctionId = res.result["unitTables"][0].functionId;
          this.dictData.modelId = res.result["unitTables"][0].modelId;
          this.dictData.unitName = res.result["unitTables"][0].unitName;
          this.dictData.dictUnitId = res.result["unitTables"][0].unitId;
          this.usersData = res.result[this.dictData.dictUnitId];
          this.visibleModel = true;
        } else {
          this.$message.error("请检查相关配置是否完善！")
        }
      })
    },
    //确认上报
    upSendConfirm() {
      this.clickTotal++;
      if (this.clickTotal>1){
        return;
      }
      this.busData = this.backData;
      let param = {};
      param.table = this.dictData.table;
      param.modelId = this.dictData.modelId;
      param.functionId = this.dictData.dictFunctionId;
      let unitId = this.dictData.dictUnitId;
      let flag = false;
      //新建任务
      postAction("/oaBus/oaBusdata/queryNewTaskMsg", param).then(res => {
        if (res.success) {
          let receiveData = {};
          receiveData.s_title = this.busData.s_title  //标题
          receiveData.d_sealdate = this.busData.d_sealdate//成文日期  d_sealdate
          receiveData.s_receive_num = this.busData.s_file_num //来文字号 s_file_num
          // receiveData.s_varchar5 = this.busData.s_unit_name//来文机关 s_unit_name
          receiveData.i_urgency = this.busData.i_urgency; //缓急 i_urgency
          receiveData.i_safetylevel = this.busData.i_safetylevel; //密级 i_safetylevel
          receiveData.i_bigint1 = this.busData.i_bigint1  //印发份数
          receiveData.i_bigint2 = this.busData.i_bigint2  //正文页数
          receiveData.table = res.result.tableName
          receiveData.i_id = res.result.busdataId
          receiveData.s_create_by = "";
          for (let j = 0; j < this.usersData.length; j++) {
            receiveData.s_create_by += this.usersData[j].userId + ","; //创建人
          }
          //更新数据
          postAction(this.url.updateData, receiveData).then(res => {
            if (res.success) {
              //开启流程
              postAction(this.url.updateBusdata, {updateBusdata: res.result}).then(res => {
                if (res.success) {
                  let users = [];
                  users = this.usersData;
                  postAction('/oaBus/dynamic/insertPermit', {
                    list: users,
                    functionId: param.functionId,
                    iBusdataId: receiveData.i_id,
                    table: receiveData.table
                  }).then(res => {
                    if (res.success) {
                      //复制发文附件
                      let fileParam = {};
                      fileParam.sTable = this.busData.table; //发文业务表
                      fileParam.iTableId = this.busData.i_id; //发文业务数据id
                      fileParam.sFileType = 4; //附件类型
                      fileParam.receiveTable = receiveData.table;
                      fileParam.receiveId = receiveData.i_id
                      postAction('/oaBus/oaFile/copyFile', fileParam).then(res => {
                        if (res.success) {
                          flag = true;
                          this.$message.success("上报成功！")
                          this.closeModal();
                          //组装参数--传输日志记录
                          let oaOutLog = {};
                          oaOutLog.i_bus_model_id = this.backData.i_bus_model_id;
                          oaOutLog.i_bus_function_id = this.backData.i_bus_function_id;
                          oaOutLog.s_busdata_table = this.backData.table;
                          oaOutLog.i_busdata_id = this.backData.i_id;
                          oaOutLog.i_type = 1;
                          oaOutLog.s_rec_unitid = unitId;
                          this.insertOaOutLog(oaOutLog,1);  //记录传输日志；
                        } else {
                          this.$message.error("附件复制失败！")
                        }
                      })
                    } else {
                      this.$message.error("用户权限写入失败！")
                    }
                  })
                } else {
                  this.$message.error("开启流程失败！")
                }
              })
            } else {
              this.$message.error("业务数据更新失败！")
            }
          })
        } else {
          this.$message.error("新建任务失败！")
        }
      });
    },
    //按钮-传阅下发
    downSendFile() {
      this.$refs.selectUnitModel.title = "选择下发县行";
      this.$refs.selectUnitModel.show(this.backData);
      //数据字典配置 类型 上报  1 中支 id value (functionid)
      // 下发---》 县行 key (id) value (functionid)
      // 内部传阅  1 中支id value (functionid)
    },

    //记录对外传输数据日志
    insertOaOutLog(data,type) {
      /**
       * 参数1:data项：
       * 1.s_send_by  发送者id
       * 2.i_bus_model_id   业务模块id
       * 3.i_bus_function_id  业务功能id
       * 4.i_busdata_id   业务数据表
       * 5.i_type     类型：1为机构id；2为数据字典itemid'
       * 6.s_rec_unitid   接收者机构对应的数据字典id（机构id）
       * 7.d_create_time
       * 参数2:type类型
       * 1.公文上报
       * 2.公文下发
       * 3.内部传阅
       * 4.省会转地市收文
       * 5.省会转地市传阅
       */
      var sendName = "";
      if (type == 1){
        sendName="公文上报";
      }
      if (type == 2){
        sendName="公文下发";
      }
      if (type == 3){
        sendName="内部传阅";
      }
      if (type == 4){
        sendName="省会转地市收文";
      }
      if (type == 5){
        sendName="省会转地市传阅";
      }
      data.table = "oa_out_log"
      data.s_send_name = sendName;
      postAction("oaBus/dynamic/insertOaOutLog", data).then(res => {
        if (res.success) {
          return;
        } else {
          this.$message.error("传输日志记录失败！")
        }
      })
    },
    //按钮校验
    checkData() {
      let buttonList = this.btn.isDefend //获取上面的按钮
      let buttonList2 = this.btn.isNotDefend //获取下面的按钮
      for (let i = 0; i < buttonList.length; i++) {
        //判断是不是选择了校验
        if (buttonList[i].iisCheckbus != undefined && buttonList[i].iisCheckbus != '') {
          if (buttonList[i].sbtnName == '下一任务') {
            for (let i = 0; i < buttonList2.length; i++) {
              if (buttonList2[i].smethod != undefined && buttonList2[i].smethod != '' && (buttonList2[i].smethod == 'qiCao')) {

              }
            }
          }
        }
      }
    },
    setBackDataNew(BackDataNew) {
      this.backData = BackDataNew
    },
    //最新环节和密级
    lastedUrgency() {
      //数据缓急拿到最新
      let i_urgency = localStorage.getItem('缓急:' + this.backData.table + this.backData.i_id)
      this.backData.i_urgency = i_urgency == null ? 4 : i_urgency
      let i_safetylevel = localStorage.getItem('密级:' + this.backData.table + this.backData.i_id)
      this.backData.i_urgency = i_urgency == null ? 4 : i_urgency
      this.backData.i_safetylevel = i_safetylevel == null ? 1 : i_safetylevel
      //清除缓存中的记录
      localStorage.removeItem('缓急:' + this.backData.table + this.backData.i_id)
      localStorage.removeItem('密级:' + this.backData.table + this.backData.i_id)
    },
    //选择下一办理人的同时办理任务
    confirmNextUsers(ids, activity, endTime, depts) {
      console.log('------------------', activity)
      //传后台的参数
      var data = {};
      var taskId = this.taskMsg.id
      if (this.havaOtherProc) {
        taskId = undefined
      }
      data['taskId'] = taskId
      //业务数据权限表（流转过程中逐步维护该表数据、收回删除人员权限）
      data['assignee'] = ids
      data['functionId'] = this.backData.i_bus_function_id
      data['busDataId'] = this.backData.i_id
      //下一节点为 结束节点不需要拼接 下一办理用户
      data['isDept'] = false
      if (ids.length > 0) {
        //连线信息--决定走向
        var vars = activity.actMsg.conditionContext;
        if (vars == undefined) {
          vars = {}
        }
        //进行任务办理
        if (endTime != '') {
          //有时间限制
          vars.endTime = endTime;
        }
        //组装办理人信息
        //是否是设计上的多实例
        if (activity.actMsg.allowMulti) {
          //数据库配置是否允许多实例
          vars[activity.actMsg.multiAssignee] = ids
          vars[activity.actMsg.loopSize] = ids.length
        } else {
          vars[activity.actMsg.assignee] = ids[0]
        }
        //流程所需变量
        data['vars'] = vars
      }
      //记录部门相关信息
      var deptMsg = {}
      //如果是部门 记录部门信息
      if (activity.oaProcActinst != undefined && activity.oaProcActinst.userOrRole == 'dept') {
        //记录部门信息
        deptMsg['tskId'] = this.taskMsg.id
        deptMsg['taskDefKey'] = activity.actMsg.id
        deptMsg['deptMsg'] = depts
        var mainDept = ''
        for (let i in activity.departSelect) {
          if (i.indexOf("主办") >= 0) {
            mainDept = activity.departSelect[i][0].departName
          }
        }
        deptMsg['mainDept'] = mainDept
        data['taskWithDepts'] = deptMsg
        data['isDept'] = true

      }
      this.backData.page_ref = this.taskMsg.pageRef
      //业务数据
      this.$emit("getbackDataNew", this.backData.page_ref)
      this.lastedUrgency()

      if (this.havaOtherProc) {
        data['busData'] = this.otherProc.busData
        // data['busData']['justStart'] = true
      } else {
        data['busData'] = this.backData
      }
      data['taskDefKey'] = activity.actMsg.id

      //参数构造完毕***********************
      postAction(this.url.doTask, data).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.havaOtherProc = false
          this.nextConfirm = true
          // this.saveBusData()
          setTimeout(function () {
            this.close()
          }, 500)
          // this.reload()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //并行/包容网关的确定
    confirmNextUsersMore(actMsg, endTime) {
      var datas = []
      for (let key  in actMsg) {
        let type = actMsg[key]
        if (Object.keys(type).length > 0) {
          this.constructData(type, endTime, datas)
        }
      }
      let taskInfoVoList = {list: datas}
      //请求后台
      postAction(this.url.doTaskMore, taskInfoVoList).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.havaOtherProc = false
          this.nextConfirm = true
          setTimeout(function () {
            this.close()
          }, 500)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //追加用户
    confirmAddUserSingle(ids, activity, endTime, depts) {
      console.log(' 节点属性：：', activity)
      //传后台的参数
      var data = {};
      var taskId = this.taskMsg.id
      if (this.havaOtherProc) {
        taskId = undefined
      }
      data['taskId'] = taskId
      //业务数据权限表（流转过程中逐步维护该表数据、收回删除人员权限）
      data['assignee'] = ids
      data['functionId'] = this.backData.i_bus_function_id
      data['busDataId'] = this.backData.i_id
      //下一节点为 结束节点不需要拼接 下一办理用户
      data['isDept'] = false
      if (ids.length > 0) {
        //连线信息--决定走向
        var vars = activity.actMsg.conditionContext;
        if (vars == undefined) {
          vars = {}
        }
        //进行任务办理
        if (endTime != '') {
          //有时间限制
          vars.endTime = endTime;
        }
        //组装办理人信息
        //是否是设计上的多实例
        if (activity.actMsg.allowMulti) {
          //数据库配置是否允许多实例
          vars[activity.actMsg.multiAssignee] = ids
          vars[activity.actMsg.loopSize] = ids.length
        } else {
          vars[activity.actMsg.assignee] = ids[0]
        }
        //流程所需变量
        data['vars'] = vars
      }
      //记录部门相关信息
      var deptMsg = {}
      //如果是部门 记录部门信息
      if (activity.oaProcActinst != undefined && activity.oaProcActinst.userOrRole == 'dept') {
        //记录部门信息
        deptMsg['tskId'] = this.taskMsg.id
        deptMsg['taskDefKey'] = activity.actMsg.id
        deptMsg['deptMsg'] = depts
        var mainDept = ''
        for (let i in activity.departSelect) {
          if (i.indexOf("主办") >= 0) {
            mainDept = activity.departSelect[i][0].departName
          }
        }
        deptMsg['mainDept'] = mainDept
        data['taskWithDepts'] = deptMsg
        data['isDept'] = true
        //遍历节点属性找出所选择的用户


      }
      this.backData.page_ref = this.taskMsg.pageRef
      //业务数据
      this.$emit("getbackDataNew", this.backData.page_ref)
      this.lastedUrgency()

      if (this.havaOtherProc) {
        data['busData'] = this.otherProc.busData
        // data['busData']['justStart'] = true
      } else {
        data['busData'] = this.backData
      }
      data['taskDefKey'] = activity.actMsg.id

      if (activity.nextUsers.length > 0) {
        let user = activity.nextUsers[0]
        data['taskId'] = user.taskId
        data['executionId'] = user.executionId
      }


      let taskInfoVoList = {list: [data]}
      //参数构造完毕***********************
      postAction(this.url.doAddUsers, taskInfoVoList).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.havaOtherProc = false
          this.nextConfirm = true
          setTimeout(function () {
            this.close()
          }, 500)
          this.reload()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //并行/包容追加
    confirmAddUsers(actMsg, endTime) {

      var datas = []
      for (let key  in actMsg) {
        let type = actMsg[key]
        if (Object.keys(type).length > 0) {
          this.constructData(type, endTime, datas)
        }
      }
      let taskInfoVoList = {list: datas}
      if (datas.length == 0) {
        this.$message.error('没有可追加的环节')
        return
      }

      //请求后台
      postAction(this.url.doAddUsers, taskInfoVoList).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.havaOtherProc = false
          this.nextConfirm = true
          setTimeout(function () {
            this.close()
          }, 500)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    constructData(type, endTime, datas) {
      //传后台的参数
      var taskId = this.taskMsg.id
      if (this.havaOtherProc) {
        taskId = undefined
      }
      for (let k in type) {
        var data = {};
        data['taskId'] = taskId
        let v = type[k]
        let activity = v.activity
        let isDept = activity.oaProcActinst.userOrRole == 'dept'
        if (activity.canAdd != undefined && !activity.canAdd) {
          continue;
        }
        data['isDept'] = isDept

        var ids = []
        if (isDept) {
          //构造用户id集合
          // for (let kk in v.departUsersId) {
          //   let inids = v.departUsersId[kk]
          //   if (inids.length > 0) {
          //     ids.push(inids)
          //   }
          // }
          let userGroupByDept = {}
          for (let k of Object.keys(v.departUsersMsg)) {
            for (let user of v.departUsersMsg[k]) {
              let uid = user.id
              let did = user.departId
              if (userGroupByDept[did] == undefined) {
                userGroupByDept[did] = []
                userGroupByDept[did].push(uid)
              } else {
                userGroupByDept[did].push(uid)
              }
            }

          }
          // console.log('userGroupByDept',userGroupByDept)
          for (let k of Object.keys(userGroupByDept)) {
            ids.push(userGroupByDept[k])
          }
          //记录部门相关信息
          var deptMsg = {}
          //记录部门信息
          deptMsg['tskId'] = taskId
          deptMsg['taskDefKey'] = activity.actMsg.id
          var mainDept = '';
          for (let i in v.departSelect) {
            if (i.indexOf("主办") >= 0 && (v.departSelect[i].length > 0)) {
              mainDept = v.departSelect[i][0].departName
              break
            }
          }
          deptMsg['mainDept'] = mainDept
          //记录主办部门信息
          deptMsg['deptMsg'] = v.departUsersId
          data['taskWithDepts'] = deptMsg
          data['isDept'] = true

          for (let k of Object.keys(v.departSelect)) {
            if (k != undefined && k != null) {
              let val = v.departSelect[k]
              if (val != undefined && val != null && val != '' && val.length > 0) {
                if (
                  val[0].executionId != undefined &&
                  val[0].executionId != null &&
                  val[0].taskId != undefined &&
                  val[0].taskId != null
                ) {
                  data['taskId'] = val[0].taskId
                  data['executionId'] = val[0].executionId
                  break
                }
              }
            }
          }
        } else {
          ids = v.selectedRowKeys
        }
        data['assignee'] = ids
        data['functionId'] = this.backData.i_bus_function_id
        data['busDataId'] = this.backData.i_id
        //下一节点为 结束节点不需要拼接 下一办理用户
        // if (ids.length > 0) {
        //连线信息--决定走向
        var vars = activity.actMsg.conditionContext;
        if (vars == undefined) {
          vars = {}
        }
        //进行任务办理
        if (endTime != undefined && endTime != '') {
          //有时间限制
          vars.endTime = endTime;
        }
        //组装办理人信息
        //是否是设计上的多实例
        if (activity.actMsg.allowMulti) {
          //数据库配置是否允许多实例
          vars[activity.actMsg.multiAssignee] = ids
          vars[activity.actMsg.loopSize] = ids.length
        } else {
          vars[activity.actMsg.assignee] = ids[0]
        }
        //流程所需变量
        data['vars'] = vars
        // }
        this.backData.page_ref = this.taskMsg.pageRef

        //业务数据
        this.$emit("getbackDataNew", this.backData.page_ref)
        this.lastedUrgency()
        //业务数据
        if (this.havaOtherProc) {
          data['busData'] = this.otherProc.busData
        } else {
          data['busData'] = this.backData

        }
        data['taskDefKey'] = activity.actMsg.id

        //追加使用
        if (v.selectionRows != undefined && v.selectionRows.length > 0) {
          if (v.selectionRows[0].executionId != undefined) {
            data['taskId'] = v.selectionRows[0].taskId
            data['executionId'] = v.selectionRows[0].executionId
          }
        }

        datas.push(data)

      }
    },
    //仅保存数据
    justSave() {
      postAction(this.url.insert, this.backData).then(res => {
        if (res.success) {
          this.backData.id = res.result.id
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //开启流程
    start() {
      //加入 任务描述
      this.doPost(this.url.start, this.backData)
    },
    //保存数据并开启流程
    saveAndStartPro() {
      //加入任务描述
      this.doPost(this.url.insertDataAndStartPro, this.backData)
    },
    //强制办结
    forceEndPro() {
      var res = window.confirm("是否强制办结");
      if (res) {
        this.doGet(this.url.endProUrl, {processId: this.taskMsg.processInstanceId})
        //关闭页面刷新父组件
        // this.$emit('close');
        // this.visible = false;
        this.reload()
      }
    },
    //展示回退节点
    showBack() {
      this.showPoint('back')
    },
    //展示跳转节点
    showJump() {
      this.showPoint('all')
    },
    showPoint(type) {
      var text = type == 'all' ? '跳转' : '回退'
      getAction(this.url.showBackAct,
        {
          processDefinitionId: this.taskMsg.processDefinitionId,
          type: type,
          processInstanceId: this.taskMsg.processInstanceId,
          taskDefinitionKey: this.taskMsg.taskDefinitionKey
        }
      ).then(res => {
        if (res.success) {
          if (res.result.length <= 0) {
            this.$message.error('没有可' + text + '节点')
            return
          }
          this.$refs.backModal.dataSource = res.result
          this.$refs.backModal.taskMsg = this.taskMsg
          this.$refs.backModal.title = text
          this.$refs.backModal.show()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //撤回---判断发出任务是否已读
    reCall() {

      let params = this.$route;

      let router = this.$router

      //展示自己已办的所有节点
      let taskId = this.taskMsg.hiTaskId
      if (taskId == undefined) taskId = this.taskMsg.id
      getAction(this.url.reCallTask + '?taskId=' + taskId).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            setTimeout(function () {
              if (params.query.status != undefined) params.query.status = 'todo'
              if (params.query.task != undefined) params.query.task = JSON.stringify(res.result)

              let parm = []
              for (let k in  params.query) {
                let v = k + '=' + params.query[k]
                if (k == 'task') {
                  v = k + '=' + JSON.stringify(params.query[k])
                }
                parm.push(v)
              }
              let parms = parm.join('&')
              router.push({path: params.path + '?' + parms})

            }, 500)

          } else {
            this.$message.error(res.message)
          }
        }
      )


    },
//部门完成
    deptFinish() {
      //拿到当前taskId
      var res = window.confirm("是否部门完成");
      if (res) {
        // let param={taskId: this.taskMsg.id}
        postAction(this.url.departFinish + "?taskId=" + this.taskMsg.id).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            setTimeout(function () {
              this.close()
            }, 500)
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
    ,
    showPic() {
      let key = this.backData.s_cur_proc_name
      if (key == undefined || key == null || key.length == 0) {
        this.$message.error('此条业务没有流程,请检查按钮配置')
        return
      }
      if (typeof (this.taskMsg) == 'string') {
        this.taskMsg = JSON.parse(this.taskMsg)
      }

      if (this.taskMsg.processInstanceId == null) {
        getAction(this.url.lastVersionProc + '?key=' + key).then(res => {
          if (res.success) {
            this.$refs.picModalNoTask.show(res.result.id)
            this.$refs.picModalNoTask.title = res.result.name
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$refs.picModal.show(this.taskMsg)
      }
    }
    ,
    /**
     * 流程办结
     */
    endProc() {

      //没有流程的办结
      if (this.backData.s_cur_proc_name == undefined || this.backData.s_cur_proc_name == '') {
        this.backData.i_is_state = 1
        postAction(this.url.updateBusdata, this.backData).then(res => {
          if (res.success) {
            this.$message.success('办结成功')
            getAction(this.url.recordFileSend, {stable: this.backData.table, tableid: this.backData.i_id}).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.reload();

              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            this.$message.error('数据更新失败')
          }

        })
      } else {
        getAction(this.url.nextUsers, {
          procDefkey: this.backData.s_cur_proc_name,
          drafterId: this.backData.s_create_by,
          taskId: this.taskMsg.id
        }).then(res => {
          //展示数据
          if (res.success) {
            if (res.result.length == 1) {
              this.confirmNextUsers([], res.result[0], null, null)
              // setTimeout(function () {
              //   this.close()
              // }, 500)
            } else {
              this.$message.error('当前节点不可办结')
            }
            // this.$refs.nextUsers.showNextUsers(res.result)
            //TODO********************************* 档案系统接口  ************************************
            getAction(this.url.recordFileSend, {stable: this.backData.table, tableid: this.backData.i_id}).then(res => {
              if (res.success) {
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            this.$message.error(res.message)
          }
        })
      }


    }
    ,

//TODO(仅标识)*****************************************************  工作流相关 END  *********************************

//TODO(仅标识)***************************************************** 意见相关 *****************************************
    writeOpinion: function () {
      for (var index in this.opts) {
        //判断意见环节是否匹配
        // let td = this.backData.s_cur_task_name.split("-")[0]
        let td = this.taskMsg.taskDefinitionKey;
        for (let i of this.opts[index].taskDefKeys) {
          if (i.key == td) {
            this.backDataOpt.i_id = this.backDataOpt.i_id == '' ? this.opts[index].optId : this.backDataOpt.i_id
            this.backDataOpt.i_order = this.opts[index]['orderId']
            this.backDataOpt.i_opinion_set_id = i.optionSetId
            this.backDataOpt.s_opinion_type = this.opts[index]['type'] //意见类型
            this.flag = true;
            break
          }
        }
      }
      this.backDataOpt.i_bus_function_id = this.backData.i_bus_function_id
      this.backDataOpt.i_busdata_id = this.backData.i_id
      this.backDataOpt.s_task_id = this.backDataOpt.s_task_id
      this.backDataOpt.s_task_name = this.taskMsg.name
      // this.backDataOpt.s_taskdef_key = this.backData.s_cur_task_name.split("-")[0]
      this.backDataOpt.s_taskdef_key = this.taskMsg.taskDefinitionKey
      this.backDataOpt.i_user_id = this.currentUserMessage.sysUserId
      this.backDataOpt.s_name = this.currentUserMessage.sysUserName
      this.backDataOpt.table = this.backData.table + "_opinion"
      // console.log(JSON.stringify(this.taskMsg))
      // console.log(JSON.stringify(this.backDataOpt))
      this.$refs.opinionForm.suggest(this.backDataOpt);
      this.$refs.opinionForm.title = "填写意见";
      this.$refs.opinionForm.disableSubmit = false;
    }
    ,
//填写意见
    saveOption(optionContext) {
      var deptType = null
      if (this.deptMsg != undefined && this.deptMsg != null && this.deptMsg.length > 0) {
        //去匹配部门环节
        deptType = this.deptMsg[0]
      }
      this.backDataOpt.s_opinion = optionContext
      this.backDataOpt.i_bus_function_id = this.backData.i_bus_function_id
      this.backDataOpt.i_busdata_id = this.backData.i_id
      this.backDataOpt.d_sign = this.dateFormat(new Date())
      this.backDataOpt.s_task_id = this.backDataOpt.s_task_id
      this.backDataOpt.s_task_name = this.taskMsg.name
      this.backDataOpt.s_overt = '0'//是否公开
      this.backDataOpt.s_tpye = '1'//
      this.backDataOpt.s_taskdef_key = this.taskMsg.taskDefinitionKey
      this.backDataOpt.i_user_id = this.currentUserMessage.sysUserId
      this.backDataOpt.s_name = this.currentUserMessage.sysUserName
      this.backDataOpt.s_dept_id = this.currentUserMessage.deptId
      this.backDataOpt.s_dept_name = this.currentUserMessage.sysDeptName
      this.backDataOpt.table = this.backData.table + "_opinion"
      // console.log('---->意见数据',this.opts)
      // console.log('---->环节',JSON.stringify(this.taskMsg))
      for (var index in this.opts) {
        //判断意见环节是否匹配
        let td = this.taskMsg.taskDefinitionKey
        let type = this.opts[index].type
        for (let i of this.opts[index].taskDefKeys) {
          if (deptType != null) {
            //有部门类型就匹配环节和 type
            if (i.key == td && type == deptType) {
              this.backDataOpt.i_id = this.backDataOpt.i_id == '' ? this.opts[index].optId : this.backDataOpt.i_id
              this.backDataOpt.i_order = this.opts[index]['orderId']
              this.backDataOpt.i_opinion_set_id = i.optionSetId
              this.backDataOpt.s_opinion_type = this.opts[index]['type'] //意见类型
              this.flag = true;
              break
            }
          } else {
            //没有部门类型就只匹配环节
            if (i.key == td) {
              this.backDataOpt.i_id = this.backDataOpt.i_id == '' ? this.opts[index].optId : this.backDataOpt.i_id
              this.backDataOpt.i_order = this.opts[index]['orderId']
              this.backDataOpt.i_opinion_set_id = i.optionSetId
              this.backDataOpt.s_opinion_type = this.opts[index]['type'] //意见类型
              this.flag = true;
              break
            }
          }

        }
      }
      if (!this.flag) {
        this.$message.error("请配置对应的环节！")
        return
      }
      //根据taskId判断是否更新意见
      postAction(this.url.isUpdateOpinion, this.backDataOpt).then(res => {
        if (res.success) {
          this.isSaveFlag = true;
          this.$message.success("填写意见成功！")
          this.$emit("reloadOpinion", this.taskMsg.taskDefinitionKey);
          this.backDataOpt.i_id = res.result.i_id;
        } else {
          this.$message.error("填写意见失败！")
        }
      })
    }
    ,
//发送会议通知
    sendMeetingInform: function () {
      this.$emit('submit', this.backData);
    }
    ,
    showReadCase: function () {
      let tableName = this.backData.table;
      let busFunctionId = this.backData.i_bus_function_id;
      let busDataId = this.backData.i_id;
      this.$refs.showreadmodal.showHead(tableName, busFunctionId, busDataId);
      this.$refs.showreadmodal.title = "已读情况";
      this.$refs.showreadmodal.disableSubmit = false;
    }
    ,
//TODO(仅标识)***************************************************** 控件相关 *****************************************
//起草底稿
    qiCao() {
      this.openFile(1, this.fileName)
    }
    ,
//正文排版
    zwPaiBan() {
      if (parseInt(this.backData.s_varchar8) == 0) {
        this.$message.error("请您先登记文号");
      } else {
        this.openFile(2, this.fileName)
      }
    }
    ,
//查看底稿
    showDiGao() {
      this.openFile(3, this.fileName)
    }
    ,
//编辑底稿
    editDiGao() {
      this.openFile(4, this.fileName)
    }
    ,
//查看正文
    showZw() {
      this.openFile(5, this.fileName)
    }
    ,
//校核正文
    checkZw() {
      this.openFile(6, this.fileName)
    }
    ,
//盖章(查看正文)
    sealFile() {
      this.openFile(5, this.fileName)
    }
    ,
//保存办文单
    saveBanWen() {
      this.openFile(7, this.fileName)
    }
    ,
//打印办文单
    printBanWen() {
      this.openFile(8, this.fileName)
    }
    ,
    //盖章(查看正文)
    CheachSealFile() {
      this.openFile(12, this.fileName)
    }
    ,
//打印公文
    printZFile() {
      this.openFile(13, this.fileName)
    }
    ,
//打开附件
    showFujianFile() {
      this.openFile(9, fileName)
    }
    ,
//打开附件
    showFujianFile2(cmd, fileName) {
      this.openFile(9, fileName)
    }
    ,
//对比拟稿
    compareFile() {
      let URL = 'http://localhost:4000/mytask/taskList/Test-detailFile?tableName=' + this.backData.table + '&busdataId=' + this.backData.i_id;
      window.open(URL);
    }
    ,
    openFile(cmd, fileName) {
      let ntkoed = ntkoBrowser.ExtensionInstalled();
      if (ntkoed) {
        //console.log('--------------------->>>>>>!!!!!',JSON.stringify("&taskId=" +this.taskMsg.id))
        //console.log('--------------------->>>>>>!!!!!', JSON.stringify(this.currentBtn.iid))
        //console.log('--------------------->>>>>>!!!!!',JSON.stringify(this.currentUserMessage))
        //console.log('--------------------->>>>>>!!!!!', JSON.stringify(this.backData.s_varchar20))
        console.log('--------------------->>>>>>!!!!!', JSON.stringify(this.backData));
        //console.log('--------------------->>>>>>!!!!!', JSON.stringify(this.opts));
        ntkoBrowser.openWindow(window.location.origin + "/ntko/editindex.html?cmd=" + cmd +
          "&stable=" + this.backData.table + "&tableid=" + this.backData.i_id + "&sbtnid=" +
          this.currentBtn.iid + "&userName=" + this.currentUserMessage.sysUserName + "&docNumId="
          + parseInt(this.backData.s_varchar8) + "&fileName=" + fileName);
      } else {
        window.open(window.location.origin + "/ntko/exeindex.html")
      }
      window.ntkoCloseEvent = function () {
        this.$message.error("跨浏览器插件应用程序窗口已关闭");
      }
    }
    ,
//新公文传输
//TODO *************************  新公文传输接口 *************************
    newPublicFileSend() {
      // console.log('=======================>>>>',this.backData.table)
      // console.log('=======================>>>>',this.backData.i_id)
      getAction(this.url.newPublicFileSend, {stable: this.backData.table, tableid: this.backData.i_id}).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    }
    ,
//弹框-登记文号
    djDocNum: function () {
      this.$refs.docNumForm.dengji(this.backData);
      this.$refs.docNumForm.title = "登记文号";
      this.$refs.docNumForm.disableSubmit = false;
    }
    ,
//保存登记文号
    saveDocNum(data) {
      let param = {
        table: this.backData.table,
        i_id: this.backData.i_id,
        s_file_num: data.docnum, //文件字号
        s_varchar8: data.id //文号id
      }
      postAction("oaBus/dynamic/updateData", param).then(res => {
        if (res.success) {
          // this.reload(); //页面刷新
          this.$emit("saveDocNum", data)
          this.$message.success("登记文号成功！")
        } else {
          this.$message.error(res.message)
        }
      })

    }
    ,
//弹框-引入公文链接
    yrOfficeDoc: function () {
      this.$refs.officeForm.yinru();
      this.$refs.officeForm.title = "引入公文链接";
      this.$refs.officeForm.disableSubmit = false;
    }
    ,
//保存公文链接
    gongwenData(data) {
      this.$emit("saveGongwenData", data)
    }
    ,
    updatePaperTitle: function () {
      this.$refs.titleForm.paperTitle(this.backData);
      this.$refs.titleForm.title = "修改文头";
      this.$refs.titleForm.disableSubmit = false;
    }
    ,
    updateMiddleParameter: function (middleParameter) {
      this.backData.s_middle_parameter = middleParameter;
      // //console.log('---wentou--',this.backData.s_middle_parameter)
    }
    ,
//保存封发日期
    delTime: function () {
      let d_datetime1 = this.dateFormat(new Date());
      let param = {
        table: this.backData.table,
        'i_id': this.backData.i_id,
        'd_sealdate': d_datetime1
      }
      postAction(this.url.updateData, param).then(res => {
        if (res.success) {
          // this.$emit("saveDelTime", d_datetime1)
          this.$message.success(res.message)
          this.reload();
        } else {
          this.$message.error(res.message)
        }
      })
    }
    ,
//按钮-发布
    publishInform: function () {
      //校验是否发布
      let checkParam = {};
      checkParam.table = this.backData.table;
      checkParam.i_id = this.backData.i_id;
      postAction(this.url.queryById, checkParam).then(res => {
        if (res.success && res.result.i_is_publish == 0) {
          this.$emit("publishInform")
        } else {
          this.$message.error("该公告已发布！")
        }
      })
    }
    ,
//按钮-取消发布
    unpublish: function () {
      this.$emit("unpublishBtn")
    }
    ,

    piliang: function () {
      this.$refs.watchForm.piliang();
      this.$refs.watchForm.title = "批量审阅";
      this.$refs.watchForm.disableSubmit = false;
    }
    ,
//弹窗-引入附件
    banwenModal: function () {
      this.$refs.banwenForm.show(this.backData);
      this.$refs.banwenForm.title = "引入附件";
      this.$refs.banwenForm.disableSubmit = false;
    }
    ,
//弹窗-引入办文依据
    bwyjModal: function () {
      this.$refs.banwenYiJuForm.show(this.backData);
      this.$refs.banwenYiJuForm.title = "引入办文依据";
      this.$refs.banwenYiJuForm.disableSubmit = false;
    }
    ,

//下载所有附件
    downAllFiles() {
      this.$emit("downFiles")
    }
    ,
//协同办公
    callaboration() {
      // 子组件获取 父组件的tableid 和 什么id  （标题上）
      this.$emit('callaboration')

    },

    //查看意见
    opinionModal: function () {
      this.backData['sTaskdefKey'] = this.taskMsg.taskDefinitionKey
      this.backData["opinionTable"] = this.backData.table + "_opinion"
      this.$refs.opinionlistForm.show(this.backData);
      this.$refs.opinionlistForm.title = "查看意见";
      this.$refs.opinionlistForm.disableSubmit = false;
    }
    ,

    //电子公告-预览
    lookUpBusdata() {
      let table = 'oa_busdata30';
      if (this.backData.table === table) {
        this.$emit('savaObj', false);
        window.open(window.location.origin + '/mytask/taskList/Test-detailFile?lookUp=true&tableName=' + table + '&busdataId=' + this.backData.i_id + '&navisshow=true')
      } else {
        this.$message.error("该业务暂不支持预览！")
      }
    },
//日期格式化
    dateFormat(date) {
      let date1 = new Date(date);
      let Y = date1.getFullYear();
      let M = date1.getMonth() + 1;
      let D = date1.getDate();
      let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
      return newTime;
    }

  },
//页面刷新
  shuaX(value) {//传入当前按钮的value值
    let that = this;
    let isrleod = false;
    that.btn.map((item, index) => {
      //判断是否需要刷新
      if (item.sbtnValue == value && item.iisRefresh == 1) {
        isrleod = true
      }
    });
    that.defindBtns.map((item, index) => {
      if (item.sbtnValue == value && item.iisRefresh == 1) {
        isrleod = true
      }
    });

    if (isrleod == true) {
      // this.reload();
      // window.location.replace(window.location.href);
      that.showBtn(that.butArrLists);
    }
  },

}