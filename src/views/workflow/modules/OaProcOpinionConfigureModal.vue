<template>
  <a-modal :visible="showFunPer" :width="900" @ok="handleOk" @cancel="handleCancle"  cancelText="关闭">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">

            <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="主键id">-->
            <!--<a-input placeholder="请输入主键id" v-model="queryParam.iId"></a-input>-->
            <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="流程定义KEY">-->
            <!--<a-input placeholder="请输入流程定义KEY" v-model="queryParam.procDefKey"></a-input>-->
            <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<template v-if="toggleSearchStatus">-->
            <!--<a-col :md="12" :sm="8">-->
            <!--<a-form-item label="流程按钮配置名称（概要说明此套配置特点）">-->
            <!--<a-input placeholder="请输入流程按钮配置名称" v-model="queryParam.sButtonSetName"></a-input>-->
            <!--</a-form-item>-->
            <!--</a-col>-->
            <!--</template>-->
            <!--<a-col :md="6" :sm="8">-->
            <!--<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
            <!--<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
            <!--<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
            <!--<a @click="handleToggleSearch" style="margin-left: 8px">-->
            <!--{{ toggleSearchStatus ? '收起' : '展开' }}-->
            <!--<a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
            <!--</a>-->
            <!--</span>-->
            <!--</a-col>-->

          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        <!--<a-button type="primary" icon="download" @click="handleExportXls('发布类按钮管理')">导出</a-button>-->
        <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
                  <!--@change="handleImportExcel">-->
          <!--<a-button type="primary" icon="import">导入</a-button>-->
        <!--</a-upload>-->
        <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
          <!--<a-menu slot="overlay">-->
            <!--<a-menu-item key="1" @click="batchDel">-->
              <!--<a-icon type="delete"/>-->
              <!--删除-->
            <!--</a-menu-item>-->
          <!--</a-menu>-->
          <!--<a-button style="margin-left: 8px"> 批量操作-->
            <!--<a-icon type="down"/>-->
          <!--</a-button>-->
        <!--</a-dropdown>-->
      </div>

      <!-- table区域-begin -->
      <div>
        <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
          <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
          <!--selectedRowKeys.length }}</a>项-->
          <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
        <!--</div>-->

        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="iid"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
               <a @click="handleCat(record)">意见配置</a>
          <a-divider type="vertical"/>
          <a @click="handleEditNewName(record)">修改名称</a>
          <a-divider type="vertical"/>
          <!--<a @click="handleEdit1(record)">编辑</a>-->
          <!--<a-divider type="vertical"/>-->
          <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">-->
            <!--<a>删除</a>-->
           <!--</a-popconfirm>-->
          <a @click="beforeConfirm(record.iid)">删除</a>
          <a-divider type="vertical"/>
          <a @click="handleCopy(record)">一键复制</a>
        </span>

        </a-table>
      </div>
      <!-- table区域-end -->

      <!-- 表单区域 -->
      <!--<oa-proc-opinion-new-modal ref="OaProcOpinionNewModal" @ok="modalFormOk"></oa-proc-opinion-new-modal>-->
      <oaProcOpinionCat-modal ref="OaProcOpinionCatModal" @ok="modalFormOk"></oaProcOpinionCat-modal>
      <oaProcOpinionAdd-modal ref="OaProcOpinionAddModal" @ok="modalFormOk"></oaProcOpinionAdd-modal>
      <oaProcOpinionCopy-modal ref="OaProcOpinionCopyModal" @ok="modalFormOk"></oaProcOpinionCopy-modal>
    </a-card>
  </a-modal>
</template>

