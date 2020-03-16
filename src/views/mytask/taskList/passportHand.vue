<template>

  <form>
    <center>
      <!--part3-->
      <table width="100%" border="1" borderColor="#F0F5FC">
        <tr>
          <td width="15%" class="title">
            <!--申请人：：-->
            <center><h3>{{detailList.s_create_name}}</h3></center>
          </td>
          <td>
            <div style="padding-left: 10px;width:35%;">{{backData.s_create_name}}</div>
          </td>
          <td width="15%" class="title">
            <!--所在部门：：-->
            <center><h3>{{detailList.s_create_dept}}</h3></center>
          </td>
          <td width="35%">
            <div style="padding-left: 10px">{{backData.s_create_dept}}</div>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--申请时间：-->
            <center><h3>{{detailList.d_create_time}}</h3></center>
          </td>
          <td width="35%">
            <div style="padding-left: 10px;">{{backData.d_create_time}}</div>
          </td>
          <td width="15%" class="title">
            <!--电话：：-->
            <center><h3>{{detailList.i_phone}}</h3></center>
          </td>
          <td>
            <a-input  type="number"  ref="i_phone" v-on:blur="blurText(backData.i_phone,$refs.i_phone)" v-model="backData.i_phone"></a-input>
          </td>
        </tr>


        <tr>
          <td class="title" width="15%">
            <!--出境天数-->
            <center><h3>{{detailList.i_bigint1}}</h3></center>
          </td>
          <td>
            <a-input type="number" style="padding-left: 10px" ref="i_bigint1" v-on:blur="blurText(backData.i_bigint1,$refs.i_bigint1)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.i_bigint1"></a-input>
            <!--<a-input style="padding-left: 10px" v-model="backData.i_bigint1"></a-input>-->
          </td>
          <td class="title" width="15%">
            <!--销假日期-->
            <center><h3>{{detailList.d_datetime3}}</h3></center>
          </td>
          <td>
            <a-input style="padding-left: 10px" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.d_datetime3" disabled></a-input>
          </td>
        </tr>

        <tr >
          <td class="title" width="15%">
            <!--起始日期-->
            <center><h3>{{detailList.d_datetime4}}</h3></center>
          </td>
          <td colspan="6">
            <a-date-picker v-if="backData.d_datetime4" ref="d_datetime4" v-on:blur="blurText([backData.d_datetime4],$refs.d_datetime4)"  :defaultValue="moment(backData.d_datetime4,'YYYY-MM-DD HH:mm:ss')"  showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
            <a-date-picker  v-else @change="getDateTime4" ref="d_datetime4" v-on:blur="blurText([backData.d_datetime4],$refs.d_datetime4)" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
          </td>
        </tr>
        <tr>
          <td class="title" width="15%">
            <!--结束日期-->
            <center><h3>{{detailList.d_datetime5}}</h3></center>
          </td>
          <td colspan="6">
            <a-date-picker v-if="backData.d_datetime5" ref="d_datetime5" v-on:blur="blurText([backData.d_datetime5],$refs.d_datetime5)" :defaultValue="moment(backData.d_datetime5,'YYYY-MM-DD HH:mm:ss')"  showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
            <a-date-picker v-else @change="getDateTime5" ref="d_datetime5" v-on:blur="blurText([backData.d_datetime5],$refs.d_datetime5)" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--需办理事项：-->
            <center><h3>{{detailList.s_varchar1}}</h3></center>
          </td>
          <td>
            <a-select placeholder="请选择需办理事项" ref="s_varchar1" v-on:blur="blurText(backData.s_varchar1,$refs.s_varchar1)"
                      v-model="backData.s_varchar1" @change="varOneSelectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar1_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>

          <td width="15%" class="title">
            <!--办理说明：-->
            <center><h3>{{detailList.s_varchar2}}</h3></center>
          </td>
          <td>
            <a-select placeholder="请选择办理说明" ref="s_varchar2" v-on:blur="blurText(backData.s_varchar2,$refs.s_varchar2)"
                      v-model="backData.s_varchar2" @change="varTwoSelectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar2_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
        </tr>

        <tr>
          <!--职务-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar3}}</h3></center>
          </td>
          <td>
            <a-input ref="s_varchar3" v-on:blur="blurText(backData.s_varchar3,$refs.s_varchar3)" v-model="backData.s_varchar3"></a-input>
          </td>
          <!--所在地区-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar4}}</h3></center>
          </td>
          <td>
            <a-input ref="s_varchar4" v-on:blur="blurText(backData.s_varchar4,$refs.s_varchar4)" v-model="backData.s_varchar4"></a-input>
          </td>
        </tr>

        <tr>
          <!--出国（境）事由——标题-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_title}}</h3></center>
          </td>
          <td colspan="3">
            <a-input ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)" v-model="backData.s_title"></a-input>
          </td>
        </tr>


        <tr>
          <td width="15%" class="title">
            <!--人事部门备案-->
            <center><h3>{{detailList.s_varchar5}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea v-model="backData.s_varchar5"></a-textarea>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--备注-->
            <center><h3>{{detailList.s_remarks}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea v-model="backData.s_remarks"></a-textarea>
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
    name: "passportHand",
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
      isShowFile:{
        type: Object,
        required: false
      }
    },
    data() {
      return {
        visible: false,
        title: '发文',
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
      dateFormat(date) {
        let date1 = new Date(date);
        let Y = date1.getFullYear();
        let M = date1.getMonth() + 1;
        let D = date1.getDate();
        let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
        return newTime;
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