<style lang="scss" scoped>

  .ant-input {
    background-color: #f0f5fc;
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

  .table-page-search-submitButtons .ant-btn {
    background: linear-gradient(180deg, rgba(115, 128, 255, 1), rgba(47, 86, 255, 1)) repeat scroll 0% 0%;
  }

  .table-page-search-submitButtons .ant-btn svg {
    fill: cyan;
  }

</style>

<template>
  <div class="table-page-search-wrapper">
    <a-card :bordered="ture">
      <a-tabs @change="changFunId" defaultActiveKey="1">
        <a-tab-pane v-for="(item,index) in selectList" :tab="item.sname" :key="index+1">
          <a-form layout="inline">
            <a-row :gutter="48" style="margin:0 -150px 0 24px;">
              <a-col :md="!advanced && 24 || 24" :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a @click="toggleAdvanced" style="position: absolute;bottom: 34%;right: 14%;">
                {{ advanced ? '隐藏' : '显示' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
              </a-col>
              <template v-if="advanced">
                <!--<a-col :md="7" :sm="24" style="margin-top:7px;">-->
                <!--<a-form-item label="业务功能">-->
                <!--<a-select @change="changFunId" v-model="queryParam.function_id">-->
                <!--<a-select-option v-for="(item,index) in selectList" :key="index" :value="item.iid">{{item.sname}}-->
                <!--</a-select-option>-->
                <!--</a-select>-->
                <!--</a-form-item>-->
                <!--</a-col>-->
                <a-col :md="7" :sm="24" style="margin-top:7px;">
                  <a-form-item label="公文状态">
                    <a-select v-model="queryParam.i_is_state">
                      <a-select-option value="1">已办结</a-select-option>
                      <a-select-option value="0">未办结</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="7" :sm="24" style="margin-top: 7px;">
                  <a-form-item label="申请人">
                    <a-radio-group v-model="queryParam.selType">
                      <a-radio :value="0">由我创建</a-radio>
                      <a-radio :value="1" style="width: 33%;">
                        全部数据
                        <a-input v-if="queryParam.selType === 1" v-model="queryParam.s_create_name"
                                 style="margin-left: 7px"/>
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :md="7" :sm="24" style="margin-top:7px;">
                  <a-form-item label="申请年份">
                    <a-select v-model="queryParam.d_create_time">
                      <a-select-option v-for="(item,index) in timeList" :key="index" :value="item">{{item}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>


                <a-col v-for="(atom,index) in conditionList" :key="index" :value="atom.s_table_column" :md="7" :sm="24"
                       style="margin-top:7px;">
                  <a-form-item :label="atom.s_column_name">
                    <!--<a-select v-if="atom.s_table_column=='s_file_num'" @change="changeSelect($event,atom.s_table_column)" placeholder="请选择">-->
                    <!--<a-select-option v-for="(item,index) in selectList" :key="item.i_id" :value="item.i_id">{{item.s_name}}</a-select-option>-->
                    <!--</a-select>-->

                    <a-input class="input" ref="inputs" @input="changeInput($event,atom.s_table_column)"
                             placeholder="请输入"/>
                  </a-form-item>
                </a-col>


                <a-col :md="!advanced && 7 || 24" :sm="24" style="text-align: center;padding-right:172px;">
            <span class="table-page-search-submitButtons" :style="advanced && { overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="search" @click="collapseListOrNot">查询</a-button>
              <a-button type="primary" icon="reload" @click="resetPgConditionList"
                        style="margin-left:27px;">重置</a-button>
            </span>
                </a-col>

              </template>
            </a-row>
          </a-form>

          <!-- 操作按钮区域 -->
          <div class="table-operator">
            <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="batchEnd">
                  <a-icon type="delete"/>
                  批量办结
                </a-menu-item>
                <a-menu-item v-if="(url.list=='/wf/task/queryTask?operstatus=my_chuanyue') "
                             key="1" @click="batchPiYue">
                  <a-icon type="delete"/>
                  批量批阅
                </a-menu-item>
              </a-menu>

              <a-button style="margin-left: 8px"> 批量操作
                <a-icon type="down"/>
              </a-button>
            </a-dropdown>
          </div>

          <!-- table区域-begin -->
          <div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
              <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
              selectedRowKeys.length }}</a>项
              <a style="margin-left: 24px" @click="onClearSelected">清空</a>
            </div>

            <a-table
              v-if="iisFold == 0"
              size="middle"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="pagination"
              :loading="loading"
              :showAlertInfo="false"
              bordered
              rowKey="processInstanceId"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              :customRow="doTask"
              @change="(page,pageSize) => {
               handleTableChange(page)
          }"
              :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
            >

             <span slot="action" slot-scope="text, record">

          <a @click.stop="jump(record)">重置</a>
           <a-divider type="vertical"/>
          <a @click.stop="unDo(record)">未办理信息</a>
          <a-divider type="vertical"/>
          <a @click.stop="showPic(record)">查看流程图</a>

        </span>

            </a-table>

            <a-table
              v-if="iisFold == 1"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="false"
              :loading="loading"
              :showAlertInfo="false"
              :showHeader="false"
              :expandIconAsCell="false"
              bordered
              :rowKey="record => record.key"
              @expandedRowsChange="(expandedRows) => {
               getPgSecondList(expandedRows);
          }"
            >

              <a-table
                slot="expandedRowRender"
                slot-scope="record,index,indent,expanded"
                size="middle"
                :columns="columnes"
                :dataSource="dataSources"
                :pagination="false"
                :loading="loading"
                :showAlertInfo="false"
                rowKey="processInstanceId"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                :customRow="doTask"
                :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
              >

              <span slot="action" slot-scope="text, record">

          <a @click.stop="jump(record)">重置</a>
           <a-divider type="vertical"/>
          <a @click.stop="unDo(record)">未办理信息</a>
          <a-divider type="vertical"/>
          <a @click.stop="showPic(record)">查看流程图</a>

        </span>


              </a-table>

            </a-table>

          </div>
          <!-- table区域-end -->

          <!-- 表单区域 -->
          <pic2-modal ref="pic" @ok="modalFormOk"></pic2-modal>
          <new-task-modal ref="newTask"></new-task-modal>


          <!--业务页面-->
          <detail-file ref="detailFile"></detail-file>
          <back-modal ref="backModal"></back-modal>


        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import STable from '@/components/table/'
  import ATextarea from "ant-design-vue/es/input/TextArea"
  import AInput from "ant-design-vue/es/input/Input"
  import pic2Modal from '../../views/mytask/modules/pic2Modal'
  import moment from "moment"
  import {getAction, getRoleList, getServiceList, getUserList, httpAction, postAction} from '@/api/manage'
  import ARadioGroup from "ant-design-vue/es/radio/Group"
  import DetailFile from "@/views/mytask/taskList/detailFile"
  import backModal from '@/views/mytask/modules/backModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "CollapseListOrNot",
    mixins: [JeecgListMixin],
    components: {
      pic2Modal,
      DetailFile,
      ARadioGroup,
      AInput,
      ATextarea,
      STable,
      backModal
    },
    data() {
      return {
        // headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        description: '这是公共查询列表页面',
        visibleCreateModal: false,
        visible: false,
        iisFold: 0,
        getPageList: [],
        conditionList: [],
        resetConditionList: {},
        setConditionList: {},
        selectList: [],
        timeList: [],
        modelId: '',
        tableName: '',
        searchColumns: [],
        searchList: [],
        model: {pageDetailList: [{}]},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        mdl: {
          dataIndex: 'description',
        },

        // 高级搜索 展开/关闭
        advanced: true,
        // 查询参数
        queryParam: {
          function_id: '',
          i_is_state: '',
          selType: 1,
          s_create_name: '',
          d_create_time: '',
        },
        // 表头
        columns: [],
        columnes: [],
        dataSource: [],
        taskKey: [],
        taskNames: [],
        // rowSelection:{
        //   onSelect:(record,selected,selectedRows)=>{
        //     console.log('-----------------------<><><><><><><><><><><><><>--------------------------');
        //     console.log(record,selected,selectedRows);
        //   }
        // },
        dataSources: [],
        pagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['5', '10', '15', '20', '25', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + "共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
        },
        url: {
          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
          getModelIdByUrl: '/oaBus/busModel/getModelIdByUrl',
          getConditionByFunId: '/oaBus/busPageDetail/getConditionByFunId',

          list: "/wf/task/queryTask?operstatus=jump",
          yewuDataQuery: "/oaBus/dynamic/query",
          actShowQuery: '/oaBus/busPage/queryActShowByPageRef',
          batchEnd: '/wf/task/batchEnd',
          batchPiYue: '/wf/task/batchPiYue',
          currentUnDo: '/wf/task/queryTaskUnDoCurrent',
          showBackAct: '/wf/task/showBackAct',//展示回退/跳转 节点
        },
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        toggleSearchStatus: false,
        startTimeFake: null,
        endTimeFake: null,
        taskType: null,
      }
    },
    created() {
      //默认不带部门类型
      this.queryParam.isDept = false
      this.init();
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
      // loadData (arg){
      //   if(arg===1){
      //     this.ipagination.current = 1;
      //   }
      //   let params = this.getQueryParams();
      //   getServiceList(params).then((res)=>{
      //     if(res.success){
      //       this.dataSource = res.result.records;
      //       this.ipagination.total = res.result.total;
      //     }
      //   })
      // },
      //清空其他排序条件
      nullOther(type) {
        let orderColums = ['orederByWenHao', 'orederByTile', 'orederByHuanJie', 'orederByDrafter', 'orederByTime']
        for (let i in orderColums) {
          if (i != type) {
            this.queryParam[orderColums[i]] = undefined
          }
        }
      },
      jump(record) {
        // var text = type == 'all' ? '跳转' : '回退'

        getAction(this.url.showBackAct,
          {
            processDefinitionId: record.processDefinitionId,
            type: 'all',
            processInstanceId: record.processInstanceId,
            taskDefinitionKey: record.taskDefinitionKey
          }
        ).then(res => {
          if (res.success) {
            if (res.result.length <= 0) {
              this.$message.error('没有可' + text + '节点')
              return
            }
            this.$refs.backModal.dataSource = res.result
            // this.$refs.backModal.taskMsg = this.taskMsg
            this.$refs.backModal.taskMsg = record
            this.$refs.backModal.title = '流程重置'
            this.$refs.backModal.show()
          } else {
            this.$message.error(res.message)
          }
        })
      },
      unDo(record) {
        let procInstId = record.processInstanceId
        getAction(this.url.currentUnDo, {
          procInstId: procInstId
        }).then(res => {
          if (res.success) {

            const h = this.$createElement;
            let content = []
            for (let i in res.result) {
              let msg = res.result[i]
              content.push(h('p', `【${msg.taskDefName}】 ${msg.deptName} ：${msg.userName}`))
            }

            let content_ = h('div', {}, content)

            const modal = this.$success({
              title: '未办理信息',
              content: content_,
            });
          } else {
            this.$message.error(res.message)
          }
        })
      },
      //类型选择
      taskTypeChange(type) {
        if (type != '全部') {
          this.queryParam.isDept = true
          this.queryParam.deptType = type
        } else {
          this.queryParam.isDept = false
        }
      },
      searchQueryMy() {
        this.queryParam.tableOrder = false

        this.searchQuery()
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      searchResetMy() {
        this.queryParam.tableOrder = false

        this.searchReset()
        this.startTimeFake = null
        this.endTimeFake = null
        this.taskType = null
        this.queryParam.isDept = false
      },
      endTimeChange(a, time) {
        this.queryParam.endQueryTime = time
      },
      startTimeChange(a, time) {
        console.log('-------------------------', time)
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
        console.log('------->取消选择')
      },
      showPic(record) {
        console.log('----=-=-=-=-=-=-=', JSON.stringify(record))
        this.$refs.pic.show(record)
        this.$refs.pic.title = '当前环节'
      },
      //批量办结
      batchEnd() {

        var ids = []
        for (let i in this.selectionRows) {
          if (this.selectionRows[i].processInstanceId != undefined) {
            ids.push(this.selectionRows[i].processInstanceId)
          }
        }
        var param = {ids: ids}

        postAction(this.url.batchEnd, param).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.reload()
          } else {
            this.$message.error(res.message)
          }
        })

      },
      batchPiYue() {
        var data = []
        for (let i in this.selectionRows) {
          if (this.selectionRows[i].id != undefined) {
            let d = this.selectionRows[i]
            let v = {
              table: d.table + '_opinion',
              i_busdata_id: d.tableId,
              s_opinion_type: 4,
              s_task_id: d.id,
              s_task_name: d.name,
              s_overt: 0,
              s_taskdef_key: d.taskDefinitionKey,
            }
            data.push()
          }
        }


        postAction(this.url.batchPiYue, data).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.reload()
          } else {
            this.$message.error(res.message)
          }
        })

      },
      changFunId(index) {
        index = index - 1;
        this.resetPgConditionList();
        getAction(this.url.getConditionByFunId, {functionId: this.selectList[index].iid}).then((res) => {
          this.conditionList = res;
          this.queryParam = Object.assign({}, this.setConditionList);
          for (let i = 0; i < this.conditionList.length; i++) {
            this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
          }
          this.queryParam.function_id = this.selectList[index].iid;
          this.resetConditionList = Object.assign({}, this.queryParam);
          this.pagination.current = 1;
          this.collapseListOrNot();
        });
      },
      init() {
        let path = this.$route.path;
        let paths = path.split('/')
        let str = paths[paths.length - 1]
        this.getModelIdByUrl(str);
      },
      clearData() {
        this.conditionList = [];
        this.selectList = [];
        this.pagination = [];
        this.columns = [];
        this.columnes = [];
        this.dataSource = [];
        this.dataSources = [];
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.current = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        let str = "id,";
        for (let i = 0; i < this.columns.length; i++) {
          str += "," + this.columns[i].dataIndex;
        }
        return str;
      },

      handleEdit(record) {
        this.mdl = Object.assign({}, record);
        console.log(this.mdl);
        this.visible = true;
      },
      handleOk() {

      },

      //添加逻辑
      handleModalVisible(isVisible) {
        this.visibleCreateModal = isVisible;
      },

      handleCreateModalCancel() {
        this.visibleCreateModal = false;
      },

      onChange(row) {
        this.selectedRowKeys = row.selectedRowKeys;
        this.selectedRows = row.selectedRows;
        // console.log(this.$refs.table)
      },
      toggleAdvanced() {
        this.advanced = !this.advanced
      },

      resetSearchForm() {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      handleTableChange(page) {
        this.pagination.current = page.current;
        this.pagination.pageSize = page.pageSize;
        this.collapseListOrNot();
      },
      getModelIdByUrl(str) {
        //let url = "/papertitle/docNumSet/busModelList";
        getAction(this.url.getModelIdByUrl, {str: 'electronicFile'}).then((res) => {
          this.modelId = res;
          this.getPgConditionList();

          //this.getPgSearchList();
        });
      },
      getPgConditionList() {
        let url = "/oaBus/oaBusdata/queryFunSelByModelId";
        postAction(url, {modelId: this.modelId, function_id: this.queryParam.function_id}).then((res) => {
          this.clearData();
          this.conditionList = res.colList;
          this.selectList = res.funList;
          this.tableName = res.tableName;
          this.timeList = res.d_create_time;
          this.queryParam.function_id = this.selectList[0].iid;
          this.setConditionList = Object.assign({}, this.queryParam);
          for (let i = 0; i < this.conditionList.length; i++) {
            this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
          }
          this.resetConditionList = Object.assign({}, this.queryParam);

          // console.log('----------------------------------------------------------');
          // console.log(this.queryParam);

          this.collapseListOrNot();
        });
      },
      getPgFirstList() {
        this.columns = [];
        this.dataSource = [];
        this.chooseSearch();

        let url = "/sys/dict/getDictByKey";
        getAction(url, {dictKey: 'urgencyDegree'}).then((res) => {

          this.columns.push({
            dataIndex: 'wenHao',
          });

          for (let i = 0; i < res.result.length; i++) {
            this.taskKey.push(res.result[i].itemValue);
            this.dataSource.push({
              key: i,
              wenHao: res.result[i].itemText,
            });
          }
          // console.log('-----------------------<><><><><><><><><><><><><>--------------------------');
          // console.log(this.taskKey);
          // console.log('------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------');
          // console.log(res);


        });
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
        this.columnes = [];
        this.dataSources = [];
        let url = "urgency/degree/queryTask";
        getAction(url, {operstatus: 'jump', urgencyDegree: 'null'}).then((res) => {

          // this.searchColumns = JSON.parse(res.records);
          //
          // for (let i = 1; i < this.searchColumns.length; i++) {
          //   this.columnes.push({
          //     title: this.searchColumns[i].s_column_name,
          //     dataIndex: this.searchColumns[i].s_table_column,
          //     align: "center",
          //   });
          // }
          this.columnes.push({
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
              width: 100,
              sorter: (i, ii, type) => {

                this.queryParam.tableOrder = true
                this.nullOther('orederByWenHao')

                this.queryParam.orederByWenHao = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'wenHao'
            },
            {
              title: '标题',
              width: 350,
              align: "center",
              sorter: (i, ii, type) => {
                //descend倒叙
                //ascend正序

                this.queryParam.tableOrder = true
                //置空其他环节
                this.nullOther('orederByTile')
                this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'title'
            },
            {
              title: '当前环节',
              sorter: (i, ii, type) => {
                this.queryParam.tableOrder = true
                this.nullOther('orederByHuanJie')

                this.queryParam.orederByHuanJie = type == 'descend' ? -1 : 1
                return true
              },
              align: "center",
              dataIndex: 'name'
            },
            {
              title: '拟稿人',
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
              title: '转发时间',
              sorter: (i, ii, type) => {
                this.queryParam.tableOrder = true
                this.nullOther('orederByTime')

                this.queryParam.orederByTime = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'createTime'
            },
            {
              title: '操作',
              dataIndex: 'action',
              align: "center",
              scopedSlots: {customRender: 'action'},
            });

          // this.dataSources = res.result.dataList;
          this.dataSources = res.result.records;

          // console.log('-------------++++++++++++++++++++++++++++++---------------');
          // console.log(this.dataSources);

        });
      },
      getPgSearchList() {
        this.columns = [];
        this.dataSource = [];
        this.chooseSearch();
        let url = "urgency/degree/queryTask";
        // this.queryParam.function_id = this.queryParam.function_id.toString();
        // this.queryParam.i_is_state = this.queryParam.i_is_state.toString();
        // this.queryParam.s_create_name = this.queryParam.s_create_name.toString();
        // this.queryParam.d_create_time = this.queryParam.d_create_time.toString();

        getAction(url, {operstatus: 'jump', urgencyDegree: 'null'}).then((res) => {
          // this.searchColumns = JSON.parse(res.message);
          this.searchList = res.result;
          this.pagination.current = this.searchList.current;
          this.pagination.pageSize = this.searchList.size;
          this.pagination.total = this.searchList.total;

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
              width: 60,
              align: "center",
              customRender: function (t, r, index) {
                return parseInt(index) + 1;
              }
            },
            {
              title: '文号',
              width: 100,
              sorter: (i, ii, type) => {

                this.queryParam.tableOrder = true
                this.nullOther('orederByWenHao')

                this.queryParam.orederByWenHao = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'wenHao'
            },
            {
              title: '标题',
              width: 350,
              align: "center",
              sorter: (i, ii, type) => {
                //descend倒叙
                //ascend正序

                this.queryParam.tableOrder = true
                //置空其他环节
                this.nullOther('orederByTile')
                this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'title'
            },
            {
              title: '当前环节',
              sorter: (i, ii, type) => {
                this.queryParam.tableOrder = true
                this.nullOther('orederByHuanJie')

                this.queryParam.orederByHuanJie = type == 'descend' ? -1 : 1
                return true
              },
              align: "center",
              dataIndex: 'name'
            },
            {
              title: '拟稿人',
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
              title: '转发时间',
              sorter: (i, ii, type) => {
                this.queryParam.tableOrder = true
                this.nullOther('orederByTime')

                this.queryParam.orederByTime = type == 'descend' ? -1 : 1;
                return true
              },
              align: "center",
              dataIndex: 'createTime'
            },
            {
              title: '操作',
              dataIndex: 'action',
              align: "center",
              scopedSlots: {customRender: 'action'},
            });

          this.dataSource = res.result.records;

        });

      },
      changeInput(event, obj) {
        this.queryParam[obj] = event.currentTarget.value;
        // console.log('----------------------------------------------------------');
        // console.log("object: " + obj + " value: " + event);
        // console.log('----------------------------------------------------------');
        // console.log(this.queryParam);
      },
      changeSelect(event, obj) {
        // this.queryParam[obj] = event.toString();
        // console.log('----------------------------------------------------------');
        // console.log("object: " + obj + " value: " + event);
        // console.log('----------------------------------------------------------');
        // console.log(this.queryParam);
      },
      onClick(record, index) {
        return {
          on: {
            click: (event) => {
              //查询---业务数据--流程信息
              let param = {tableName: this.tableName, busdataId: record.i_id};
              this.$refs.detailFile.show(param)

              // this.$router.push({path:'/mytask/taskList/Test-detailFile',query:param})
            }
          }
        }
      },
      doTask(record, index) {
        return {
          on: {
            click: (event) => {
              let taskDetail = {
                tableName: record.table,
                busdataId: record.tableId,
              }
              // this.$router.push({path:'/taskList/Test-detailFile',query:param})
              this.$refs.detailFile.showTaskInAct(taskDetail, record)
            }
          }
        }
      },
      chooseSearch() {
        if (this.queryParam.selType == 0) {
          this.queryParam.s_create_name = '';
        }
        // console.log('222----------------------------------------------------------222');
        // console.log('radio checked', e.target.value)
      },
      dataDestroy() {
        this.searchColumns = [];
        this.searchList = [];
        this.pagination = [];
        this.columns = [];
        this.columnes = [];
        this.dataSource = [];
        this.dataSources = [];
      },
      resetPgConditionList() {
        this.queryParam = Object.assign({}, this.resetConditionList);
        for (let i = 0; i < this.$refs.inputs.length; i++) {
          this.$refs.inputs[i].stateValue = '';
        }
      },
      collapseListOrNot() {
        const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
        getAction('/testt/sysUserSet/queryByUserId', {userId: userid}).then((res) => {
          this.iisFold = res.result.iisFold;
          if (res.result.iisFold == 1) {
            this.getPgFirstList();
          } else {
            this.getPgSearchList();
          }
        })
      }
    },
    watch: {

      '$route.path': {
        handler(newPath, oldPath) {
          //this.init();
          let path = newPath;
          let paths = path.split('/')
          let str = paths[paths.length - 1]
          this.getModelIdByUrl(str);
          // console.log('---------------------------------', newPath);
          // console.log('---------------------------------', oldPath);
        },
        immediate: false,
        deep: true,
      }

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