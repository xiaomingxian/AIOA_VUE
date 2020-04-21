<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item>
              <a-input  placeholder="文件标题" v-model="queryParam.dataTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item >
              <a-input  placeholder="文件字号" v-model="queryParam.fileNum"></a-input>
            </a-form-item>
          </a-col>


          <template v-if="toggleSearchStatus">
            <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="拟稿人">-->
            <!--<a-input placeholder="拟稿人" v-model="queryParam.createName"></a-input>-->
            <!--</a-form-item>-->
            <!--</a-col>-->

            <a-col :md="8" :sm="8">
              <a-form-item>
                <a-select v-model="queryParam.iImport">
                  <a-select-option value="" disabled selected hidden>领导关注</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="8">

              <a-form-item>
                <a-select v-model="queryParam.taskType"  @change="taskTypeChange">
                  <a-select-option value="" disabled selected hidden>任务类型</a-select-option>
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">传阅</a-select-option>
                  <a-select-option value="2">主办</a-select-option>
                  <a-select-option value="3">辅办</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!--<a-col :md="8" :sm="8">-->
              <!--<a-form-item label="开始时间">-->
                <!--<a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" style="width: 100%;padding: 0;box-sizing: border-box;"-->
                               <!--v-model='queryParam.startTimeFake' @change="startTime"/>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :md="8" :sm="8">-->
              <!--<a-form-item label="结束时间">-->
                <!--<a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" style="width: 100%;padding: 0;box-sizing: border-box;"-->
                               <!--v-model='queryParam.endTimeFake' @change="endTime"/>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item>
                <a-input placeholder="主办部门" v-model="queryParam.mainDept"></a-input>
              </a-form-item>
            </a-col>


          </template>


          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;">
              <a-button type="primary" ref="reSearchQuery" @click="collapseListOrNot" icon="search">查询</a-button>
              <a-button type="primary" @click="searchResetMy" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">


    </div>

    <!-- table区域-begin         :pagination="pagination"
-->
    <div v-if="iisFold == 0">
      <a-table
        ref="table"
        size="middle"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :showAlertInfo="false"
        bordered
        rowKey="processInstanceId"
        :customRow="doTask"
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

                <span slot="action" slot-scope="text, record">
          <a @click.stop="unDo(record)">未办信息</a>
           <a-divider type="vertical"/>
          <a @click.stop="showPic(record)">流程图</a>
        </span>

      </a-table>
    </div>

    <div v-if="iisFold == 1">
      <a-table
        v-once
        :columns="columnes"
        :dataSource="dataSources"
        :pagination="false"
        :showAlertInfo="false"
        :showHeader="false"
        :expandIconAsCell="false"
        bordered
        @expand="(expanded, record) => {
            getExpandRecords(expanded, record);
        }"
        @expandedRowsChange="(expandedRows) => {
            getPgSecondList(expandedRows);
          }"
      >

        <a-table
          slot="expandedRowRender"
          slot-scope="record,index,indent,expanded"
          size="middle"
          :columns="columns"
          :dataSource="dataSource007"
          :pagination="false"
          :loading="loading"
          :showAlertInfo="false"
          :rowKey="record => record.key"
          :customRow="doTask"
          :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
        >

           <span slot="action" slot-scope="text, record">
          <a @click.stop="unDo(record)">未办信息</a>
          <a-divider type="vertical"/>
          <a @click.stop="showPic(record)">流程图</a>
        </span>


        </a-table>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <pic2-modal ref="pic2Modal" @ok="modalFormOk"></pic2-modal>
    <new-task-modal ref="newTask"></new-task-modal>


    <!--业务页面-->
    <detail-file ref="detailFile"></detail-file>
    <a-modal
      :title="moreTask"
      :width="600"
      :visible="haveMore"
      :confirmLoading="false"
      @ok="confirm2"
      @cancel="cancel2"
      destroyOnClose
      okText="确认"
      cancelText="取消">


      <a-table
        ref="table"
        size="small"
        bordered
        rowKey="key"
        :loading="loading"
        :columns="columns3"
        :dataSource="dataSource3"
        :pagination="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys2,selectedRows:selectedRows2, onChange: onSelectChangeMy2,type:'radio'}"
        @change="handleTableChange"
      >
      </a-table>
    </a-modal>

    <undo-msg ref="undoMsg"></undo-msg>

  </a-card>
</template>

