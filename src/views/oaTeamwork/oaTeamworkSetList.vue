<template>
  <a-modal :visible="showFunPer" :width="900" @ok="handleOk" @cancel="handleCancle">
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="add" type="primary" icon="plus">新增</a-button>
     <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
  <!--  <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="iid"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
          <a-divider type="vertical"/>
           <a @click="handleDelete(record.iid)" title="确定删除吗?">删除</a>
        </span>

      </a-table>
    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visibleDel"
      @ok="comfirmDelOrBatchDel"
      @cancel="handleCancel"
    >
      <p>请确认是否要删除该条数据</p>
    </a-modal>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <oaTeamworkSet-modal ref="modalForm"  @submit="getissubmit($event)" @ok="modalFormOk"></oaTeamworkSet-modal>
  </a-card>
  </a-modal>
</template>

<script>
  import oaTeamworkSetModal from './modules/oaTeamworkSetModal'
  import oaTeamworkSetCatModal from './modules/CollaborativePreviewModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {httpAction, getAction, postAction, deleteAction,getRoleList, getUserList, getServiceList} from '@/api/manage'

  export default {
    name: "oaTeamworkSetList",
    mixins:[JeecgListMixin],
    components: {
      oaTeamworkSetModal,
      oaTeamworkSetCatModal
    },
    data () {
      return {
        iteamworkId:'',
        steamworkName:'',
        iversion:'',
        visibleDel:false,
        loading:false,
        showFunPer: false,
        description: '个人协同办公业务配置明细管理页面',
        // 表头
        columns: [
		/*   {
            title: '流程按钮关联ID',
            align:"center",
            dataIndex: 'iteamworkId'
           },*/
		   {
            title: '顺序号',
            align:"center",
            width: 60,
            dataIndex: 'iorder'
           },

          {
            title: '业务分类',
            align:"center",
            dataIndex: 'busModelName'
          },
          {
            title: '业务功能',
            align:"center",
            dataIndex: 'busFunctionName'
          },

          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width: 100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        ipagination:{
          total:'',
          current:''
        },
		url: {
          list: "/oateamwork/oaTeamworkSet/list",
          delete: "/oateamwork/oaTeamworkSet/delete",
          deleteBatch: "/oateamwork/oaTeamworkSet/deleteBatch",
          exportXlsUrl: "oateamwork/oaTeamworkSet/exportXls",
          importExcelUrl: "oateamwork/oaTeamworkSet/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      handleTableChange(q,w,e,){
        console.log(q.current);
        this.ipagination.current = q.current;
        getAction(this.url.list, {pageNo:q.current, iTeamworkId:this.iteamworkId}).then((res) => {
          this.dataSource = res.result.records;
          this.ipagination.total =  res.result.total;
           this.loading = false;
        })
      },
      open (record) {
        this.iteamworkId = record.iid
        this.steamworkName = record.steamworkName
        this.iversion = record.iversion;
        this.showFunPer = true;
        this.loading = true;
        getAction(this.url.list, {iTeamworkId:this.iteamworkId}).then((res) => {
          this.dataSource = res.result.records;
          this.ipagination.total =  res.result.total;
          this.loading = false;
        })
      },
      //----------------确定子组件已经提交，若提交则刷新表格-------------------
      getissubmit(issubmit){
        console.log(issubmit)
        console.log(this.iteamworkId);
        this.loading = true;
        getAction(this.url.list, {iTeamworkId:this.iteamworkId}).then((res) => {
          this.dataSource = res.result.records;
          this.loading = false;
          this.ipagination.total =  res.result.total;
        })
      },

      // 批量删除  获取id  组
      onSelectChange(selectedRowKeys){
        this.selectedRowKeys = selectedRowKeys
        this.iid = selectedRowKeys.toString()
      },
      //批量删除操作
      batchDel(){
        this.visibleDel = true;
      },
      //确认删除模态框
      comfirmDelOrBatchDel(){
        this.loading = true;
        if(this.iid.length>1){
          deleteAction(this.url.deleteBatch, {ids: this.selectedRowKeys.toString()}).then((res) => {
            if(res.success){
              this.getissubmit();
              this.visibleDel = false;
              this.loading = false;
            }

          })
        }else{
          deleteAction(this.url.delete,{id:this.iid}).then((res) => {
            console.log(res.success);
            //--------------删除成功后   刷新列表-----------------
            if(res.success){
              this.getissubmit();
              this.visibleDel = false;
              this.loading = false;
            }

          })
        }


      },
      //确定删除的取消按钮
      handleCancel(){
        this.visibleDel = false;
      },
      //---------删除功能---------------------------
      handleDelete(iid) {
        this.visibleDel = true;
        this.iid = iid; //   单元删除id
      },
      add() {
        this.$refs.modalForm.add1(this.iteamworkId,this.steamworkName,this.iversion);
      },
      edit(record) {
        console.log(record)
        console.log(typeof(record.iorder)  );
        this.$refs.modalForm.edit1(record);
      },
      handleOk() {
        this.showFunPer = false;
      },
      handleCancle() {
        this.showFunPer = false;
      },
    }
  }
</script>
<style scoped>

</style>