<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">


    <a-table
      ref="table"
      size="middle"
      bordered
      :columns="columns"
      :dataSource="dataSource1"
      :pagination="ipagination"
      @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a-input v-decorator="[ text, {}]"> </a-input>

        </span>
    </a-table>
  </a-modal>
</template>

<script>
  import {httpAction, getAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "BusTableColumn",
    mixins: [JeecgListMixin],
    data() {
      return {
        description: '表中的列名管理页面',
        confirmLoading:false ,
        visible: false,
        // 表头
        columns: [
          /*{
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },*/
          {
            title: '列的名字',
            align: "center",
            dataIndex: 'colName'
          },
          {
            title: '列的注释',
            align: "center",
            dataIndex: 'colCom',
            scopedSlots: {customRender: 'action'},
          },
          {
            title: '列的注释',
            align: "center",
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
          },
          {
            title: '列的注释',
            align: "center",
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
          },
          {
            title: '列的注释',
            align: "center",
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
          }
        ],
        title:'选择数据项',
        dataSource1: [],
        url: {
          list: "/oaBus/oaBusdata/getPageDataForm",
          delete: "/oaBus/tableCol/delete",
          deleteBatch: "/oaBus/tableCol/deleteBatch",
          exportXlsUrl: "oaBus/tableCol/exportXls",
          importExcelUrl: "oaBus/tableCol/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      show(iPageId, modelId) {
        console.log(iPageId);
        let url = "/oaBus/oaBusdata/getPageDataForm";
        getAction(url, {iPageId: iPageId, modelId: modelId}).then((res) => {
          console.log(res);
          this.dataSource1 = res.result.records;
        })
        this.visible = true;
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      handleOk () {
        this.close();
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>