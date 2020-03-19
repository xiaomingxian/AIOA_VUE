<template>
    <form>
      <center>
        <table border="0" class="sendFileStyle" width="100%">
          <center>
            <table  width="100%" border="1" borderColor="#F0F5FC">
              <tr style="height: 50px;">
                <td width="15%" class="title">
                  <center><h3>{{detailList.s_create_dept}}</h3></center>
                </td>
                <td  width="35%">
                  <div style="padding-left: 10px;">{{backData.s_create_dept}}</div>
                </td>
                <td width="15%" class="title">
                  <!--登记人员-->
                  <center><h3>{{detailList.s_create_name}}</h3></center>
                </td>
                <td  width="35%">
                  <div style="padding-left: 10px">{{backData.s_create_name}}</div>
                </td>

              </tr>
              <!--会议室申请-->
              <tr style="height: 50px;">
                <td colspan="1" class="title">
                  <center><h3>{{detailList.s_varchar1}}</h3></center>
                </td>
                <td colspan="7">
                  <left>
                    <a-select style="width:80%" placeholder="请选择会议室" ref="s_varchar1" v-on:blur="blurText(backData.s_varchar4,$refs.s_varchar1)"
                              v-model="backData.s_varchar4" @change="changeHuanJi">
                      <a-select-option  v-for="(item,index) in optionMap.s_varchar1_option" :key="index" :text="item.text" :value="item.value" >{{item.text}}</a-select-option>
                    </a-select>
                    <a-button style="height:50px"  @click="showMeeting" >会议室使用情况</a-button>
                  </left>
                </td>

              </tr>
              <!--申请时间-->
              <tr style="height: 50px;">
                <td colspan="1" class="title">
                  <center><h3>{{detailList.s_varchar4}}</h3></center>
                </td>
                <td colspan="7">
                  <left>
                    <template v-if="backData.d_datetime1 == null && backData.d_datetime2 ==null">
                      <a-range-picker
                        ref="s_varchar4"
                        v-on:blur="blurText([backData.d_datetime1,backData.d_datetime2],$refs.s_varchar4)"
                        style="width: 95%"
                        showTime
                       :disabledDate="disabledDate"
                       :disabledTime="disabledRangeTime"
                       :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                        format="YYYY-MM-DD HH:mm"
                        :placeholder="['开始时间','结束时间']"
                        @change="selectTime" @ok="confirmTime"
                      />
                    </template>

                    <template v-else>
                      <a-range-picker
                        ref="s_varchar4"
                        v-on:blur="blurText([backData.d_datetime1,backData.d_datetime2],$refs.s_varchar4)"
                        style="width: 95%"
                        :showTime="{format}"
                        :disabledDate="disabledDate"
                       :disabledTime="disabledRangeTime"
                      
                        format="YYYY-MM-DD HH:mm:ss"
                        :placeholder="['开始时间','结束时间']"
                        @change="selectTime" @ok="confirmTime"
                        :defaultValue="[moment(backData.d_datetime1),moment(backData.d_datetime2)]"
                      />
                    </template>
                  </left>
                </td>
              </tr>
              <!--会议内容-->
              <tr>
                <td colspan="1" class="title">
                  <center><h3>{{detailList.s_title}}</h3></center>
                </td>
                <td colspan="7" height="100px">
                  <left>
                    <template>
                      <a-textarea  ref="s_varchar2" v-on:blur="blurText(backData.s_title,$refs.s_title)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_title" style="height: 100px;width: 95%"
                                  :rows="true"></a-textarea>
                    </template>
                  </left>
                </td>
              </tr>
              <!--附件-->
              <tr style="height: 50px;">
                <td width="10%" class="title">
                  <center><h3>{{detailList.s_varchar3}}</h3></center>
                </td>
                <td colspan="3">
                  <div v-for="(item,index) in oaFileList" style="padding-left: 15px">
                    <div class="qiCao"><span class="hoverred" @click="qiCao1(9,item)">{{index+1}}、{{item.sfileName}}</span>
                      <span class="delCss" v-show="isShowFile">
                <img :title="fileBtnName(1)" v-show ="isSuffex(item.sfileName)" class="pices" @click.stop="qiCao2(10,item)" src="../../../../src/assets/set.png"/>
                <img :title="fileBtnName(2)" class="pices" @click.stop="updateFileName(item)" src="../../../../src/assets/setName.png"/>
                <img :title="fileBtnName(3)" class="pices" @click.stop="deleteFilesBtn(item,4)" src="../../../../src/assets/delete.png"/>
                <img :title="fileBtnName(4)" v-show="oaFileList.length > 1 && index > 0" class="pices" @click.stop="topFile(item,index,4)" src="../../../../src/assets/top.png"/>
                <img :title="fileBtnName(5)" v-show="oaFileList.length > 1 && index < oaFileList.length-1" class="pices" @click.stop="lowFile(item,index,4)" src="../../../../src/assets/bottom.png"/>
              </span>
                    </div>
                  </div>
                </td>
              </tr>
              <!--创建时间-->
              <template v-if="this.backData.d_create_time != timeStrings">
                <tr style="height: 50px;">
                  <td width="10%" class="title">
                    <center><h3>{{detailList.d_create_time}}</h3></center>
                  </td>
                  <td colspan="3">
                    <div style="padding-left: 10px;">{{backData.d_create_time}}</div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr style="height: 50px;">
                  <td width="10%" class="title">
                    <center><h3>{{detailList.d_create_time}}</h3></center>
                  </td>
                  <td colspan="3">
                    <div style="padding-left: 10px;" v-model="backData.d_create_time">{{ timeStrings }}</div>
                  </td>
                </tr>
              </template>
            </table>
          </center>
        </table>
        <br/>
        <del-time ref="updateFileNameModal" @reloadAfterUpdate="reloadAfterUpdate"></del-time>
        <show-meeting ref="showMeeting"></show-meeting>
      </center>
    </form>
