<template>
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
            <a-col :md="6" :sm="8">
              <a-form-item label="按钮组合名称">
                <a-input placeholder="请输入按钮组合名称" v-model="queryParam.sButtonSetName"></a-input>
              </a-form-item>
            </a-col>
          <!--</template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">-->
                <!--{{ toggleSearchStatus ? '收起' : '展开' }}-->
                <!--<a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--</a>-->
            </span>
          </a-col>

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
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text, record">
               <a @click="handleCat(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleCopy(record)">复制配置</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit1(record)">按钮维护</a>
          <a-divider type="vertical"/>
          <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">-->
            <!--<a>删除</a>-->
           <!--</a-popconfirm>-->
           <a @click="beforeConfirm(record.iid)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <oaProcButton-modal ref="modalForm" @ok="modalFormOk"></oaProcButton-modal>
    <oaProcButtonCat-modal ref="catModalForm" @ok="modalFormOk"></oaProcButtonCat-modal>
    <oaProcButtonAdd-modal ref="addModalForm" @ok="modalFormOk"></oaProcButtonAdd-modal>
    <oaProcButtonCopy-modal ref="copyModalForm" @ok="modalFormOk"></oaProcButtonCopy-modal>
  </a-card>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import OaProcButtonAddModal from './modules/OaProcButtonAddModal'
  import OaProcButtonModal from './modules/OaProcButtonModal'
  import OaProcButtonCatModal from './modules/OaProcButtonCatModal'
  import OaProcButtonCopyModal from  './modules/OaProcButtonCopyModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "OaProcButtonList",
    mixins: [JeecgListMixin],
    components: {
      OaProcButtonModal,
      OaProcButtonCatModal,
      OaProcButtonAddModal,
      OaProcButtonCopyModal
    },
    data() {
      return {
        description: '发布类按钮管理管理页面',
        iisFontSize: '16px',
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
          /*  {
                 title: '流程定义KEY',
                 align:"center",
                 dataIndex: 'procDefKey'
                },*/
          {
            title: '按钮组合名称',
            align: "center",
            width:800,
            dataIndex: 'sbuttonSetName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
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
      this.setFontSize();
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
          document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
        })
      },
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
      handleCat: function (record) {
        //console.log(record.iid)
        this.$refs.catModalForm.add(record);
        this.$refs.catModalForm.loadData();
        this.$refs.catModalForm.title = "查看";
        this.$refs.catModalForm.disableSubmit = false;

      },
      handleAdd:function () {
        this.$refs.addModalForm.add();
        this.$refs.addModalForm.title = "新增";
        this.$refs.addModalForm.disableSubmit = false;


      },
      handleEdit1:function (record) {
        this.$refs.modalForm.edit(record);
        this.$refs.modalForm.loadData();
        this.$refs.modalForm.title = "按钮维护";
        this.$refs.modalForm.disableSubmit = false;
      }
      ,
      handleCopy:function (record) {
        this.$refs.copyModalForm.copy(record);
        this.$refs.copyModalForm.title = "复制配置";
        this.$refs.copyModalForm.disableSubmit = false;
      }
    }
  }
</script>
<style scoped>
</style>