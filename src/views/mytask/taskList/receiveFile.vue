<template>

  <form>
    <center>

      <table width="100%" border="1" style="border:#913838;">
        <tr>
          <td class="title" width="15%">
            <!--标题-->
            <center><h3>{{detailList.s_title}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea cols="92" rows="2" ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)" v-model="backData.s_title"></a-textarea>
          </td>
        </tr>
       <!-- <tr>
          <td class="title" width="15%">
            &lt;!&ndash;登记人员&ndash;&gt;
            <center><h3>{{detailList.s_create_name}}</h3></center>
          </td>
          <td colspan="3">
            <div style="padding-left: 10px;width:35%;">{{backData.s_create_name}}</div>
          </td>
          &lt;!&ndash;创建部门&ndash;&gt;
          &lt;!&ndash;<td width="15%">
            <center><h3>{{detailList.s_create_dept}}</h3></center>
          </td>&ndash;&gt;
          &lt;!&ndash;<td>
            <div style="padding-left: 10px">{{backData.s_create_dept}}</div>
          </td>&ndash;&gt;
        </tr>-->
        <tr>
          <td class="title" width="15%">
            <!--收文日期-->
            <center><h3>{{detailList.d_create_time}}</h3></center>
          </td>
          <td width="35%">
            <div style="padding-left: 10px;">{{backData.d_create_time}}</div>
            <!--<a-input :value="backData.d_create_time"></a-input>-->
          </td>
          <td class="title" width="15%">
            <!--成文日期-->
            <center><h3>{{detailList.d_sealdate}}</h3></center>
          </td>
          <td>
            <a-input :value="backData.d_sealdate"></a-input>
          </td>
        </tr>
        <tr>
          <td class="title" width="10%">
            <!--文件字号-->
            <center><h3>{{detailList.s_file_num}}</h3></center>
          </td>
          <td colspan="3">
            <a-input :value="backData.s_file_num"></a-input>
          </td>
        </tr>
        <tr>
          <td class="title" width="15%">
            <!--来文文种-->
            <center><h3>{{detailList.s_varchar4}}</h3></center>
          </td>
          <td>
            <!--<a-input :value="backData.s_varchar4"></a-input>-->
            <a-select placeholder="请选择来文文种" ref="s_varchar4" v-on:blur="blurText(backData.s_varchar4,$refs.s_varchar4)"
                      v-model="backData.s_varchar4">
              <a-select-option v-for="(item,index) in recFileTypeList" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
          </td>
          <td class="title" width="15%">
            <!--来文字号-->
            <center><h3>{{detailList.s_receive_num}}</h3></center>
          </td>
          <td>
            <a-input :value="backData.s_receive_num"></a-input>
          </td>
        </tr>
        <tr>
          <td class="title" width="10%">
            <!--来文机关-->
            <center><h3>{{detailList.s_varchar5}}</h3></center>
          </td>
          <td >
            <a-select placeholder="请选择来文机关" ref="s_varchar5" v-on:blur="blurText(backData.s_varchar5,$refs.s_varchar5)"
                      v-model="backData.s_varchar5">
              <a-select-option v-for="(item,index) in recFileOrgList" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
          </td>

          <td class="title" width="15%">
            <center><h3>数量</h3></center>
          </td>
          <td>
            <a-input style="width: 45%" ref="i_bigint1" v-on:blur="blurText(backData.i_bigint1,$refs.i_bigint1)" v-model="backData.i_bigint1"></a-input>
            份
            <a-input style="width: 45%" ref="i_bigint2" v-on:blur="blurText(backData.i_bigint2,$refs.i_bigint2)" v-model="backData.i_bigint2"></a-input>
            页
          </td>
        </tr>
        <tr>
          <td class="title" width="10%">
            <!--主办部门-->
            <center><h3>{{detailList.s_create_dept}}</h3></center>
          </td>
          <td colspan="3">
            <a-input :value="backData.s_create_dept"></a-input>
          </td>
        </tr>
        <tr>
          <td class="title" width="10%">
            <!--辅办部门-->
            <center><h3>{{detailList.s_cc_dept_names}}</h3></center>
          </td>
          <td colspan="3">
            <a-input :value="backData.s_cc_dept_names"></a-input>
          </td>
        </tr>
        <tr>
          <td class="title" width="10%">
            <!--内部发送部门-->
            <center><h3>{{detailList.s_inside_deptnames}}</h3></center>
          </td>
          <td colspan="3">
            <a-input :value="backData.s_inside_deptnames"></a-input>
          </td>
        </tr>
        <tr>
          <td class="title" width="10%">
            <!--备注-->
            <center><h3>{{detailList.s_remarks}}</h3></center>
          </td>
          <td colspan="3">
            <a-input v-model="backData.s_remarks"></a-input>
          </td>
        </tr>

        <tr>
          <td class="title" width="10%">
            <center><h3>附件</h3></center>
          </td>
          <td colspan="3">
            <div v-for="(item,index) in oaFileList" style="padding-left: 15px">
              <!--<div @click="openFile(9,item.sfileName)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>-->
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
            <!--<a-input :value="backData.s_remarks"></a-input>-->
          </td>
        </tr>
      </table>
      <del-time ref="updateFileNameModal" @reloadAfterUpdate="reloadAfterUpdate"></del-time>
    </center>
  </form>