</template>

<script>
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  // import JEditor from '@/components/jeecg/JEditor'
  import moment from 'moment'
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import showMeeting from "../../meeting/showMeeting"
  import DelTime from "../../buttons/DelTimeModal";

  export default {
    name: "meetintInform",
    mixins: [JeecgListMixin,busdataTemplate],
    components: {
      DelTime,
      /*JEditor,*/showMeeting
    },
    props: {
      backDataRef: {
        type: Object,
        required: false
      },
      detailList: {
        type: Object,
        required: false
      },
      optionMap: {
        type: Object,
        required: false
      },
      isShowFile:{
        type: Object,
        required: false
      }
    },
    data() {
      return {
        s_varchar:[],
        visible: false,
        title: '会议申请',
        confirmLoading: false,
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        oaFileList: [],    //  文档数据   字段含义
        banWenFileList:[],
        backData: {

          //属性判断---新建时使用
          //---------------------------------------------
          //流程key
          key: '',
          //文号
          act_show: '',
          //page ref
          page_ref: '',
          //业务配置表id-用于查询按钮/意见权限
          iprocSetId: '',
          //对应的业务数据表
          table: 'oa_busdata40',
          //---------------------------------- 以下为表存储字段

          //*******
          i_id: '',
          i_bigint1: '',   //份数
          i_bigint2: '',   //页数
          s_receive_type: '',     //来文文种
          s_varchar3: '',//"办文依据"
          d_datetime1: '',//"成文日期"
          //*******
          //模块
          i_bus_model_id: '',
          //
          i_bus_function_id: '',
          //密级
          i_safetylevel: 0,
          //缓急
          i_urgency: 0,
          //主办部门
          s_main_dept_names: '主办部门',
          //辅办部门
          s_cc_dept_names: '辅办部门',
          //内部发送部门
          s_inside_deptnames: '内部发送部门',
          //标题
          s_title: '中国人民银行永州市中心支行收文处理签',
          //左侧参数页面头部
          s_left_parameter: '左侧参数页面头部',
          //机构
          s_unit_name: '',
          //部门
          s_dept_name: '',
          //插入参数（修改文头）（页面头部）
          s_middle_parameter: '',
          //右侧参数（页面头部）
          s_right_parameter: '',
          //来文字号
          s_receive_num: '',
          //文件字号
          s_file_num: '',
          //来文机关（数据字典取值）
          i_receive_dept_id: '',
          //是否办结
          i_is_state: 0,
          //是否保存办文单
          i_is_approve: 0,
          //是否归档
          i_is_archives: 0,
          //是否已送全文检索
          i_is_es: 0,
          //是否送公文传输
          i_is_send: 0,
          //是否为临时文件
          i_is_display: 0,
          //备注
          s_remarks: '',
          //创建时间-年
          i_create_year: new Date().getFullYear(),
          //创建时间-月
          i_create_month: new Date().getMonth(),
          //创建时间-日期
          i_create_day: new Date().getDate(),
          //创建人id
          s_create_by: '',
          //创建者姓名
          s_create_name: '',
          //创建人部门name
          s_create_dept: '',
          //创建人部门id
          s_create_deptid: '',
          //创建人机构id
          s_create_unitid: '',
          //创建时间
          d_create_time:'',
          //修改时间
          d_update_time: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
          //申请会议室名
          s_varchar1:'',
          //会议内容
          // s_varchar2:'',
          //附件
          s_varchar3:'',
          /*申请时间
          s_varchar4:'',*/
          //会议室id
          s_varchar4:'',
          //录入时间
          d_create_time:'',
          //开始时间
          d_datetime1:'',
          //截至时间
          d_datetime2:'',
          s_cur_proc_name: '',
          //当前任务名称
          s_cur_task_name: '',
          //是否重要
          i_is_important: ''
        },
        url: {
          optionAndBtn: '/oaBus/newTask/optionAndBtn',
          currentUserMsg: '/sys/user/getUserSectionInfoByToken',
          updateReadStatus: '/oaBus/taskInAct/changeStatus',
          selectTaskType: '/oaBus/busModel/list',
          selectTask: '/oaBus/busModel/list',
        }
      }
    },
    computed:{
      timeStrings(){
        let oneTime = new Date();
        let Y = oneTime.getFullYear();
        let M = oneTime.getMonth()+1;
        let D = oneTime.getDate();
        return  Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+oneTime.toTimeString().substr(0,8);
      },
    },

    created() {
      this.show();
    },
    methods: {
      moment,
       range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      },

      disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
       

      },
      disabledDateTime() {
        return {
          disabledHours: () => this.range(0, 24).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      },
      changeHuanJi(e,d) {
        this.backData.s_varchar1 = d.data.attrs.text;
        // this.backData.s_varchar1 = e;
      },

      //会议室使用情况
      showMeeting(){
        if (this.backData.s_varchar1 == null){
          this.$message.error("请选择会议室");
        } else {
          let meetingRoom=this.backData.s_varchar1;
          this.$refs.showMeeting.showMeetingCase(meetingRoom);
        }
      },


      close() {
        this.visible = false;
      },
      //----------------时间变化检测---------------
      selectTime(e) {
        console.log(e);
      },
      //----------------确定时间---------------
      confirmTime(e) {
        // console.log(e);
        let startTime = e[0]._d;
        let endTime = e[1]._d;

        this.backData.d_datetime1 = this.dataTime(startTime);
        this.backData.d_datetime2 = this.dataTime(endTime);

      },
      dataTime(time) {
        let oneTime = new Date(time);
        let Y = oneTime.getFullYear();
        let M = oneTime.getMonth() + 1;
        let D = oneTime.getDate();
        return Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + oneTime.toTimeString().substr(0, 8);
      },


     /* dateFormat(date) {
        let date1 = new Date(date);
        let Y = date1.getFullYear();
        let M = date1.getMonth() + 1;
        let D = date1.getDate();
        let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
        return newTime;
      },*/

      /*optsGet(opts) {
        this.opts = opts
      },*/

      change(e) {
        this.backData.i_safetylevel = e
      },

     /* //详情页面数据
      showTaskInAct(taskDetail, task) {
        this.task = task
        this.show(taskDetail)
        //修改数据信息为已读
        this.changeReadStatus()
      },

      //已读
      changeReadStatus() {
        var param = 'table=' + this.backData.table + "_permit&userId=" + this.userData.sysUserId + "&functionId="
          + this.backData.i_bus_function_id + "&dataId=" + this.backData.i_id

        getAction(this.url.updateReadStatus + "?" + param).then(res => {
          if (!res.success) {
            this.$message.error(res.message)
          }
        })
      },*/

      show() {
        for(let i = 0;i<this.optionMap.checkList.length;i++){
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }

        // console.log('====================================================');
        // console.log(this.s_varchar);
        //业务数据赋值
        for (var i in this.backData) {
           this.backData[i] = this.backDataRef[i]
        }
        // console.log(JSON.stringify(this.backdata))
        // console.log('----->>>',JSON.stringify(this.backData))
        //this.s_varchar1_option = this.optionMap.s_varchar1_option;
        //************************************* 查询字段名称start ************************************
        this.getOaFiles(this.backData.table, this.backData.i_id);
        //************************************* 查询字段名称end ************************************
        this.visible = true
      },

      ok() {
        this.handleCancel()
      },


      handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        //清除意见与按钮页面数据
        this.$refs.taskOptRef.clear();

        //刷新父页面
        this.$emit('reload_todo')
      },
      /*onChange(date, dateString) {

      },
      onChange2(date, dateString) {

      }*/

    }
  }
</script>
<style lang="less" scoped>
  @import "../../../assets/less/detailsBaseStyle";

  /*input.ant-input{*/
  /*height: 48px;*/
  /*}*/

  /*textarea.ant-input{*/
  /*height: 48px;*/
  /*}*/

  /*/deep/ .ant-select-selection--single{*/
  /*height: 48px;*/
  /*padding: 8px 0;*/
  /*}*/

  /*/deep/ .ant-calendar-picker-input{*/
  /*height: 48px;*/
  /*}*/
</style>

<style>
  /*.hoverred:hover {*/
  /*color: red;*/
  /*cursor: pointer;*/
  /*}*/

  /*.title  h3 {*/
  /*font-weight: bolder !important;*/
  /*}*/

  /*.ant-btn-default{*/
  /*font-weight: bolder !important;*/
  /*background: rgb(178, 218, 255) !important;*/
  /*}*/

  /*.title{*/
  /*background-color: #e9ecf2 !important;*/
  /*padding: 0.7% !important;*/
  /*text-align: center !important;*/
  /*}*/
</style>