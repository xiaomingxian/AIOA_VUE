<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

        <a-col :md="6" :sm="8">
            <a-form-item label="模板名称">
              <a-input placeholder="" v-model="queryParam.sName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="模板类型">
              <a-select v-model="queryParam.iType">
                <a-select-option :value="1" >上报</a-select-option>
                <a-select-option :value="2" >下发</a-select-option>
                <a-select-option :value="3" >办公单</a-select-option>
                <!--<a-select-option v-for="(item,index) in upData" :key="index" :value="item.iid">{{item.sname}}-->
                <!--</a-select-option>-->
              </a-select>
              <!--<a-input placeholder="" v-model="queryParam.iType"></a-input>-->
            </a-form-item>
          </a-col>
          <!--<template v-if="toggleSearchStatus">-->
          <!--</template>-->
          <a-col :md="6" :sm="8" >
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
<!--      <a-button type="primary" icon="download" @click="handleExportXls('模板管理')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->

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
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
            <a>删除</a>
           </a-popconfirm>
          <!--<a-dropdown>-->
            <!--<a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item>-->
                <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">-->
                  <!--<a>删除</a>-->
                <!--</a-popconfirm>-->
              <!--</a-menu-item>-->
            <!--</a-menu>-->
          <!--</a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <oaTemplate-modal ref="modalForm" @ok="modalFormOk"></oaTemplate-modal>
    <oaTemplateCat-modal ref="catModalForm" @ok="modalFormOk"></oaTemplateCat-modal>
  </a-card>
</template>

<script>
  import OaTemplateModal from './modules/OaTemplateModal'
  import OaTemplateCatModal from './modules/OaTemplateCatModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'

  export default {
    name: "OaTemplateList",
    mixins:[JeecgListMixin],
    components: {
      OaTemplateModal,
      OaTemplateCatModal
    },
    data () {
      return {
        description: '模板管理管理页面',
        iisFontSize: '16px',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
		   {
            title: '模板类型',
            align:"center",
            dataIndex: 'itype',
            customRender:function (id) {
              if (id == "1"){
                return "上报";
              } else if(id == "2"){
                return "下发";
              }else if (id == "3") {
                return "办公单";
              }else {
                return id;
              }
            }
           },
		   {
            title: '模板名称',
            align:"center",
            dataIndex: 'sname'
           },
        {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/papertitle/oaTemplate/list",
          delete: "/papertitle/oaTemplate/delete",
          deleteBatch: "/papertitle/oaTemplate/deleteBatch",
          exportXlsUrl: "papertitle/oaTemplate/exportXls",
          importExcelUrl: "papertitle/oaTemplate/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
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
      handleCat: function (record) {
        this.$refs.catModalForm.add(record);
        this.$refs.catModalForm.title = "查看";
        this.$refs.catModalForm.disableSubmit = false;
      }

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>