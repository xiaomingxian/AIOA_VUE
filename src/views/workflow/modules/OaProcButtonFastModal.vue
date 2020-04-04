<template>
  <a-modal :visible="showFunPer" :width="1200" @ok="handleOk" @cancel="handleCancle">
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
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
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
        ref="table"
        size="middle"
        bordered
        rowKey="iid"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
               <a @click="handleCat(record)">按钮配置</a>
          <a-divider type="vertical"/>
          <a @click="handleCopy(record)">复制配置</a>
          <a-divider type="vertical"/>
          <a @click="handleEditNewName(record)">修改名称</a>
          <a-divider type="vertical"/>
          <!--<a @click="handleEdit1(record)">编辑</a>-->
          <!--<a-divider type="vertical"/>-->
          <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">-->
            <!--<a>删除</a>-->
           <!--</a-popconfirm>-->
           <a @click="beforeConfirm(record.iid)">删除</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!--<oaProcButton-modal ref="modalForm" @ok="modalFormOkProc(this.procDefKey)"></oaProcButton-modal>-->
  <!--<oa-proc-button-new-modal ref="modalForm" @ok="modalFormOkProc(this.procDefKey)"></oa-proc-button-new-modal>-->

    <oa-proc-button-cat-modal ref="catModalForm" @ok="modalFormOk()"></oa-proc-button-cat-modal>
    <oaProcButtonAdd-modal ref="addModalForm" @ok="modalFormOk()"></oaProcButtonAdd-modal>
    <oaProcButtonCopy-modal ref="copyModalForm" @ok="modalFormOk()"></oaProcButtonCopy-modal>
</a-card>
  </a-modal>
</template>

<script>
  import OaProcButtonAddModal from './proc/OaProcButtonAddModal'
  // import OaProcButtonModal from './proc/OaProcButtonModal'
  import OaProcButtonNewModal from './proc/OaProcButtonNewModal'
  import OaProcButtonCatModal from './proc/OaProcButtonCatModal'
  import OaProcButtonCopyModal from  './proc/OaProcButtonCopyModal'

  import {getAction,putAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "OaProcButtonFastModal",
    mixins: [JeecgListMixin],
    components: {
      // OaProcButtonModal,
      OaProcButtonNewModal,
      OaProcButtonCatModal,
      OaProcButtonAddModal,
      OaProcButtonCopyModal
    },
    data() {
      return {
        description: '发布类按钮管理管理页面',
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
          {
            title: '序号',
            align: "center",
            dataIndex: 'iid'
          },
           {
                 title: '流程定义KEY',
                 align:"center",
                 dataIndex: 'procDefKey'
           },
          {
            title: '按钮组合名称',
            align: "center",
            width: "45%",
            dataIndex: 'sbuttonSetName'
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
        params:{},
        dataSource:[],
        TaskLinkId:'',//流程定义id- 任务环节
        url: {
          // listByKey: "/oaprocbutton/oaProcButton/list",
          list: "/oaprocbutton/oaProcButton/list",
          delete: "/oaprocbutton/oaProcButton/delete",
          deleteBatch: "/oaprocbutton/oaProcButton/deleteBatch",
          exportXlsUrl: "oaprocbutton/oaProcButton/exportXls",
          importExcelUrl: "oaprocbutton/oaProcButton/importExcel",
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
    // beforeUpdate(){
    //   params={procDefKey:this.procDefKey};
    // },
    // update(){
    //   params={procDefKey:this.procDefKey};
    // },
    methods: {
      //点击删除按钮 前校验
      beforeConfirm(iid){
        // console.log(this.btnSetModel)
        if (iid==null){
          this.$message.warning("当前信息不存在");
        }else {
          let url='oaprocbutton/oaProcButton/verButtonSetDelete';
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
          title:'您的某些业务已经使用了这套按钮!!!',
          content:'删除将影响业务办理,你确定还要删除吗?',
          onOk(){
            that.handleDelete(iid);
          },
          onCancel(){
          }
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
        //console.log(record.iid)
        this.$refs.catModalForm.add(record,this.TaskLinkId,this.procDefKey);
        this.$refs.catModalForm.loadData();
        this.$refs.catModalForm.title = "按钮配置";
        this.$refs.catModalForm.disableSubmit = false;

      },
      handleAdd:function () {
        this.$refs.addModalForm.add(this.procDefKey);
        this.$refs.addModalForm.title = "新增";
        this.$refs.addModalForm.disableSubmit = false;

      },
      handleEditNewName:function (record) {
        this.$refs.addModalForm.edit(record);
        this.$refs.addModalForm.title = "修改名称";
        this.$refs.addModalForm.disableSubmit = false;
      },
      // handleEdit1:function (record) {
      //   this.$refs.modalForm.edit(record,this.TaskLinkId);
      //   this.$refs.modalForm.loadData(record.iid)
      //   this.$refs.modalForm.title = "编辑";
      //   this.$refs.modalForm.disableSubmit = false;
      // }
      // handleEdit1:function (record) {
      //   this.$refs.modalForm.edit(record,this.TaskLinkId);
      //   this.$refs.modalForm.loadData(record.iid)
      //   this.$refs.modalForm.title = "新编辑";
      //   this.$refs.modalForm.disableSubmit = false;
      // },
      handleCopy:function (record) {
        this.$refs.copyModalForm.copy(record);
        // this.$refs.copyModalForm.loadData(record.iid)
        this.$refs.copyModalForm.title = "复制配置";
        this.$refs.copyModalForm.disableSubmit = false;
      },
      //根据流程定义KEY 和 id查询数据
      show1(iid,procDefKey){
        this.TaskLinkId=iid;//流程定义Id eg:receiveFile:1:4
        this.showFunPer = true;
        this.procDefKey=procDefKey;
        getAction(this.url.list,{procDefKey:procDefKey,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res)=>{
          console.log("====================================");
          console.log(res);
          this.data=res.result;
          this.dataSource=res.result.records;
          this.ipagination.total = res.result.total;
        })
      },
      handleTableChange(page) {
        this.ipagination.current = page.current;
        this.ipagination.pageSize = page.pageSize;
        this.loadData();
      },
      loadData(){
        getAction(this.url.list, {procDefKey: this.procDefKey,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      clearData(){
        this.dataSource= [];
        this.ipagination.current =1;
      },
      modalFormOkProc(procDefKey){
        this.loading = true;
        // console.log("66666666666666666666666666");
        getAction(this.url.list, {procDefKey:procDefKey,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res) => {
          // console.log("5555555555555555555555555555");
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if(res.code===510){
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      }
    }
  }
</script>
<style scoped>
</style>