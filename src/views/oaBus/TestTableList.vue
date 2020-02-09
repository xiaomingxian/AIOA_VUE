<style>

.input{
  background-color: #f0f5fc;
}

.ant-select-selection--single{
  background-color: #f0f5fc !important;
}

.ant-table-thead > tr > th{
  color: #fff;
  background-color: #006db9;
  border: none !important;
}

.ant-table-tbody > tr:hover{
  cursor: pointer;
}

.light-row{
  background-color: #fff;
}

.dark-row{
  /*background:linear-gradient(to bottom,rgb(221,221,255),rgb(167,196,255)) repeat scroll 0% 0%;*/
  background-color: #c2d9f8;
}

.dark-row:hover{
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

.table-page-search-submitButtons .ant-btn{
  background:linear-gradient(180deg,rgba(115,128,255,1),rgba(47,86,255,1)) repeat scroll 0% 0%;
}

.table-page-search-submitButtons .ant-btn svg{
  fill:cyan;
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
                <a-col :md="7" :sm="24" style="margin-top:7px;">
                  <a-form-item label="状态">
                    <a-select v-model="queryParam.i_is_state">
                      <a-select-option value="1">已办结</a-select-option>
                      <a-select-option value="0">未办结</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="7" :sm="24" style="margin-top: 7px;">
                  <a-form-item label="拟稿人">
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
                  <a-form-item label="年份">
                    <a-select v-model="queryParam.d_create_time">
                      <a-select-option v-for="(item,index) in timeList" :key="index" :value="item">{{item}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>


                <a-col v-for="(atom,index) in conditionList" :key="index" :value="atom.s_table_column" :md="7" :sm="24" style="margin-top:7px;">
                  <a-form-item :label="atom.s_column_name">
                    <!--<a-select v-if="atom.s_table_column=='s_file_num'" @change="changeSelect($event,atom.s_table_column)" placeholder="请选择">-->
                    <!--<a-select-option v-for="(item,index) in selectList" :key="item.i_id" :value="item.i_id">{{item.s_name}}</a-select-option>-->
                    <!--</a-select>-->

                    <a-input class="input" ref="inputs" @input="changeInput($event,atom.s_table_column)" placeholder="请输入"/>
                  </a-form-item>
                </a-col>


                <a-col :md="!advanced && 7 || 24" :sm="24" style="text-align: center;padding-right:172px;">
            <span class="table-page-search-submitButtons" :style="advanced && { overflow: 'hidden' } || {} ">
              <a-button type="primary" icon="search" @click="getPgSearchList">查询</a-button>
              <a-button type="primary" icon="reload" @click="resetPgConditionList" style="margin-left:27px;">重置</a-button>
            </span>
                </a-col>

              </template>
            </a-row>

          </a-form>

          <a-table
            ref="table"
            size="middle"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
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
    name: "TestTableList",
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
        visibleCreateModal: false,
        visible: false,
        getPageList: [],
        conditionList: [],
        resetConditionList: {},
        setConditionList:{},
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
        dataSource: [],
        pagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['5', '10', '15', '20', '25', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + "共" +  total + "条"
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
    created() {
      this.init();
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
      changFunId(index) {
        index = index - 1 ;
        this.resetPgConditionList();
        getAction(this.url.getConditionByFunId, {functionId: this.selectList[index].iid}).then((res) => {
          this.conditionList = res;
          this.queryParam = Object.assign({}, this.setConditionList);
          for (let i = 0; i < this.conditionList.length; i++) {
            this.queryParam = Object.assign({},this.queryParam,{[this.conditionList[i].s_table_column]: ""});
          }
          this.queryParam.function_id = this.selectList[index].iid;
          this.resetConditionList = Object.assign({},this.queryParam);
          this.pagination.current = 1;
          this.getPgSearchList();
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
        this.columns = [];
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
        this.getPgSearchList();
      },
      getModelIdByUrl(str) {
        //let url = "/papertitle/docNumSet/busModelList";
        getAction(this.url.getModelIdByUrl, {str: str}).then((res) => {
          this.modelId = res;
          this.getPgConditionList();

          // console.log('----------------------------------------------------------');
          // console.log(this.modelId);

          //this.getPgSearchList();
          //alert(this.modelId)
        });
      },
      getPgConditionList() {
        let url = "/oaBus/oaBusdata/queryFunSelByModelId";
        postAction(url, {modelId: this.modelId, function_id: ""}).then((res) => {
          this.clearData();
          this.conditionList = res.colList;
          this.selectList = res.funList;
          this.tableName = res.tableName;
          this.timeList = res.d_create_time;
          this.queryParam.function_id = this.selectList[0].iid;
          this.setConditionList = Object.assign({},this.queryParam);
          for (let i = 0; i < this.conditionList.length; i++) {
            this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
          }
          this.resetConditionList = Object.assign({},this.queryParam);
          this.getPgSearchList();
        });
      },
      getPgSearchList() {
        this.columns = [];
        this.dataSource = [];
        this.chooseSearch();
        let url = "/oaBus/oaBusdata/queryByModelId";
        // this.queryParam.function_id = this.queryParam.function_id.toString();
        // this.queryParam.i_is_state = this.queryParam.i_is_state.toString();
        // this.queryParam.s_create_name = this.queryParam.s_create_name.toString();
        // this.queryParam.d_create_time = this.queryParam.d_create_time.toString();

        postAction(url, {modelId: this.modelId, pageNo: this.pagination.current, pageSize: this.pagination.pageSize, condition: this.queryParam}).then((res) => {
          this.searchColumns = JSON.parse(res.message);
          this.searchList = res.result;
          this.pagination.current = this.searchList.current;
          this.pagination.pageSize = this.searchList.size;
          this.pagination.total = this.searchList.total;

          this.dataSource = this.searchList.records;
          this.columns.push(
            {
              title: '序号',
              dataIndex: '',
              key: 'rowIndex',
              width: 120,
              align: "center",
              customRender: function (t, r, index) {
                return parseInt(index) + 1;
              }
            }
          )
          for (let i = 0; i < this.searchColumns.length; i++) {
            if (this.searchColumns[i].s_table_column != 'i_id') {
              if(this.searchColumns[i].s_table_column =='i_is_state'){
                this.columns.push({
                  title: this.searchColumns[i].s_column_name,
                  dataIndex: this.searchColumns[i].s_table_column,
                  align: "center",
                  customRender: (text) => {
                    if(text == true){
                      return '已办结'
                    }else if(text == false){
                      return '未办结'
                    }else{
                      return text
                    }
                  }
                });
              }else if(this.searchColumns[i].s_table_column =='s_title'){
                this.columns.push({
                  title: this.searchColumns[i].s_column_name,
                  dataIndex: this.searchColumns[i].s_table_column,
                  align: "left",
                });
              }
              else{
                this.columns.push({
                  title: this.searchColumns[i].s_column_name,
                  dataIndex: this.searchColumns[i].s_table_column,
                  align: "center",
                });
              }

            }
          }
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
              let params = {tableName: this.tableName, busdataId: record.i_id};
              //this.$refs.detailFile.show(param)

              // this.$router.push({path:'/mytask/taskList/Test-detailFile',query:params})
              // let params = {tableName:res.result.tableName,busdataId:res.result.busdataId};


              this.$store.commit('pushNewDetial',params)
              this.$router.push({path:'/mytask/taskList/Test-detailFile',query:params})

            }
          }
        }
      },
      chooseSearch() {
        if(this.queryParam.selType == 0){
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
        this.dataSource = [];
      },
      resetPgConditionList() {
        this.queryParam = Object.assign({},this.resetConditionList);
        for (let i = 0; i < this.$refs.inputs.length; i++) {
          this.$refs.inputs[i].stateValue = '';
        }
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