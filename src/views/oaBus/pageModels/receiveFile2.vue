<template>
  <a-modal
    :title="title"
    :width="1300"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="save"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消">
    <form>

      <center>
        <table width="97%" border="0">
          <tr>
            <td align="right" colspan="3" class="">
              机密：
              <a-select style="width: 120px" placeholder="请选择密级" @change="change">
                <a-select-option value="1">普通</a-select-option>
                <a-select-option value="2">秘密</a-select-option>
                <a-select-option value="3">机密</a-select-option>
                <a-select-option value="4">决密</a-select-option>
              </a-select>

            </td>
          </tr>
          <tr>
            <td align="center" colspan="2" height="50" valign="bottom">
              <h1 style="color: red; font-weight: 800; font-size: 25px">
                <!--{{fileTitle}}-->
                <span>{{busDataTable.s_left_parameter}}</span>
                <span>{{busDataTable.s_unit_name}}</span>
                <span>{{busDataTable.s_dept_name}}</span>
                <span>{{busDataTable.s_middle_parameter}}</span>
                <span>{{busDataTable.s_right_parameter}}</span>
              </h1>
            </td>
          </tr>
          <center>
            <!--引入意见展示框-->
            <task-opt ref="taskOptRef" @optsReturn="optsGet"></task-opt>

            <!--part3-->
            <table width="90%" border="1">

              <tr>
                <td width="15%">
                  <center><h3>主办部门：</h3></center>
                </td>
                <td>
                  <a-input :value="partname"></a-input>
                </td>
                <td width="15%">
                  <center><h3>拟稿人：</h3></center>
                </td>
                <td>
                  <a-input :value="username"></a-input>
                </td>
              </tr>

              <tr>
                <td width="15%">
                  <center><h3>拟稿时间：</h3></center>
                </td>
                <td>
                  <a-input :value="filetime"></a-input>
                </td>
                <td width="15%">
                  <center><h3>电话：</h3></center>
                </td>
                <td>
                  <a-input></a-input>
                </td>
              </tr>


              <tr>
                <td width="15%">
                  <center><h3>信息公开：</h3></center>
                </td>
                <td>
                  <a-select style="width: 160px" placeholder="请选择缓急程度">
                    <a-select-option value="1">普通</a-select-option>
                    <a-select-option value="2">工作机密</a-select-option>
                  </a-select>
                </td>
                <td width="15%">
                  <center><h3>不公开理由：</h3></center>
                </td>
                <td>
                  <a-select style="width: 160px" placeholder="请选择缓急程度">
                    <a-select-option value="1">普通</a-select-option>
                    <a-select-option value="2">工作机密</a-select-option>
                  </a-select>
                </td>
              </tr>

            </table>

            <table width="90%" border="1">
              <tr>
                <!--标题-->
                <td width="10%">
                  <center><h3>{{detailList.s_title}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.s_title"></a-input>
                </td>
              </tr>
              <tr>
                <td width="15%">
                  <center><h3>{{detailList.s_main_unit_names}}：</h3></center>
                </td>
                <!--主送单位-->
                <td>
                  <a-input v-model="busDataTable.s_main_unit_names"></a-input>
                </td>
              </tr>
              <tr>
                <!--抄送单位-->
                <td width="10%">
                  <center><h3>{{detailList.s_cc_unit_names}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.s_cc_unit_names"></a-input>
                </td>
              </tr>

              <tr>
                <td width="10%">
                  <!--""办文依据""-->
                  <center><h3>{{detailList.s_varchar3}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.s_varchar3"></a-input>
                </td>
              </tr>
            </table>
            <!--印发分数   分发日期   文件字号  正文页数等-->
            <table width="90%" border="1">

              <tr>
                <!---印发份数-->
                <td width="15%">
                  <center><h3>{{detailList.i_bigint1}}：</h3></center>
                </td>
                <td>
                  <a-input style="width: 90%" v-model="busDataTable.i_bigint1"></a-input>
                  &nbsp份
                </td>
                <!---分发日期-->
                <td width="15%">
                  <center><h3>{{detailList.d_datetime1}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.d_datetime1"></a-input>
                </td>
              </tr>

              <tr>
                <!---文件字号-->
                <td width="15%">
                  <center><h3>{{detailList.s_file_num}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.s_file_num"></a-input>
                </td>
                <!--- 正文页数-->
                <td width="15%">
                  <center><h3>{{detailList.i_bigint2}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.i_bigint2"></a-input>
                </td>
              </tr>

              <tr>
                <!--校对 -->
                <td width="15%">
                  <center><h3>{{detailList.s_varchar1}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.s_varchar1"></a-input>
                </td>
                <!--打字 -->
                <td width="15%">
                  <center><h3>{{detailList.s_varchar2}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.s_varchar2"></a-input>
                </td>
              </tr>

            </table>


            <table width="90%" border="1">
              <tr>
                <td width="15%">
                  <!--备注-->
                  <center><h3>{{detailList.s_remarks}}：</h3></center>
                </td>
                <td>
                  <a-input v-model="busDataTable.s_remarks"></a-input>
                </td>
              </tr>
            </table>


            <table v-show="jeditShow" width="90%" border="1">
              <tr>
                <td>
                  <j-editor v-model="jeditor.value"/>
                </td>
              </tr>
            </table>


          </center>
        </table>

        <br/>
        <task-btn ref="taskRef" :backData="backData" :backDataOpt="backDataOpt" :taskMsg="task" :opts="opts"></task-btn>

      </center>
    </form>
  </a-modal>
</template>


<script>
  import {getAction, postAction} from "@/api/manage";
  import {JeecgListMixin} from "@/mixins/JeecgListMixin2";
  import taskBtn from '@/views/buttons/taskBtn'
  import taskOpt from '@/views/buttons/taskOpt'
  import JEditor from '@/components/jeecg/JEditor'


  export default {
    name: "receiveFile2",
    mixins: [JeecgListMixin],
    components: {
      taskBtn,
      taskOpt,
      JEditor
    },
    data() {
      return {
        visible: false,
        title: '新建收文任务',
        confirmLoading: false,
        detailList: null,    //  文档数据   字段含义
        jeditShow: false,
        jeditor: {
          value: ''
        },
        backData: {
          id: '',
          key: ''
        },
        //fileTitle: '',
        partname: '',
        username: '',
        filetime: '',
        busDataTable: {
          table: '',
          i_id: '',
          s_left_parameter: '',
          s_unit_name: '',
          s_dept_name: '',
          s_middle_parameter: '',
          s_right_parameter: '',
          //part3
          s_title: '', // 标题
          s_main_unit_names: '', //主送单位
          s_cc_unit_names: '',//抄送单位
          s_inside_deptnames: '',//内部发送
          s_file_num: '',//"文件字号"
          s_varchar3: '',//"办文依据"
          i_bigint1: '',//印发份数
          d_datetime1: '',//"分发日期"
          i_bigint2: '',//正文页数
          s_varchar1: '',//校对
          s_varchar2: '',//打字
          s_remarks: '', // 备注
        },
        busFunction: {},
        url: {
          selectTaskType: window._CONFIG['domianURL'] + '/oaBus/busModel/list',
          selectTask: window._CONFIG['domianURL'] + '/oaBus/busModel/list',
          optionAndBtn: window._CONFIG['domianURL'] + '/oaBus/newTask/optionAndBtn',
          queryBusdata: '/oaBus/oaBusdata/queryBusdataById',
          departurl: '/oaBus/oaBusdata/getBusDataUserDepart',
          updateBusdata: '/oaBus/dynamic/update',

        }
      }
    },
    created() {
      //获取当前用户信息
      let usersdata = JSON.parse(localStorage.getItem('userdata'));
      // console.log(usersdata);

    },
    methods: {
      optsGet(opts) {
        this.opts = opts
      },
      change(e) {
        this.backData.i_safetylevel = e

      },
      changeHuanJi(e) {
        this.backData.i_urgency = e
      },
      //详情页面数据
      showTaskInAct(taskDetail, task) {
        //this.task = task
        this.show(taskDetail)
      },

      //页面初始化调用方法，初始化渲染页面
      show(tableName, busdataId) {
        //查询按钮与意见框展示权限
        //let t = taskDetail
        //console.log("-------receive2  --:"+  functionId+"----" + busdataId );

        let promiseParamse = new Promise((resolve) => {
          //初始化方法
          postAction(this.url.queryBusdata, {
            tableName: tableName,
            busdataId: JSON.stringify(busdataId),
          }).then((res) => {
            // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~', JSON.stringify(res));

            // 获取红头文件头部标题
            //this.busDataTable.fileTitle = res.oaBusdata.s_left_parameter + res.oaBusdata.s_unit_name + res.oaBusdata.s_dept_name + res.oaBusdata.s_middle_parameter + res.oaBusdata.s_right_parameter;
            this.busDataTable.i_id = res.oaBusdata.i_id;
            this.busDataTable.table = res.optionTable.substring(0, res.optionTable.length - 8);
            //左侧参数
            this.busDataTable.s_left_parameter = res.oaBusdata.s_left_parameter;

            //机构
            this.busDataTable.s_unit_name = res.oaBusdata.s_unit_name;
            //部门
            this.busDataTable.s_dept_name = res.oaBusdata.s_dept_name;
            //插入参数（修改文头）（页面头部）
            this.busDataTable.s_middle_parameter = res.oaBusdata.s_middle_parameter;
            //右侧参数（页面头部）
            this.busDataTable.s_right_parameter = res.oaBusdata.s_right_parameter;

            //  拟稿时间
            this.filetime = res.oaBusdata.i_create_year + '-' + res.oaBusdata.i_create_month + '-' + res.oaBusdata.i_create_day;
            //拟稿人
            this.username = res.oaBusdata.s_create_name;
            //主办部门
            this.partname = res.oaBusdata.s_create_dept;
            // 抄送单位
            this.busDataTable.s_cc_unit_names = res.oaBusdata.s_cc_unit_names;

            // 标题
            this.busDataTable.s_title = res.oaBusdata.s_title;
            //办文依据
            this.busDataTable.s_varchar3 = res.oaBusdata.s_varchar3;
            //主送单位名称
            this.busDataTable.s_main_unit_names = res.oaBusdata.s_main_unit_names;
            //印发份数
            this.busDataTable.i_bigint1 = res.oaBusdata.i_bigint1;
            //分发日期
            this.busDataTable.d_datetime1 = res.oaBusdata.d_datetime1;
            //文件字号
            this.busDataTable.s_file_num = res.oaBusdata.s_file_num;
            //正文页数
            this.busDataTable.i_bigint2 = res.oaBusdata.i_bigint2;
            //校对
            this.busDataTable.s_varchar1 = res.oaBusdata.s_varchar1;
            //打字
            this.busDataTable.s_varchar2 = res.oaBusdata.s_varchar2;
            //备注
            this.busDataTable.s_remarks = res.oaBusdata.s_remarks;

            // console.log(res);

            //--------------------------
            //  文档数据  map
            let detailList = res.detailList;
            // console.log(detailList);
            this.detailList = detailList;
            this.busFunction = res.busFunction;
            if (this.busFunction.iisEditor == 1) {

              this.jeditShow = true;
            }
            //resolove 嫁接参数
            resolve(res);


          });
          this.visible = true
          // this.title = t.sname
        })

        //异步请求
        promiseParamse.then((leastVal) => {
          // console.log(leastVal);
          //按钮组件查询
          getAction(this.url.optionAndBtn, {
            iprocSetId: leastVal.proSetId,
            taskDefKey: leastVal.taskDefKey,
            busDataId: busdataId,
            optionTable: leastVal.optionTable,
          }).then(res => {
            //获取流程定义key用于开启任务
            // console.log(res);
            if (res.success) {
              // this.backData.key = res.result.key
              this.$refs.taskRef.showBtn(res.result.btn)
              this.$refs.taskOptRef.showOpt(res.result.opt)
            } else {
              that.$message.error('查询按钮与意见框失败')
            }
          })
        });

      }


      ,
      save() {
        alert("queding");
        postAction(this.url.updateBusdata, {
          'updateBusdata': this.busDataTable
        }).then(res => {
          //获取流程定义key用于开启任务
          // console.log(res);

        })


      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        //清除富文本框数据
        this.jeditor.value = ''
        //清除意见与按钮页面数据
        this.$refs.taskOptRef.clear()
        // this.$refs.taskRef.clear()

        //刷新父页面
        // this.$emit('reload_todo')
      }, onChange(date, dateString) {
        console.log(date, dateString);
      }, onChange2(date, dateString) {
        console.log(date, dateString);
      }

    }
  }
</script>