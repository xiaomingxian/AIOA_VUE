<template>

  <form>
    <center>
      <!--part3-->
      <table border="1" borderColor="#F0F5FC" class="sendFileStyle" width="100%">
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
            <a-input ref="i_phone" v-on:blur="blurText(backData.i_phone,$refs.i_phone)" v-model="backData.i_phone"></a-input>
          </td>
        </tr>

        <tr>
          <!--会议名称-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_title}}</h3></center>
          </td>
          <td colspan="3">
            <a-input ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)" v-model="backData.s_title"></a-input>
          </td>
        </tr>

        <tr style="height: 50px;">
          <td colspan="1" class="title">
            <center><h3>{{detailList.d_datetime1}}</h3></center>
          </td>
          <td colspan="7">
            <center>
              <template v-if="this.backData.d_datetime1 == null && this.backData.d_datetime2 ==null">
                <a-range-picker
                  ref="d_datetime1"
                  v-on:blur="blurText([backData.d_datetime1,backData.d_datetime2],$refs.d_datetime1)"

                  style="width: 100%"
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['开始时间','结束时间']"
                  @change="selectTime" @ok="confirmTime"
                />
              </template>

              <template v-else>
                <a-range-picker
                  ref="d_datetime1"
                  v-on:blur="blurText([backData.d_datetime1,backData.d_datetime2],$refs.d_datetime1)"
                  style="width: 100%"
                  :showTime="{format}"
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="['开始时间','结束时间']"
                  @change="selectTime" @ok="confirmTime"
                  :defaultValue="[moment(backData.d_datetime1),moment(backData.d_datetime2)]"
                />
              </template>
            </center>
          </td>
        </tr>

        <!--会议召开时间-->
        <tr style="height: 50px;">
          <td colspan="1" class="title">
            <center><h3>{{detailList.d_datetime3}}</h3></center>
          </td>
          <td colspan="7">
            <center>
              <template v-if="this.backData.d_datetime3 == null && this.backData.d_datetime4 ==null">
                <a-range-picker
                  ref="d_datetime3"
                  v-on:blur="blurText([backData.d_datetime3,backData.d_datetime4],$refs.d_datetime3)"
                  style="width: 100%"
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['开始时间','结束时间']"
                  @change="selectTime" @ok="conveneTime"
                />
              </template>
              <template v-else>
                <a-range-picker
                  ref="d_datetime3"
                  v-on:blur="blurText([backData.d_datetime3,backData.d_datetime4],$refs.d_datetim3)"
                  style="width: 100%"
                  :showTime="{format}"
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="['开始时间','结束时间']"
                  @change="selectTime" @ok="conveneTime"
                  :defaultValue="[moment(backData.d_datetime3),moment(backData.d_datetime4)]"
                />
              </template>
            </center>
          </td>
        </tr>

        <tr>
          <!--会议召开范围-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar8}}</h3></center>
          </td>
          <td colspan="3">
            <a-select placeholder="" ref="s_varchar8"
                      v-on:blur="blurText($event,$refs.s_varchar8)"
                      v-model="backData.s_varchar8" @change="varFiveSelectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar8_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
        </tr>
        <!--主会场-发言范围等-->
        <tr>
          <!--主会场-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar1}}</h3></center>
          </td>
          <td colspan="3">
            <a-input v-model="backData.s_varchar1"></a-input>
          </td>

        </tr>

        <tr>
          <!--发言范围-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar2}}</h3></center>
          </td>
          <td colspan="3">
            <a-input v-model="backData.s_varchar2"></a-input>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--是否使用双流播放课件：-->
            <center><h3>{{detailList.s_varchar6}}</h3></center>
          </td>
          <td>
            <a-select placeholder="是否使用双流播放课件" ref="s_varchar6" v-on:blur="blurText(backData.s_varchar6,$refs.s_varchar6)"
                      v-model="backData.s_varchar6" @change="varSixSelectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar6_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
          <td width="15%" class="title">
            <!--是否需要录像：-->
            <center><h3>{{detailList.s_varchar7}}</h3></center>
          </td>
          <td>
            <a-select placeholder="是否需要录像" ref="s_varchar7" v-on:blur="blurText(backData.s_varchar7,$refs.s_varchar7)"
                      v-model="backData.s_varchar7" @change="varSevenSelectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar7_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
        </tr>

        <tr>
          <!--其他需求-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar3}}</h3></center>
          </td>
          <td colspan="3">
            <a-input v-model="backData.s_varchar3"></a-input>
          </td>

        </tr>

        <tr>
          <!--执行结果-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar4}}</h3></center>
          </td>
          <td colspan="3">
            <a-input v-model="backData.s_varchar4"></a-input>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--备注-->
            <center><h3>{{detailList.s_remarks}}</h3></center>
          </td>
          <td colspan="3">
            <a-input v-model="backData.s_remarks"></a-input>
          </td>
        </tr>

        <!--<tr>-->
        <!--<td width="10%" class="title">-->
        <!--<center><h3>附件</h3></center>-->
        <!--</td>-->
        <!--<td colspan="3">-->
        <!--<div v-for="(item,index) in oaFileList" style="padding-left: 15px">-->
        <!--&lt;!&ndash;<div @click="openFile(9,item.sfileName)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>&ndash;&gt;-->
        <!--<div @click="qiCao1(9,item.sfilePath)"><span class="hoverred">{{index+1}}、{{item.sfileName}}</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--&lt;!&ndash;<a-input :value="backData.s_remarks"></a-input>&ndash;&gt;-->
        <!--</td>-->
        <!--</tr>-->

        <!--<tr>-->
        <!--<td width="10%" class="title">-->
        <!--&lt;!&ndash;""办文依据""&ndash;&gt;-->
        <!--<center><h3>{{detailList.s_varchar3}}</h3></center>-->
        <!--</td>-->
        <!--<td colspan="3">-->
        <!--<div v-for="(item,index) in oaFileList" style="padding-left: 15px">-->
        <!--&lt;!&ndash;<div @click="openFile(9,item.sfileName)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>&ndash;&gt;-->
        <!--<div @click="qiCao1(9,item.sfilePath)"><span class="hoverred">{{index+1}}、{{item.sfileName}}</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--&lt;!&ndash;<a-input :value="backData.s_remarks"></a-input>&ndash;&gt;-->
        <!--</td>-->
        <!--</tr>-->
      </table>
    </center>

    <sel-depart-name ref="selDepartNameRef" @ok="witeDepart"></sel-depart-name>
  </form>

