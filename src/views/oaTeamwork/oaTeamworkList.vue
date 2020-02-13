<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="协同业务">
              <a-input placeholder="请输入协同业务" v-model="queryParam.sTeamworkName"></a-input>
            </a-form-item>
          </a-col>
       <!-- <a-col :md="6" :sm="8">
            <a-form-item label="描述">
              <a-input placeholder="请输入描述" v-model="queryParam.description"></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('个人协同办公业务配置分类')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
          <a @click="handleConfig(record)">配置业务</a>
          <a-divider type="vertical" />
         <a @click="handleDelete11(record.iid)">删除</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visibleDel"
      @ok="comfirmDelOrBatchDel"
      @cancel="handleCancel"
    >
      <p>请确认是否要删除该条数据</p>
    </a-modal>
    <!-- 表单区域 -->
    <oaTeamwork-modal ref="modalForm" @ok="modalFormOk"></oaTeamwork-modal>
    <oa-teamwork-set-list ref="teamworkSetList" @ok="modalFormOk" ></oa-teamwork-set-list>
  </a-card>
</template>

<script>
  import oaTeamworkModal from './modules/oaTeamworkModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import  oaTeamworkSetList from './oaTeamworkSetList'
  import {httpAction, getAction, postAction, getRoleList, getUserList, getServiceList,deleteAction} from '@/api/manage'
  export default {
    name: "oaTeamworkList",
    mixins:[JeecgListMixin],
    components: {
      oaTeamworkModal,
      oaTeamworkSetList,

    },
    data () {
      return {
        description: '个人协同办公业务配置分类管理页面',
        // 表头
        columns: [

		      {
            title: '协同业务名称',
            align:"center",
            dataIndex: 'steamworkName'
           },
          {
            title: '描述',
            align:"left",
            dataIndex: 'description'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/oateamwork/oaTeamwork/list",
          delete: "/oateamwork/oaTeamwork/delete",
          deleteBatch: "/oateamwork/oaTeamwork/deleteBatch",
          exportXlsUrl: "oateamwork/oaTeamwork/exportXls",
          importExcelUrl: "oateamwork/oaTeamwork/importExcel",
       },
        keysObjs:[],
        ids:'',

        visibleDel:false,
        selectedRowKeys:[],
        selectionRows: [],
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      // 多选事件
      onSelectChange(selectedRowKeys,keysObjs){
        console.log(selectedRowKeys)
        console.log(keysObjs)
        let ids = []
        for(let i=0;i<keysObjs.length;i++){
           ids.push(keysObjs[i].iid)
        }
        console.log(ids.toString())
        this.keysObjs = keysObjs;
        this.ids=ids.toString()
        this.selectedRowKeys = selectedRowKeys
      },
      handleConfig: function (record) {
        this.$refs.teamworkSetList.open(record);
        this.$refs.teamworkSetList.title = "查看";

      },
      showOpen(){
        // alert(111)
        getAction(this.url.list).then((res) => {
          this.dataSource = res.result.records;
          this.ipagination.total =  res.result.total;
        })
      } ,
      //---------删除功能---------------------------
      handleDelete11(iid) {
        this.visibleDel = true;
        this.iid = iid; //   单元删除id

      },
      comfirmDelOrBatchDel(){
        deleteAction(this.url.delete,{id:this.iid }).then((res) => {
          if(res.success){
            this.showOpen()
          }else{
            this.$message.warning(res.message);
          }
        });

        this.visibleDel = false;

      },
      handleCancel(){
        this.visibleDel = false;
      },
      //单项删除
      handleDelete(e,n){
        console.log(e);
        console.log(n);
        deleteAction(this.url.delete, {id: e}).then((res) => {
          if (res.success) {
            this.$message.success(res.message);

          } else {
            this.$message.warning(res.message);
          }
        });
      },
      // 批量删除操作
      batchDel(){

        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk:(()=>{

            deleteAction(this.url.deleteBatch, {ids:this.ids }).then((res) => {
              if (res.success) {
                this.$message.success(res.message);
                this.showOpen();

                this.selectedRowKeys = []
              } else {
                this.$message.warning(res.message);
                this.selectedRowKeys = []

              }
            });
          })
        });
      },
    }
  }
</script>
<style scoped>
</style>