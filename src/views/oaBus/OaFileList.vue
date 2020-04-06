<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="附件所属数据id">
              <a-input placeholder="请输入附件所属数据id" v-model="queryParam.iTableId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="附件所属数据所在表">
              <a-input placeholder="请输入附件所属数据所在表" v-model="queryParam.sTable"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

            <a-col :md="6" :sm="8">
              <a-form-item label="附件类型">
                <!--（1 底稿 2 正文 3办文单4 附件 5背景材料 6办文依据）-->
                <a-input placeholder="请输入附件类型" v-model="queryParam.sFileType"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="序号">
                <a-input placeholder="请输入序号" v-model="queryParam.iOrder"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
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
      <a-button type="primary" icon="download" @click="handleExportXls('附件表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
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
    <oaFile-modal ref="modalForm" @ok="modalFormOk"></oaFile-modal>
  </a-card>
</template>

<script>
  import OaFileModal from './modules/OaFileModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "OaFileList",
    mixins: [JeecgListMixin],
    components: {
      OaFileModal
    },
    data() {
      return {
        description: '附件表管理页面',
        // 表头
        columns: [
          /*{
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
            title: '主键id',
            align: "center",
            dataIndex: 'iid'
          },
          {
            title: '附件所属数据所在表',
            align: "center",
            dataIndex: 'stable'
          },
          {
            title: '附件所属数据id',
            align: "center",
            dataIndex: 'itableId'
          },
          {
            title: '附件类型',  //（1 底稿 2 正文 3办文单4 附件 5背景材料 6办文依据）
            align: "center",
            dataIndex: 'sfileType'
          },
          {
            title: '序号',
            align: "center",
            width: 60,
            dataIndex: 'iorder'
          },
          {
            title: '附件名',
            align: "center",
            dataIndex: 'sfileName'
          },
          {
            title: '附件存储路径',
            align: "center",
            dataIndex: 'sfilePath'
          },
          /* {
                title: '创建者',
                align:"center",
                dataIndex: 'screateBy'
               },
               {
                title: '创建时间',
                align:"center",
                dataIndex: 'dCreateTime'
               },
               {
                title: '修改者',
                align:"center",
                dataIndex: 'supdateBy'
               },
               {
                title: '修改时间',
                align:"center",
                dataIndex: 'dupdateTime'
               },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/oaBus/oaFile/list",
          delete: "/oaBus/oaFile/delete",
          deleteBatch: "/oaBus/oaFile/deleteBatch",
          exportXlsUrl: "oaBus/oaFile/exportXls",
          importExcelUrl: "oaBus/oaFile/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {}
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>