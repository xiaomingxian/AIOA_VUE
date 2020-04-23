<template>

  <form>
    <center>
      <!--part3-->
      <table border="1" borderColor="#F0F5FC" class="sendFileStyle" width="100%">
        <tr>
          <td class="title" width="15%">
            <!--流水号-->
            <center><h3>{{detailList.s_file_num}}</h3></center>
          </td>
          <td>
            <a-input ref="s_file_num" v-model="backData.s_file_num"  v-on:blur="blurText(backData.s_file_num,$refs.s_file_num)" disabled></a-input>
          </td>
          <td class="title" width="15%">
            <!--督办员-->
            <center><h3>{{detailList.s_create_name}}</h3></center>
          </td>
          <td width="35%">
            <a-input style="padding-left: 10px" ref="s_create_name" v-on:blur="blurText(backData.s_create_name,$refs.s_create_name)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_create_name" disabled></a-input>
          </td>
        </tr>

        <tr>
          <td class="title" width="15%">
            <!--文件字号s_file_num-->
            <center><h3>{{detailList.s_receive_num}}</h3></center>
          </td>
          <td>
            <!--<a-input ref="s_receive_num" v-model="backData.s_receive_num"  v-on:blur="blurText(backData.s_receive_num,$refs.s_receive_num)"></a-input>-->
            <div style="padding-left: 10px;">{{backData.s_receive_num}}</div>
          </td>
          <td class="title" width="15%">
            <!--发文单位-->
            <center><h3>{{detailList.s_varchar1}}</h3></center>
          </td>
          <td width="35%">
           <!-- <a-select placeholder="请选择发文单位" ref="s_varchar1" v-on:blur="blurText(backData.s_varchar1,$refs.s_varchar1)"
                      v-model="backData.s_varchar1">
              <a-select-option v-for="(item,index) in recFileTypeList" :key="index" :value="item.value">
                {{item.text}}   placeholder="请选择发文单位"
              </a-select-option>
            </a-select>-->

            <a-select  ref="s_varchar1" v-on:blur="blurText(backData.s_varchar1,$refs.s_varchar1)" v-model="backData.s_varchar1" @change="selectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar1_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
        </tr>

        <tr>
          <td class="title" width="15%">
            <!--收（发）文时间-->
            <center><h3>{{detailList.d_datetime1}}</h3></center>
          </td>
          <td width="35%">
            <a-date-picker v-if="backData.d_datetime1" ref="d_datetime1" v-on:blur="blurText([backData.d_datetime1],$refs.d_datetime1)"  :defaultValue="moment(backData.d_datetime1,'YYYY-MM-DD HH:mm:ss')" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
            <a-date-picker v-else @change="getDateTime1" ref="d_datetime1" v-on:blur="blurText([backData.d_datetime1],$refs.d_datetime1)" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
          </td>
          <td class="title" width="15%">
            <!--办理时限-->
            <center><h3>{{detailList.d_datetime2}}</h3></center>
          </td>
          <td width="35%">
            <a-date-picker v-if="backData.d_datetime2" ref="d_datetime2" v-on:blur="blurText([backData.d_datetime2],$refs.d_datetime2)"  :defaultValue="moment(backData.d_datetime2,'YYYY-MM-DD HH:mm:ss')" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
            <a-date-picker v-else @change="getDateTime2" ref="d_datetime2" v-on:blur="blurText([backData.d_datetime2],$refs.d_datetime2)" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"></a-date-picker>
          </td>
        </tr>

        <tr>
          <td class="title" width="15%">
            <!--立项时间-->
            <center><h3>{{detailList.d_create_time}}</h3></center>
          </td>
          <td width="35%">
            <!--<a-input style="padding-left: 10px" v-model="backData.d_create_time"></a-input>-->
            <!--<a-date-picker @change="getDateTime4" showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%"  ></a-date-picker>-->
            <!--<a-date-picker :defaultValue="moment(backData.d_create_time,'YYYY-MM-DD HH:mm:ss')"  showTime="true" format="YYYY-MM-DD HH:mm:ss"  style="width: 100%" disabled></a-date-picker>-->
            <div style="padding-left: 10px;">{{backData.d_create_time}}</div>
          </td>
          <td class="title" width="15%">
            <!--收文总号-->
            <center><h3>{{detailList.s_varchar4}}</h3></center>
          </td>
          <td>
            <a-input ref="s_varchar4" v-model="backData.s_varchar4"  v-on:blur="blurText(backData.s_varchar4,$refs.s_varchar4)"></a-input>
          </td>
        </tr>

        <tr>
          <td class="title" width="10%">
            <!--重要督查事项-->
            <center><h3>{{detailList.i_is_important}}</h3></center>
          </td>
          <td width="35%">
           <!-- <a-select placeholder="123" ref="i_is_important" v-on:blur="blurText(backData.i_is_important,$refs.i_is_important)" v-model="backData.i_is_important" @change="selectType">
              <a-select-option v-for="(item,index) in optionMap.i_is_important_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
