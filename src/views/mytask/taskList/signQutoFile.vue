<template>
  <form>
  <center>

    <table border="1" class="sendFileStyle" style="border:#F0F5FC;" width="100%">
      <tr>
        <td class="title" width="15%">
          <!--主办部门-->
          <center><h3>{{detailList.s_create_dept}}</h3></center>
        </td>
        <td colspan="2">
          <!--<a-textarea cols="92" rows="2" v-model="backData.s_create_dept"></a-textarea>-->
          <!--<a-input style="padding-left: 10px" v-model="backData.s_create_dept"></a-input>-->
          <a-input style="width:85%;" ref="s_create_dept" v-on:blur="blurText(backData.s_create_dept,$refs.s_create_dept)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}"  v-model="backData.s_create_dept"></a-input>
          <a-button style="width:15%;" @click="selDepartName" >选择</a-button>
        </td>
        <td class="title" width="15%">
          <!--拟稿人-->
          <center><h3>{{detailList.s_create_name}}</h3></center>
        </td>
        <td colspan="2">
          <!--<a-textarea cols="92" rows="2" v-model="backData.s_create_name"></a-textarea>-->
          <a-input style="padding-left: 10px" ref="s_create_name" v-on:blur="blurText(backData.s_create_name,$refs.s_create_name)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_create_name"></a-input>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--联系电话-->
          <center><h3>{{detailList.i_phone}}</h3></center>
        </td>
        <td colspan="2">
          <!--<a-textarea cols="92" rows="2" v-model="backData.i_phone"></a-textarea>-->
          <!--:value="value"-->
          <!--@change="changeIphone"-->
          <!--@blur="blurIphone"-->
          <a-input
            type="number" min="1"
            style="padding-left: 10px" ref="i_phone" v-on:blur="blurText(backData.i_phone,$refs.i_phone)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.i_phone"></a-input>
        </td>
        <td class="title" width="15%">
          <!--拟稿日期-->
          <center><h3>{{detailList.d_create_time}}</h3></center>
        </td>
        <td colspan="2">
          <!--<a-input style="padding-left: 10px" v-model="backData.d_create_time"></a-input>-->
          <!--<a-date-picker @change="getDateTime4" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"  ></a-date-picker>-->
          <a-date-picker :defaultValue="moment(backData.d_create_time,'YYYY-MM-DD HH:mm:ss')"  showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%" disabled></a-date-picker>
        </td>
      </tr>
      <tr >
        <td class="title" width="15%">
           <!--标题-->
          <center><h3>{{detailList.s_title}}</h3></center>
        </td>
        <td colspan="7">
          <a-textarea cols="92" rows="4" ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_title"></a-textarea>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--辅办单位-->
          <center><h3>{{detailList.s_main_unit_names}}</h3></center>
        </td>
        <td colspan="7">
          <!--<a-textarea cols="92" rows="4" v-model="backData.s_main_unit_names"></a-textarea>-->
          <!--<a-input style="padding-left: 10px" v-model="backData.s_main_unit_names"></a-input>-->

          <!--<a-select style="width:82%" placeholder="请选择主送单位" v-model="backData.s_main_unit_names" @change="selectType">-->
            <!--<a-select-option v-for="(item,index) in optionMap.s_main_unit_names_option" :key="index" :value="item.value">{{item.text}}-->
            <!--</a-select-option>-->
          <!--</a-select>-->

          <a-input style="width:85%;" ref="s_main_unit_names" v-on:blur="blurText(backData.s_main_unit_names,$refs.s_main_unit_names)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}"  v-model="backData.s_main_unit_names"></a-input>
          <a-button style="width:15%;" @click="selDepartName" >选择</a-button>
        </td>

      </tr>

      <tr>
        <!--内部发送-->
        <td class="title" width="10%">
          <center><h3>{{detailList.s_inside_deptnames}}</h3></center>
        </td>
        <td colspan="7">
          <!--<a-input  cols="92" rows="4"  v-model="backData.s_inside_deptnames"></a-input>-->

          <!--<a-select style="width:82%" placeholder="请选择内部发送" v-model="backData.s_inside_deptnames" @change="selectInsideType">-->
            <!--<a-select-option v-for="(item,index) in optionMap.s_inside_deptnames_option" :key="index" :value="item.value">{{item.text}}-->
            <!--</a-select-option>-->
          <!--</a-select>-->

          <a-input style="width:85%;" ref="s_inside_deptnames" v-on:blur="blurText(backData.s_inside_deptnames,$refs.s_inside_deptnames)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}"  v-model="backData.s_inside_deptnames"></a-input>
          <a-button style="width:15%;" @click="selDepartName" >选择</a-button>
        </td>
      </tr>


      <tr>
        <td class="title" width="15%">
          <!--文件字号-->
          <center><h3>{{detailList.s_file_num}}</h3></center>
        </td>
        <td colspan="2">
          <a-textarea onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_file_num"></a-textarea>
          <!--<a-input cols="92" rows="2" v-model="backData.s_file_num"></a-input>-->
        </td>
        <td class="title" width="15%">
          <!--文件备注-->
          <center><h3>{{detailList.s_remarks}}</h3></center>
        </td>
        <td colspan="2">
          <a-textarea onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_remarks"></a-textarea>
          <!--<a-input cols="92" rows="2" v-model="backData.s_remarks"></a-input>-->
        </td>
      </tr>
      <tr>
        <td class="title" width="10%">
          <center><h3>附件</h3></center>
        </td>
        <td colspan="6" style="height: 80px">
          <div  v-for="(item,index) in oaFileList" style="padding-left: 15px">
            <!--<div @click="openFile(9,item.sfileName)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>-->
            <div @click="qiCao1(9,item.sfilePath)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>
            </div>
          </div>
          <!--<a-input :value="backData.s_remarks"></a-input>-->
        </td>
      </tr>
      <tr>
        <td class="title" width="10%">
          <!--""办文依据""-->
          <center><h3>{{detailList.s_varchar3}}</h3></center>
        </td>
        <td colspan="7">
          <a-input ref="s_varchar3" v-on:blur="blurText(backData.s_varchar3,$refs.s_varchar3)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_varchar3"></a-input>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--印发份数-->
          <center><h3>{{detailList.i_bigint1}}</h3></center>
        </td>
        <td colspan="2">
          <a-input type="number" min="1" ref="i_bigint1" v-on:blur="blurText(backData.i_bigint1,$refs.i_bigint1)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" style="padding-left: 10px" v-model="backData.i_bigint1"></a-input>
          <!--<a-textarea cols="92" rows="5" v-model="backData.s_varchar4"></a-textarea>-->
        </td>
        <!--- 正文页数-->
        <td class="title" width="15%">
          <center><h3>{{detailList.i_bigint2}}</h3></center>
        </td>
        <td colspan="2">
          <a-input type="number" min="1" ref="i_bigint2" v-on:blur="blurText(backData.i_bigint2,$refs.i_bigint2)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.i_bigint2"></a-input>
        </td>
      </tr>

      <tr>
        <!--校对 -->
        <td class="title" width="15%">
          <center><h3>{{detailList.s_varchar1}}</h3></center>
        </td>
        <td colspan="2">
          <a-input onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_varchar1"></a-input>
        </td>
        <!--打字 -->
        <td class="title" width="15%">
          <center><h3>{{detailList.s_varchar2}}</h3></center>
        </td>
        <td colspan="2">
          <a-input onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_varchar2"></a-input>
        </td>
      </tr>

      <tr>
        <td class="title" width="15%">
          <!--封发日期-->
          <center><h3>{{detailList.d_sealdate}}</h3></center>
        </td>
        <!--<td colspan="3">-->
        <!--<a-textarea cols="92" rows="5" v-model="backData.s_varchar4"></a-textarea>-->
        <td colspan="7">
          <!--<a-input  v-model="backData.d_sealdate"></a-input>-->
          <!--<a-date-picker @change="getDateTime5"  showTime="true" format="YYYY-MM-DD HH:mm:ss"   style="width: 100%"></a-date-picker>-->
          <a-input onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" disabled v-model="backData.d_sealdate"></a-input>

        </td>
      </tr>
    </table>

  </center>

    <sel-depart-name ref="selDepartNameRef" @ok="witeDepart"></sel-depart-name>
  </form>