</template>

<script>
  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import {ntkoBrowser} from '../../buttons/btn-js/ntkobackground.min.js'
  //模板
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import DelTime from "../../buttons/DelTimeModal";


  export default {
    name: "doTaskModal",
    mixins: [JeecgListMixin,busdataTemplate],
    components: {
      DelTime

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
      taskParent: {
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
        visible: false,
        title: '收文',
        s_varchar:[],
        recFileTypeList:[],
        recFileOrgList:[],
        confirmLoading: false,
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        opts: [],//意见框信息

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
          s_taskdef_key: "",
          //是否重要
          i_is_important: ''
        },
        oaFileList: [],    //  文档数据   字段含义
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
          //function值用于排序
          ilevel: '',
          //业务配置表id-用于查询按钮/意见权限
          iprocSetId: '',
          //对应的业务数据表
          table: 'oa_busdata20',
          //---------------------------------- 以下为表存储字段

          //*******
          i_id: '',
          i_bigint1: '',   //份数
          i_bigint2: '',   //页数
          s_receive_type: '',     //来文文种
          s_varchar3: '',//"办文依据"
          //d_datetime1: '',//"成文日期"
          d_sealdate: '',//"成文日期"
          //*******
          //模块
          i_bus_model_id: '',
          //
          i_bus_function_id: '',
          //密级
          i_safetylevel: '0',
          //缓急
          i_urgency: '0',
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
          i_is_state: '0',
          //是否保存办文单
          i_is_approve: '0',
          //是否归档
          i_is_archives: '0',
          //是否已送全文检索
          i_is_es: '0',
          //是否送公文传输
          i_is_send: '0',
          //是否为临时文件
          i_is_display: '0',
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
          d_sealdate: '',
          //创建时间
          d_create_time: '',
          //修改时间
          d_update_time: '',
          //当前流程名称
          s_cur_proc_name: '',
          //当前任务名称
          s_cur_task_name: ''
        },

        url: {
          optionAndBtn: '/oaBus/newTask/optionAndBtn',
          currentUserMsg: '/sys/user/getUserSectionInfoByToken',
          updateReadStatus: '/oaBus/taskInAct/changeStatus',
          selectTaskType: '/oaBus/busModel/list',
          selectTask: '/oaBus/busModel/list',
          queryOaFileList: '/oaBus/oaFile/queryOaFileList',
          functionQuery: '/oaBus/busFunction/list',
          initSelDate: '/sys/dict/getDictByKeyObj',
        }
      }
    },
    created() {
      this.initSelDate() ;
      this.show();
    },
    methods: {
      initSelDate(){
        //初始化来文文种
        getAction(this.url.initSelDate,{dictKey:"recFileType"}).then(res =>{
          this.recFileTypeList = res.result ;
        })
        //初始化来文机关
        getAction(this.url.initSelDate,{dictKey:"recFileOrg"}).then(res =>{
          this.recFileOrgList = res.result ;
        })
      },
      optsGet(opts) {
        this.opts = opts
      },
      change(e) {
        this.backData.i_safetylevel = e

      }, changeHuanJi(e) {
        console.log('=============',e)
        this.backData.i_urgency = e
      },
      //详情页面数据
      showTaskInAct(taskDetail, task) {
        //查询出优先级
        this.task = task
        this.show(taskDetail)
        //修改数据信息为已读
        this.changeReadStatus()
      },
      show() {

        for(let i = 0;i<this.optionMap.checkList.length;i++){
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }

        for (var i in this.backData) {

          this.backData[i] = this.backDataRef[i]
        }
        this.getOaFiles(this.backData.table, this.backData.i_id);
        // this.backData.table = table
        this.visible = true
      },
      //子孙组件事件回传
      watchSub(e) {
        this.getOaFileList(this.backData.table, this.backData.i_id);
      },
      //意见id赋值  区分新增与更新
      optSet(opts, key) {
        for (let i in opts) {
          if (opts[i].taskDefKey == key) {
            this.backDataOpt.i_id = opts[i].optId
          }
        }
      },

      ok() {
        this.handleCancel()
      },
      getOaFileList(tableName, busDataId) {
        getAction(this.url.queryOaFileList,
          {
            tableName: tableName, busDataId: busDataId
          }).then(res => {
          this.oaFileList = res.result;
        })
      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        //清除意见与按钮页面数据
        this.$refs.taskOptRef.clear()

        //刷新父页面
        this.$emit('reload_todo')
      }, onChange(date, dateString) {
        // console.log(date, dateString);
      }, onChange2(date, dateString) {
        // console.log(date, dateString);
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