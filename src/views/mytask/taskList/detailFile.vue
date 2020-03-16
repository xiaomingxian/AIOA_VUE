<template>
  <a-modal
    :title="title"
    :width="1300"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="ok"
    @cancel="handleCancel"
    cancelText="取消">
    <form>

      <center>
        <table width="87%" border="0">
          <tr>
            <td align="right" colspan="3" class="">
              机密：
              <!--<a-select style="width: 120px" v-model="backData.i_safetylevel" placeholder="请选择密级" @change="change">-->
              <a-select style="width: 120px" v-model="secretModle" placeholder="请选择密级" @change="change">
                <a-select-option v-for="(item,index) in secretDegree" :key="index" :text="item.text"
                                 :value="item.value">{{item.text}}
                </a-select-option>
              </a-select>

            </td>
          </tr>
          <tr>
            <td align="center" colspan="2" height="50" valign="bottom">
              <h1 style="color: red; font-weight: 800; font-size: 25px">
                <span>{{backData.s_left_parameter}}</span>
                <span>{{backData.s_unit_name}}</span>
                <span>{{backData.s_dept_name}}</span>
                <span>{{backData.s_middle_parameter}}</span>
                <span>{{backData.s_right_parameter}}</span>
              </h1>
            </td>
          </tr>
          <center>
            <!--引入意见展示框-->
            <task-opt ref="taskOptRef" @optsReturn="optsGet"></task-opt>

            <!--引入模板等-->
            <!--发文-->
            <send-file v-if="pageRef == 'sendFile'" ref="sendFile" :backDataRef="backData" @getBackData="getBackData"
                       :optionMap="optionMap" :detailList="detailList" :taskParent="task"></send-file>


            <!--新发文-->
            <send-file-fu-zhou v-if="pageRef == 'sendFileFuZhou'" ref="sendFileFuZhou" :backDataRef="backData" @getBackData="getBackData"
                           :optionMap="optionMap" :detailList="detailList" :taskParent="task"></send-file-fu-zhou>


            <!--视频会议申请-->
            <video-meet v-if="pageRef == 'videoMeet'" ref="videoMeet" :backDataRef="backData"
                        @getBackData="getBackData"
                        :optionMap="optionMap" :detailList="detailList" :taskParent="task"></video-meet>


            <!--收文-->
            <receive-file v-if="pageRef == 'receiveFile'" ref="receiveFile" :backDataRef="backData"
                          :optionMap="optionMap"
                          @getBackData="getBackData"
                          :detailList="detailList"/>
            <!--会议室管理-->
            <meeting-room-file v-if="pageRef == 'meetingRoomFile'" ref="meetingRoomFile" :optionMap="optionMap"
                               :backDataRef="backData"
                               @getBackData="getBackData"
                               :detailList="detailList"/>
            <!--会议申请-->
            <meetint-inform v-if="pageRef == 'meetingInform'" ref="meetingInform" :backDataRef="backData"
                            :optionMap="optionMap" :detailList="detailList"/>
            <!--会议通知-->
            <meeting-notice v-if="pageRef == 'meetingNotice'" ref="meetingNotice" :backDataRef="backData"
                            @getBackData="getBackData"
                            :optionMap="optionMap" :detailList="detailList"></meeting-notice>
            <!--电子公告-->
            <electronic-file v-if="pageRef == 'electronicFile'" ref="electronicFile" :backDataRef="backData"
                             :detailList="detailList" :busFunction="busFunction" :optionMap="optionMap"
                             @isPublish="isPublish" :publishData="publishData" @validDate="validDate"></electronic-file>
            <!-- 请假申请-->
            <synthesize-file v-if="pageRef == 'synthesizeFile'" ref="synthesizeFile" :backDataRef="backData"
                             @getBackData="getBackData" :optionMap="optionMap"
                             :detailList="detailList"></synthesize-file>
            <!-- 签报管理-->
            <sign-quto-file v-if="pageRef == 'signQutoFile'" ref="signQutoFile" :backDataRef="backData"
                            @getBackData="getBackData" :optionMap="optionMap"
                            :detailList="detailList"></sign-quto-file>
            <!--公文传阅-->
            <inside-reading-file v-if="pageRef == 'insideReadingFile'" ref="insideReadingFile" :backDataRef="backData"
                                 @getBackData="getBackData" :optionMap="optionMap"
                                 :detailList="detailList"></inside-reading-file>
            <!--富文本框-->
            <table width="100%"
                   style=" border-right:1px solid #F0F5FC; ;border-left:1px  solid #F0F5FC; ;border-bottom:1px solid #F0F5FC; ;">
              <tr v-show="jeditShow">
                <!--<td class="title" colspan="1" width="15%" style="border-right: 1px solid #F0F5FC;">-->
                <!--<center><h3>{{detailList.s_title}}</h3></center>-->
                <!--</td>-->
                <td colspan="4">
                  <j-editor class="fuwenben" v-model="jeditor.value"/>
                </td>
              </tr>
            </table>
            <!--发布范围-->
            <table width="100%"
                   style=" border-right:1px solid #F0F5FC; ;border-left:1px  solid #F0F5FC; ;border-bottom:1px solid #F0F5FC; ;">
              <tr v-show="isLimitsShow">
                <td class="title" width="10%" style="width: 163px;border-right: 1px solid #F0F5FC;">
                  <center><h3>发布范围：</h3></center>
                </td>
                <td colspan="3">
                  <release-scope ref="resleaseScope" @change1="change1" :backData="backData"/>
                </td>
              </tr>
            </table>

          </center>
        </table>

        <br/>
        <task-btn ref="taskRef" @submit="submit" @publishInform="publishInform" @unpublishBtn="unpublishBtn"
                  @saveDocNum="saveDocNum"
                  @saveGongwenData="saveGongwenData" @saveDelTime="saveDelTime"
                  @savaObj="savaObj" :backData="backData" :backDataOpt="backDataOpt" :taskMsg="task"
                  :opts="opts" @downFiles="downFiles"
                  @destoryObj="destoryObj" @iIsImportantObj="iIsImportantObj"
                  @watchSub="watchSub" :oaFileList="oaFileList" @close="handleCancel"></task-btn>

      </center>
    </form>
  </a-modal>
