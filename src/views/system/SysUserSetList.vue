<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

        <!--  <a-col :md="6" :sm="8">
            <a-form-item label="iId">
              <a-input placeholder="请输入iId" v-model="queryParam.iId"></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :md="6" :sm="8">
            <a-form-item label="用户id">
              <a-input placeholder="请输入用户id" v-model="queryParam.sUserId"></a-input>
            </a-form-item>
          </a-col>
        <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="是否AI阅读">
              <a-input placeholder="请输入是否AI阅读" v-model="queryParam.iIsAi"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="待办工作是否即时消息提醒">
              <a-input placeholder="请输入待办工作是否即时消息提醒" v-model="queryParam.iIsMessages"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="是否折叠展示数据">
              <a-input placeholder="请输入是否折叠展示数据" v-model="queryParam.iIsFold"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('权限设置')">导出</a-button>
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
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
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
    <sysUserSet-modal ref="modalForm" @ok="modalFormOk"></sysUserSet-modal>
  </a-card>
</template>

<script>
  import SysUserSetModal from './modules/SysUserSetModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "SysUserSetList",
    mixins:[JeecgListMixin],
    components: {
      SysUserSetModal
    },
    data () {
      return {
        description: '权限设置管理页面',
        // 表头
        columns: [
		   {
            title: 'iid',
            align:"center",
            dataIndex: 'iid'
           },
		   {
            title: '用户id',
            align:"center",
            dataIndex: 'suserId'
           },
		   {
            title: '是否AI阅读',
            align:"center",
            dataIndex: 'iisAi',
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
            title: '待办工作是否即时消息提醒',
            align:"center",
            dataIndex: 'iisMessages',
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
            title: '是否折叠展示数据',
            align:"center",
            dataIndex: 'iisFold',
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
            title: '是否默认首页风格是日程办公',
            align:"center",
            dataIndex: 'iisCalendar',
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
            title: '首页区域1对应业务模块',
            align:"center",
            dataIndex: 'ibus1Id'
          },
          {
            title: '首页区域2对应业务模块',
            align:"center",
            dataIndex: 'ibus2Id'
          },
          {
            title: '首页区域3对应业务模块',
            align:"center",
            dataIndex: 'ibus3Id'
          }, {
            title: '首页区域4对应业务模块',
            align:"center",
            dataIndex: 'ibus4Id'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/testt/sysUserSet/list",
          delete: "/testt/sysUserSet/delete",
          deleteBatch: "/testt/sysUserSet/deleteBatch",
          exportXlsUrl: "testt/sysUserSet/exportXls",
          importExcelUrl: "testt/sysUserSet/importExcel",
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
</style>