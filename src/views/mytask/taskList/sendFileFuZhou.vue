<template>

  <form>
    <center>
      <!--part3-->
      <table width="100%" border="1" borderColor="#aa7d7d">
        <tr>
          <td width="15%" class="title">
            <!--部门：：-->
            <center><h3>{{detailList.s_create_dept}}</h3></center>
          </td>
          <td width="35%">
            <div style="padding-left: 10px">{{backData.s_create_dept}}</div>
          </td>
          <td width="15%" class="title">
            <!--拟稿人：：-->
            <center><h3>{{detailList.s_create_name}}</h3></center>
          </td>
          <td>
            <div style="padding-left: 10px;width:35%;">{{backData.s_create_name}}</div>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--拟稿时间：-->
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
            <a-input ref="i_phone" v-on:blur="blurText(backData.i_phone,$refs.i_phone)" v-model="backData.i_phone"></a-input>
          </td>
        </tr>


        <tr>
          <td width="15%" class="title">
            <!--信息公开：-->
            <center><h3>{{detailList.s_varchar4}}</h3></center>
          </td>
          <td>
            <a-select ref="s_varchar4" @change="infoOut" v-on:blur="blurText(backData.s_varchar4,$refs.s_varchar4)" v-model="backData.s_varchar4" placeholder="请选择信息是否公开">
              <a-select-option v-for="(item,index) in xxgkList" :key="index" :text="item.text"
                               :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
          <td width="15%" class="title">
            <!--不公开理由：-->
            <center><h3>{{detailList.s_varchar5}}</h3></center>
          </td>
          <td>
            <a-select :disabled="disabled"  ref="s_varchar5" v-on:blur="blurText(backData.s_varchar5,$refs.s_varchar5)" v-model="backData.s_varchar5" placeholder="请选择理由">
              <a-select-option v-for="(item,index) in bgklyList" :key="index" :text="item.text"
                               :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
        </tr>
        <!--新增------------开始------------------------------------------------------------>
        <tr>
          <td width="15%" class="title">
            <!--运转过程紧急程度：-->
            <center><h3>{{detailList.s_varchar6}}</h3></center>
          </td>
          <td>
            <a-select placeholder="请选择紧急程度" ref="s_varchar6" v-on:blur="blurText(backData.s_varchar6,$refs.s_varchar6)"
                      v-model="backData.s_varchar6" @change="varSixSelectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar6_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
          <td width="15%" class="title">
            <!--运转过程涉密程度：-->
            <center><h3>{{detailList.s_varchar7}}</h3></center>
          </td>
          <td>
            <a-select placeholder="请选择涉密程度" ref="s_varchar7" v-on:blur="blurText(backData.s_varchar7,$refs.s_varchar7)"
                      v-model="backData.s_varchar7" @change="varSevenSelectType">
              <a-select-option v-for="(item,index) in optionMap.s_varchar7_option" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
          </td>
        </tr>

        <tr>
          <td width="15%" class="title">
            <!--规范性文件：-->
            <center><h3>{{detailList.s_varchar8}}</h3></center>
          </td>
          <td>
            <a-select placeholder="请选择规范性文件" ref="s_varchar8" v-on:blur="blurText(backData.s_varchar8,$refs.s_varchar8)"
                        v-model="backData.s_varchar8" @change="varEightSelectType">
            <a-select-option v-for="(item,index) in optionMap.s_varchar8_option" :key="index" :value="item.value">{{item.text}}
            </a-select-option>
          </a-select>
          </td>
          <!--- 工作机密年限-->
          <td width="15%" class="title">
            <center><h3>{{detailList.i_bigint3}}</h3></center>
          </td>
          <td>
            <a-input type="number" ref="i_bigint3" v-on:blur="blurText(backData.i_bigint3,$refs.i_bigint3)" v-model="backData.i_bigint3"></a-input>
          </td>
        </tr>
        <tr>
          <!--发文总号-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_varchar9}}</h3></center>
          </td>
          <td colspan="3">
            <a-input ref="s_varchar9" v-on:blur="blurText(backData.s_varchar9,$refs.s_varchar9)" v-model="backData.s_varchar9"></a-input>
          </td>
        </tr>

        <!--新增----------------结束---------------------------------------------------------------->

        <tr>
          <!--标题-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_title}}</h3></center>
          </td>
          <td colspan="3">
            <a-input ref="s_title" v-on:blur="blurText(backData.s_title,$refs.s_title,detailList.s_title)" v-model="backData.s_title"></a-input>
          </td>
        </tr>
        <tr>
          <td width="15%" class="title">
            <center><h3>{{detailList.s_main_unit_names}}</h3></center>
          </td>
          <!--主送单位-->
          <td colspan="3">
            <a-textarea style="width:85%;" ref="s_main_unit_names" v-on:blur="blurText(backData.s_main_unit_names,$refs.s_main_unit_names)" v-model="backData.s_main_unit_names"></a-textarea>
            <a-button style="width:15%;" @click="selDepartName">选择</a-button>
          </td>
        </tr>
        <tr>
          <!--抄送单位-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_cc_unit_names}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea style="width:85%;" ref="s_cc_unit_names" v-on:blur="blurText(backData.s_cc_unit_names,$refs.s_cc_unit_names)" v-model="backData.s_cc_unit_names"></a-textarea>
            <a-button style="width:15%;" @click="selDepartName">选择</a-button>
          </td>
        </tr>
        <tr>
          <!--内部发送-->
          <td width="10%" class="title">
            <center><h3>{{detailList.s_inside_deptnames}}</h3></center>
          </td>
          <td colspan="3">
            <a-textarea style="width:85%;" ref="s_inside_deptnames" v-on:blur="blurText(backData.s_inside_deptnames,$refs.s_inside_deptnames)" v-model="backData.s_inside_deptnames"></a-textarea>
            <a-button style="width:15%;" @click="selDepartName">选择</a-button>
          </td>
        </tr>

        <!--印发分数   分发日期   文件字号  正文页数等-->

        <tr>
          <!---印发份数-->
          <td width="15%" class="title">
            <center><h3>{{detailList.i_bigint1}}</h3></center>
          </td>
          <td>
            <a-input style="width: 94%" ref="i_bigint1" v-on:blur="blurText(backData.i_bigint1,$refs.i_bigint1)"
                     v-model="backData.i_bigint1"></a-input>
            &nbsp份
          </td>
          <!---封发日期-->
          <td width="15%" class="title">
            <center><h3>{{detailList.d_sealdate}}</h3></center>
          </td>
          <td>
            <div style="padding-left: 10px;">{{backData.d_sealdate}}</div>
          </td>
        </tr>

        <tr>
          <!---文件字号-->
          <td width="15%" class="title">
            <center><h3>{{detailList.s_file_num}}</h3></center>
          </td>
          <td>
            <div style="padding-left: 10px;">{{backData.s_file_num}}</div>
            <!--<a-input v-model="backData.s_file_num"></a-input>-->
          </td>
          <!--- 正文页数-->
          <td width="15%" class="title">
            <center><h3>{{detailList.i_bigint2}}</h3></center>
          </td>
          <td>
            <a-input ref="i_bigint2" v-on:blur="blurText(backData.i_bigint2,$refs.i_bigint2)" v-model="backData.i_bigint2"></a-input>
          </td>
        </tr>

        <tr>
          <!--校对 -->
          <td width="15%" class="title">
            <center><h3>{{detailList.s_varchar1}}</h3></center>
          </td>
          <td>
            <div style="padding-left: 10px;">{{backData.s_varchar1}}</div>
          </td>
          <!--打字 -->
          <td width="15%" class="title">
            <center><h3>{{detailList.s_varchar2}}</h3></center>
          </td>
          <td>
            <div style="padding-left: 10px;">{{backData.s_varchar2}}</div>
          </td>
        </tr>
        <tr>
          <td width="15%" class="title">
            <!--发文总号-->
            <center><h3>{{detailList.s_varchar9}}</h3></center>
          </td>
          <td colspan="1">
            <a-input v-model="backData.s_varchar9"></a-input>
          </td>
          <td width="15%" class="title">
            <!--备注-->
            <center><h3>{{detailList.s_remarks}}</h3></center>
          </td>
          <td colspan="1">
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

        <tr>
          <td width="10%" class="title">
            <!--""办文依据""-->
            <center><h3>{{detailList.s_varchar3}}</h3></center>
          </td>
          <td colspan="3">
            <div  v-for="(item,index) in banWenFileList" style="padding-left: 15px">
              <!--<div @click="openFile(9,item.sfileName)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>-->
              <div  class="qiCao"><span class="hoverred" @click="qiCao1(9,item)">{{index+1}}、{{item.sfileName}}</span>
                <span class="delCss" v-show="isShowFile">
                <img :title="fileBtnName(1)" v-show ="isSuffex(item.sfileName)" class="pices" @click.stop="qiCao2(10,item)" src="../../../../src/assets/set.png"/>
                <img :title="fileBtnName(2)" class="pices" @click.stop="updateFileName(item)" src="../../../../src/assets/setName.png"/>
                <img :title="fileBtnName(3)" class="pices" @click.stop="deleteFilesBtn(item,6)" src="../../../../src/assets/delete.png"/>
                <img :title="fileBtnName(4)" v-show="banWenFileList.length > 1 && index > 0" class="pices" @click.stop="topFile(item,index,6)" src="../../../../src/assets/top.png"/>
                <img :title="fileBtnName(5)" v-show="banWenFileList.length > 1 && index < banWenFileList.length-1" class="pices" @click.stop="lowFile(item,index,6)" src="../../../../src/assets/bottom.png"/>
              </span>
              </div>
            </div>
            <!--<a-input v-model="backData.s_varchar3"></a-input>-->
          </td>
        </tr>
      </table>
    </center>

    <sel-depart-name ref="selDepartNameRef" @ok="witeDepart"></sel-depart-name>
  </form>

