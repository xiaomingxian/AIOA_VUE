<template>
  <center>
    <table width="100%" border="1" style="border:#913838;">
      <tr>
        <td class="title" width="15%">
          <!--申请人-->
          <center><h3>{{detailList.s_create_name}}</h3></center>
        </td>
        <td colspan="3">
          <a-input style="padding-left: 10px" ref="s_create_name" v-on:blur="blurText(backData.s_create_name,$refs.s_create_name)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_create_name" disabled></a-input>
          <!--<a-input style="padding-left: 10px" v-model="backData.s_create_name" disabled></a-input>-->
        </td>
        <td class="title" width="15%">
          <!--所属部门-->
          <center><h3>{{detailList.s_create_dept}}</h3></center>
        </td>
        <td colspan="3">
          <!--<a-textarea cols="92" rows="2" v-model="backData.s_dept_name"></a-textarea>-->
          <a-input style="padding-left: 10px" ref="s_create_dept" v-on:blur="blurText(backData.s_create_dept,$refs.s_create_dept)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_create_dept" disabled></a-input>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--联系电话-->
          <center><h3>{{detailList.i_phone}}</h3></center>
        </td>
        <td colspan="3">
          <!--<a-textarea cols="92" rows="2" v-model="backData.i_phone"></a-textarea>-->
          <a-input type="number" style="padding-left: 10px" ref="i_phone" v-on:blur="blurText(backData.i_phone,$refs.i_phone)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.i_phone"></a-input>
        </td>
        <td class="title" width="15%">
          <!--请假地点-->
          <center><h3>{{detailList.s_varchar1}}</h3></center>
        </td>
        <td colspan="3">
          <a-input style="padding-left: 10px" ref="s_varchar1" v-on:blur="blurText(backData.s_varchar1,$refs.s_varchar1)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_varchar1"></a-input>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--参加工作时间-->
          <center><h3>{{detailList.d_datetime2}}</h3></center>
        </td>
        <td colspan="3">
          <a-date-picker v-if="backData.d_datetime2" ref="d_datetime2" v-on:blur="blurText([backData.d_datetime2],$refs.d_datetime2)"  :defaultValue="moment(backData.d_datetime2,'YYYY-MM-DD HH:mm:ss')" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
          <a-date-picker v-else @change="getDateTime2" ref="d_datetime2" v-on:blur="blurText([backData.d_datetime2],$refs.d_datetime2)" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
        </td>

        <td class="title" width="15%">
          <!--岗位-->
          <center><h3>{{detailList.s_varchar2}}</h3></center>
        </td>
        <td colspan="3">
          <a-input style="padding-left: 10px" ref="s_varchar2" v-on:blur="blurText(backData.s_varchar2,$refs.s_varchar2)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_varchar2"></a-input>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--请假类别-->
          <center><h3>{{detailList.s_varchar3}}</h3></center>
        </td>
        <td colspan="3">
          <a-select placeholder="请选择请假类别" ref="s_varchar3" v-on:blur="blurText(backData.s_varchar3,$refs.s_varchar3)" v-model="backData.s_varchar3" @change="selectType">
            <a-select-option v-for="(item,index) in optionMap.s_varchar3_option" :key="index" :value="item.value">{{item.text}}
            </a-select-option>
          </a-select>

          <!--<a-input style="padding-left: 10px" v-model="backData.s_varchar3"></a-input>-->
        </td>
        <td class="title" width="15%">
          <!--申请时间-->
          <center><h3>{{detailList.d_create_time}}</h3></center>
        </td>
        <td colspan="3">
          <!--<a-input style="padding-left: 10px" v-model="backData.d_create_time"></a-input>-->
          <!--<a-date-picker @change="getDateTime4" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"  ></a-date-picker>-->
          <a-date-picker :defaultValue="moment(backData.d_create_time,'YYYY-MM-DD HH:mm:ss')"  showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%" disabled></a-date-picker>
        </td>
      </tr>
      <tr>
      <td class="title" width="15%">
        <!--请假天数-->
        <center><h3>{{detailList.i_bigint1}}</h3></center>
      </td>
      <td colspan="3">
        <a-input type="number" style="padding-left: 10px" ref="i_bigint1" v-on:blur="blurText(backData.i_bigint1,$refs.i_bigint1)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.i_bigint1"></a-input>
        <!--<a-input style="padding-left: 10px" v-model="backData.i_bigint1"></a-input>-->
      </td>
      <td class="title" width="15%">
        <!--销假日期-->
        <center><h3>{{detailList.d_datetime3}}</h3></center>
      </td>
      <td colspan="3">
        <a-input style="padding-left: 10px" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.d_datetime3" disabled></a-input>
      </td>
    </tr>
      <tr >
        <td class="title" width="15%">
          <!--请假起始日期-->
          <center><h3>{{detailList.d_datetime4}}</h3></center>
        </td>
        <td colspan="6">
          <a-date-picker v-if="backData.d_datetime4" ref="d_datetime4" v-on:blur="blurText([backData.d_datetime4],$refs.d_datetime4)"  :defaultValue="moment(backData.d_datetime4,'YYYY-MM-DD HH:mm:ss')"  showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
          <a-date-picker  v-else @change="getDateTime4" ref="d_datetime4" v-on:blur="blurText([backData.d_datetime4],$refs.d_datetime4)" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--请假结束日期-->
          <center><h3>{{detailList.d_datetime5}}</h3></center>
        </td>
        <td colspan="6">
          <a-date-picker v-if="backData.d_datetime5" ref="d_datetime5" v-on:blur="blurText([backData.d_datetime5],$refs.d_datetime5)" :defaultValue="moment(backData.d_datetime5,'YYYY-MM-DD HH:mm:ss')"  showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
          <a-date-picker v-else @change="getDateTime5" ref="d_datetime5" v-on:blur="blurText([backData.d_datetime5],$refs.d_datetime5)" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
        </td>
      </tr>

      <tr>
        <td class="title" width="15%">
          <!--请假事由-->
          <center><h3>{{detailList.s_title}}</h3></center>
        </td>
        <td colspan="6">
          <a-textarea cols="92" rows="4" ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_title"></a-textarea>
          <!--<a-input v-model="backData.s_varchar4"></a-input>-->
        </td>
      </tr>
      <tr>
        <td class="title" width="10%">
          <center><h3>附件</h3></center>
        </td>
        <td colspan="6">
          <div v-for="(item,index) in oaFileList" style="padding-left: 15px">
            <!--<div @click="openFile(9,item.sfileName)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>-->
            <div @click="qiCao1(9,item.sfilePath)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>
            </div>
          </div>
          <!--<a-input :value="backData.s_remarks"></a-input>-->
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--备注-->
          <center><h3>{{detailList.s_remarks}}</h3></center>
        </td>
        <td colspan="6">
          <a-textarea cols="92" rows="4" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_remarks"></a-textarea>
          <!--<a-input cols="92" rows="2" v-model="backData.s_remarks"></a-input>-->
        </td>
      </tr>
    </table>
  </center>

