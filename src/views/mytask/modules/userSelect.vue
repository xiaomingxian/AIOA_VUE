<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="confirm"
    @cancel="cancel"
    destroyOnClose
    :okText="okText"
    cancelText="取消">


    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :customRow="setRowCheck"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'checkbox'}">
    </a-table>


  </a-modal>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'


  export default {
    name: "userSelect",
    mixins: [JeecgListMixin],
    components: {},
    data() {
      return {
        title: '用户选择',
        okText: '确定',
        dataSource: [],
        visible: false,
        confirmLoading: false,
        columns: [
          {
            title: '用户姓名',
            align: "center",
            dataIndex: 'username'
          },{
            title: '部门',
            align: "center",
            dataIndex: 'departName'
          },
        ]
      }
    },
    methods: {
      setRowCheck(res) {
        return {
          on: {
            click: () => {
              let rowkeys = this.selectedRowKeys;
              let selectionRows = this.selectionRows;
              if (rowkeys.length > 0 && rowkeys.includes(res.id)) {
                rowkeys.splice(rowkeys.indexOf(res.id), 1);
                selectionRows.splice(rowkeys.indexOf(res), 1);
              } else {
                rowkeys.push(res.id);
                selectionRows.push(res);
              }
              this.selectedRowKeys = rowkeys;
              this.selectionRows = selectionRows;
            }
          }
        }
      },
      show() {
        this.visible = true
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      cancel() {
        //初始数据
        this.dataInit()
        this.$emit('close');
        this.visible = false;
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      dataInit() {
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      confirm() {
        this.$emit('func', this.selectionRows)
        this.close()
      }

    }


  }
</script>