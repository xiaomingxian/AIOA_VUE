<template>
  <center>
    <table :submit="submit" border="1" borderColor="#F0F5FC" class="sendFileStyle" width="100%">
      <tr style="height: 50px;">
        <td width="15%"class="title">
          <center><h3>{{detailList.s_create_dept}}</h3></center>
        </td>
        <td  width="35%">
          <div style="padding-left: 10px;">{{backData.s_create_dept}}</div>
        </td>
        <td width="15%"class="title">
          <!--登记人员-->
          <centezr><h3>{{detailList.s_create_name}}</h3></centezr>
        </td>
        <td  width="35%">
          <div style="padding-left: 10px">{{backData.s_create_name}}</div>
        </td>
      </tr>
      <tr style="height: 50px;">
        <td width="15%" class="title">
          <center><h3>{{detailList.s_varchar1}}</h3></center>
        </td>
        <td width="35%">
          <center>
            <a-select style="width: 100%" placeholder="请选择会议室" ref="s_varchar6" v-on:blur="blurText(backData.s_varchar6,$refs.s_varchar6)" v-model="backData.s_varchar6"
                      @change="changeMeetingRoom">
              <a-select-option v-for="(item,index) in optionMap.s_varchar1_option" :key="index" :text="item.text"
                               :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </center>
        </td>

        <!--<td width="15%" class="title">-->
          <!--<center><h3>{{detailList.d_datetime1}}</h3></center>-->
        <!--</td>-->
        <!--<td width="35%">-->
          <!--<left>-->
            <!--<template v-if="backData.d_datetime3 == null && backData.d_datetime4 ==null">-->
              <!--<a-range-picker-->
                <!--ref="s_varchar4"-->
                <!--v-on:blur="blurText([backData.d_datetime3,backData.d_datetime4],$refs.s_varchar4)"-->
                <!--style="width: 95%"-->
                <!--showTime-->
                <!--:disabledDate="disabledDate"-->
                <!--:disabledTime="disabledRangeTime"-->
                <!--:showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"-->
                <!--format="YYYY-MM-DD HH:mm"-->
                <!--:placeholder="['开始时间','结束时间']"-->
                <!--@change="selectTime" @ok="confirmTime"-->
              <!--/>-->
            <!--</template>-->

            <!--<template v-else>-->
              <!--<a-range-picker-->
                <!--ref="s_varchar4"-->
                <!--v-on:blur="blurText([backData.d_datetime3,backData.d_datetime4],$refs.s_varchar4)"-->
                <!--style="width: 95%"-->
                <!--:showTime="{format}"-->
                <!--:disabledDate="disabledDate"-->
                <!--:disabledTime="disabledRangeTime"-->

                <!--format="YYYY-MM-DD HH:mm:ss"-->
                <!--:placeholder="['开始时间','结束时间']"-->
                <!--@change="selectTime" @ok="confirmTime"-->
                <!--:defaultValue="[moment(backData.d_datetime1),moment(backData.d_datetime2)]"-->
              <!--/>-->
            <!--</template>-->
          <!--</left>-->
        <!--</td>-->

        <td colspan="1" class="title">
          <center><h3>{{detailList.d_datetime1}}</h3></center>
        </td>
        <td colspan="7">
          <left>
            <template v-if="backData.d_datetime3 == null && backData.d_datetime4 ==null">
              <a-range-picker
                ref="s_varchar4"
                v-on:blur="blurText([backData.d_datetime3,backData.d_datetime4],$refs.s_varchar4)"
                style="width: 95%"
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
                v-on:blur="blurText([backData.d_datetime3,backData.d_datetime4],$refs.s_varchar4)"
                style="width: 95%"
                :showTime="{format}"
                :disabledDate="disabledDate"
                :disabledTime="disabledRangeTime"

                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始时间','结束时间']"
                @change="selectTime" @ok="confirmTime"
                :defaultValue="[moment(backData.d_datetime3),moment(backData.d_datetime4)]"
              />
            </template>
          </left>
        </td>
      </tr>
      <tr>
        <td colspan="1" class="title">
          <center><h3>{{detailList.s_title}}</h3></center>
        </td>
        <td colspan="9" height="100px">
          <center>
            <template>
              <a-textarea maxLength="300" placeholder="请输入会议内容..." ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_title" style="height: 100px"
                          :rows="true"></a-textarea>
            </template>
          </center>
        </td>
      </tr>
      <!--参会人员-->
      <!--<tr style="height: 50px;">-->
        <!--<td width="15%"class="title">-->
          <!--<center><h3>{{detailList.s_varchar4}}</h3></center>-->
        <!--</td>-->
        <!--<td colspan="3">-->
          <!--<getpersons maxLength="50" v-model="backData.s_varchar4"  ref="s_varchar4" :backData="backData" @saveInform="submit"-->
                      <!--@getDUS="getDUS"/>-->
        <!--</td>-->
      <!--</tr>-->
      <!--附件-->
      <tr style="height: 50px;">
        <td width="15%"class="title">
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
          <td width="15%"class="title">
            <center><h3>{{detailList.d_create_time}}</h3></center>
          </td>
          <td colspan="3">
            <div style="padding-left: 10px;">{{backData.d_create_time}}</div>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr style="height: 50px;">
          <td width="15%"class="title">
            <center><h3>{{detailList.d_create_time}}</h3></center>
          </td>
          <td colspan="3">
            <div style="padding-left: 10px;" v-model="backData.d_create_time">{{ timeStrings }}</div>
          </td>
        </tr>
      </template>
    </table>
    <del-time ref="updateFileNameModal" @reloadAfterUpdate="reloadAfterUpdate"></del-time>
  </center>