</template>


<script>
  import {getAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import SelDepartName from "../../oaBus/pageModels/selDepartName";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "videoMeet",
    mixins: [JeecgListMixin, busdataTemplate],
    components: {ATextarea, SelDepartName},
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
        visible: false,
        title: '视频会议',
        confirmLoading: false,
        s_varchar: [],
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        //detailList: null,    //  文档数据   字段含义
        oaFileList: [],    //  文档数据   字段含义
        banWenFileList:[],
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
          i_bigint1: '',   //
          i_bigint2: '',   //
          s_receive_type: '',     //
          s_varchar3: '',//"办文依据"
          d_datetime1: '',//"会议调试开始时间"
          d_datetime2: '',//"会议调试结束时间"
          d_datetime3: '',//"会议召开开始时间"
          d_datetime4: '',//"会议召开结束时间"
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
          //会议名称
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
          s_varchar8: '',
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
      varFiveSelectType(e){
        this.backData.s_varchar8=e;
      },
      varSixSelectType(e){
        this.backData.s_varchar6=e;
      },
      varSevenSelectType(e){
        this.backData.s_varchar7=e;
      },
      //----------------时间变化检测---------------
      selectTime(e) {
        console.log(e);
      },
      //会议调试时间
      confirmTime(e) {
        let startTime = e[0]._d;
        let endTime = e[1]._d;
        this.backData.d_datetime1 = this.dataTime(startTime);
        this.backData.d_datetime2 = this.dataTime(endTime);
      },
      //会议召开时间
      conveneTime(e) {
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
      openFile(cmd, fileName) {
        let ntkoed = ntkoBrowser.ExtensionInstalled();
        if (ntkoed) {
          ntkoBrowser.openWindow(window.location.origin + "/ntko/editindex.html?cmd=" + cmd + "&fileName=" + fileName + "&userName=" + "admin" + "&sbtnid=" + 43);
        } else {
          window.open(window.location.origin + "/ntko/exeindex.html")
        }
        window.ntkoCloseEvent = function () {
          // alert("跨浏览器插件应用程序窗口已关闭")
        }
      },
      /*qiCao1(index, fileName) {
        //alert(fileName)

        let name = fileName.split('\\')
        var name1 = name[name.length - 1]
        alert(name1)
        this.$refs.taskRef.showFujianFile2(index, name1);
      },*/
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
        console.log(this.optionMap)
        //************************************* 查询字段名称end ************************************
        for (let i = 0; i < this.optionMap.checkList.length; i++) {
          console.log(this.s_varchar)
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }

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