<template>
  <center>

    <table border="1" class="sendFileStyle" style="border:#F0F5FC;" width="100%">
      <tr>
        <td class="title" width="15%">
          <!--标题-->
          <center><h3>{{detailList.s_title}}</h3></center>
        </td>
        <td colspan="3">
          <a-textarea  maxLength="300"  cols="92" rows="2" ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)"
                      onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}"
                      v-model="backData.s_title"></a-textarea>
        </td>
      </tr>
      <tr>
        <td class="title" width="15%">
          <!--类型-->
          <center><h3>{{detailList.s_varchar4}}</h3></center>

        </td>
        <td colspan="3">
          <a-textarea  maxLength="50"  cols="92" rows="2" ref="s_varchar4" v-on:blur="blurText(backData.s_varchar4,$refs.s_title,detailList.s_varchar4)"
                      onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}"
                      v-model="backData.s_varchar4"></a-textarea>
        </td>
      </tr>
      <tr style="height: 50px;">

        <td class="title" width="15%">
          <!--创建人-->
          <center><h3>{{detailList.s_create_name}}</h3></center>
        </td>
        <td>
          <div style="padding-left: 10px">{{backData.s_create_name}}</div>
        </td>
        <!--创建部门-->
        <td class="title" width="15%">
          <center><h3>{{detailList.s_create_dept}}</h3></center>
        </td>
        <td>
          <div style="padding-left: 10px;">{{backData.s_create_dept}}</div>
        </td>

      </tr>

      <tr style="height: 50px;">
        <td class="title" width="15%">
          <!--创建时间-->
          <center><h3>{{detailList.d_create_time}}</h3></center>
        </td>
        <td width="35%">
          <a-date-picker :defaultValue="moment(backData.d_create_time,'YYYY-MM-DD HH:mm:ss')" showTime="true"
                         format="YYYY-MM-DD HH:mm:ss" style="width: 100%" disabled></a-date-picker>
        </td>
        <!--有效时间-->
        <td class="title" width="15%">
          <center><h3>{{detailList.d_datetime1}}</h3></center>
        </td>
        <td  width="35%">
          <a-date-picker v-if="backData.d_datetime1" ref="d_datetime1"
                         v-on:blur="blurText([backData.d_datetime1],$refs.d_datetime1)" :defaultValue="moment(backData.d_datetime1,'YYYY-MM-DD HH:mm:ss')"
                         :allowClear="false" showTime="true" format="YYYY-MM-DD HH:mm:ss" style="width: 100%"
                         @change="selectTime"></a-date-picker>
          <a-date-picker v-else ref="d_datetime1"
                         v-on:blur="blurText([backData.d_datetime1],$refs.d_datetime1)" showTime="true" format="YYYY-MM-DD HH:mm:ss" style="width: 100%"
                         @change="selectTime"></a-date-picker>
        </td>
      </tr>
      <tr>
        <td class="title" width="10%">
          <center><h3>{{detailList.s_varchar1}}</h3></center>
        </td>
        <td colspan="3">
          <div v-for="(item,index) in oaFileList" style="padding-left: 15px">
            <div class="qiCao"><span class="hoverred"@click="qiCao1(9,item)">{{index+1}}、{{item.sfileName}}</span>
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
    </table>
    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visibleDel"
      @ok="comfirmModal"
      @cancel="closeModal"
    >
      <p>有效时间尚未选择，是否发布？</p>
    </a-modal>
    <del-time ref="updateFileNameModal" @reloadAfterUpdate="reloadAfterUpdate"></del-time>
  </center>

</template>

<script>
  import {getAction, postAction} from "@/api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import moment from 'moment';
  import DelTime from "../../buttons/DelTimeModal";

  export default {
    name: "electronicFile",
    mixins: [JeecgListMixin, busdataTemplate],
    components: {
      DelTime,
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
      busFunction: {
        type: Object,
        required: false
      },
      optionMap: {
        type: Object,
        required: false
      },
      publishData: {
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
        s_varchar: [],
        visible: false,
        visibleDel: false,
        title: '电子公告',
        confirmLoading: false,
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        detailList: null,    //  文档数据   字段含义
        oaFileList: [],    //  文档数据   字段含义
        banWenFileList:[],
        typeList: [],    //类别
        select_type: '',
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
          table: 'oa_busdata30',
          //---------------------------------- 以下为表存储字段
          //*******
          i_id: '',
          s_receive_type: '',     //来文文种

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

          //创建人部门id
          s_create_deptid: '',
          //创建人机构id
          s_create_unitid: '',
          s_varchar1: '', //附件
          s_varchar2: '',
          s_varchar3: '',
          s_varchar4: '',
          s_varchar5: '', //数据字典值汉字
          /************电子公告表单内容********************/
          //标题
          s_title: '',
          //创建者姓名
          s_create_name: '',
          //创建人部门name
          s_create_dept: '',
          //创建时间
          d_create_time: '',
          //修改时间
          d_update_time: new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate(),
          //有效时间
          d_datetime1: '',
          //发布时间
          d_datetime2: '',
          //公告类别
          i_bigint1: '',
          //发布状态
          i_bigint2: '',
          //发布范围
          i_bigint3: '',
          s_cur_proc_name: '',
          //当前任务名称
          s_cur_task_name: '',
          //是否重要
          i_is_important: ''
        },
        url: {
          currentUserMsg: '/sys/user/getUserSectionInfoByToken',
          updateReadStatus: '/oaBus/taskInAct/changeStatus',
          selectTaskType: '/oaBus/busModel/list',
          selectTask: '/oaBus/busModel/list',
          queryOaFileList: '/oaBus/oaFile/queryOaFileList',
        }
      }
    },
    created() {
      this.show();
    },

    methods: {
      moment,
      //获取选择类别
      selectType(e) {
        this.backData.i_bigint1 = e;
        for (let i in  this.optionMap.i_bigint1_option) {
          if (e + "" == this.optionMap.i_bigint1_option[i].value) {
            this.backData.s_varchar5 = this.optionMap.i_bigint1_option[i].text;
            return;
          }
        }
      },
      //获取选中结束时间
      selectTime(e) {
        if (e != null) {
          let endDate = this.dateFormat(e._d);
          this.backData.d_datetime1 = endDate
          console.log('有效时间=====》', endDate);
          this.$emit("validDate", endDate)
        }
      },
      isSelectDate() {
        //校验有效时间是否选择
        if (this.backData.d_datetime1 == '' || this.backData.d_datetime1 == undefined) {
          this.visibleDel = true;
        } else {
          this.$emit("isPublish", false)
        }
      },
      comfirmModal() {
        this.visibleDel = false;
        this.$emit("isPublish", true)
      },
      closeModal() {
        this.visibleDel = false;
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
      show() {
        for (let i = 0; i < this.optionMap.checkList.length; i++) {
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }

        //业务数据赋值
        for (var i in this.backData) {
          this.backData[i] = this.backDataRef[i]
        }
        if (this.backData.d_datetime1 == undefined) {
          this.backData.d_datetime1 = this.getNextMonth(this.backData.d_create_time); //默认180天之后
          var internet = navigator.userAgent;
          if (/firefox/i.test(internet) && this.backData.d_datetime1 !=""){
            this.backData.d_datetime1.replace(/-/g,"/");
          }else {
            this.backData.d_datetime1 = this.dateFormat(this.backData.d_datetime1);
          }
        }
        if (this.backData.i_bigint1 != "" && this.backData.i_bigint1 != undefined) {
          this.backData.i_bigint1 = this.backData.i_bigint1 + '';
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

</style>