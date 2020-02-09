<template>

  <form>
    <center>
      <!--part3-->
      <table width="100%" border="1" borderColor="#aa7d7d">

        <tr>
          <td width="15%" class="title">
            <!--文件编号-->
            <center><h3>{{detailList.s_varchar8}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea v-model="backData.s_varchar8"></a-textarea>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--需求部门：-->
            <center><h3>{{detailList.s_create_dept}}</h3></center>
          </td>
          <td width="35%">
            <div style="padding-left: 10px">{{backData.s_create_dept}}</div>
          </td>
          <td width="15%" class="title">
            <!--需求部门拟稿人：-->
            <center><h3>{{detailList.s_create_name}}</h3></center>
          </td>
          <td>
            <div style="padding-left: 10px;width:35%;">{{backData.s_create_name}}</div>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--创建时间：-->
            <center><h3>{{detailList.d_create_time}}</h3></center>
          </td>
          <td width="35%">
            <div style="padding-left: 10px;">{{backData.d_create_time}}</div>
          </td>
          <td width="15%" class="title">
            <!--联系电话：：-->
            <center><h3>{{detailList.i_phone}}</h3></center>
          </td>
          <td>
            <a-input ref="i_phone" v-on:blur="blurText(backData.i_phone,$refs.i_phone)"
                     v-model="backData.i_phone"></a-input>
          </td>
        </tr>

        <tr>
          <!--主要用途-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_title}}</h3></center>
          </td>
          <td colspan="3">
            <a-input ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title)"
                     v-model="backData.s_title"></a-input>
          </td>
        </tr>


        <tr>
          <!--设备型号/数量-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar1}}</h3></center>
          </td>
          <td colspan="3">
            <a-input type="number" ref="s_varchar1" v-on:blur="blurText(backData.s_varchar1,$refs.s_varchar1)"
                     v-model="backData.s_varchar1"></a-input>
          </td>
        </tr>


        <tr>
          <!--安装区域-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar2}}</h3></center>
          </td>
          <td colspan="3">
            <a-input ref="s_varchar2" v-on:blur="blurText(backData.s_varchar2,$refs.s_varchar2)"
                     v-model="backData.s_varchar2"></a-input>
          </td>
        </tr>


        <tr>
          <!--设备使用者/联系电话-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar3}}</h3></center>
          </td>
          <td colspan="3">
            <a-input ref="s_varchar3" v-on:blur="blurText(backData.s_varchar3,$refs.s_varchar3)"
                     v-model="backData.s_varchar3"></a-input>
          </td>
        </tr>

        <tr>
          <!--技术支持者/联系电话-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar4}}</h3></center>
          </td>
          <td colspan="3">
            <a-input type="number" ref="s_varchar4" v-on:blur="blurText(backData.s_varchar4,$refs.s_varchar4)"
                     v-model="backData.s_varchar4"></a-input>
          </td>
        </tr>


        <tr>
          <!--信息节点号-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar5}}</h3></center>
          </td>
          <td>
            <a-input ref="s_varchar5" v-on:blur="blurText(backData.s_varchar5,$refs.s_varchar5)"
                     v-model="backData.s_varchar5"></a-input>
          </td>
          <!--UPS电源节点号-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar6}}</h3></center>
          </td>
          <td>
            <a-input ref="s_varchar6" v-on:blur="blurText(backData.s_varchar6,$refs.s_varchar6)"
                     v-model="backData.s_varchar6"></a-input>
          </td>
        </tr>


        <tr style="height: 150px">
          <!--科技部门办理结果 -->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar7}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea style="height: 140px" ref="s_varchar7"
                        v-on:blur="blurText(backData.s_varchar7,$refs.s_varchar7)"
                        v-model="backData.s_varchar7"></a-textarea>
          </td>
        </tr>

        <tr style="height: 150px">
          <td width="15%" class="title">
            <!--备注-->
            <center><h3>{{detailList.s_remarks}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea style="height: 140px" v-model="backData.s_remarks"></a-textarea>
          </td>
        </tr>


      </table>
    </center>
    <del-time ref="updateFileNameModal" @reloadAfterUpdate="reloadAfterUpdate"></del-time>
    <sel-depart-name ref="selDepartNameRef" @ok="witeDepart"></sel-depart-name>
  </form>

</template>


<script>
  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import SelDepartName from "../../oaBus/pageModels/selDepartName";
  import UpdatePaperTitle from "../../buttons/UpdatePaperTitleModal";
  import DelTime from "../../buttons/DelTimeModal";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "electricEquipment",
    mixins: [JeecgListMixin, busdataTemplate],
    components: {ATextarea, DelTime, UpdatePaperTitle, SelDepartName},
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
      isShowFile: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        visible: false,
        title: '电子设备进出机房',
        confirmLoading: false,
        s_varchar: [],
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        //detailList: null,    //  文档数据   字段含义
        oaFileList: [],    //  文档数据   字段含义
        banWenFileList: [],
        xxgkList: [],     //  信息公开
        bgklyList: [],    //  不公开理由
        backData: {

          //属性判断---新建时使用
          //---------------------------------------------
          i_phone: '',
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
          table: '',
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
          //主送单位
          s_main_unit_names: '',
          //抄送单位
          s_cc_unit_names: '',
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
          d_update_time: '',
          //当前流程名称
          s_cur_proc_name: '',
          //当前任务名称
          s_cur_task_name: '',
          d_sealdate: '',
          //模板id
          s_varchar20: '',
          //信息公开
          s_varchar4: '',
          //不公开理由
          s_varchar5: '',
          s_varchar20: '',
          s_cur_proc_name: '',
          s_varchar1: '',
          s_varchar2: '',
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
          queryOaFileList: '/oaBus/oaFile/queryOaFileList',
          functionQuery: '/oaBus/busFunction/list',
          updateBusdata: '/oaBus/dynamic/update',
        }
      }
    },
    created() {
      /*getAction(this.url.currentUserMsg).then(res => {
        this.userData = res.result
      })*/
      this.show();
    },
    destroyed() {
      this.backData = {};
      this.backData = {};
    },
    methods: {
      varOneSelectType(e) {
        this.backData.s_varchar1 = e;
      },
      varTwoSelectType(e) {
        this.backData.s_varchar2 = e;
      },
      witeDepart(param) {
        this.backData.s_main_unit_names = param.str1;
        this.backData.s_cc_unit_names = param.str2;
        this.backData.s_inside_deptnames = param.str3;
      },
      //选择主送单位
      selDepartName() {
        //this.$refs.selDepartNameRef.show() ;
        let param = {
          str1: this.backData.s_main_unit_names,
          str2: this.backData.s_cc_unit_names,
          str3: this.backData.s_inside_deptnames
        }
        this.$refs.selDepartNameRef.show(param);
      },

      optsGet(opts) {
        this.opts = opts
      },
      change(e) {
        this.backData.i_safetylevel = e

      },
      changeHuanJi(e) {
        this.backData.i_urgency = e
      },

      //页面初始化调用方法，初始化渲染页面
      show(taskDetail) {
        /*console.log("页面数据---：" + JSON.stringify(this.detailList))
        console.log("基础数据---：" + JSON.stringify(this.backDataRef))*/
        //查询出优先级
        if (this.backData.ilevel != '') {
          //去查一次
          getAction(this.url.functionQuery, {
            iBusModelId: this.backData.i_bus_function_id
          }).then(res => {
            if (res.success) {
              this.backData.ilevel = res.result.records.ilevel
            }
          })
        }
        if (this.optionMap.xxgk != undefined) {
          this.xxgkList = this.optionMap.xxgk;
        }
        if (this.optionMap.bgkly != undefined) {
          this.bgklyList = this.optionMap.bgkly;
        }
        //业务数据赋值
        for (var i in this.backData) {
          this.backData[i] = this.backDataRef[i]
        }

        //************************************* 查询字段名称start ************************************
        this.getOaFiles(this.backData.table, this.backData.i_id)
        this.getBanWenFiles(this.backData.table, this.backData.i_id);
        console.log(this.optionMap)
        //************************************* 查询字段名称end ************************************
        for (let i = 0; i < this.optionMap.checkList.length; i++) {
          console.log(this.s_varchar)
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }

      },

      //监测开始时间变化
      getDateTime4(e, datetime4) {
        this.backData.d_datetime4 = datetime4;
      },
      //监测结束时间变化
      getDateTime5(e, datetime5) {
        this.backData.d_datetime5 = datetime5;

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
  input.ant-input {
    height: 48px;
  }

  textarea.ant-input {
    height: 48px;
  }

  /deep/ .ant-select-selection--single {
    height: 48px;
    padding: 8px 0;
  }

  /deep/ .ant-calendar-picker-input {
    height: 48px;
  }
</style>

<style>
  .hoverred:hover {
    color: red;
    cursor: pointer;
  }

  .title h3 {
    font-weight: bolder !important;
  }

  .ant-btn-default {
    font-weight: bolder !important;
    background: rgb(178, 218, 255) !important;
  }

  .title {
    background-color: #e9ecf2 !important;
    padding: 0.7% !important;
    text-align: center !important;
  }
</style>