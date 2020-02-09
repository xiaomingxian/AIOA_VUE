<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="主键">
              <a-input placeholder="请输入主键id" v-model="queryParam.iId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="业务页面id">
              <a-input placeholder="请输入业务页面id" v-model="queryParam.iBusPageId"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="业务功能id">
              <a-input placeholder="请输入业务功能id" v-model="queryParam.iBusFunctionId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="业务数据表名">
              <a-input placeholder="请输入业务数据表名" v-model="queryParam.sBusdataTable"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="业务数据表列名">
              <a-input placeholder="请输入业务数据表列名" v-model="queryParam.sTableColumn"></a-input>
            </a-form-item>
          </a-col>
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('业务页面详情表（实际业务字段含义说明）')">导出</a-button>
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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <busPageDetail-modal ref="modalForm" @ok="modalFormOk"></busPageDetail-modal>
  </a-card>
</template>

<script>
  import BusPageDetailModal from './modules/BusPageDetailModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "BusPageDetailList",
    mixins:[JeecgListMixin],
    components: {
      BusPageDetailModal
    },
    data () {
      return {
        description: '业务页面详情表（实际业务字段含义说明）管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
		   {
            title: '主键id',
            align:"center",
            dataIndex: 'iid'
           },
		   {
            title: '业务页面id',
            align:"center",
            dataIndex: 'ibusPageId'
           },
		   {
            title: '业务功能id',
            align:"center",
            dataIndex: 'ibusFunctionId'
           },
		   {
            title: '业务数据表名',
            align:"center",
            dataIndex: 'sbusdataTable'
           },
		   {
            title: '业务数据表列名',
            align:"center",
            dataIndex: 'stableColumn'
           },
		   {
            title: '页面显示的数据项名',
            align:"center",
            dataIndex: 'scolumnName'
           },
		   {
            title: '是否作为列表标题列',
            align:"center",
            dataIndex: 'iisListtitle'
           },
		   {
            title: '是否作为列表查询条件',
            align:"center",
            dataIndex: 'iisListquery'
           },
		   {
            title: '是否必填校验',
            align:"center",
            dataIndex: 'icheckIsNull'
           },
		   {
            title: 'java校验规则，正则表达式',
            align:"center",
            dataIndex: 'scheckExpjava'
           },
		   {
            title: '数据校验sql',
            align:"center",
            dataIndex: 'scheckExpsql'
           },
		   {
            title: 'js校验规则，正则表达式（从数据字典查）',
            align:"center",
            dataIndex: 'scheckExpjs'
           },
		   {
            title: '校验提示信息',
            align:"center",
            dataIndex: 'scheckShowmsg'
           },
		   {
            title: '对应公文传输字段',
            align:"center",
            dataIndex: 'ssendKey'
           },
		   {
            title: '档案系统对应字段',
            align:"center",
            dataIndex: 'sarchivesKey'
           },
		   {
            title: '是否模板业务原型含义（1是、0否）',
            align:"center",
            dataIndex: 'iisDefault'
           },
		   {
            title: '含义设置方式（1、可修改、0、不可更改）',
            align:"center",
            dataIndex: 'isetType'
           },
		   {
            title: '业务数据列备注',
            align:"center",
            dataIndex: 'scolumnRemarks'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/oaBus/busPageDetail/list",
          delete: "/oaBus/busPageDetail/delete",
          deleteBatch: "/oaBus/busPageDetail/deleteBatch",
          exportXlsUrl: "oaBus/busPageDetail/exportXls",
          importExcelUrl: "oaBus/busPageDetail/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>