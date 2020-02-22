<style lang="scss" scoped>

  .input {
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
    /*border: none !important;*/
    /*border-color: #779ecb !important;*/
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
            <a-row :gutter="48" style="margin-left: 0px;">
              <a-col :md="!advanced && 24 || 24" :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a @click="toggleAdvanced" style="position: absolute;bottom: 58%;right: 7%;">
                {{ advanced ? '隐藏' : '显示' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
            <template v-if="advanced">
              <a-row :gutter="48" style="width: 88.3%;">
                <!--="<a-col :md="7" :sm="24">-->
                <!--<a-form-item label="业务功能">-->
                <!--<a-select @change="changFunId" v-model="queryParam.function_id">-->
                <!--<a-select-option v-for="(item,index) in selectList" :key="index" :value="item.iid">{{item.sname}}-->
                <!--</a-select-option>-->
                <!--</a-select>-->
                <!--</a-form-item>-->
                <!--</a-col>-->

                <a-col :md="7" :sm="24">
                  <a-form-item>
                    <a-select v-model="queryParam.i_is_state">
                      <a-select-option value="" disabled selected hidden>状态</a-select-option>
                      <a-select-option value="0">未办结</a-select-option>
                      <a-select-option value="1">已办结</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <!--<a-col :md="7" :sm="24">-->
                  <!--<a-form-item label="拟稿人">-->
                    <!--<a-radio-group v-model="queryParam.selType">-->
                      <!--<a-radio @click="clearCurPageIndex()" :value="0">由我创建</a-radio>-->
                      <!--<a-radio @click="clearCurPageIndex()" :value="1" style="width: 33%;">-->
                        <!--全部数据-->
                        <!--<a-input v-if="queryParam.selType === 1" v-model="queryParam.s_create_name" style="margin-left: 7px"/>-->
                      <!--</a-radio>-->
                    <!--</a-radio-group>-->
                  <!--</a-form-item>-->
                <!--</a-col>-->

                <a-col :md="7" :sm="24">
                  <a-form-item>
                    <a-select v-model="queryParam.s_create_name">
                      <a-select-option value="" disabled selected hidden>拟稿人</a-select-option>
                      <a-select-option value="0">全部数据</a-select-option>
                      <a-select-option value="1">由我创建</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>


                <a-col :md="7" :sm="24">
                  <a-form-item>
                    <a-select v-model="queryParam.d_create_time">
                      <a-select-option value="" disabled selected hidden>年份</a-select-option>
                      <a-select-option v-for="(item,index) in timeList" :key="index" :value="item">{{item}}
                      </a-select-option>
                    </a-select>
                    <span class="table-page-search-submitButtons" :style="advanced && { overflow: 'hidden' } || {} " style="position: absolute;top: -34%;left: 127%;">
                      <a-button type="primary" icon="search" @click="collapseListOrNot">查询</a-button>
                    </span>
                  </a-form-item>
                </a-col>
              </a-row>

            <a-row :gutter="48" style="width: 88.3%;">
                <a-col v-for="(atom,index) in conditionList" :key="index" :value="atom.s_table_column" :md="7" :sm="24">
                  <a-form-item>
                    <a-select v-if="atom.i_column_type == 1" @change="changeSelect($event,atom.s_table_column)" :placeholder="atom.s_column_name">
                    <a-select-option v-for="(item,index) in selectList" :key="item.i_id" :value="item.i_id">{{item.s_name}}</a-select-option>
                    </a-select>
                    <a-input v-else class="input" ref="inputs" @input="changeInput($event,atom.s_table_column)" :placeholder="atom.s_column_name"/>
                    <span v-if="index == 2" class="table-page-search-submitButtons" :style="advanced && { overflow: 'hidden' } || {} " style="position: absolute;top: -34%;left: 127%;">
                      <a-button type="primary" icon="reload" @click="resetPgConditionList">重置</a-button>
                    </span >
                  </a-form-item>

                </a-col>

            </a-row>

              <!--<a-row :gutter="48">-->
                <!--<a-col :md="!advanced && 7 || 24" :sm="24" style="text-align: center;padding-right:172px;">-->
                <!--<span class="table-page-search-submitButtons" :style="advanced && { overflow: 'hidden' } || {} ">-->
                  <!--<a-button type="primary" icon="search" @click="collapseListOrNot">查询</a-button>-->
                  <!--<a-button type="primary" icon="reload" @click="resetPgConditionList" style="margin-left: 27px;">重置</a-button>-->
                <!--</span>-->
                <!--</a-col>-->
              <!--</a-row>-->
              </template>
            </a-row>

          </a-form>

          <a-table
            v-if="iisFold == 0 || collapse == 0"
            size="middle"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="paginations"
            :loading="loading"
            :showAlertInfo="false"
            bordered
            :rowKey="record => record.id"
            :customRow="onClick"
            @change="(page,pageSize) => {
               handleTableChange(page)
          }"
            :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
          >

          </a-table>

          <a-table
            v-if="iisFold == 1 && collapse == 1"
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
              :rowKey="record => record.key"
              :customRow="onClick"
              style="word-break: break-all"
              :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
            >

            </a-table>

          </a-table>

        </a-tab-pane>
      </a-tabs>
    </a-card>
    <detail-file ref="detailFile"></detail-file>
  </div>
</template>

<script>
  import STable from '@/components/table/'
  import ATextarea from "ant-design-vue/es/input/TextArea"
  import AInput from "ant-design-vue/es/input/Input"
  import moment from "moment"
  import axios from 'axios';
  import {httpAction, getAction, postAction, getRoleList, getUserList, getServiceList} from '@/api/manage'
  import pick from 'lodash.pick'
  import ARadioGroup from "ant-design-vue/es/radio/Group";
  import DetailFile from "@/views/mytask/taskList/detailFile";

  export default {
    name: "CollapseListOrNot",
    inject: ['reload'],
    components: {
      DetailFile,
      ARadioGroup,
      AInput,
      ATextarea,
      STable,
    },
    data() {
      return {
        description: '这是公共查询列表页面',
        iisFontSize: '16px',
        visibleCreateModal: false,
        visible: false,
        index: 0,
        collapse: 0,
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
        advanced: false,
        // 查询参数
        queryParam: {
          function_id: '',
          i_is_state: '',
          selType: 1,
          s_create_name: '',
          d_create_time: '',
          orderFlag: '',    //排序字段
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
        paginations: {
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
        },
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        toggleSearchStatus: false,
      }
    },
    created: async function () {
      await this.init();
    },
    destroyed() {
      this.dataDestroy();
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
      //清除当前页和
      clearCurPageIndex(){
        this.paginations.current = 1 ;
      },
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
      // changFunId(index) {
      //
      //   index = index - 1;
      //
      //   this.resetPgConditionList();
      //   getAction(this.url.getConditionByFunId, {functionId: this.selectList[index].iid}).then((res) => {
      //     this.conditionList = res;
      //     this.queryParam = Object.assign({}, this.setConditionList);
      //     for (let i = 0; i < this.conditionList.length; i++) {
      //       this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
      //     }
      //     this.queryParam.function_id = this.selectList[index].iid;
      //     this.resetConditionList = Object.assign({}, this.queryParam);
      //     this.paginations.current = 1;
      //     this.columns = [];
      //     this.columnes = [];
      //     this.dataSource = [];
      //     this.dataSources = [];
      //     this.collapseListOrNot();
      //   });
      // },
      changFunId: async function (index) {

        index = index - 1;

        this.resetPgConditionList();
        await getAction(this.url.getConditionByFunId, {functionId: this.selectList[index].iid}).then((res) => {
          this.conditionList = res;
          this.queryParam = Object.assign({}, this.setConditionList);
          for (let i = 0; i < this.conditionList.length; i++) {
            this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
          }
          this.queryParam.function_id = this.selectList[index].iid;
          this.resetConditionList = Object.assign({}, this.queryParam);
          this.paginations.current = 1;
          this.columns = [];
          this.columnes = [];
          this.dataSource = [];
          this.dataSources = [];
          this.collapseListOrNot();
        });
      },
      // init() {
      //   let path = this.$route.path;
      //   let paths = path.split('/')
      //   let str = paths[paths.length - 1]
      //   this.getModelIdByUrl(str);
      // },
      init: async function () {
        let path = this.$route.path;
        let paths = path.split('/')
        let str = paths[paths.length - 1]
        await this.getModelIdByUrl(str);
      },
      clearData() {
        this.conditionList = [];
        this.selectList = [];
        this.columns = [];
        this.columnes = [];
        this.dataSource = [];
        this.dataSources = [];
      },
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

      // handleEdit(record) {
      //   this.mdl = Object.assign({}, record);
      //   console.log(this.mdl);
      //   this.visible = true;
      // },
      // handleOk() {
      //
      // },

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
      // handleTableChange(page) {
      //
      //   this.paginations.current = page.current;
      //   this.paginations.pageSize = page.pageSize;
      //   this.collapseListOrNot();
      //
      // },
      handleTableChange: async function (page) {

        this.paginations.current = page.current;
        this.paginations.pageSize = page.pageSize;
        await this.collapseListOrNot();

      },
      // getModelIdByUrl(str) {
      //   //let url = "/papertitle/docNumSet/busModelList";
      //   getAction(this.url.getModelIdByUrl, {str: str}).then((res) => {
      //     this.modelId = res;
      //     this.getPgConditionList();
      //
      //     //this.getPgSearchList();
      //   });
      // },
      getModelIdByUrl: async function (str) {
        //let url = "/papertitle/docNumSet/busModelList";
        await getAction(this.url.getModelIdByUrl, {str: str}).then((res) => {
          this.modelId = res;
          this.getPgConditionList();

          //this.getPgSearchList();
        });
      },
      // getPgConditionList() {
      //   let url = "/oaBus/oaBusdata/queryFunSelByModelId";
      //   this.clearData();
      //   postAction(url, {modelId: this.modelId, function_id: this.queryParam.function_id}).then((res) => {
      //     this.conditionList = res.colList;
      //     this.selectList = res.funList;
      //     this.tableName = res.tableName;
      //     this.timeList = res.d_create_time;
      //     this.queryParam.function_id = this.selectList[this.index].iid;
      //     this.setConditionList = Object.assign({}, this.queryParam);
      //     for (let i = 0; i < this.conditionList.length; i++) {
      //       this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
      //     }
      //     this.resetConditionList = Object.assign({}, this.queryParam);
      //
      //     // console.log('----------------------------------------------------------');
      //     // console.log(this.queryParam);
      //
      //     this.collapseListOrNot();
      //   });
      // },
      getPgConditionList: async function () {
        let url = "/oaBus/oaBusdata/queryFunSelByModelId";
        this.clearData();
        await postAction(url, {modelId: this.modelId, function_id: this.queryParam.function_id}).then((res) => {
          this.conditionList = res.colList;
          this.selectList = res.funList;
          this.tableName = res.tableName;
          this.timeList = res.d_create_time;
          this.queryParam.function_id = this.selectList[this.index].iid;
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
      // getPgFirstList() {
      //   this.columns = [];
      //   this.dataSource = [];
      //   this.chooseSearch();
      //   let url = "/modify/fields/queryTaskList";
      //   postAction(url, {modelId: this.modelId, function_id: this.queryParam.function_id}).then((res) => {
      //
      //     this.columns.push({
      //       dataIndex: res.result[0].taskKey,
      //     });
      //
      //     for (let i = 0; i < res.result.length; i++) {
      //       this.taskKey.push(res.result[i].taskKey);
      //       this.dataSource.push({
      //         key: i,
      //         [this.taskKey[0]]: res.result[i].taskName,
      //       });
      //     }
      //     // console.log('-----------------------<><><><><><><><><><><><><>--------------------------');
      //     // console.log(this.taskKey);
      //     // console.log('------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------');
      //     // console.log(this.dataSource);
      //   });
      //   this.setFontSize();
      // },
      getPgFirstList: async function () {
        this.columns = [];
        this.dataSource = [];
        this.chooseSearch();
        let url = "/modify/fields/queryTaskList";
        await postAction(url, {modelId: this.modelId, function_id: this.queryParam.function_id}).then((res) => {

          this.columns.push({
            dataIndex: res.result[0].taskKey,
          });

          for (let i = 0; i < res.result.length; i++) {
            this.taskKey.push(res.result[i].taskKey);
            this.dataSource.push({
              key: i,
              [this.taskKey[0]]: res.result[i].taskName,
            });
          }
          // console.log('-----------------------<><><><><><><><><><><><><>--------------------------');
          // console.log(this.taskKey);
          // console.log('------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>---------------');
          // console.log(this.dataSource);
        });
        this.setFontSize();
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
        let url = "/modify/fields/queryByModelIdNoPage";
        postAction(url, {
          modelId: this.modelId,
          condition: this.queryParam,
          taskName: this.taskKey[this.taskNames]
        }).then((res) => {

          this.searchColumns = JSON.parse(res.message);

          this.columnes.push(
            {
              title: '序号',
              dataIndex: '',
              key: 'rowIndex',
              align: "center",
              customRender: function (t, r, index) {
                return parseInt(index) + 1;
              }
            })

          for (let i = 1; i < this.searchColumns.length; i++) {
            this.columnes.push({
              title: this.searchColumns[i].s_column_name,
              dataIndex: this.searchColumns[i].s_table_column,
              align: "center",
            });
          }

          this.dataSources = res.result.dataList;

          // console.log('-------------++++++++++++++++++++++++++++++---------------');
          // console.log(this.dataSources);

        });
        this.setFontSize();
      },
      getPgSearchList() {

        this.chooseSearch();
        let url = "/oaBus/oaBusdata/queryByModelId";
        // this.queryParam.function_id = this.queryParam.function_id.toString();
        // this.queryParam.i_is_state = this.queryParam.i_is_state.toString();
        // this.queryParam.s_create_name = this.queryParam.s_create_name.toString();
        // this.queryParam.d_create_time = this.queryParam.d_create_time.toString();

        postAction(url, {
          modelId: this.modelId,
          pageNo: this.paginations.current,
          pageSize: this.paginations.pageSize,
          condition: this.queryParam
        }).then((res) => {
          this.columns = [];
          this.dataSource = [];
          this.searchColumns = JSON.parse(res.message);
          this.searchList = res.result;
          this.paginations.current = this.searchList.current;
          this.paginations.pageSize = this.searchList.size;
          this.paginations.total = this.searchList.total;

          this.dataSource = this.searchList.records;


          // console.log('-------------++++++++++++++++++++++++++++++---------------');
          // console.log(res);

          this.columns.push(
            {
              title: '序号',
              dataIndex: '',
              key: 'rowIndex',
              align: "center",
              customRender: function (t, r, index) {
                return parseInt(index) + 1;
              }
            })

          for (let i = 0; i < this.searchColumns.length; i++) {
            if (this.searchColumns[i].s_table_column != 'i_id') {
              if (this.searchColumns[i].s_table_column == 'i_is_state') {
                this.columns.push({
                  title: this.searchColumns[i].s_column_name,
                  dataIndex: this.searchColumns[i].s_table_column,
                  align: "center",
                  customRender: (text) => {
                    if (text == true) {
                      return '已办结'
                    } else if (text == false) {
                      return '未办结'
                    } else {
                      return text
                    }
                  },
                  sorter: (a, b, type) => {
                    if (type == 'descend') {
                      this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' desc'
                    } else {
                      this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' asc'
                    }
                    //a.s_title.length - b.s_title.length ;
                  },
                });
              } else if (this.searchColumns[i].s_table_column == 's_title') {
                this.columns.push({
                  title: this.searchColumns[i].s_column_name,
                  dataIndex: this.searchColumns[i].s_table_column,
                  width: 600 ,
                  align: "left",
                  sorter: (a, b, type) => {
                    if (type == 'descend') {
                      this.queryParam.orderFlag = 's_title desc'
                    } else {
                      this.queryParam.orderFlag = 's_title asc'
                    }
                    //a.s_title.length - b.s_title.length ;
                  },
                });
              }else if (this.searchColumns[i].s_table_column.search(/d/i) == 0) {
                this.columns.push({
                  title: this.searchColumns[i].s_column_name,
                  dataIndex: this.searchColumns[i].s_table_column,
                  align: "center",
                  customRender: (text) => {
                    return this.formatterTime(text,"yyyy-MM-dd hh:mm:ss")
                    /*if (text == true) {
                      return '已办结'
                    } else if (text == false) {
                      return '未办结'
                    } else {
                      return text
                    }*/
                  },
                  sorter: (a, b, type) => {
                    if (type == 'descend') {
                      this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' desc'
                    } else {
                      this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' asc'
                    }
                    //a.s_title.length - b.s_title.length ;
                  },
                });
              }
              else {
                this.columns.push({
                  title: this.searchColumns[i].s_column_name,
                  dataIndex: this.searchColumns[i].s_table_column,
                  align: "center",
                  sorter: (a, b, type) => {
                    if (type == 'descend') {
                      this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' desc'
                    } else {
                      this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' asc'
                    }
                    //a.s_title.length - b.s_title.length ;
                  },
                });
              }
            }
          }
        });
        this.setFontSize();
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
      //对日期的处理，后端经过json序列化将日期转换为数字（时间戳），这里将时间戳在转换为日期，前提是这个字段的
      //的类型一定要以d或者D开头，例如d_create_time
      formatterTime(time, fmt) {
        if (!time) {
          return '';
        }
        if (typeof (time) == "object" || typeof (time) == "OBJECT") {
          var z = {
            M: time.getMonth() + 1,
            d: time.getDate(),
            h: time.getHours(),
            m: time.getMinutes(),
            s: time.getSeconds()
          };
          fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
          });
          return fmt.replace(/(y+)/g, function (v) {
            return time.getFullYear().toString().slice(-v.length);
          });
        } else if (typeof (time) == "number") {
          var TIME = new Date(time);
          var z = {
            M: TIME.getMonth() + 1,
            d: TIME.getDate(),
            h: TIME.getHours(),
            m: TIME.getMinutes(),
            s: TIME.getSeconds()
          };
          fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2);
          });
          return fmt.replace(/(y+)/g, function (v) {
            return TIME.getFullYear().toString().slice(-v.length);
          });
        } else return time;
      },

      onClick(record, index) {
        return {
          on: {
            click: (event) => {


              window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + this.tableName + '&busdataId=' + record.i_id + '&navisshow=false')

              //查询---业务数据--流程信息
              // let params = {tableName: this.tableName, busdataId: record.i_id};

              //在队列中追加数据时  预先判断  是否已经有该条数据   有则不再添加
              // console.log(this.$store.state.postDetialLists);
              // this.$store.commit('pushNewDetial',params)
              // this.$router.replace({path:'/mytask/taskList/Test-detailFile',query:params})
              // let postDetialLists = JSON.parse(JSON.stringify(this.$store.state.postDetialLists));
              // if(postDetialLists.length!='0'){
              //     postDetialLists.map((item,index)=>{
              //       if( item.tableName== this.tableName&&item.busdataId== record.i_id){
              //         alert('不能重复添加')
              //         return false;
              //       }else{
              //         this.$store.commit('pushNewDetial',params)
              //         this.$router.push({path:'/mytask/taskList/Test-detailFile'})
              //
              //         console.log(params)
              //       }
              //     })
              // }else{
              //   this.$store.commit('pushNewDetial',params)
              //   this.$router.push({path:'/mytask/taskList/Test-detailFile'})
              //
              //   console.log(params)
              // }
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
        this.columns = [];
        this.columnes = [];
        this.dataSource = [];
        this.dataSources = [];
      },
      resetPgConditionList() {
        this.queryParam = Object.assign({}, this.resetConditionList);
        console.log(this.$refs.inputs);
        if (this.$refs.inputs != undefined) {
          for (let i = 0; i < this.$refs.inputs.length; i++) {
            this.$refs.inputs[i].stateValue = '';
          }
        }
        this.queryParam.orderFlag = '';
      },
      // collapseListOrNot() {
      //
      //   const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
      //   getAction('/testt/sysUserSet/queryByUserId', {userId: userid}).then((res) => {
      //     this.iisFold = res.result.iisFold;
      //   })
      //
      //   getAction('/modify/fields/getProcDefKey', {functionId: '113'}).then((res) => {
      //     this.collapse = res.result;
      //     if (this.iisFold == 1 && this.collapse == 1) {
      //       this.getPgFirstList();
      //     } else {
      //       this.getPgSearchList();
      //     }
      //   })
      // }
      collapseListOrNot: async function () {

        const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
        await getAction('/testt/sysUserSet/queryByUserId', {userId: userid}).then((res) => {
          this.iisFold = res.result.iisFold;
        })

        await getAction('/modify/fields/getProcDefKey', {functionId: '113'}).then((res) => {
          this.collapse = res.result;
          if (this.iisFold == 1 && this.collapse == 1) {
            this.getPgFirstList();
          } else {
            this.getPgSearchList();
          }
        })
      }
    },
    watch: {

      '$route.path': {
        handler: async function (newPath, oldPath) {
          //this.init();
          let path = newPath;
          let paths = path.split('/')
          let str = paths[paths.length - 1]
          await this.getModelIdByUrl(str);
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