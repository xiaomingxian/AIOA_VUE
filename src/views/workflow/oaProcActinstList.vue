<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleCancel"
    @cancel="handleCancel"
    cancelText="关闭">
    <!--<div style="height: 500px;overflow: auto">-->
      <!--&lt;!&ndash;定义含义页面，保存所有列&ndash;&gt;-->
      <!--<div style="width: 95%">-->
    <template slot="footer">
      <a-button type="primary" @click.stop="handleCancel">关闭</a-button>
      <!--      <a-button type="primary" @click.stop="confrimUpLoad()">确定</a-button>-->
    </template>
    <a-card :bordered="false" v-if="visible">
      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
        <a-button @click="handleAddMy" type="primary" icon="plus">新增</a-button>
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
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange"
          :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
        >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEditMy(record)">编辑</a>

          <a-divider type="vertical"/>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
                  <a>删除</a>
                </a-popconfirm>
          <!--<a-dropdown>-->
          <!--<a class="ant-dropdown-link">更多 <a-icon type="down"/></a>-->
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
      <oaProcActinst-modal ref="modalForm" @ok="modalFormOk"></oaProcActinst-modal>
    </a-card>
      <!--</div>-->
    <!--</div>-->
  </a-modal>
</template>

<script>
  import oaProcActinstModal from './modules/oaProcActinstModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction, httpAction} from '@/api/manage'


  export default {
    name: "oaProcActinstList",
    mixins: [JeecgListMixin],
    components: {
      oaProcActinstModal
    },
    data() {
      return {
        description: '流程节点配置管理页面',
        visible: false,
        // 表头
        columns: [
          // {
          //   title: '关键字',
          //   align: "center",
          //   dataIndex: 'procDefKey'
          // },
          // {
          //   title: '流程定义的活动节点ID',
          //   align: "center",
          //   dataIndex: 'actId'
          // },
          {
            title: '环节名称',
            align: "center",
            dataIndex: 'actName'
          },
          // {
          //   title: '节点类型',
          //   align: "center",
          //   dataIndex: 'actType'
          // },
          {
            title: '审批角色',
            align: "center",
            dataIndex: 'candidates'
          },
          {
            title: '多实例环节',
            align: "center",
            dataIndex: 'multAssignee',
            customRender: function (value) {
              if (!value) {
                return "否";
              } else {
                return '是';
              }
            },
          },
          {
            title: '查询范围',
            align: "center",
            dataIndex: 'roleScope',
            customRender: function (value) {
              switch (value) {
                case 'drafter' :
                  return '拟稿人'
                case 'drafter_dept' :
                  return '拟稿人所在部门'
                case 'current_org' :
                  return '当前用户所在机构'
                case 'all_dept' :
                  return '所有部门'
                case 'current_dept' :
                  return '当前用户所在部门'
                case 'main_dept' :
                  return '主办部门'
              }
            },
          },
          {
            title: '用户或部门',
            align: "center",
            dataIndex: 'userOrRole',
            customRender: function (value) {
              if ('user' == value) {
                return "用户";
              } else {
                return '部门';
              }
            }
          },
          // {
          //   title: '是否填写完意见就完成任务',
          //   align: "center",
          //   dataIndex: 'completeTask',
          //   customRender: function (value) {
          //     if (!value) {
          //       return "否";
          //     } else {
          //       return '是';
          //     }
          //   }
          // },
          // {
          //   title: '记录当前用户',
          //   align: "center",
          //   dataIndex: 'recordCurrentuser',
          //   customRender: function (value) {
          //     if (!value) {
          //       return "否";
          //     } else {
          //       return '是';
          //     }
          //   }
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          listBase: "/workflow/oaProcActinst/list",
          list: "/workflow/oaProcActinst/list",
          delete: "/workflow/oaProcActinst/delete",
          deleteBatch: "/workflow/oaProcActinst/deleteBatch",
          exportXlsUrl: "workflow/oaProcActinst/exportXls",
          importExcelUrl: "workflow/oaProcActinst/importExcel",
        },
        confirmLoading: false,
        record: null,

      }
    }
    ,
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    }
    ,
    created() {

    },
    methods: {
      show(record) {
        this.url.list = this.url.listBase + "?procDefKey=" + record.key
        getAction(this.url.list).then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            this.record = record
            this.ipagination.total = res.result.total;
            this.visible = true
          } else {
            this.$message.error(res.message)
          }
        })
      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
      },
      handleAddMy() {
        this.$refs.modalForm.title = '新增'
        this.$refs.modalForm.handleAddMy(this.record)
      },
      handleEditMy(recoder) {
        this.$refs.modalForm.title = '编辑'
        this.$refs.modalForm.handleEditMy(recoder)
      }

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>