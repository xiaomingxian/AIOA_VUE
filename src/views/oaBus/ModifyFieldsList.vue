<style>

</style>

<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">

        <a-row :gutter="48">
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a @click="toggleAdvanced" style="margin-left: 1259px">
                {{ advanced ? '隐藏' : '显示' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24" style="margin:0 0 -7px 120px;">
              <a-form-item label="业务分类">
                <a-select v-model="iBMId"
                          @change="getFunctionList">
                  <a-select-option v-for="(item,index) in modelList" :key="index" :value="item.iid">{{item.sname}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" style="margin:0 0 -7px 120px;">
              <a-form-item label="业务功能">
                <a-select v-model="queryParam.function_id" @change="getFunctionListId">
                  <a-select-option v-for="(item,index) in selectList" :key="index" :value="item.iid">{{item.sname}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="24" style="margin:0 0 -7px 120px;">-->
            <!--<a-form-item label="公文状态">-->
            <!--<a-select v-model="queryParam.i_is_state">-->
            <!--&lt;!&ndash;<a-select-option  v-for="(item,index) in selectList" :key="index" :value="item.i_id">{{item.s_name}}</a-select-option>&ndash;&gt;-->
            <!--<a-select-option value="1">已办结</a-select-option>-->
            <!--<a-select-option value="0">未办结</a-select-option>-->
            <!--</a-select>-->
            <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :md="8" :sm="24" style="margin:0 0 -7px 120px;padding-right:0;">-->
            <!--<a-form-item label="申请人">-->
            <!--<a-radio-group @change="chooseSearch" v-model="queryParam.selType">-->
            <!--<a-radio :value="0">由我创建</a-radio>-->
            <!--<a-radio :value="1">-->
            <!--全部数据-->
            <!--<a-input v-if="queryParam.selType === 1" v-model="queryParam.s_create_name" style="width: 143px;margin-left: 10px"/>-->
            <!--</a-radio>-->
            <!--</a-radio-group>-->
            <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :md="8" :sm="24" style="margin:0 0 -7px 120px;">-->
              <!--<a-form-item label="申请年份">-->
                <!--<a-select v-model="queryParam.d_create_time">-->
                  <!--<a-select-option  v-for="(item,index) in timeList" :key="index" :value="item">{{item}}</a-select-option>-->
                <!--</a-select>-->
              <!--</a-form-item>-->
            <!--</a-col>-->


            <a-col v-for="(atom,index) in conditionList" :key="index" :value="atom.s_table_column" :md="8" :sm="24"
                   style="margin:0 0 -7px 120px;">
              <a-form-item :label="atom.s_column_name">
                <!--<a-select v-if="atom.s_table_column=='s_file_num'" @change="changeSelect($event,atom.s_table_column)" placeholder="请选择">-->
                <!--<a-select-option v-for="(item,index) in selectList" :key="item.i_id" :value="item.i_id">{{item.s_name}}</a-select-option>-->
                <!--</a-select>-->
                <a-input v-if="atom.s_table_column=='s_file_num'" @input="changeInput($event,atom.s_table_column)" placeholder="请输入"/>
                <a-input v-if="atom.s_table_column=='s_title'" @input="changeInput($event,atom.s_table_column)" placeholder="请输入"/>
                <a-input v-if="atom.s_table_column=='s_main_unit_names'" @input="changeInput($event,atom.s_table_column)" placeholder="请输入"/>
              </a-form-item>
            </a-col>


            <a-col :md="!advanced && 8 || 24" :sm="24" style="text-align: center;">
            <span class="table-page-search-submitButtons" :style="advanced && { overflow: 'hidden' } || {} ">
               <a-button type="primary" icon="search" @click="getPgSearchList">查询</a-button>
            </span>
            </a-col>
          </template>
        </a-row>


        <a-table
          ref="table"
          size="default"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          :showAlertInfo="false"
          bordered
          :rowKey="record => record.id"
          :customRow="onClick"
          @change="handleTableChange"
          :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="editModify(record)">编辑数据</a>
          <!--<a-divider type="vertical" />-->
            <br/>
            <a @click="replaceFile(record)">替换文件</a>
          </span>
        </a-table>

        <modify-fields-model ref="modalForm" @ok="modalFormOk"></modify-fields-model>
        <modify-replace-file-modal ref="modalFormFile" @ok="modalFormOk"></modify-replace-file-modal>
      </a-form>
    </div>

    <!--业务页面-->
    <!--<send-file ref="cutFile"></send-file>-->

  </a-card>
</template>

<script>
  import ModifyFieldsModel from './modules/ModifyFieldsModal'
  import ModifyReplaceFileModal from './modules/ModifyReplaceFileModal'
  import STable from '@/components/table/'
  import ATextarea from "ant-design-vue/es/input/TextArea"
  import AInput from "ant-design-vue/es/input/Input"
  import moment from "moment"
  import axios from 'axios';
  import {httpAction, getAction, postAction, getRoleList, getUserList, getServiceList} from '@/api/manage'
  import pick from 'lodash.pick'
  //业务页面
  import cutFile from '../mytask/taskList/sendFile'
  import ARadioGroup from "ant-design-vue/es/radio/Group";

  export default {
    name: "ModifyFieldsList",
    components: {
      ModifyFieldsModel,
      ModifyReplaceFileModal,
      ARadioGroup,
      AInput,
      ATextarea,
      STable,
      //业务
      cutFile
    },
    data() {
      return {
        description: '这是运维工具查询列表页面',
        iisFontSize: '16px',
        visibleCreateModal: false,
        visible: false,
        getPageList: [],
        conditionList: [],
        modelList: [],
        selectList: [],
        timeList:[],
        iBMId: '',
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
        isClick:false,
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
            return range[0] + "/" + range[1] + "共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
        },
        loading: false,
        // 加载数据方法 必须为 Promise 对象
        // loadData: parameter => {
        //   return getServiceList(Object.assign(parameter, this.queryParam))
        //     .then(res => {
        //       return res.result;
        //       console.log('----------------------------------------------------------');
        //       console.log(res.result);
        //     })
        // },
        selectedRowKeys: [],
        selectedRows: [],
        tableName:'',
        toggleSearchStatus: false,
      }
    },
    created() {
      console.log("9999999999999999999999")
//      this.getPgSearchList(1);
      this.getBusModelSelectList();//业务分类列表
      // this.getPgList();
      this.setFontSize();
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
          document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
        })
      },
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.getPgSearchList();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.current = this.pagination.current;
        param.pageSize = this.pagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        let str = "id,";
        for (let i = 0; i < this.columns.length; i++) {
          str += "," + this.columns[i].dataIndex;
        }
        return str;
      },
      editModify(record) {
        this.$refs.modalForm.edit(record,this.searchColumns,this.tableName);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      replaceFile(record) {
        this.$refs.modalFormFile.edit(record,this.tableName);
        this.$refs.modalFormFile.title = "文件替换";
        this.$refs.modalFormFile.disableSubmit = false;
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

        console.log(this.$refs.table)
      },
      toggleAdvanced() {
        this.advanced = !this.advanced
      },

      resetSearchForm() {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      getBusModelSelectList(){
        let url = "/oaBus/busModel/findList";
        getAction(url, {}).then((res) => {
          console.log('--------------------模块-下拉列表------------------------------');
          console.log(res);
          this.modelList=res.result;
          this.iBMId=this.modelList[0].iid;
          this.getFunctionList(this.iBMId);
        });
      },
      getFunctionList(modelId){
        console.log(modelId);
        let url = "/oaBus/oaBusdata/queryFunSelByModelId";
        postAction(url, {modelId: modelId.toString(), function_id: ""}).then((res) => {
          // this.conditionList = res.colList;
          console.log('--------------------业务-下拉列表------------------------------');
          console.log(res);
          this.selectList = res.funList;
          this.timeList = res.d_create_time;
          this.queryParam.function_id = this.selectList[0].iid;
          this.getPgSearchList(modelId);

          // for (let i = 0; i < this.conditionList.length; i++) {
          //   this.queryParam = Object.assign({}, this.queryParam, {[this.conditionList[i].s_table_column]: ""});
          // }
        });

      },
      getFunctionListId(funcation){
      this.queryParam.function_id=funcation;
      },
      handleTableChange(page) {
//        console.log(page);
        this.pagination.current = page.current;
        this.pagination.pageSize = page.pageSize;
        this.getPgSearchList(this.iBMId);
      },
      getPgSearchList(iBMId) {
        console.log("0-0-0-0000000000000000000000000");
        console.log(this.queryParam.function_id);
        this.columns = [];
        if (iBMId!=null && iBMId>0){
          this.iBMId = iBMId;
        }

        if(this.isClick==false){
          this.isClick=true;
          // let url = "oaBus/oaBusdata/queryByModelId";
          let url = "modify/fields/queryOaBusdataList";
          // this.queryParam.function_id = this.queryParam.function_id.toString();
          // this.queryParam.i_is_state = this.queryParam.i_is_state.toString();
          // this.queryParam.s_create_name = this.queryParam.s_create_name.toString();
          // this.queryParam.d_create_time = this.queryParam.d_create_time.toString();
          postAction(url, {modelId:  this.iBMId, pageNo:this.pagination.current,pageSize:this.pagination.pageSize,map: this.queryParam}).then((res) => {
          console.log("000000000000000运维-数据列表000000000000000");
//          console.log(res);
            this.isClick=false;
            // JSON.parse(res.message);----------------表头列表-----------
            this.searchColumns = res.result.colList
            this.searchList = res.result.dataList;
            this.tableName=res.result.tableName;
            //当前页码
            this.pagination.current = this.searchList.current;
            this.pagination.pageSize = this.searchList.size;
            this.pagination.total = this.searchList.total;


            this.dataSource = this.searchList.records;
            this.columns.push({
              title: '顺序号',
              // dataIndex: 'mm',
              align: "center",
              customRender: (text,row,index) => {
                return index+1;
              }
            });

            for (let i = 1; i < this.searchColumns.length; i++) {
              // this.columns.push({
              //   title: this.searchColumns[i].s_column_name,
              //   dataIndex: this.searchColumns[i].s_table_column,
              //   align: "center",
              //
              // });
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
                }else{
                  this.columns.push({
                    title: this.searchColumns[i].s_column_name,
                    dataIndex: this.searchColumns[i].s_table_column,
                    align: "center",
                  });
                }

              }

              // for (let j = 0; j < this.dataSource.length; j++) {
              //   if (this.dataSource[j][this.searchColumns[i].s_table_column] == true) {
              //     this.dataSource[j][this.searchColumns[i].s_table_column] = '已办结';
              //   } else if (this.dataSource[j][this.searchColumns[i].s_table_column] == false) {
              //     this.dataSource[j][this.searchColumns[i].s_table_column] = '未办结';
              //   }
              //   if (this.dataSource[j][this.searchColumns[i].s_table_column] == 1) {
              //     this.dataSource[j][this.searchColumns[i].s_table_column] = '是';
              //   } else if (this.dataSource[j][this.searchColumns[i].s_table_column] == 0) {
              //     this.dataSource[j][this.searchColumns[i].s_table_column] = '否';
              //   }
              // }
            }

            this.columns.push({
              title: '操作',
              dataIndex: 'action',
              align: "center",
              width:"150px",
              scopedSlots: {customRender: 'action'},
            });
          });
        }else {

        }



      },
      changeInput(event, obj) {
        this.queryParam[obj] = event.currentTarget.value;
      },
      changeSelect(event, obj) {
        // this.queryParam[obj] = event.toString();
      },
      onClick(record, index) {
        return {
          on: {
            click: () => {
              this.$refs.cutFile.show(record)


            }

          }
        }
      },
      chooseSearch(e){
      }

    },
    watch: {
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