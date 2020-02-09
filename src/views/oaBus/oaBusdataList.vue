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
              <a-form-item label="业务功能id">
                <a-input placeholder="请输入业务功能id" v-model="queryParam.iBusFunctionId"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="流程实例id">
                <a-input placeholder="请输入流程实例id" v-model="queryParam.procInstId"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="主送单位名称">
                <a-input placeholder="请输入主送单位名称" v-model="queryParam.sMainUnitNames"></a-input>
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
      <a-button type="primary" icon="download" @click="handleExportXls('业务数据表')">导出</a-button>
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
        rowKey="id"
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
    <oaBusdata-modal ref="modalForm" @ok="modalFormOk"></oaBusdata-modal>
  </a-card>
</template>

<script>
  import oaBusdataModal from './modules/oaBusdataModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "oaBusdataList",
    mixins: [JeecgListMixin],
    components: {
      oaBusdataModal
    },
    data() {
      return {
        description: '业务数据表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '主键id',
            align: "center",
            dataIndex: 'iId'
          },
          {
            title: '业务模块id',
            align: "center",
            dataIndex: 'iBusModelId'
          },
          {
            title: '业务功能id',
            align: "center",
            dataIndex: 'iBusFunctionId'
          },
          {
            title: '流程实例id',
            align: "center",
            dataIndex: 'procInstId'
          },
          {
            title: '主送单位名称',
            align: "center",
            dataIndex: 'sMainUnitNames'
          },
          {
            title: '抄送单位名称',
            align: "center",
            dataIndex: 'sCcUnitNames'
          },
          {
            title: '内部发送部门',
            align: "center",
            dataIndex: 'sInsideDeptnames'
          },
          {
            title: '抄报单位名称',
            align: "center",
            dataIndex: 'sReportNuitNames'
          },
          {
            title: '会签部门',
            align: "center",
            dataIndex: 'sCrcDeptnames'
          },
          {
            title: '标题',
            align: "center",
            dataIndex: 'sTitle'
          },
          {
            title: '左侧参数（页面头部）',
            align: "center",
            dataIndex: 'sLeftParameter'
          },
          {
            title: '是否插入机构',
            align: "center",
            dataIndex: 'sUnitName'
          },
          {
            title: '是否插入部门',
            align: "center",
            dataIndex: 'sDeptName'
          },
          {
            title: '插入参数（修改文头）（页面头部）',
            align: "center",
            dataIndex: 'sMiddleParameter'
          },
          {
            title: '右侧参数（页面头部）',
            align: "center",
            dataIndex: 'sRightParameter'
          },
          {
            title: '来文字号',
            align: "center",
            dataIndex: 'sReceiveNum'
          },
          {
            title: '文件字号',
            align: "center",
            dataIndex: 'sFileNum'
          },
          {
            title: '是否发布',
            align: "center",
            dataIndex: 'iIsRelease'
          },
          {
            title: '是否办结',
            align: "center",
            dataIndex: 'iIsState'
          },
          {
            title: '是否封发日期',
            align: "center",
            dataIndex: 'iIsSealdate'
          },
          {
            title: '是否排版',
            align: "center",
            dataIndex: 'iIsTypeset'
          },
          {
            title: '是否保存办文单',
            align: "center",
            dataIndex: 'iIsApprove'
          },
          {
            title: '是否归档',
            align: "center",
            dataIndex: 'iIsArchives'
          },
          {
            title: '是否已送全文检索',
            align: "center",
            dataIndex: 'iIsEs'
          },
          {
            title: '是否送公文传输',
            align: "center",
            dataIndex: 'iIsSend'
          },
          {
            title: '是否为临时文件',
            align: "center",
            dataIndex: 'iIsDisplay'
          },
          {
            title: '备注',
            align: "center",
            dataIndex: 'sRemarks'
          },
          {
            title: '创建时间-年',
            align: "center",
            dataIndex: 'iCreateYear'
          },
          {
            title: '创建时间-月',
            align: "center",
            dataIndex: 'iCreateMonth'
          },
          {
            title: '创建时间-日期',
            align: "center",
            dataIndex: 'iCreateDay'
          },
          {
            title: '创建者姓名',
            align: "center",
            dataIndex: 'sCreateName'
          },
          {
            title: '创建者id',
            align: "center",
            dataIndex: 'sCreateBy'
          },
          {
            title: '创建部门名称',
            align: "center",
            dataIndex: 'sCreateDept'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'dCreateTime'
          },
          {
            title: '修改时间',
            align: "center",
            dataIndex: 'dUpdateTime'
          },
          /*{
            title: 'iBigint1',
            align: "center",
            dataIndex: 'iBigint1'
          },
          {
            title: 'iBigint2',
            align: "center",
            dataIndex: 'iBigint2'
          },
          {
            title: 'iBigint3',
            align: "center",
            dataIndex: 'iBigint3'
          },
          {
            title: 'iBigint4',
            align: "center",
            dataIndex: 'iBigint4'
          },
          {
            title: 'dDatetime1',
            align: "center",
            dataIndex: 'dDatetime1'
          },
          {
            title: 'dDatetime2',
            align: "center",
            dataIndex: 'dDatetime2'
          },
          {
            title: 'dDatetime3',
            align: "center",
            dataIndex: 'dDatetime3'
          },
          {
            title: 'dDatetime4',
            align: "center",
            dataIndex: 'dDatetime4'
          },
          {
            title: 'dDatetime5',
            align: "center",
            dataIndex: 'dDatetime5'
          },
          {
            title: 'dDatetime6',
            align: "center",
            dataIndex: 'dDatetime6'
          },
          {
            title: 'sVarchar1',
            align: "center",
            dataIndex: 'sVarchar1'
          },
          {
            title: 'sVarchar2',
            align: "center",
            dataIndex: 'sVarchar2'
          },
          {
            title: 'sVarchar3',
            align: "center",
            dataIndex: 'sVarchar3'
          },
          {
            title: 'sVarchar4',
            align: "center",
            dataIndex: 'sVarchar4'
          },
          {
            title: 'sVarchar5',
            align: "center",
            dataIndex: 'sVarchar5'
          },
          {
            title: 'sVarchar6',
            align: "center",
            dataIndex: 'sVarchar6'
          },
          {
            title: 'sVarchar7',
            align: "center",
            dataIndex: 'sVarchar7'
          },
          {
            title: 'sVarchar8',
            align: "center",
            dataIndex: 'sVarchar8'
          },
          {
            title: 'sVarchar9',
            align: "center",
            dataIndex: 'sVarchar9'
          },
          {
            title: 'sVarchar10',
            align: "center",
            dataIndex: 'sVarchar10'
          },
          {
            title: 'sVarchar11',
            align: "center",
            dataIndex: 'sVarchar11'
          },
          {
            title: 'sVarchar12',
            align: "center",
            dataIndex: 'sVarchar12'
          },
          {
            title: 'sVarchar13',
            align: "center",
            dataIndex: 'sVarchar13'
          },
          {
            title: 'sVarchar14',
            align: "center",
            dataIndex: 'sVarchar14'
          },
          {
            title: 'sVarchar15',
            align: "center",
            dataIndex: 'sVarchar15'
          },
          {
            title: 'sVarchar16',
            align: "center",
            dataIndex: 'sVarchar16'
          },
          {
            title: 'sVarchar17',
            align: "center",
            dataIndex: 'sVarchar17'
          },
          {
            title: 'sVarchar18',
            align: "center",
            dataIndex: 'sVarchar18'
          },
          {
            title: 'sVarchar19',
            align: "center",
            dataIndex: 'sVarchar19'
          },
          {
            title: 'sVarchar20',
            align: "center",
            dataIndex: 'sVarchar20'
          },
          {
            title: '是否',
            align: "center",
            dataIndex: 'iIs1'
          },
          {
            title: '是否',
            align: "center",
            dataIndex: 'iIs2'
          },
          {
            title: '是否',
            align: "center",
            dataIndex: 'iIs3'
          },
          {
            title: '是否',
            align: "center",
            dataIndex: 'iIs4'
          },*/
          {
            title: '是否',
            align: "center",
            dataIndex: 'iIs5'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/oaBus/oaBusdata/list",
          delete: "/oaBus/oaBusdata/delete",
          deleteBatch: "/oaBus/oaBusdata/deleteBatch",
          exportXlsUrl: "oaBus/oaBusdata/exportXls",
          importExcelUrl: "oaBus/oaBusdata/importExcel",
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