<script>
  import OaProcOpinionNewModal from './opinion/OaProcOpinionNewModal'
  import OaProcOpinionAddModal from './opinion/OaProcOpinionAddModal'
  import OaProcOpinionCatModal from './opinion/OaProcOpinionCatModal'
  import OaProcOpinionCopyModal from  './opinion/OaProcOpinionCopyModal'

  import {getAction,putAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "OaProcOpinionConfigureModal",
    mixins: [JeecgListMixin],
    components: {
      OaProcOpinionAddModal,
      OaProcOpinionNewModal,
      OaProcOpinionCatModal,
      OaProcOpinionCopyModal
    },
    data() {
      return {
        description: '意见配置管理管理页面',
        // 表头
        columns: [
          /* {
             title: '#',
             dataIndex: '',
             key:'rowIndex',
             width:60,
             align:"center",
             customRender:function (t,r,index) {
               return parseInt(index)+1;
             }
            },*/
          // {
          //   title: '主键id',
          //   align: "center",
          //   dataIndex: 'iid'
          // },
          // {
          //   title: '流程定义KEY',
          //   align:"center",
          //   dataIndex: 'procDefKey'
          // },
          {
            title: '名称',
            align: "left",
            width: "45%",
            dataIndex: 'sprocOpinionName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        showFunPer: false ,
        data:'',
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        procDefKey:'',
        dataSource:[],
        TaskLinkId:'',//流程定义id- 任务环节
        url: {
          opinionConfigureList:"/oaprocopinion/oaProcOpinion/list",  //意见配置
          list: "/oaprocopinion/oaProcOpinion/list",
          delete: "/oaprocopinion/oaProcOpinion/delete",
          deleteBatch: "/oaprocopinion/oaProcOpinion/deleteBatch",
          exportXlsUrl: "oaprocopinion/oaProcOpinion/exportXls",
          importExcelUrl: "oaprocopinion/oaProcOpinion/importExcel"
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){

    },
    methods: {
      //点击删除按钮 前校验
      beforeConfirm(iid){
        // console.log(this.btnSetModel)
        if (iid==null){
          this.$message.warning("当前信息不存在");
        }else {
          let url='/oaprocopinion/oaProcOpinion/verButtonSetDelete';
          getAction(url,{id:iid}).then(res=>{
            if (res.success){
              // this.$message.success(res.message);
              //调用弹框
              this.showConfirm(iid);
            } else {
              this.handleDelete(iid);
            }
          });
        }
      },
      //弹框
      showConfirm(iid){
        let that=this;
        this.$confirm({
          title:'您的某些业务已经使用了这套意见!!!',
          content:'删除将影响业务办理,你确定还要删除吗?',
          onOk(){
            that.handleDelete(iid);
          },
          onCancel(){
          }
        })
      },
      handleTableChange(page) {
        this.ipagination.current = page.current;
        this.ipagination.pageSize = page.pageSize;
        this.loadData();
      },
      loadData() {//请求表格数据
        // getAction(this.url.list, {iProcOpinionId: iid}).then(res => {
        //   this.dataSource = res.result.records;
        // })
        getAction(this.url.opinionConfigureList,{procDefKey:this.procDefKey,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res)=>{
          // console.log("====================================");
          // console.log(res);
          this.data=res.result;
          this.dataSource=res.result.records;
        })
      },
      handleOk(){
        this.clearData();
        this.showFunPer = false ;
      },
      handleCancle (){
        this.clearData();
        // this.close();
        this.showFunPer = false ;
      },
      handleCat: function (record) {
        this.$refs.OaProcOpinionCatModal.add(record,this.TaskLinkId);
//        this.$refs.OaProcOpinionCatModal.loadData();
        this.$refs.OaProcOpinionCatModal.title = "意见配置";
        this.$refs.OaProcOpinionCatModal.disableSubmit = false;

      },
      handleAdd:function () {
        this.$refs.OaProcOpinionAddModal.add(this.procDefKey);
        this.$refs.OaProcOpinionAddModal.title = "新增";
        this.$refs.OaProcOpinionAddModal.disableSubmit = false;

      },
      handleEditNewName:function (record) {
        this.$refs.OaProcOpinionAddModal.edit(record);
        this.$refs.OaProcOpinionAddModal.title = "修改按钮组合名称";
        this.$refs.OaProcOpinionAddModal.disableSubmit = false;

      },
      // handleEdit1:function (record) {
      //   this.$refs.OaProcOpinionNewModal.editlvjian(record,this.TaskLinkId);
      //   // this.$refs.OaProcOpinionNewModal.loadData(record.iid)
      //   this.$refs.OaProcOpinionNewModal.title = "编辑";
      //   this.$refs.OaProcOpinionNewModal.disableSubmit = false;
      // },
      handleCopy:function (record) {
        this.$refs.OaProcOpinionCopyModal.copy(record);
        // this.$refs.OaProcOpinionCopyModal.loadData(record.iid)
        this.$refs.OaProcOpinionCopyModal.title = "复制配置";
        this.$refs.OaProcOpinionCopyModal.disableSubmit = false;
      },
      clearData(){
        this.dataSource= [];
        this.ipagination.current =1;
      },
      //根据流程定义KEY 和 id查询数据
      show1(iid,procDefKey){
        this.TaskLinkId=iid;//流程定义Id eg:receiveFile:1:4
        this.showFunPer = true;
        this.procDefKey=procDefKey;
        getAction(this.url.opinionConfigureList,{procDefKey:procDefKey,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res)=>{
          // console.log("====================================");
          // console.log(res);
          this.data=res.result;
          this.dataSource=res.result.records;
          this.ipagination.total = res.result.total;
        })
      }
    }
  }
</script>
<style scoped>
</style>