<script>
  // import Vue from 'vue'
  // import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  // import {ACCESS_TOKEN} from "../../store/mutation-types"
  // import {getAction, getRoleList, getServiceList, getUserList, httpAction, postAction} from '@/api/manage'
  // import pic2Modal from '../../views/mytask/modules/pic2Modal'
  // import STable from '@/components/table/'
  // import ATextarea from "ant-design-vue/es/input/TextArea"
  // import AInput from "ant-design-vue/es/input/Input"
  // import ARadioGroup from "ant-design-vue/es/radio/Group"
  // import moment from "moment"

  import Vue from 'vue'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {ACCESS_TOKEN} from "../../store/mutation-types";
  import {getAction, postAction} from "../../api/manage";
  import pic2Modal from './modules/pic2Modal'

  //业务页面
  // import DetailFile from "@/views/mytask/taskList/detailFile"
  // import backModal from '@/views/mytask/modules/backModal'

  import detailFile from './taskList/detailFile'
  import undoMsg from './modules/undoMsg'

  export default {
    name: "taskHaveDone",
    mixins: [JeecgListMixin],
    components: {
      pic2Modal,
      //业务
      detailFile,
      undoMsg
    },
    data() {
      return {
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        description: '已办任务',
        iisFontSize: '16px',
        // visibleCreateModal: false,
        // visible: false,
        iisFold: 0,
        // getPageList: [],
        // conditionList: [],
        // resetConditionList: {},
        // setConditionList: {},
        // selectList: [],
        // timeList: [],
        // modelId: '',
        // tableName: '',
        // searchColumns: [],
        // searchList: [],
        // model: {pageDetailList: [{}]},
        // labelCol: {
        //   xs: {span: 24},
        //   sm: {span: 5},
        // },
        // wrapperCol: {
        //   xs: {span: 24},
        //   sm: {span: 16},
        // },
        // confirmLoading: false,
        // mdl: {
        //   dataIndex: 'description',
        // },

        // 高级搜索 展开/关闭
        // advanced: true,
        // 查询参数
        queryParam: {
          dataTitle: '',
          fileNum: '',
          iImport: '',
          createName: '',
          mainDept: '',
          taskType: '',
          startTimeFake: null,
          endTimeFake: null
        },
        // 表头
        columns: [],
        columnes: [],
        dataSource: [],
        dataSource007: [],
        taskKey: [],//缓急返回值
        taskNames: [],
        taskArray: [],
        taskSearch: [],
        // selectedRowKeys: [],
        // selectedRows: [],
        dataSources: [],
        loginInfo: '',
        url: {
          // busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
          // getModelIdByUrl: '/oaBus/busModel/getModelIdByUrl',
          // getConditionByFunId: '/oaBus/busPageDetail/getConditionByFunId',

          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
          list: "/wf/task/queryTask?operstatus=task_done",
          doTask: "/wf/process/processDel",
          currentUnDo: '/wf/task/queryTaskUnDoCurrent'
        },
        loading: false,
        // toggleSearchStatus: false,
        //任务环节选择
        taskRecord: null,
        haveMore: false,
        selectedRowKeys2: [],
        selectedRows2: [],
        dataSource3: [],
        columns3: [
          {
            title: '环节名称',
            align: "center",
            dataIndex: 'name'
          }
        ],
        moreTask: '',
      }
    },
    created: async function () {
      // this.init();

      //默认不带部门类型
      this.queryParam.isDept = false
      getAction("/sys/user/getLoginInfo").then(res => {
        this.loginInfo = res
      })
      await this.collapseListOrNot();
    },
    destroyed() {
      this.dataDestroy();
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      setFontSize(){
        const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url,{userId:userid}).then((res) => {
          if(res.result.iisFontSize == 1){
            this.iisFontSize = '18px';
          }else if(res.result.iisFontSize == 3){
            this.iisFontSize = '14px';
          }else{
            this.iisFontSize = '16px';
          }
          for(let i = 0;i < document.getElementsByClassName('ant-table').length;i++){
            document.getElementsByClassName('ant-table')[i].style.fontSize = this.iisFontSize;
          }
        })
      },
      //清空其他排序条件
      nullOther(type) {
        let orderColums = ['orederByWenHao', 'orederByTile', 'orederByHuanJie', 'orederByDrafter', 'orederByTime']
        for (let i in orderColums) {
          if (i != type) {
            this.queryParam[orderColums[i]] = undefined
          }
        }
      },
      unDo(record) {
        let procInstId = record.processInstanceId
        getAction(this.url.currentUnDo, {
          procInstId: procInstId
        }).then(res => {
          if (res.success) {
            this.$refs.undoMsg.visible=true
            this.$refs.undoMsg.dataSource2= res.result
            // const h = this.$createElement;
            // let content = []
            // for (let i in res.result) {
            //   let msg = res.result[i]
            //   content.push(h('p', `【${msg.taskDefName}】 ${msg.deptName} ：${msg.userName}`))
            // }
            //
            // let content_ = h('div', {}, content)
            //
            // const modal = this.$success({
            //   title: '未办理信息',
            //   content: content_,
            // });
          } else {
            this.$message.error(res.message)
          }
        })


      },
      //类型选择
      taskTypeChange(type) {
        if (type != '全部') {
          this.queryParam.isDept = true
        } else {
          this.queryParam.isDept = false
        }
        this.queryParam.deptType = type
      },
      searchQueryMy() {
        this.queryParam.tableOrder = false
        this.searchQuery()
        this.selectionRows = []
        this.selectedRowKeys = []

      },
      // searchResetMy() {
      //   this.queryParam.tableOrder = false
      //   if (this.iisFold == 1) {
      //
      //     this.getPgFirstList();
      //
      //   } else {
      //
      //     this.searchReset();
      //
      //   }
      //   this.queryParam.taskType = null
      //   this.queryParam.startTimeFake = null
      //   this.queryParam.endTimeFake = null
      //   this.queryParam.isDept = false
      //   this.selectionRows = []
      //   this.selectedRowKeys = []
      // },
      searchResetMy: async function () {
        this.queryParam.tableOrder = false
        if(this.iisFold == 1){

          await this.getPgFirstList();

        }else {

          this.searchReset();

        }
        this.queryParam.taskType = null
        // this.queryParam.startTimeFake = null
        // this.queryParam.endTimeFake = null
        this.queryParam.isDept = false
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      endTime(a, time) {
        this.queryParam.endQueryTime = time
      },
      startTime(a, time) {
        this.queryParam.startQueryTime = time
      },
      reload() {
        this.loading = true;
        getAction(this.url.list).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      cancel() {
//        console.log('------->取消选择')
      },
      showPic(record) {
        this.$refs.pic2Modal.show(record)
        // this.$refs.pic2Modal.title = '当前环节'
      },
      // changFunId(index) {
      //   index = index - 1;
      //   this.resetPgConditionList();
      //   getAction(this.url.getConditionByFunId, {functionId: this.selectList[index].iid}).then((res) => {
      //     this.conditionList = res;
      //     this.queryParam = Object.assign({}, this.setConditionList);
      //     for (let i = 0; i < this.conditionList.length; i++) {
      //       this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
      //     }
      //     this.queryParam.function_id = this.selectList[index].iid;
      //     this.resetConditionList = Object.assign({}, this.queryParam);
      //     this.pagination.current = 1;
      //     this.columns = [];
      //     this.columnes = [];
      //     this.dataSource = [];
      //     this.dataSources = [];
      //     this.collapseListOrNot();
      //   });
      // },
      // init() {
      //   let path = this.$route.path;
      //   let paths = path.split('/')
      //   let str = paths[paths.length - 1]
      //   this.getModelIdByUrl(str);
      // },
      // clearData() {
      //   this.conditionList = [];
      //   this.selectList = [];
      //   this.columns = [];
      //   this.columnes = [];
      //   this.dataSource = [];
      //   this.dataSources = [];
      // },
      // getQueryParams() {
      //   let param = Object.assign({}, this.queryParam, this.isorter);
      //   param.field = this.getQueryField();
      //   param.current = this.ipagination.current;
      //   param.pageSize = this.ipagination.pageSize;
      //   return filterObj(param);
      // },
      // getQueryField() {
      //   let str = "id,";
      //   for (let i = 0; i < this.columns.length; i++) {
      //     str += "," + this.columns[i].dataIndex;
      //   }
      //   return str;
      // },
      //
      // handleEdit(record) {
      //   this.mdl = Object.assign({}, record);
      //   console.log(this.mdl);
      //   this.visible = true;
      // },
      // handleOk() {
      //
      // },

      //添加逻辑
      // handleModalVisible(isVisible) {
      //   this.visibleCreateModal = isVisible;
      // },
      //
      // handleCreateModalCancel() {
      //   this.visibleCreateModal = false;
      // },
      //
      // onChange(row) {
      //   this.selectedRowKeys = row.selectedRowKeys;
      //   this.selectedRows = row.selectedRows;
      //   // console.log(this.$refs.table)
      // },
      // toggleAdvanced() {
      //   this.advanced = !this.advanced
      // },
      //
      // resetSearchForm() {
      //   this.queryParam = {
      //     date: moment(new Date())
      //   }
      // },
      // handleTableChange(page) {
      //   this.pagination.current = page.current;
      //   this.pagination.pageSize = page.pageSize;
      //   this.collapseListOrNot();
      // },
      // getModelIdByUrl(str) {
      //   //let url = "/papertitle/docNumSet/busModelList";
      //   getAction(this.url.getModelIdByUrl, {str: 'electronicFile'}).then((res) => {
      //     this.modelId = res;
      //     this.getPgConditionList();

      //this.getPgSearchList();
      //   });
      // },
      // getPgConditionList() {
      //   let url = "/oaBus/oaBusdata/queryFunSelByModelId";
      //   postAction(url, {modelId: this.modelId, function_id: this.queryParam.function_id}).then((res) => {
      //     this.clearData();
      //     this.conditionList = res.colList;
      //     this.selectList = res.funList;
      //     this.tableName = res.tableName;
      //     this.timeList = res.d_create_time;
      //     this.queryParam.function_id = this.selectList[0].iid;
      //     this.setConditionList = Object.assign({}, this.queryParam);
      //     for (let i = 0; i < this.conditionList.length; i++) {
      //       this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
      //     }
      //     this.resetConditionList = Object.assign({}, this.queryParam);

      // console.log('----------------------------------------------------------');
      // console.log(this.queryParam);

      // this.collapseListOrNot();
      //   });
      // },
      // getPgFirstList() {
      //   this.columnes = [];
      //   this.dataSources = [];
      //   this.taskKey = [];
      //   // this.chooseSearch();
      //
      //   let url = "/sys/dict/getDictByKeyObj";
      //   getAction(url, {dictKey: 'urgencyDegree'}).then((res) => {
      //
      //     this.columnes.push({
      //       dataIndex: 'wenHao',
      //     });
      //
      //     for (let i = 0; i < res.result.length; i++) {
      //       this.taskKey.push(res.result[i].value);
      //       let url = "urgency/degree/queryTask";
      //       let Urgency = res;
      //       getAction(url, {operstatus: 'task_done', urgencyDegree: this.taskKey[i], jY: 1}).then((res) => {
      //         if (res.result.total > 0) {
      //           this.dataSources.push({
      //             key: i,
      //             wenHao: Urgency.result[i].text,
      //           });
      //         }
      //       })
      //     }
      //
      //     // console.log('-----------------------<><><><><><><><><><><><><>--------------------------');
      //     // console.log(this.taskKey);
      //     // console.log('------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------');
      //     // console.log(this.dataSources);
      //
      //   });
      //
      //   this.setFontSize();
      //
      //   // console.log('------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------');
      //   // console.log(this.dataSource007.length);
      //
      //   if (this.dataSource007.length > 0) {
      //     this.getSearchList();
      //   } else {
      //     return;
      //   }
      //
      // },
      getPgFirstList: async function () {
        this.columnes = [];
        this.dataSources = [];
        this.taskKey = [];
        // this.chooseSearch();

        let url = "/sys/dict/getDictByKeyObj";
        await getAction(url, {dictKey: 'urgencyDegree'}).then((res) => {

          this.columnes.push({
            dataIndex: 'wenHao',
          });

          this.getData(0,res.result.length,res.result)
//          for (let i = 0; i < res.result.length; i++) {
//            this.taskKey.push(res.result[i].value);
//            let url = "urgency/degree/queryTask";
//            let Urgency = res;
//            getAction(url, {operstatus: 'task_done', urgencyDegree: this.taskKey[i], jY: 1}).then((res) => {
//
//              setTimeout(()=> {
//
//                if (res.result.total > 0) {
//                  this.dataSources.push({
//                    key: i,
//                    wenHao: Urgency.result[i].text,
//                  });
//                }
//
//              },500)
//
//            })
//          }

          // console.log('-----------------------<><><><><><><><><><><><><>--------------------------');
          // console.log(this.taskKey);
          // console.log('------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------');
          // console.log(this.dataSources);

        });

        this.setFontSize();

        // console.log('------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------');
        // console.log(this.dataSource007.length);

        if (this.dataSource007.length > 0) {
          this.getSearchList();
        } else {
          return;
        }

      },

      getData(i,length,data){
        this.taskKey.push(data[i].value);
        let url = "urgency/degree/queryTask";
        let Urgency = data;
        getAction(url, {operstatus: 'task_done', urgencyDegree: this.taskKey[i], jY: 1}).then((res) => {
          if (res.result.total > 0) {
            this.dataSources.push({
              key: i,
              wenHao: Urgency[i].text,
            });
          }
          if(++i<length){
            this.getData(i,length,data)
          }
        })
      },
      getExpandRecords(expanded, record) {
        if (expanded == false) {
          this.dataSource007 = [];
        }
      },
      getCaption(obj, state) {
        let index = obj.lastIndexOf("\-");
        if (state == 0) {
          obj = obj.substring(0, index);
        } else {
          obj = obj.substring(index + 1, obj.length)
        }
        return obj;
      },
      getPgSecondList(taskNames) {
        this.taskNames = taskNames[taskNames.length - 1];
        taskNames.length = 0;
        this.taskSearch = this.taskKey[this.taskNames];
        this.columns = [];
        this.dataSource007 = [];
        let url = "urgency/degree/queryTask";
        getAction(url, {
          operstatus: 'task_done',
          urgencyDegree: this.taskKey[this.taskNames],
          dataTitle: this.queryParam.dataTitle,
          fileNum: this.queryParam.fileNum,
          createName: this.queryParam.createName,
          mainDept: this.queryParam.mainDept,
          taskType: this.queryParam.taskType,
          startTimeFake: this.queryParam.startTimeFake,
          endTimeFake: this.queryParam.endTimeFake
        }).then((res) => {
          // this.searchColumns = JSON.parse(res.records);

          //   for (let i = 1; i < this.searchColumns.length; i++) {
          //     this.columnes.push({
          //       title: this.searchColumns[i].s_column_name,
          //       dataIndex: this.searchColumns[i].s_table_column,
          //       align: "center",
          //     });
          //   }
          this.columns.push({
              title: '序号',
              dataIndex: '',
              key: 'rowIndex',
              width: 60,
              align: "center",
              customRender: function (t, r, index) {
                return parseInt(index) + 1;
              }
            },
            {
              title: '文号',
              align: "center",
              width: 150,
              sorter: (i, ii, type) => {

                this.queryParam.tableOrder = true
                this.nullOther('orederByWenHao')

                this.queryParam.orederByWenHao = type == 'descend' ? -1 : 1;
                return true
              },
              dataIndex: 'wenHao'
            },
            {
              title: '标题',
              sorter: (i, ii, type) => {
                //descend倒叙
                //ascend正序

                this.queryParam.tableOrder = true
                //置空其他环节
                this.nullOther('orederByTile')
                this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
                return true
              },
              width: 400,
              align: "left",
              dataIndex: 'title'
            },
            // {
            //   title: '流程名称',
            //   align: "center",
            //   dataIndex: 'proDefName'
            // },
            {
              title: '当前环节',
              width: 180,
              sorter: (i, ii, type) => {
                this.queryParam.tableOrder = true
                this.nullOther('orederByHuanJie')

                this.queryParam.orederByHuanJie = type == 'descend' ? -1 : 1
                return true
              },
              align: "center",
              dataIndex: 'taskDefinitionKeyName'
            },
            {
              title: '拟稿人',
              width: 100,
              sorter: (i, ii, type) => {
                this.queryParam.tableOrder = true
                this.nullOther('orederByDrafter')

                this.queryParam.orederByDrafter = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'drafter'
            },
            {
              title: '办理时间',
              width: 160,
              sorter: (i, ii, type) => {
                this.queryParam.tableOrder = true
                this.nullOther('orederByTime')

                this.queryParam.orederByTime = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'startTime'
            },
            {
              title: '操作',
              width: 115,
              dataIndex: 'action',
              align: "center",
              scopedSlots: {customRender: 'action'},
            });

          // this.dataSources = res.result.dataList;


          this.dataSource007 = res.result.records;
          for (let i = 0; i < this.dataSource007.length; i++) {
            this.dataSource007[i].key = this.dataSource007[i].id;
          }

          // console.log('-------------++++++++++++++++++++++++++++++---------------');
          // console.log(this.dataSource);

        });
        this.setFontSize();
      },
      getSearchList() {
        this.dataSource007 = [];
        let url = "urgency/degree/queryTask";
        getAction(url, {
          operstatus: 'task_done',
          urgencyDegree: this.taskSearch,
          dataTitle: this.queryParam.dataTitle,
          fileNum: this.queryParam.fileNum,
          createName: this.queryParam.createName,
          mainDept: this.queryParam.mainDept,
          taskType: this.queryParam.taskType,
          startTimeFake: this.queryParam.startTimeFake,
          endTimeFake: this.queryParam.endTimeFake
        }).then((res) => {
          this.dataSource007 = res.result.records;
          for (let i = 0; i < this.dataSource007.length; i++) {
            this.dataSource007[i].key = this.dataSource007[i].id;
          }
        })
      },
      getPgSearchList() {
        this.columns = [];
        this.dataSource = [];
        // this.chooseSearch();
        // let url = "urgency/degree/queryTask";
        // getAction(url, {operstatus: 'jump', urgencyDegree: 'null'}).then((res) => {
        // this.searchColumns = JSON.parse(res.message);
        // this.searchList = res.result;
        // this.pagination.current = this.searchList.current;
        // this.pagination.pageSize = this.searchList.size;
        // this.pagination.total = this.searchList.total;

        // this.dataSource = this.searchList.records;
        // for (let i = 0; i < this.searchColumns.length; i++) {
        //   if (this.searchColumns[i].s_table_column != 'i_id') {
        //     if(this.searchColumns[i].s_table_column =='i_is_state'){
        //       this.columns.push({
        //         title: this.searchColumns[i].s_column_name,
        //         dataIndex: this.searchColumns[i].s_table_column,
        //         align: "center",
        //         customRender: (text) => {
        //           if(text == true){
        //             return '已办结'
        //           }else if(text == false){
        //             return '未办结'
        //           }else{
        //             return text
        //           }
        //         }
        //       });
        //     }else{
        //       this.columns.push({
        //         title: this.searchColumns[i].s_column_name,
        //         dataIndex: this.searchColumns[i].s_table_column,
        //         align: "center",
        //       });
        //     }

        //   }
        // }

        this.columns.push({
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 50,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },

          {
            title: '标题',
            sorter: (i, ii, type) => {
              //descend倒叙
              //ascend正序

              this.queryParam.tableOrder = true
              //置空其他环节
              this.nullOther('orederByTile')
              this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
              return true
            },
            align: "left",
            dataIndex: 'title'
          },
          {
            title: '文号',
            align: "center",
            width: 120,
            sorter: (i, ii, type) => {

              this.queryParam.tableOrder = true
              this.nullOther('orederByWenHao')

              this.queryParam.orederByWenHao = type == 'descend' ? -1 : 1;
              return true
            },
            dataIndex: 'wenHao'
          },
          // {
          //   title: '流程名称',
          //   align: "center",
          //   dataIndex: 'proDefName'
          // },
          {
            title: '已办环节',

            sorter: (i, ii, type) => {
              this.queryParam.tableOrder = true
              this.nullOther('orederByHuanJie')

              this.queryParam.orederByHuanJie = type == 'descend' ? -1 : 1
              return true
            },
            align: "center",
            width: 110,
            dataIndex: 'taskDefinitionKeyName'
          },
          {
            title: '拟稿人',
            // width: 100,
            sorter: (i, ii, type) => {
              this.queryParam.tableOrder = true
              this.nullOther('orederByDrafter')

              this.queryParam.orederByDrafter = type == 'descend' ? -1 : 1;
              return true
            },
            align: "center",
            width: 100,
            dataIndex: 'drafter'
          },
          {
            title: '办理时间',
            width: 150,
            sorter: (i, ii, type) => {
              this.queryParam.tableOrder = true
              this.nullOther('orederByTime')

              this.queryParam.orederByTime = type == 'descend' ? -1 : 1;
              return true
            },
            align: "center",
            dataIndex: 'startTime'
          },
          {
            title: '审批信息',
            width: 180,
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          });

        // this.dataSource = res.result.records;

        this.searchQuery();


        // });
        this.setFontSize();
      },
      // changeInput(event, obj) {
      //   this.queryParam[obj] = event.currentTarget.value;
      // console.log('----------------------------------------------------------');
      // console.log("object: " + obj + " value: " + event);
      // console.log('----------------------------------------------------------');
      // console.log(this.queryParam);
      // },
      // changeSelect(event, obj) {
      // this.queryParam[obj] = event.toString();
      // console.log('----------------------------------------------------------');
      // console.log("object: " + obj + " value: " + event);
      // console.log('----------------------------------------------------------');
      // console.log(this.queryParam);
      // },
      // onClick(record, index) {
      //   return {
      //     on: {
      //       click: (event) => {
      //         //查询---业务数据--流程信息
      //         let param = {tableName: this.tableName, busdataId: record.i_id};
      //         this.$refs.detailFile.show(param)

      // this.$router.push({path:'/mytask/taskList/Test-detailFile',query:param})
      //       }
      //     }
      //   }
      // },
      confirm2() {
        if (this.selectedRowKeys2.length <= 0) {
          this.$message.error("请选择环节")
          return
        }
        let status = 'done'
        this.taskRecord.taskDefinitionKey = this.selectedRowKeys2[0]
        this.taskRecord.taskDefinitionKeyName = this.selectedRows2[0].name
        if (this.selectedRows2[0].status != undefined && this.selectedRows2[0].status == 'todo') {

          this.taskRecord.id = this.selectedRows2[0].id
          this.taskRecord.hiTaskId=undefined
          status = 'todo'
        } else {
          this.taskRecord.hiTaskId = this.selectedRows2[0].id
        }


        window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName='
          + this.taskRecord.table + '&busdataId=' + this.taskRecord.tableId
          + '&status=' + status + '&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))
        this.haveMore = false


      },
      cancel2() {
        this.haveMore = false
      },
      onSelectChangeMy2(rowKeys, rows) {
        this.selectedRowKeys2 = rowKeys
        this.selectedRows2 = rows
      },
      doTask(record, index) {
        return {
          on: {
            click: (event) => {
              this.taskRecord = record

              //查询是否有待办环节
              getAction('/wf/task/currentUserTodos?processInstanceId=' + record.processInstanceId).then(res => {

                if (res.success) {
                  if (res.result.length > 0) {
                    //提示是否以待办身份进入
                    var r = window.confirm("您有此任务的待办,是否以待办身份进入");

                    //TODO 方式待完善
                    // var r = this.$confirm({
                    //   title: '提示',
                    //   content: '您有此任务的待办,是否以待办身份进入?',
                    //   confirmButtonText: '确定',
                    //   cancelButtonText: '取消',
                    //   type: 'warning'
                    //
                    // })

//                    console.log(r)
                    if (r) {

                      if (res.result.length == 1) {
                        this.taskRecord.id = res.result[0].id
                        this.taskRecord.name = res.result[0].name
                        this.taskRecord.taskDefinitionKey = res.result[0].taskDefinitionKey
                        this.taskRecord.processDefinitionId = res.result[0].processDefinitionId
                        this.taskRecord.hiTaskId = undefined

//                        console.log(res.result,this.taskRecord)
                        window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName='
                          + this.taskRecord.table + '&busdataId=' + this.taskRecord.tableId
                          + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))
                      }

                      if (res.result.length > 1) {
                        this.dataSource3 = []
                        for (let i in res.result) {
                          let act = res.result[i]
                          let actMSg = {
                            key: act.taskDefinitionKey,
                            name: act.name,
                            id: act.id,
                            status: 'todo'
                          }
                          this.dataSource3.push(actMSg)
                          this.haveMore = true
                          this.moreTask = '您当前有多个环节的待办，请选择一个环节'
                        }
                      }

                    } else {
                      this.moreHiTask();
                    }


                  } else {
                    this.moreHiTask();
                  }
                } else {
                  this.$message.error(res.message)
                }
              })


            }
          }
        }

      },
      moreHiTask() {
        if (this.taskRecord.hiTaskId.indexOf(',') >= 0) {
          let keys = this.taskRecord.taskDefinitionKey.split(",")
          let names = this.taskRecord.allNames.split(",")
          let ids = this.taskRecord.hiTaskId.split(",")
          this.dataSource3 = []
          let map = {}
          for (let i in keys) {
            //构造集合 去重 同一环节去id最大的
            let data = {key: keys[i], name: names[i], id: ids[i]}
            let act = map[keys[i]]
            if (act == undefined) {
              map[keys[i]] = data
            } else {
              if (parseInt(ids[i]) > parseInt(act.id)) {
                map[keys[i]] = data
              }
            }
          }
          //如果去重之后只有一个
          if (Object.values(map).length > 1) {
            this.dataSource3 = Object.values(map)
            this.haveMore = true
            this.moreTask = '您当前有多个环节的已办，请选择一个环节'

          }
          if (Object.values(map).length == 1) {

            let record2 = Object.values(map)[0]
            this.taskRecord.taskDefinitionKey = record2.key
            this.taskRecord.name = record2.name
            this.taskRecord.hiTaskId = record2.id
            window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + this.taskRecord.table
              + '&busdataId=' + this.taskRecord.tableId
              + '&status=done&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))
          }
        } else {
          window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName='
            + this.taskRecord.table + '&busdataId=' + this.taskRecord.tableId
            + '&status=done&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))
        }
      },
      dataDestroy() {
        // this.searchColumns = [];
        this.searchList = [];
        this.columns = [];
        this.columnes = [];
        this.dataSource = [];
        this.dataSource007 = [];
        this.dataSources = [];
      },
      // resetPgConditionList() {
      //   this.queryParam = Object.assign({}, this.resetConditionList);
      //   for (let i = 0; i < this.$refs.inputs.length; i++) {
      //     this.$refs.inputs[i].stateValue = '';
      //   }
      // },
      //   collapseListOrNot() {
      //     const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
      //     getAction('/testt/sysUserSet/queryByUserId', {userId: userid}).then((res) => {
      //       this.iisFold = res.result.iisFold;
      //       if (this.iisFold == 1) {
      //         this.getPgFirstList();
      //       } else {
      //         this.getPgSearchList();
      //       }
      //     })
      //   }
      // },
      collapseListOrNot: async function () {
        const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
        await  getAction('/testt/sysUserSet/queryByUserId', {userId: userid}).then((res) => {
          this.iisFold = res.result.iisFold;
          if (this.iisFold == 1) {
            this.getPgFirstList();
          } else {
            this.getPgSearchList();
          }
        })
      }
    },
    watch: {

      // '$route.path': {
      //   handler(newPath, oldPath) {
      //     //this.init();
      //     let path = newPath;
      //     let paths = path.split('/')
      //     let str = paths[paths.length - 1]
      //     this.getModelIdByUrl(str);
      //     // console.log('---------------------------------', newPath);
      //     // console.log('---------------------------------', oldPath);
      //   },
      //   immediate: false,
      //   deep: true,
      // }

      /* this.$route.path:{

     }*/
      /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
    }
  }
</script>
<style lang="scss" scoped>

  .ant-input {
    background-color: #f0f5fc;
  }

  input::-webkit-input-placeholder{
    color: rgba(0, 0, 0, 0.65);
  }

  .ant-select-selection--single {
    background-color: #f0f5fc !important;
  }

  .ant-table-thead > tr > th {
    color: #fff;
    background-color: #006db9;
    border: none !important;
  }

  /deep/ .ant-table-middle .ant-table-tbody > tr:hover {
    cursor: pointer;
  }

  .light-row {
    background-color: #fff;
  }


  .dark-row {
    /*background:linear-gradient(to bottom,rgb(221,221,255),rgb(167,196,255)) repeat scroll 0% 0%;*/
    background-color: #c2d9f8;
  }

  .dark-row:hover {
    background-color: #ffadd2;
  }

  .ant-table-middle .ant-table-tbody .ant-table-row-selected {
    background-color: #000 !important;
  }

  /*.ant-tabs-nav-scroll{*/
  /*height:39px;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar{*/
  /*border:none;*/
  /*}*/

  /*.ant-card-body .ant-tabs-nav{*/
  /*!*background-color: #ffadd2;*!*/
  /*border:1px solid #909090;*/
  /*border-radius: 25%;*/
  /*height: 27px;*/
  /*top: 5px;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar .ant-tabs-tab{*/
  /*font-size: 14px;*/
  /*padding-top: 2px;*/
  /*margin-right: 0px;*/
  /*bottom: 1px;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar .ant-tabs-tab:hover{*/
  /*color: #0061cb;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar .ant-tabs-tab-active{*/
  /*color: #fff;*/
  /*background-color: #7d70ff;*/
  /*border-radius: 27%;*/
  /*height:27px;*/
  /*}*/
  /*.ant-card-body .ant-tabs-bar .ant-tabs-ink-bar-animated{*/
  /*display: none !important;*/
  /*}*/

  /*.table-page-search-submitButtons .ant-btn {*/
    /*background: linear-gradient(180deg, rgba(115, 128, 255, 1), rgba(47, 86, 255, 1)) repeat scroll 0% 0%;*/
  /*}*/

  /*.table-page-search-submitButtons .ant-btn svg {*/
    /*fill: cyan;*/
  /*}*/

  [v-cloak] {
    display: none;
  }

</style>