</template>

<script>
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import moment from 'moment';
  import SelDepartName from "../../oaBus/pageModels/selDepartName";

  function formatNumber(value) {
    value+='';
    const list=value.split('.');
    const prefix=list[0].charAt(0)==='-'?'-':'';
    let num=prefix?list[0].slice(1):list[0];
    let result='';
    while (num.length>3){
      result=`,${num.slice(-3)}${result}`;
      num=num.slice(0,num.length-3);
    }
    if (num){
      result=num+result;
    }
    return `${prefix}${result}${list[1]?`.${list[1]}`:''}`;
  }

  export default {
    name: "signQutoFile",
    mixins: [JeecgListMixin,busdataTemplate],
    components: {
      ATextarea,
      SelDepartName,
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
        // value:'',
        visible: false,
        title: '签报管理',
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
          //对应的业务数据表
          table: 'oa_busdata70',
          //---------------------------------- 以下为表存储字段

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
          i_create_year:'',
          i_create_month:'',
          i_create_day:'',
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
          s_varchar1i_id:'',
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
          i_create_year:'',
          i_create_month:'',
          i_create_day:'',
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
          i_bigint3:'',
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
          /*optionAndBtn: '/oaBus/newTask/optionAndBtn',
          currentUserMsg: '/sys/user/getUserSectionInfoByToken',
          updateReadStatus: '/oaBus/taskInAct/changeStatus',
          selectTaskType: '/oaBus/busModel/list',
          selectTask: '/oaBus/busModel/list',
          queryOaFileList: '/oaBus/oaFile/queryOaFileList',
          updateBusdata: '/oaBus/dynamic/update'*/
        }
      }
    },
    created() {
      this.show();
    },
    methods: {
      // formatNumber,
      // changeIphone(e){
      //   const {value}=e.target;
      //   const reg=/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      //   if(!isNaN(value)&&reg.test(value)||value===''||value==='-'){
      //     this.value=value;
      //   }
      // },
      // blurIphone(){
      //   const {value,changeIphone}=this;
      //   if (value.charAt(value.length-1)==='.'||value==='-'){
      //     changeIphone({value:value.slice(0,-1)});
      //   }
      // },

      witeDepart(param){
        this.backData.s_create_dept = param.str1;
        this.backData.s_main_unit_names = param.str2;
        this.backData.s_inside_deptnames = param.str3;
      },
    //选择主送单位
    selDepartName(){
      //this.$refs.selDepartNameRef.show() ;
      let param = {
        str1:this.backData.s_create_dept,
        str2:this.backData.s_main_unit_names,
        str3:this.backData.s_inside_deptnames
      }
      this.$refs.selDepartNameRef.show(param);
    },
      selectInsideType(e){
        this.backData.s_inside_deptnames = e;
      },
      selectType(e,d) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(e);
        this.backData.s_main_unit_names=e;
      },
      getDateTime4(e,datetime4){
        // alert(datetime4)
        this.d_datetime4 = datetime4;
      },
      getDateTime5(e,d_sealdate){
        // alert(datetime4)
        this.d_sealdate = d_sealdate;
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

  /*.title{*/
  /*background-color: #e9ecf2 !important;*/
  /*padding: 0.7% !important;*/
  /*text-align: center !important;*/
  /*}*/

  /*.text {*/
  /*padding: 10px;*/
  /*}*/


  /*.title  h3 {*/
  /*font-weight: bolder !important;*/
  /*}*/

  /*.ant-btn-default{*/
  /*font-weight: bolder !important;*/
  /*background: rgb(178, 218, 255) !important;*/
  /*}*/
</style>