</template>


<script>
  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import SelDepartName from "../../oaBus/pageModels/selDepartName";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "sendFileFuZhou",
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
        disabled:true,
        banWenFileList:[],
        visible: false,
        title: '新发文',
        confirmLoading: false,
        s_varchar: [],
        userData: '',
        //代办信息
        task: '',
        //已办信息
        taskDone: '',
        //detailList: null,    //  文档数据   字段含义
        oaFileList: [],    //  文档数据   字段含义
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
          //运转过程紧急程度
          s_varchar6: '',
          //运转过程涉密程度
          s_varchar7: '',
          //规范性文件
          s_varchar8: '',
          //工作密级年限
          i_bigint3: '',
          //发文总号
          s_varchar9:'',
          s_varchar20: '',
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
      infoOut(e){
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log(e);
        console.log(this.$refs.s_varchar5);
        if (e=="gk"){
          this.disabled=true;
          // this.$refs.s_varchar5.disabled=true;
        }else {
          this.disabled=false;
          // this.$refs.s_varchar5.disabled=false;
        }
      },
      varSixSelectType(e){
        this.backData.s_varchar6=e;
      },
      varSevenSelectType(e){
        this.backData.s_varchar7=e;
      },
      varEightSelectType(e){
        this.backData.s_varchar8=e;
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
      qiCao1(index, fileName) {
        //alert(fileName)

        let name = fileName.split('\\')
        var name1 = name[name.length - 1]
        alert(name1)
        this.$refs.taskRef.showFujianFile2(index, name1);
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
        console.log(this.optionMap)
        //************************************* 查询字段名称end ************************************
        for (let i = 0; i < this.optionMap.checkList.length; i++) {
          console.log(this.s_varchar)
          this.s_varchar.push(this.optionMap.checkList[i].stableColumn);
        }

        // this.infoOut();
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

  .title  h3 {
    font-weight: bolder !important;
  }

  .ant-btn-default{
    font-weight: bolder !important;
    background: rgb(178, 218, 255) !important;
  }

  .title{
    background-color: #e9ecf2 !important;
    padding: 0.7% !important;
    text-align: center !important;
  }
</style>