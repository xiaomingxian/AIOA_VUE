<template>
<!--  position: fixed;-->
  <form style="background-color: #fff;padding-top: 20px;">
    <!--<div v-show="true" @change="changRouter" v-model="routeParam">{{this.$route.params.tableName}}</div>-->
    <center>
      <div :style="{height: scrHeight}" style="overflow: auto;scrollbar-width: none;">
        <table width="87%" border="0">

          <tr v-show="previewFlag">
            <td style="padding: 2% 0%;" align="right" colspan="3">
              密级：
              <!--<a-select style="width: 120px" v-model="bacwangzhaData.i_safetylevel" placeholder="请选择密级" @change="change">-->
              <a-select style="width: 120px;margin-right: 27px;" v-model="secretModle" placeholder="请选择密级"
                        @change="change">
                <a-select-option v-for="(item,index) in secretDegree" :key="index" :text="item.text"
                                 :value="item.value">{{item.text}}
                </a-select-option>
              </a-select>


              缓急：
              <!--<a-select style="width: 120px" v-model="backData.i_safetylevel" placeholder="请选择密级" @change="change">-->
              <a-select style="width: 120px" v-model="i_urgency" placeholder="请选择缓急" @change="changeUrgency">
                <a-select-option v-for="(item,index) in urgencyList" :key="index" :text="item.text"
                                 :value="parseInt(item.value)">{{item.text}}
                </a-select-option>
              </a-select>

            </td>
          </tr>
          <tr v-show="previewFlag">
            <td style="padding: 4% 0% 2%" align="center" colspan="2" height="50" valign="bottom">
              <h1 style="color: red; font-weight: 800; font-size: 34px;margin-top: -60px;">
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
            <send-file v-if="pageRef == 'sendFile'" ref="sendFile" :backDataRef="backData" :isShowFile="isShowFile"
                       @getBackData="getBackData"
                       :optionMap="optionMap" :detailList="detailList" :taskParent="task"></send-file>

            <!--发文-->
            <send-file-fu-zhou v-if="pageRef == 'sendFileFuZhou'" ref="sendFileFuZhou" :backDataRef="backData"
                               @getBackData="getBackData" :isShowFile="isShowFile"
                               :optionMap="optionMap" :detailList="detailList" :taskParent="task"></send-file-fu-zhou>


            <!--电教室使用需求-->
            <electric-room v-if="pageRef == 'electricRoom'" ref="electricRoom" :backDataRef="backData"
                           @getBackData="getBackData" :isShowFile="isShowFile"
                           :optionMap="optionMap" :detailList="detailList" :taskParent="task"></electric-room>


            <!--电子设备进出机房申请-->
            <electric-equipment v-if="pageRef == 'electricEquipment'" ref="electricEquipment" :backDataRef="backData"
                                @getBackData="getBackData" :isShowFile="isShowFile"
                                :optionMap="optionMap" :detailList="detailList" :taskParent="task"></electric-equipment>


            <!--案件（线索）登记-->
            <case-clues v-if="pageRef == 'caseClues'" ref="caseClues" :backDataRef="backData"
                        @getBackData="getBackData"
                        :optionMap="optionMap" :detailList="detailList" :taskParent="task"></case-clues>


            <!--护照办理-->
            <passport-hand v-if="pageRef == 'passportHand'" ref="passportHand" :backDataRef="backData"
                           @getBackData="getBackData"
                           :optionMap="optionMap" :detailList="detailList" :taskParent="task"></passport-hand>


            <!--局域网电话网接入登记表-->
            <lan-access v-if="pageRef == 'lanAccess'" ref="lanAccess" :backDataRef="backData"
                        @getBackData="getBackData"
                        :optionMap="optionMap" :detailList="detailList" :taskParent="task"></lan-access>


            <!--收文-->
            <receive-file v-if="pageRef == 'receiveFile'" ref="receiveFile" :backDataRef="backData"
                          :isShowFile="isShowFile"
                          :optionMap="optionMap"
                          @getBackData="getBackData"
                          :detailList="detailList"/>
            <!--会议室管理-->
            <meeting-room-file v-if="pageRef == 'meetingRoomFile'" ref="meetingRoomFile" :optionMap="optionMap"
                               :isShowFile="isShowFile"
                               :backDataRef="backData"
                               @getBackData="getBackData"
                               :detailList="detailList"/>
            <!--会议申请-->
            <meetint-inform v-if="pageRef == 'meetingInform'" ref="meetingInform" :backDataRef="backData"
                            :isShowFile="isShowFile"
                            :optionMap="optionMap" :detailList="detailList"/>
            <!--会议通知-->
            <meeting-notice v-if="pageRef == 'meetingNotice'" ref="meetingNotice" :backDataRef="backData"
                            @getBackData="getBackData" :isShowFile="isShowFile"
                            :optionMap="optionMap" :detailList="detailList"></meeting-notice>
            <!--电子公告-->
            <electronic-file v-if="pageRef == 'electronicFile'" ref="electronicFile" :backDataRef="backData"
                             :isShowFile="isShowFile"
                             :detailList="detailList" :busFunction="busFunction" :optionMap="optionMap"
                             @isPublish="isPublish" :publishData="publishData" @validDate="validDate"></electronic-file>
            <!-- 请假申请-->
            <synthesize-file v-if="pageRef == 'synthesizeFile'" ref="synthesizeFile" :backDataRef="backData"
                             @getBackData="getBackData" :optionMap="optionMap"
                             :detailList="detailList"></synthesize-file>

            <!--视频会议申请-->
            <video-meet v-if="pageRef == 'videoMeet'" ref="videoMeet" :backDataRef="backData"
                        @getBackData="getBackData"
                        :optionMap="optionMap" :detailList="detailList" :taskParent="task"></video-meet>


            <!-- 签报管理-->
            <sign-quto-file v-if="pageRef == 'signQutoFile'" ref="signQutoFile" :backDataRef="backData"
                            @getBackData="getBackData" :optionMap="optionMap"
                            :detailList="detailList"></sign-quto-file>
            <!--公文传阅-->
            <inside-reading-file v-if="pageRef == 'insideReadingFile'" ref="insideReadingFile" :backDataRef="backData"
                                 :isShowFile="isShowFile"
                                 @getBackData="getBackData" :optionMap="optionMap" @isPublish="isPublish"
                                 :publishData="publishData"
                                 :detailList="detailList"></inside-reading-file>

            <!--电子公告预览-->
            <preview v-if="pageRef == 'preview'" ref="preview" :backDataRef="backData"
                     :detailList="detailList" :busFunction="busFunction" :optionMap="optionMap"
                     @isPublish="isPublish" :publishData="publishData" @validDate="validDate"></preview>
            <!-- &lt;!&ndash; 协同办公-->
            <oa-teamwork-set-list-model ref="teamword" @WorkList="WorkList"></oa-teamwork-set-list-model>
            <!--富文本框-->
            <table width="100%" ref="editTable"
                   style=" border-right:1px solid rgb(145, 56, 56); ;border-left:1px  solid rgb(145, 56, 56); ;border-bottom:1px solid rgb(145, 56, 56); ;">
              <tr v-show="jeditShow">
                <!--<td class="title" colspan="1" width="15%" style="border-right: 1px solid rgb(145, 56, 56);">-->
                <!--<center><h3>{{detailList.s_title}}</h3></center>-->
                <!--</td>-->
                <td colspan="4">
                  <j-editor ref="jeditor" :newHeight="newHeight" :disabled="disableFlag" class="fuwenben"
                            v-model="jeditor.value"/>
                </td>
              </tr>
            </table>
            <!--发布范围-->
            <table width="100%"
                   style=" border-right:1px solid rgb(145, 56, 56); ;border-left:1px  solid rgb(145, 56, 56); ;border-bottom:1px solid rgb(145, 56, 56); ;">
              <tr v-show="isLimitsShow">
                <td class="title" width="15%" style="border-right: 1px solid rgb(145, 56, 56);">
                  <center><h3>发布范围</h3></center>
                </td>
                <td colspan="3">
                  <release-scope ref="resleaseScope" @change1="change1" @userNames="userNames" @userIDs="userIDs"
                                 :backData="backData"/>
                </td>
              </tr>
            </table>

          </center>
        </table>
      </div>
      <!--隐藏 按钮-->
      <br/>
      <task-btn v-show="previewFlag" ref="taskRef" @submit="submit" @publishInform="publishInform"
                @unpublishBtn="unpublishBtn"
                @saveDocNum="saveDocNum"
                @checkData="checkData"
                @nextCheckDataFun="nextCheckDataFun"
                @saveGongwenData="saveGongwenData" @saveDelTime="saveDelTime"
                @savaObj="savaObj" :backData="backData" :busFunction="busFunction" :backDataOpt="backDataOpt"
                :taskMsg="task"
                :opts="opts" @downFiles="downFiles"
                @destoryObj="destoryObj" @iIsImportantObj="iIsImportantObj" @cancelImportantObj="cancelImportantObj"
                @watchSub="watchSub" :oaFileList="oaFileList" @close="handleCancel" @callaboration="callaboration"
                @getbackDataNew="getbackDataNew" @reloadOpinion="reloadOpinion"
      ></task-btn>
    </center>
  </form>
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
  import sendFileFuZhou from "@/views/mytask/taskList/sendFileFuZhou";
  import electricRoom from "./electricRoom";
  import electricEquipment from "./electricEquipment";
  import caseClues from "@/views/mytask/taskList/caseClues";
  import oaTeamworkSetListModel from "@/views/oaTeamwork/modules/oaTeamworkSetListModel";
  import preview from "./preview";
  import videoMeet from "./videoMeet";
  import passportHand from "./passportHand";
  import lanAccess from "./lanAccess";


  export default {
    name: "detailFile",
    inject: ['reload'],
    mixins: [JeecgListMixin],
    components: {
      lanAccess,
      electricEquipment,
      electricRoom,
      passportHand,
      videoMeet,
      caseClues,
      sendFileFuZhou,
      preview,//预览页面
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
      oaTeamworkSetListModel
    },
    data() {
      return {
        visible: false,
        title: '业务详情',
        confirmLoading: false,
        userData: '',
        disableFlag: false,
        secretDegree: [],
        xietongList: [],
        Ints: [],
        iteamworkId: '',
        iorder: '',
        formHeight: '',
        scrHeight: '',
        urgencyList: [],
        secretModle: '',
        i_urgency: '',
        TableName: '',
        busModelId: '',
        functionId: '',
        newDataId: '',
        iteamworkSetId: '',
        isShowFile: false, //附件按钮控制
        //富文本的高度
        newHeight: 300,
        //电子公告模板
        previewFlag: true,
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
        routeParam: '',
        optionMap: {},
        intslist: [],
        busDataId: '',
        dataId: '',
        iversion: '',
        //表中的数据相关值
        dealBtn: {},
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
          userRealName: '', //用户名称
          userIdS: '',//用户ids
        },
        url: {
          list: "/oateamwork/oaTeamworkSet/findListByteamworkId",
          selectInts: "/oateamwork/oaTeamworkSet/findListByteamworkId",
          selectNext: "/oateamwork/oaTeamworkSet/selectNext",//协同办公配置的查询
          Intslist: "/oaTea/oaTeamworkInst/querylist",
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

        },

        userinfo: '',
        userid: ''

      }
    },
    created() {
      this.formHeight = window.innerHeight;
      this.scrHeight = window.innerHeight - 60 + 'px';
      //监听页签切换  修改标题
      var _this = this;
      document.addEventListener('visibilitychange', function () {
        // document.title = _this.backData.s_right_parameter
        document.title = '[' + _this.backData.s_right_parameter + ']' + _this.backData.s_title
        // document.title = document.hidden?'拜拜11111':' 回来啦2222'
        if (document.hidden) {
          _this.showBtn(_this.butArrLists);
        }
      })

      /*let param = this.$route.params ;
      console.log(param)
      this.show(param)*/
      this.changRouter()
      getAction(this.url.currentUserMsg).then(res => {
        this.userData = res.result
      })
      //获取用户基本信息
      const userinfo = JSON.parse(localStorage.getItem('userdata')).userInfo;
      console.log(userinfo);
      this.userinfo = userinfo;
      this.userid = userinfo.id;
      // this.showOpen(this.userid);
    },
    destroyed() {
      this.backData = {};
      this.destroy = false;
    },
    watch: {
      '$route.query': function (newVal, oldVal) {
        if (JSON.stringify(newVal) !== '{}') {
          console.log(newVal)
          this.reload();
          this.show(newVal);
        }
      }
    },
    methods: {
      // jeditorBlurText(){
      //   if(this.$refs.jeditor.value == ''){
      //     this.$refs.jeditor.$el.style.border = '1px solid red';
      //   }else {
      //     this.$refs.jeditor.$el.style.border = '1px solid #d9d9d9';
      //   }
      //
      // },

      //下一任务时校验对应点数据，并修改方法
      nextCheckDataFun() {
        this.$refs[this.pageRef].nullText();
      },
      //----------------webSocket的处理
      initWebSocket: function (userId) {
        // 将busdataId作为路径，传到服务器中
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        var url = window._CONFIG['domianURL'].replace("https://", "ws://").replace("http://", "ws://") + "/websocket/" + userId;
        //alert(url)
        this.websock = new WebSocket(url);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen: function () {

        var url = window._CONFIG['domianURL'].replace("https://", "ws://").replace("http://", "ws://") + "/websocket/";

        console.log("WebSocket连接成功", url);
      },
      websocketonerror: function (e) {
        console.log("WebSocket连接发生错误");
      },
      websocketonmessage: function (e) {
        //console.log(e.data)
        var data = eval("(" + e.data + ")");
        //处理订阅信息
        if (data.cmd == "topic") {
          //TODO 系统通知
          console.log(e)
        } else if (data.cmd == "user") {
          //TODO 用户消息
          let res = JSON.parse(e.data)
          console.log("websocket接受消息:",res.msgTxt)
          if (res.msgTxt == "kongjian") {
            console.log(this.dealBtn);
            //this.$refs.taskRef.saveBusData();
            this.$refs[this.pageRef].saveNoCheck()
            //this.$refs.taskRef.alertBtnStaus(res.msgTxt,this.dealBtn) ;
          }
          //if(e.data.m)
        }
      },
      websocketclose: function (e) {
        console.log("connection closed (" + e.code + ")");
      },
      //----------------webSocket的处理end
      getbackDataNew(ref) {
        console.log('++++==============', ref)
        this.backData = this.$refs[ref].getBackDataNew()

        return this.$refs.taskRef.setBackDataNew(this.backData)
      },
      // 协同办公
      callaboration() {
        getAction(this.url.Intslist).then((res) => {
          this.intslist = res.result;
          if (this.intslist.length == 0) {
            this.$refs.teamword.showOpen(this.userid, this.backData, this.busDataId);
          } else {
            this.dataId = this.intslist[this.intslist.length - 1].ibusdataId;
            this.iteamworkId = this.intslist[this.intslist.length - 1].iteamworkId;
            this.iorder = this.intslist[this.intslist.length - 1].iorder + 1;
            this.iteamworkSetId = this.intslist[this.intslist.length - 1].iteamworkSetId
            if (this.dataId != Number(this.busDataId)) { //新的流程
              console.log(this.dataId)
              console.log(this.busDataId)
              this.$refs.teamword.showOpen(this.userid, this.backData, this.busDataId);
            } else {
              console.log(this.dataId)
              getAction("/oateamwork/oaTeamworkSet/findMax", {TeamworkId: this.iteamworkId}).then(res => {
                this.maxOrder = res.result
                console.log(this.iorder - 1)
                console.log(this.maxOrder)
                if (Number(this.iorder - 1) < Number(this.maxOrder)) {
                  //开始查下一个环节的任务id
                  getAction(this.url.selectNext, {iTeamworkId: this.iteamworkId, iOrder: this.iorder}).then((res) => {
                    console.log(res)
                    this.busModelId = res.ibusModelId
                    this.functionId = res.ibusFunctionId
                    let param = {
                      modelId: res.ibusModelId,
                      functionId: res.ibusFunctionId,
                    }


                    postAction("/oaBus/oaBusdata/queryNewTaskMsg", param).then(res => {
                      if (res.success) {
                        const promise1 = new Promise((resolve => {
                          this.newDataId = JSON.stringify(res.result.busdataId)
                          console.log(JSON.stringify(res.result));
                          // console.log(window.location);
                          // window.location.href(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + res.result.tableName + '&busdataId=' + res.result.busdataId + '&navisshow=false')
                          this.$router.push({path: '/mytask/taskList/Test-detailFile?tableName=' + res.result.tableName + '&busdataId=' + res.result.busdataId + '&navisshow=false'})
                          resolve(this.newDataId)
                        }))


                        promise1.then((newDataId) => {
                          console.log(this.newDataId)
                          // console.log(res.ibusModelId)
                          console.log(this.iteamworkSetId)
                          let data1 = {
                            iteamworkId: this.iteamworkId,
                            iteamworkSetId: this.iteamworkSetId,
                            iorder: this.iorder,
                            ibusdataId: newDataId,
                            iversion: this.intslist[this.intslist.length - 1].iversion,
                            ibusModelId: this.busModelId,
                            ibusFunctionId: this.functionId
                          }
                          let dataList = {
                            data1: data1
                          }
                          postAction("/oaTea/oaTeamworkInst/add", dataList).then(res => {
                            if (res.success) {
                              this.$message.success(res.message)
                            } else {
                              this.$message.error(res.message)
                            }
                          })

                        })

                      } else {
                        this.$message.error(res.message)
                      }
                    })

                  })
                } else {
                  this.$message.warn('协同任务已完成')
                }

              })


            }

          }

        })


        /* const promise1 = new Promise((resolve,reject)=>{
           console.log(this.backData.s_right_parameter)
           getAction(this.url.list, {TeamworkName: this.backData.s_right_parameter}).then(res => {
             this.xietongList = res;
             console.log(res)
             resolve( this.xietongList )
           })
         })
         promise1.then((lists)=>{
           // this.findMax(lists);
           new Promise((resolve,reject)=>{
             getAction("/oaTea/oaTeamworkInst/findMax",{iteamworkId:lists[0].iteamworkId}).then(res => {
               resolve(res.result,lists)
             })
           }).then((maxOrder,e)=>{
             console.log(maxOrder);
             console.log(e);

             if( typeof (maxOrder)== 'String'|| typeof (maxOrder)== 'undefined'){
               console.log(111);
               this.findTableName(lists[0].ibusModelId,lists[0].ibusFunctionId);
               let Datas = {
                 iteamworkId:lists[0].iteamworkId,
                 iteamworkSetId:lists[0].iid,
                 iorder:0,
                 ibusModelId:lists[0].ibusModelId,
                 ibusFunctionId:lists[0].ibusFunctionId
               }
               postAction("/oaTea/oaTeamworkInst/add", Datas).then(res => {
                 if (res.success) {
                   this.$message.success(res.message)
                 } else {
                   this.$message.error(res.message)
                 }
               })
             }
             else{
               const promise1 = new Promise((resolve,reject)=>{
                 console.log(this.backData.s_right_parameter)
                 getAction(this.url.list, {TeamworkName: this.backData.s_right_parameter}).then(res => {
                   this.xietongList = res;
                   console.log(res)
                   resolve( this.xietongList )
                 })
               })
               promise1.then((lists)=>{
                 // this.findMax(lists);
                 new Promise((resolve,reject)=>{
                   getAction("/oaTea/oaTeamworkInst/findMax",{iteamworkId:lists[0].iteamworkId}).then(res => {
                     resolve(res.result,lists)
                   })
                 }).then((maxOrder,e)=>{
                   console.log(maxOrder);
                   console.log(e);
                   if(maxOrder<=lists[maxOrder].iorder){
                     console.log(222);
                     console.log(lists[maxOrder])
                     this.findTableName(lists[maxOrder+1].ibusModelId,lists[maxOrder+1].ibusFunctionId);
                     let Datas = {
                       iteamworkId:lists[maxOrder].iteamworkId,
                       iteamworkSetId:lists[maxOrder].iid,
                       iorder:lists[maxOrder].iorder,
                       ibusModelId:lists[maxOrder].ibusModelId,
                       ibusFunctionId:lists[maxOrder].ibusFunctionId
                     }
                     postAction("/oaTea/oaTeamworkInst/add", Datas).then(res => {
                       if (res.success) {
                         this.$message.success(res.message)
                       } else {
                         this.$message.error(res.message)
                       }
                     })

                   }
                 })

               }).then(()=>{
               })
             }
           })
       }).then(()=>{
         })*/


      },
      findMax(lists) {
        return new Promise((resolve, reject) => {
          console.log(lists[0].iteamworkId)
          getAction("/oaTea/oaTeamworkInst/findMax", {iteamworkId: lists[0].iteamworkId}).then(res => {
            this.maxOrder = res.result
            console.log(this.maxOrder)
            resolve(lists)
          })
        })

      },
      getBackData(backData) {
        //最新业务详情回传
        // this.$refs.taskRef.backData = backData
        // this.$refs.taskRef.reload()

      },
      changRouter(value) {
        let param = this.$route.query;
        if (param.haveTask != undefined && param.haveTask) {
          this.task = param.task
        }
        //console.log(this.$route.query);
        this.show(param)
      },
      //获取发布范围数据
      change1(data) {
        for (var i in  data) {
          this.publishData = data
        }
      },
      //获取用户ids
      userIDs(data) {
        this.publishData.userIdS = data;
      },
      userNames(data) {
        this.publishData.userRealName = data.join(',');
      },
      //发布按钮
      publishInform() {
        // this.$refs[this.pageRef].isSelectDate();
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
        let message = false
        this.$refs[this.pageRef].save(message)
        this.$refs.resleaseScope.handerOk();
      },
      //取消发布
      unpublishBtn() {
        this.$refs.resleaseScope.unpublish();
      },
      //确定发布按钮
      // isPublish(data) {
      //   if (data == true) {
      //     //调用发布
      //     this.$refs.resleaseScope.handerOk();
      //   } else {
      //     // this.$refs[this.pageRef].save(data)
      //     this.$refs.resleaseScope.handerOk();
      //   }
      // },
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
      cancelImportantObj(){
        this.$refs[this.pageRef].cancelImportant()
      },
      // 关注件--是否重要
      iIsImportantObj(e) {
        this.$refs[this.pageRef].iIsImportant()
      },
      //销假--添加销假时间
      destoryObj(e) {
        //保存业务模板数据
        this.$refs[this.pageRef].destory()
      },
      //保存所有数据
      savaObj() {
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
      optsGet(opts) {
        this.opts = opts
      },
      //修改机密
      change(e) {
        this.backData.i_safetylevel = e;

        //更新缓急--往缓存里存储一份
        localStorage.setItem('密级:' + this.backData.table + this.backData.i_id, e)
        // let params = {table: this.backData.table, i_id: this.backData.i_id, i_safetylevel: this.backData.i_safetylevel}
        // postAction(this.url.updateBusdata, params).then((rec) => {
        //   console.log(rec)
        // })
      },
      //修改缓急
      changeUrgency(e) {
        this.backData.i_urgency = e;
        //更新缓急--往缓存里存储一份
        localStorage.setItem('缓急:' + this.backData.table + this.backData.i_id, e)

        // let params = {table: this.backData.table, i_id: this.backData.i_id, i_urgency: this.backData.i_urgency}
        // postAction(this.url.updateBusdata, params).then((rec) => {
        //   console.log(rec)
        // })
      },
      changeHuanJi(e) {
        this.backData.i_urgency = e
      },
      //详情页面数据
      showTaskInAct(taskDetail, task) {
        //查询出优先级
        this.task = task
        this.show(taskDetail)
      },
      dealHeight(btn) {
        let btnHegiht = 50;
        console.log(btn)
        if (btn.isNotDefend != undefined && btn.isNotDefend.length != 0) {
          btnHegiht += 70;
        }
        if (btn.isDefend != undefined && btn.isDefend.length != 0) {
          btnHegiht += 60;
        }
        // console.log("AAAAAAAAAAAAAAAAAAAAAAAA", btnHegiht)
        this.scrHeight = window.innerHeight - btnHegiht + 'px';
        console.log(btnHegiht)
      },
      //--------------------------------------   展示业务大详情    弹窗-----------------------------------------------------------------------------
      show(taskDetail) {

        document.title = ' '

        if (taskDetail.tableName == undefined || taskDetail.tableName == ''
          || taskDetail.busdataId == undefined || taskDetail.busdataId == ''
        ) {
          this.$message.error('业务数据不存在,可能已过期或被删除')
          setTimeout(function () {
            window.close()
          }, 1000)
          return
        }
        let param = {
          tableName: taskDetail.tableName,
          busdataId: taskDetail.busdataId
        }
        //************************************************* 任务相关参数  START
        if (taskDetail.task != undefined) {
          this.task = JSON.parse(taskDetail.task)
        }

        if (this.task.id != undefined && this.task.id != '') {
          param.taskId = this.task.id
          param.taskDefinitionKey = this.task.taskDefinitionKey
          param.name = this.task.name
          param.proInstanId = this.task.processInstanceId
        }

        if (this.task.hiTaskId != undefined && this.task.hiTaskId != '') {
          param.taskId = this.task.hiTaskId
          param.proInstanId = this.task.processInstanceId
          param.taskDefinitionKey = this.task.taskDefinitionKey

        }
        //标记状态 已办 待办
        if (taskDetail.status != undefined) {
          param.status = taskDetail.status
        }
        //************************************************* 任务相关参数  END

        postAction(this.url.busDataAndColums, param).then((res) => {
          if (res.success) {

            //  修改标题
            document.title = '[' + res.result.oaBusdata.s_right_parameter + ']' + res.result.oaBusdata.s_title
            this.backData.key = res.result.btnAndOpt.key;
            this.optSet(res.result.btnAndOpt.opt, this.backData.key);
            //处理显示高度
            if (res.result.btnAndOpt.btn != undefined) {
              this.dealHeight(res.result.btnAndOpt.btn);
            }
            //如果非默认按钮不是未定义且不为空的话，就将开启websocket
            if (res.result.btnAndOpt.btn.isNotDefend != undefined && res.result.btnAndOpt.btn.isNotDefend.length > 0) {
              console.log(res.result.btnAndOpt.btn)
              let qiCaoIndex = -1;         //起草底稿按钮的标志
              let editDiGaoIndex = -1;     //编辑底稿按钮的标志
              //开启websocket
              this.initWebSocket(res.result.oaBusdata.i_id);
              for (let i = 0; i < res.result.btnAndOpt.btn.isNotDefend.length; i++) {
                if (res.result.btnAndOpt.btn.isNotDefend[i].smethod == 'qiCao') {
                  qiCaoIndex = i;
                }
                if (res.result.btnAndOpt.btn.isNotDefend[i].smethod == 'editDiGao') {
                  editDiGaoIndex = i;
                }
              }
              if (qiCaoIndex >= 0) {
                //当前业务已经起草底稿
                if (res.result.oaBusdata.i_is_draft != undefined && res.result.oaBusdata.i_is_draft == 1) {
                  //将起草底稿按钮去除
                  res.result.btnAndOpt.btn.isNotDefend.splice(qiCaoIndex, 1);
                } else {    //当前业务没有起草底稿
                  if (editDiGaoIndex >= 0) {
                    this.dealBtn = res.result.btnAndOpt.btn.isNotDefend[editDiGaoIndex];
                    res.result.btnAndOpt.btn.isNotDefend.splice(editDiGaoIndex, 1);
                  }
                }
              }
              console.log(res.result.btnAndOpt.btn)
            }
            //为按钮赋值
            this.$refs.taskRef.showBtn(res.result.btnAndOpt.btn);

            //附件按钮权限控制
            postAction('/oaBus/oaFile/isFileBtn', res.result.btnAndOpt.btn).then(res => {
              if (res.success && res.result == true) {
                this.isShowFile = true;
              }
            })
            //字典值获取
            this.optionMap = res.result.optionMap;
            this.secretDegree = res.result.optionMap.secretDegree;
            //this.urgencyList = res.result.optionMap.i_urgency_option;
            this.urgencyList = res.result.optionMap.urgencyList;
            //业务数据赋值

            this.backData = res.result.oaBusdata;
            this.backData['iprocSetId'] = res.result.proSetId;
            this.backData['key'] = res.result.taskDefKey
            this.backData.act_show = res.result.actShow


            this.backDataOpt.s_task_id = res.result.taskId
            //机密等级
            let secretModleTest = this.backData.i_safetylevel;
            this.secretModle = JSON.stringify(secretModleTest)
            //缓急
            this.i_urgency = this.backData.i_urgency

            //文档数据
            this.detailList = res.result.detailList;

            this.busDataId = res.result.busdataId;

            this.busFunction = res.result.busFunction;
            this.busTextData = res.result.busTextData;
            //处理是否为电子公告预览页面
            let userInfo = JSON.parse(window.localStorage.getItem('userdata')).userInfo;
            if (this.backData.s_create_by != userInfo.id && this.busFunction.iisProc == 0 && this.busFunction.iisEditor == 1) {
              this.pageRef = 'preview';
              if (this.busTextData != null) {
                this.jeditor.value = this.busTextData.s_text;
              }
              this.$refs.editTable.style.border = "0px solid rgb(145, 56, 56)";
              //this.$refs.editTable.style.height="500px" ;
              this.jeditShow = true;
              this.newHeight = 500;
              this.previewFlag = false;
              this.disableFlag = true;
            } else {
              //if(this.busFunction.)
              //富文本显示控制
              this.pageRef = res.result.pageRef;
              if (this.busFunction.iisEditor == 1) {
                if (this.busTextData != null) {
                  this.jeditor.value = this.busTextData.s_text;
                }
                this.jeditShow = true;
              }
              if (this.busFunction.iisLimits == 1) {
                this.isLimitsShow = true;
              }
            }

            // /**
            //  * 刷新页面后,task数据覆盖
            //  */
            this.task.pageRef = res.result.pageRef
            this.task.id = res.result.taskId
            this.task.taskDefinitionKey = res.result.taskDefKey
            this.task.processDefinitionId = res.result.processDefinitionId
            this.task.processInstanceId = res.result.processInstanceId
            this.task.tableId = res.result.busdataId
            this.task.executionId = res.result.executionId
            this.task.table = res.result.table
            this.task.functionId = res.result.functionId


          } else {
            this.$message.error(res.message)
          }


        })
        this.visible = true

      },
      //子孙组件事件回传
      watchSub(e) {
        this.getOaFileList(this.backData.table, this.backData.i_id);
      },
      //意见id赋值  区分新增与更新
      // optSet(opts, key) {
      //   console.log('----------', JSON.stringify(opts))
      //   for (let i in opts) {
      //     if (opts[i].taskDefKey == key) {
      //       this.backDataOpt.i_id = opts[i].optId
      //     }
      //   }
      // },
      reloadOpinion(key){
        let  param = {};
        param.proSetId = this.busFunction.iprocSetId;
        param.taskDefKey= key;
        param.opinionTable = this.backData.table + "_opinion";
        param.busdataId = this.backData.i_id;
        postAction('/oaBus/oaBusdataOpinion/reloadOpinionList',param).then(res=>{
          if (res.success){
            this.optSet(res.result,this.backData.key);
          } else {
            this.$message.error("查询意见失败")
          }
        })
      },
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
            map[key].taskDefKeys.push({key:map[key].taskDefKey,optionSetId:map[key].optionSetId})
          } else {
            let optx = opts[i].optionContext + '\t' + opts[i].signName + '\t' + opts[i].signTime + '\n'
            map[key].optionContext2 += optx
            // if ((map[key].taskDefKeys).indexOf(opts[i].taskDefKey) < 0) {

              map[key].taskDefKeys.push({key:opts[i].taskDefKey,optionSetId:opts[i].optionSetId})
            // }
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
        this.$refs[this.pageRef].getBanWenFiles(tableName, busDataId);
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

  ::-webkit-scrollbar{
    display:none;
  }

  .fuwenben {
    /deep/ .ant-card-body {
      padding: 0 !important;
    }
  }

  .hoverred:hover {
    color: red;
    cursor: pointer;
  }

  /deep/.ant-input{
    font-size: 16px;
  }

  /deep/.ant-select{
    font-size: 16px;
  }

  /deep/.ant-btn-default{
    font-size: 16px;
  }

  /deep/.ant-btn-lg{
    font-size: 18px;
  }

  /deep/.ant-radio-wrapper{
    font-size: 16px;
  }
</style>
<style>
  /*附件列表元素----开始*/
  .qiCao {
    padding-bottom: 1%;
  }

  .hoverred {
    display: inline-block;
    padding-top: 1%;
  }

  .delCss {
    width: 22.3%;
    display: inline-block;
    font-weight: bolder;
    margin-right: 30%;
    float: right;
  }

  .pices {
    width: 28px;
    height: 27px;
    cursor: pointer;
    margin-right: 6%;
  }

  /*附件列表元素---结束*/
</style>