-->
            <!--<a-radio-group ref="i_is_important" v-on:blur="blurText(backData.i_is_important,$refs.i_is_important)" v-model="backData.i_is_important"  @change="selectType" style="padding-left: 14px;">
              <a-radio v-for="(item,index) in optionMap.i_is_important_option" :key="index" :value="item.value">{{item.text}}</a-radio>
              &lt;!&ndash;<a-radio :value="1">否</a-radio>&ndash;&gt;
            </a-radio-group>-->

            <a-radio-group :defaultValue="0" ref="i_is_important" v-on:blur="blurText(backData.i_is_important,$refs.i_is_important)" v-model="backData.i_is_important"  @change="selectType" style="padding-left: 14px;">
              <!--<a-radio v-for="(item,index) in optionMap.i_is_important_option" :key="index" :value="item.value">{{item.text}}</a-radio>-->
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">是</a-radio>
              <!--<a-radio :value="2">否</a-radio>-->
            </a-radio-group>
          </td>
          <td class="title" width="15%">
            <!--反馈频率  placeholder="请选择反馈频率" -->
            <center><h3>{{detailList.s_varchar2}}</h3></center>
          </td>
          <td width="35%">
            <a-select  ref="s_varchar2" v-on:blur="blurText(backData.s_varchar2,$refs.s_varchar2)"
                      v-model="backData.s_varchar2">
              <a-select-option v-for="(item,index) in optionMap.s_varchar2_option" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
              <!--<a-select-option :value="0">不提示</a-select-option>-->
              <!--<a-select-option :value="1">10分钟前</a-select-option>-->
              <!--<a-select-option :value="2">30分钟前</a-select-option>-->
              <!--<a-select-option :value="3">1小时前</a-select-option>-->
              <!--<a-select-option :value="4">2小时前</a-select-option>-->
            </a-select>
          </td>
        </tr>

        <tr>
          <td class="title" width="15%">
            <!--督查事项-->
            <center><h3>{{detailList.s_title}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea cols="92" rows="2" ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)" v-model="backData.s_title"></a-textarea>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <center><h3>{{detailList.s_main_unit_names}}</h3></center>
          </td>
          <td colspan="6">
            <!--主送部门-->
            <a-input ref="s_main_unit_names" v-model="backData.s_main_unit_names"  v-on:blur="blurText(backData.s_main_unit_names,$refs.s_main_unit_names)" disabled></a-input>
          </td>
        </tr>
        <tr>
          <td width="10%" class="title">
            <!--协办部门-->
            <center><h3>{{detailList.s_cc_unit_names}}</h3></center>
          </td>
          <td colspan="6">
            <a-input ref="s_cc_unit_names" v-model="backData.s_cc_unit_names"  v-on:blur="blurText(backData.s_cc_unit_names,$refs.s_cc_unit_names)" disabled></a-input>
          </td>
        </tr>

        <tr>
          <td class="title" width="15%">
            <!--办理要求-->
            <center><h3>{{detailList.s_varchar6}}</h3></center>
          </td>
          <td colspan="6">
            <a-textarea cols="92" rows="4" ref="s_varchar6" v-on:blur="blurText(backData.s_varchar6,$refs.s_varchar6,detailList.s_varchar6)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_varchar6"></a-textarea>
          </td>
        </tr>

        <tr>
          <td class="title" width="10%">
            <center><h3>附件</h3></center>
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

        <tr>
          <td class="title" width="10%">
            <!--公文链接-->
            <center><h3>{{detailList.s_varchar3}}</h3></center>
          </td>
          <td colspan="3">
            <a-input style="padding-left: 10px" ref="s_varchar3" v-on:blur="blurText(backData.s_varchar3,$refs.s_varchar3)" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}" v-model="backData.s_varchar3" disabled></a-input>
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
  import moment from 'moment';

  export default {
    name: "supFile",
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
        disabled:true,
        visible: false,
        title: '督查',
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
          d_datetime2: '',//"成文日期"
          s_varchar6:'',
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
          d_sealdate: '',
          //模板id
          s_varchar8: '',
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
          i_is_important: '',
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
      // this.backData = {};
    },
    methods: {
      moment,
      getDateTime1(e,datetime1){
        this.backData.d_datetime1 = datetime1;
      },
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
      infoOut(e){
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(this.$refs.s_varchar5);
        if (e=="gk"){
         this.disabled=true;
          //this.$refs.s_varchar5.disabled=true;
        }else {
          this.disabled=false;
          //this.$refs.s_varchar5.disabled=false;
        }
      },
      witeDepart(param) {
        this.backData.s_main_unit_names = param.str1;
        this.backData.s_cc_unit_names = param.str2;
        // this.backData.s_inside_deptnames = param.str3;
      },
      //选择主送单位
      selDepartName() {
        //this.$refs.selDepartNameRef.show() ;
        let param = {
          str1: this.backData.s_main_unit_names,
          str2: this.backData.s_cc_unit_names,
          // str3: this.backData.s_inside_deptnames
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

            console.log("123456789")
            console.log(res)

            if (res.success) {
              this.backData.ilevel = res.result.records.ilevel
            }
          })
        }
        //参数为3：查询对应的不公开理由
        postAction("/oaBus/oaBusdata/querySysDictData",{param:3}).then((res) => {
          this.regularsList = res.result.regulars;
          this.xxgkList = res.result.xxgk;
          this.bgklyList = res.result.bgkly;
        })

        /*if (this.optionMap.xxgk != undefined) {
          this.xxgkList = this.optionMap.xxgk;
        }
        if (this.optionMap.bgkly != undefined) {
          this.bgklyList = this.optionMap.bgkly;
        }*/
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
</style>

<style>

</style>