</template>

<script>
  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import taskBtn from '../../buttons/taskBtn'
  import taskOpt from '../../buttons/taskOpt'
  import JEditor from '@/components/jeecg/JEditor'
  import {ntkoBrowser} from '../../buttons/btn-js/ntkobackground.min.js'
  import ReleaseScope from "@/views/oaBus/pageModels/releaseScope";
  //业务页面
  import sendFile from '@/views/mytask/taskList/sendFile'
  import receiveFile from '@/views/mytask/taskList/receiveFile'
  import MeetingRoomFile from "@/views/mytask/taskList/meetingRoomFile";
  import MeetintInform from "@/views/mytask/taskList/meetingInform";
  import MeetingNotice from "@/views/mytask/taskList/meetingNotice";
  import ElectronicFile from "@/views/mytask/taskList/electronicFile";
  import SynthesizeFile from "./synthesizeFile";
  import SignQutoFile from "./signQutoFile";
  import InsideReadingFile from "./insideReadingFile";
  import videoMeet from "@/views/mytask/taskList/videoMeet";
  import SendFileFuZhou from "./sendFileFuZhou";



  export default {
    name: "detailFile",
    inject: ['reload'],
    mixins: [JeecgListMixin],
    components: {
      SendFileFuZhou,
      videoMeet,
      InsideReadingFile,
      SignQutoFile,
      SynthesizeFile,
      MeetingNotice,
      ElectronicFile,
      ReleaseScope,
      taskBtn,
      taskOpt,
      JEditor,
      //业务
      sendFile,
      MeetintInform,
      MeetingRoomFile,
      receiveFile,
    },
    data() {
      return {
        visible: false,
        title: '业务详情',
        confirmLoading: false,
        userData: '',
        secretDegree: [],
        secretModle: '',
        //代办信息
        task: {},
        //已办信息
        taskDone: '',
        opts: [],//意见框信息
        pageRef: '',//意见框信息
        editValue: 0,
        //意见表相关
        backDataOpt: {
          //回填数据id
          table: 'oa_busdata20_opinion',
          i_id: "",
          i_opinion_set_id: "",
          i_bus_function_id: "",
          i_busdata_id: "",
          s_name: "",
          i_user_id: "",
          d_sign: "",
          s_opinion: "",
          s_opinion_type: "",
          s_task_id: "",
          s_task_name: "",
          s_overt: "",
          i_order: "",
          s_tpye: "",
          s_dept_id: "",
          s_dept_name: "",
          s_taskdef_key: ""
        },
        detailList: null,    //  文档数据   字段含义
        oaFileList: [],    //  文档数据   字段含义
        busFunction: {},
        busTextData: {},
        optionMap: {},
        //表中的数据相关值
        jeditShow: false,   //富文本编辑器的内容的value值
        isLimitsShow: false,   //富文本编辑器的内容的value值
        jeditor: {
          value: ''
        },
        backData: {},
        //发布范围相关
        publishData: {
          iIsLimits: '', //选择范围（1 全行 2 部门 3 用户）
          departId: '',  //部门ids
          userRealName: '' //用户名称
        },
        url: {
          optionAndBtn: '/oaBus/newTask/optionAndBtn',
          currentUserMsg: '/sys/user/getUserSectionInfoByToken',
          updateReadStatus: '/oaBus/taskInAct/changeStatus',
          selectTaskType: '/oaBus/busModel/list',
          selectTask: '/oaBus/busModel/list',
          queryOaFileList: '/oaBus/oaFile/queryOaFileList',
          functionQuery: '/oaBus/busFunction/list',
          insert: '/oaBus/dynamic/insert',//动态新增数据
          updateBusdata: '/oaBus/dynamic/update',//动态修改数据

          /*加载数据*/
          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',

        }
      }
    },
    created() {
      // getAction(this.url.currentUserMsg).then(res => {
      //   this.userData = res.result
      // })

    },

    //销假--添加销假时间
    destroyed() {
      this.backData = {};
      this.destroy = false;
    },
    methods: {
      getBackData(backData) {
        //最新业务详情回传
        // this.$refs.taskRef.backData = backData
        // this.$refs.taskRef.reload()

      },
      //获取发布范围数据
      change1(data) {
        for (var i in  data) {
          this.publishData = data
        }
      },
      //发布按钮
      publishInform() {
        this.$refs[this.pageRef].isSelectDate();
      },
      //取消发布
      unpublishBtn() {
        this.$refs.resleaseScope.unpublish();
      },
      //确定发布按钮
      isPublish(data) {
        if (data == true) {
          //调用发布
          this.$refs.resleaseScope.handerOk();
        } else {
          // this.$refs[this.pageRef].save(data)
          this.$refs.resleaseScope.handerOk();
        }
      },
      validDate(date) {
        this.backData.d_datetime1 = date;
        // alert(this.backData.d_datetime1)
      },
      //发送通知
      submit(data) {
        this.$refs[this.pageRef].submit(data)
      },

      /*登记文号数据*/
      saveDocNum(data) {
        //this.ntko['i_file_num_id'] = data.id
        this.$refs[this.pageRef].saveDocNum(data)
      },
      //公文链接数据
      saveGongwenData(data) {
        this.$refs[this.pageRef].saveGongwenData(data)
      },
      //封发日期数据
      saveDelTime(data) {
        this.$refs[this.pageRef].saveDelTime(data)

      },
      // 关注件--是否重要
      iIsImportantObj(e) {
        console.log("-=-=-关注件=-=-=-=-=-")
        this.$refs[this.pageRef].iIsImportant()
      },
      //销假--添加销假时间
      destoryObj(e) {
        //保存业务模板数据
        this.$refs[this.pageRef].destory()
      },
      //保存所有数据
      savaObj(e) {
        //校验富文本编辑器数据

        if (this.busFunction.iisEditor == 1) {
          let params = {}
          params.table = "oa_busdata_text";
          params.i_busdata_id = this.backData.i_id;
          params.s_text = this.jeditor.value;
          params.s_busdata_table = this.backData.table
          if (this.editValue == 0 && this.busTextData == null) {
            postAction(this.url.insert, params).then(res => {
              this.editValue = res.result.i_id// console.log(res.result.i_id); //富文本id
            })
          } else {
            params.i_id = this.busTextData.i_id;
            postAction(this.url.updateBusdata, {
              'updateBusdata': params
            }).then(res => {
            })
          }
        }
        console.log(this.pageRef)
        //保存业务模板数据
        this.$refs[this.pageRef].save()
        // this.$emit('close');
        // this.visible = false;

      },
      /* openFile(cmd, fileName) {
         let ntkoed = ntkoBrowser.ExtensionInstalled();
         if (ntkoed) {
           ntkoBrowser.openWindow(window.location.origin + "/ntko/editindex.html?cmd=" + cmd + "&fileName=" + fileName + "&userName=" + "admin" + "&sbtnid=" + 43);
         } else {
           window.open(window.location.origin + "/ntko/exeindex.html")
         }
         window.ntkoCloseEvent = function () {
           // alert("跨浏览器插件应用程序窗口已关闭")
         }
       },*/
      qiCao1(index, fileName) {
        //alert(fileName)

        let name = fileName.split('\\')
        var name1 = name[name.length - 1]
        // alert(name1)
        this.$refs.taskRef.showFujianFile2(index, name1);
      },
      optsGet(opts) {
        this.opts = opts
      },
      change(e) {
        this.backData.i_safetylevel = e;
        let params = {table: this.backData.table, i_id: this.backData.i_id, i_safetylevel: this.backData.i_safetylevel}
        postAction(this.url.updateBusdata, params).then((rec) => {
          console.log(rec)
        })
      }, changeHuanJi(e) {
        this.backData.i_urgency = e
      },
      //详情页面数据
      showTaskInAct(taskDetail, task) {
        //查询出优先级
        this.task = task
        this.show(taskDetail)
      },
      //--------------------------------------   展示业务大详情    弹窗-----------------------------------------------------------------------------
      show(taskDetail) {
        let param = {
          tableName: taskDetail.tableName,
          busdataId: taskDetail.busdataId
        }
        if (this.task.id != undefined && this.task.id != '') {
          param.taskId = this.task.id
          param.proInstanId = this.task.processInstanceId
          if (taskDetail.status != undefined) {//用于修改状态为已读
            param.status = taskDetail.status
          }
        }
        postAction(this.url.busDataAndColums, param).then((res) => {
          if (res.success) {

            this.backData.key = res.result.btnAndOpt.key;
            this.optSet(res.result.btnAndOpt.opt, this.backData.key);
            this.$refs.taskRef.showBtn(res.result.btnAndOpt.btn);


            //字典值获取
            this.optionMap = res.result.optionMap;
            this.secretDegree = res.result.optionMap.secretDegree;
            //业务数据赋值
            let dataBus = res.result.oaBusdata;
            dataBus['iprocSetId'] = res.result.proSetId;
            dataBus['key'] = res.result.taskDefKey
            dataBus.act_show = res.result.actShow
            this.backData = dataBus
            this.backDataOpt.s_task_id = res.result.taskId
            //机密等级
            let secretModleTest = this.backData.i_safetylevel;
            this.secretModle = JSON.stringify(secretModleTest)

            //文档数据
            this.detailList = res.result.detailList;
            //业务页面的ref
            this.pageRef = res.result.pageRef;
            this.busFunction = res.result.busFunction;
            this.busTextData = res.result.busTextData;

            //富文本显示控制
            if (this.busFunction.iisEditor == 1) {
              if (this.busTextData != null) {
                this.jeditor.value = this.busTextData.s_text;
              }
              this.jeditShow = true;
            }
            if (this.busFunction.iisLimits == 1) {
              this.isLimitsShow = true;
            }

            /**
             * 刷新页面后,task数据覆盖
             */
            this.task.pageRef = res.result.pageRef
            this.task.id = res.result.taskId
            this.task.taskDefinitionKey = res.result.taskDefKey
            this.task.processDefinitionId = res.result.processDefinitionId
            this.task.processInstanceId = res.result.processInstanceId

            console.log('-----------------11111111:::', JSON.stringify(this.task))


          } else {
            this.$message.error(res.message)
            this.visible = false
          }
        })
        this.visible = true

      },
      //子孙组件事件回传
      watchSub(e) {
        this.getOaFileList(this.backData.table, this.backData.i_id);
      },
      //意见id赋值  区分新增与更新
      optSet(opts, key) {
        var map2 = []
        var keys = []
        var map = {}

        for (let i in opts) {
          let key = opts[i].optionName
          if (keys.indexOf(key) < 0) {
            keys.push(key)
          }

          if (map[key] == undefined) {
            map[key] = opts[i]
            map[key].optionContext2 = ''
            map[key].optionContext2 += opts[i].optionContext + '\t' + opts[i].signName + '\t' + opts[i].signTime + '\n'
            map[key].taskDefKeys = []
            map[key].taskDefKeys.push(map[key].taskDefKey)
          } else {
            let optx = opts[i].optionContext + '\t' + opts[i].signName + '\t' + opts[i].signTime + '\n'
            map[key].optionContext2 += optx
            if ((map[key].taskDefKeys).indexOf(opts[i].taskDefKey) < 0) {
              map[key].taskDefKeys.push(opts[i].taskDefKey)
            }
          }
          if (opts[i].taskDefKey == key) {
            this.backDataOpt.i_id = opts[i].optId
          }
        }

        for (let i of keys) {
          map2.push(map[i])
        }


        this.$refs.taskOptRef.showOpt(map2);

      },

      ok() {
        this.handleCancel()
      },

      getOaFileList(tableName, busDataId) {
        this.$refs[this.pageRef].getOaFiles(tableName, busDataId);

      },
      downFiles() {
        this.$refs[this.pageRef].downAllFiles();
      },
      handleCancel() {
        //刷新数据  若测试该方法有效  请删除多余代码
        this.reload();

        /*  this.$emit('close');
          this.jeditor.value = '';
          this.publishData = "";
          this.editValue == 0
          this.visible = false;
          this.disableSubmit = false;
          //清除意见与按钮页面数据
          this.$refs.taskOptRef.clear()

          //刷新父页面
          this.$emit('reload_todo')*/
      }, onChange(date, dateString) {
        // console.log(date, dateString);
      }, onChange2(date, dateString) {
        // console.log(date, dateString);
      }

    }
  }
</script>
<style lang="less" scoped>


  .fuwenben {
    /deep/ .ant-card-body {
      padding: 0 !important;
    }
  }

  .hoverred:hover {
    color: red;
    cursor: pointer;
  }
</style>