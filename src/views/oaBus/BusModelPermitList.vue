<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="主键id">
              <a-input placeholder="请输入主键id" v-model="queryParam.iId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="业务模块id">
              <a-input placeholder="请输入业务模块id" v-model="queryParam.iBusModelId"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="范围类型:0.所有人;1.角色;2.部门;3.人员;">
              <a-input placeholder="请输入范围类型:0.所有人;1.角色;2.部门;3.人员;" v-model="queryParam.sPermitType"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="类型对应id">
              <a-input placeholder="请输入类型对应id" v-model="queryParam.iTypeId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="是否可见:0.不可见;1.可见;">
              <a-input placeholder="请输入是否可见:0.不可见;1.可见;" v-model="queryParam.sDisplay"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('业务模板')">导出</a-button>
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
        rowKey="iid"
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
    <busModelPermit-modal ref="modalForm" @ok="modalFormOk"></busModelPermit-modal>
  </a-card>
</template>

<script>
  import BusModelPermitModal from './modules/BusModelPermitModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "BusModelPermitList",
    mixins:[JeecgListMixin],
    components: {
      BusModelPermitModal
    },
    data () {
      return {
        description: '业务模板管理页面',
        // 表头
        columns: [
		   {
            title: '主键id',
            align:"center",
            dataIndex: 'iid'
           },
		   {
            title: '业务模块id',
            align:"center",
            dataIndex: 'ibusModelId'
           },
		   {
            title: '范围类型',
            align:"center",
            dataIndex: 'spermitType',
            customRender: function (text) {
           if (text == 1) {
             return "角色";
           } else if (text == 2) {
             return "部门";
           } else if (text == 3) {
             return "人员";
           } else if(text==0){
             return "所有人";
           }else {
             return text;
           }
         }
           },
		   {
            title: '类型对应id',
            align:"center",
            dataIndex: 'itypeId'
           },
		   {
            title: '是否可见',
            align:"center",
            dataIndex: 'sdisplay',
           customRender: function (text) {
           if (text == '1') {
             return "是";
           } else if (text == "0") {
             return "否";
           } else {
             return text;
           }
         }
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/oaBus/busModelPermit/list",
          delete: "/oaBus/busModelPermit/delete",
          deleteBatch: "/oaBus/busModelPermit/deleteBatch",
          exportXlsUrl: "oaBus/busModelPermit/exportXls",
          importExcelUrl: "oaBus/busModelPermit/importExcel",
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