</template>


<script>
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import moment from 'moment'
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import getpersons from "../../oaBus/pageModels/meetingUser"
  import DelTime from "../../buttons/DelTimeModal";

  export default {
    name: "meetingNotice",
    mixins: [JeecgListMixin, busdataTemplate],
    components: {DelTime, getpersons},
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
        userRealName: '',

        value: 1,
        isAllChack: false,
        //会议时间
        meetingTime: [],
        //选择会议开始时间
        startTime: '',
        //会议室
        address: '',
        //参会人员id
        meetingUserId: [],
        oaFileList: [],    //  文档数据
        banWenFileList:[],
        visible: true,
        title: '会议申请',
        confirmLoading: false,
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        opts: [],//意见框信息
        meeting: '',
        //意见表相关
        backDataOpt: {
          //回填数据id
          table: 'oa_busdata40',
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
        //表中的数据相关值
        jeditShow: false,   //富文本编辑器的内容的value值
        jeditor: {
          value: ''
        },

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
          banWenFileList:[],  //办文依据
          //*******
          //模块---业务模块id
          i_bus_model_id: '',
          //-------业务功能id
          i_bus_function_id: '',
          //密级
          i_safetylevel: 0,
          //缓急
          i_urgency: 0,
          //主办部门
          s_main_dept_names: '',
          //辅办部门
          s_cc_dept_names: '',
          //内部发送部门
          s_inside_deptnames: '',
          //标题
          s_title: '',
          //左侧参数页面头部
          s_left_parameter: '',
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
          d_create_time: '',
          //修改时间
          d_update_time: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
          //申请会议室id
          s_varchar1: 0,
          //会议内容--标题
          // s_varchar2: '',

          //参会人员---参会人员id
          s_varchar4: '',
          //全行，部门，用户标示
          s_varchar5: '',
          //会议室名--------------!!!
          s_varchar6: '',
          //参会选择id
          s_varchar7: '',
          //附件
          s_varchar8: '',
          //开始时间---日程结束时间 -----------------!!!
          d_datetime3: '',
          //截至时间
          d_datetime4: '',
          //录入时间---日程开始时间
          d_datetime5: '',

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
          queryOaFileList: '/oaBus/oaFile/queryOaFileList',
          queryMeetingTime: '/oaBus/meetingInform/getMeetingTime',
          queryChooseUser: '/sys/user/queryChooseUser'
        }
      }
    },
    computed: {
      timeStrings() {
        let oneTime = new Date();
        let Y = oneTime.getFullYear();
        let M = oneTime.getMonth() + 1;
        let D = oneTime.getDate();
        return Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + oneTime.toTimeString().substr(0, 8);
      },
    },
    created() {
      this.show();
      // this.changeMeetingRoom();//-------------------------不要随便初始化---------
    },
    methods: {
      moment,
      //调用参会人员子组件业务数据处理方法
      submit() {
        this.$refs.s_varchar4.sendUser();
      },

      getDUS(data,iIsLimits,id) {
        if (id != undefined){
          this.backData.s_varchar7=id.toString();
        }
        this.backData.s_varchar4 = data;
        this.backData.s_varchar5 = iIsLimits;
      },
      disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
      },
      // 选择会议室查对应时间
      changeMeetingRoom(e, d) {
        // this.backData.d_datetime1 = '';
        this.backData.s_varchar1 = e;
        this.backData.s_varchar6 = d.data.attrs.text;
      },
      // 选择会议时间
      // changeTime(e) {
        // if (backData.s_varchar1 == null || backData.s_varchar1 == undefined){
        //   this.$message.error("请选择会议室");
        // }
        // this.backData.d_datetime1 = e;
      // },
      //----------------确定时间---------------
      confirmTime(e) {
        let startTime = e[0]._d;
        let endTime = e[1]._d;

        this.backData.d_datetime3 = this.dataTime(startTime);
        this.backData.d_datetime4 = this.dataTime(endTime);
      },

      dataTime(time) {
        let oneTime = new Date(time);
        let Y = oneTime.getFullYear();
        let M = oneTime.getMonth() + 1;
        let D = oneTime.getDate();
        return Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + oneTime.toTimeString().substr(0, 8);
      },

      close() {
        this.visible = false;
      },
      show() {
        for(let i = 0;i<this.optionMap.checkList.length;i++){
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }
        //业务数据赋值
        for (var i in this.backData) {
          this.backData[i] = this.backDataRef[i];
        }
        this.getOaFiles(this.backData.table, this.backData.i_id);
        this.getBanWenFiles(this.backData.table, this.backData.i_id);
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
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../assets/less/detailsBaseStyle";
  /*input.ant-input{*/
  /*height: 40px;*/
  /*}*/

  /*textarea.ant-input{*/
  /*height: 40px;*/
  /*}*/

  /*/deep/ .ant-select-selection--single{*/
  /*height: 40px;*/
  /*padding: 8px 0;*/
  /*}*/

  /*/deep/ .ant-calendar-picker-input{*/
  /*height: 40px;*/
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