</template>

<script>
  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import moment from 'moment';
  export default {
    name: "synthesizeFile",
    mixins: [JeecgListMixin,busdataTemplate],
    components: {
      ATextarea,
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
    },
    data() {
      return {
        s_varchar:[],
        dateFormat:'YYYY-MM-DD HH:mm:ss',
        placeholder:'请输入开始时间',
        visible: false,
        title: '请假申请',
        confirmLoading: false,
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        detailList: null,    //  文档数据   字段含义
        oaFileList: [],    //  文档数据   字段含义
        //表中的数据相关值
        backData: {
          //流程key
          key: '',
          //文号
          // act_show: '',
          //page ref
          page_ref: '',
          //业务配置表id-用于查询按钮/意见权限
          iprocSetId: '',
          act_show: '',
          ilevel: '',
          //对应的业务数据表
          table: 'oa_busdata70',

          //---------------------------------- 以下为表存储字段

          //*******
          i_id:'',
          i_bus_model_id:'',
          i_bus_function_id:'',
          PROC_INST_ID:'',
          i_safetylevel:'',
          i_urgency:'',
          s_signer:'',
          s_create_dept:'',
          s_cc_dept_names:'',
          s_main_unit_names:'',
          s_cc_unit_names:'',
          s_inside_deptnames:'',
          s_report_nuit_names:'',
          s_crc_deptnames:'',
          s_title:'',
          s_left_parameter:'',
          s_unit_name:'',
          s_dept_name:'',
          s_middle_parameter:'',
          s_right_parameter:'',
          s_receive_num:'',
          s_file_num:'',
          i_is_state:'',
          d_sealdate:'',
          i_is_typeset:'',
          i_is_approve:'',
          i_is_archives:'',
          i_is_important:'',
          i_is_es:'',
          i_is_publish:'',
          i_is_file:'',
          i_is_draft:'',
          i_is_send:'',
          i_is_display:'',
          s_remarks:'',
          i_create_year:new Date().getFullYear(),
          i_create_month: new Date().getMonth(),
          i_create_day:new Date().getDate(),
          i_phone:'',
          s_create_name:'',
          s_create_by:'',
          s_create_deptid:'',
          s_create_unitid:'',
          d_create_time:'',
          d_update_time:'',
          s_cur_proc_name:'',
          s_cur_task_name:'',
          i_fun_version:'',
          i_bigint1:'',
          i_bigint2:'',
          d_datetime1:'',
          d_datetime2:'',
          d_date1:'',
          d_date2:'',
          s_varchar1:'',
          s_varchar2:'',
          s_varchar3:'',
          s_varchar4:'',
          s_varchar5:'',
          s_varchar6:'',
          s_varchar7:'',
          s_varchar8:'',
          s_varchar9:'',
          s_varchar10:'',
          i_is_1:'',
          i_is_2:'',
          d_datetime3:'',
          d_datetime4:'',
          d_datetime5:'',
          d_datetime6:'',
          i_bigint3:''



        },

        url: {
          optionAndBtn: '/oaBus/newTask/optionAndBtn',
          currentUserMsg: '/sys/user/getUserSectionInfoByToken',
          updateReadStatus: '/oaBus/taskInAct/changeStatus',
          selectTaskType: '/oaBus/busModel/list',
          selectTask: '/oaBus/busModel/list',
          queryOaFileList: '/oaBus/oaFile/queryOaFileList',
          updateBusdata: '/oaBus/dynamic/update'
        }
      }
    },
    created() {
      this.show();
    },

    methods: {
      moment,
      //选择请假类别
      selectType(e,d) {
        this.backData.s_varchar3=e;
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
        this.backData.d_datetime4 = this.dataTime(startTime);
        this.backData.d_datetime5 = this.dataTime(endTime);
      },
      getDateTime2(e,datetime2){
        this.backData.d_datetime2 = datetime2;
        console.log(this.backData.d_datetime2);
      },
      //监测开始时间变化
      getDateTime4(e,datetime4){
        // alert(datetime4)
        console.log("111111111111111")
        this.backData.d_datetime4 = datetime4;
        /*if (this.backData.d_datetime5 != undefined){
          var time4 = Date.parse(datetime4);
          var time5  = Date.parse(this.backData.d_datetime5);
          console.log(time4 + "  :  " + time5);
          if (time4 > time5){
            this.backData.d_datetime4 = '';
            this.$message.error("请假终止时间必须大于请假起始时间");
            return ;
          }else{
            this.backData.d_datetime4 = datetime4;
          }
        }else {
          this.backData.d_datetime4 = datetime4;
        }*/

        /*if (this.backData.d_datetime5 != undefined){
          console.log("22222222222222")
          var time5 = Date.parse(this.backData.d_datetime5)
          var time4  = Date.parse(this.backData.d_datetime4);
          if (time4 > time5){
            this.$message.error("请假终止时间必须大于请假起始时间");
          }
        }*/
      },
      //监测结束时间变化
      getDateTime5(e,datetime5){
        // alert(datetime4)
        console.log("-=-=-=-=-=-=--=-=-")
        this.backData.d_datetime5 = datetime5;
       /* if (this.backData.d_datetime4 != undefined){
          var time5 = Date.parse(datetime5);
          var time4  = Date.parse(this.backData.d_datetime4);
          console.log(time4 + "  :  " + time5);
          if (time4 > time5){
            this.backData.d_datetime5 = '';
            this.$message.error("请假终止时间必须大于请假起始时间");
            return ;
          }else{
            this.backData.d_datetime5 = datetime5;
          }
        }else {
          this.backData.d_datetime5 = datetime5;
        }*/
      },
      dataTime(time) {
        let oneTime = new Date(time);
        let Y = oneTime.getFullYear();
        let M = oneTime.getMonth() + 1;
        let D = oneTime.getDate();
        return Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + oneTime.toTimeString().substr(0, 8);
      },
      moment,  //时间
      //打开附件
      qiCao1(index, fileName) {
        let name = fileName.split('\\')
        var name1 = name[name.length - 1]
        alert(name1)
        this.$refs.taskRef.showFujianFile2(index, name1);
      },
      dateFormat(date) {
        let date1 = new Date(date);
        let Y = date1.getFullYear();
        let M = date1.getMonth() + 1;
        let D = date1.getDate();
        let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
        return newTime;
      },
      change(e) {
        this.backData.i_safetylevel = e
      }, changeHuanJi(e) {
        this.backData.i_urgency = e
      },
      //详情页面数据
      showTaskInAct(taskDetail, task) {
        this.task = task
        this.show(taskDetail)
        //修改数据信息为已读
        this.changeReadStatus()
      },
      show(taskDetail) {

        for(let i = 0;i<this.optionMap.checkList.length;i++){
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }

        //业务数据赋值
        var table = this.backData.table
        // this.backData = taskDetail.data
        for (var i in this.backData) {
          this.backData[i] = this.backDataRef[i]
        }
        if (this.backData.s_varchar3 != "" && this.backData.s_varchar3 != undefined) {
          this.select_type = this.backData.s_varchar3;
        }
        this.backData.table = table
        this.getOaFiles(this.backData.table, this.backData.i_id)
      },

      ok() {
        this.handleCancel()
      },

      handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        //刷新父页面
        this.$emit('reload_todo')
      }, onChange(date, dateString) {
        // console.log(date, dateString);
      }, onChange2(date, dateString) {
        // console.log(date, dateString);
      },
      close() {
        this.visible = false;
      }

    }
  }
</script>
<style lang="less" scoped>
  input.ant-input{
    height: 48px;
  }

  textarea.ant-input{
    height: 48px;
  }

  /deep/ .ant-select-selection--single{
    height: 48px;
    padding: 8px 0;
  }

  /deep/ .ant-calendar-picker-input{
    height: 48px;
  }
</style>

<style>
  .hoverred:hover {
    color: red;
    cursor: pointer;
  }

  .title{
    background-color: #e9ecf2 !important;
    padding: 0.7% !important;
    text-align: center !important;
  }

  .text {
    padding: 10px;
  }


  .title  h3 {
    font-weight: bolder !important;
  }

  .ant-btn-default{
    font-weight: bolder !important;
    background: rgb(178, 218, 255) !important;
  }
</style>