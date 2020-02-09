<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="ok"
    @cancel="handleCancel"
    destroyOnClose
    okText="撤回"
    cancelText="取消">


    <a-layout id="components-layout-demo-top-side-2">
      <a-layout>
        <a-layout style="padding: 2px 2px 2px">
          <a-layout-content
            :style="{ background: '#fff', padding: '10px', margin: 0, minHeight: '280px' }">
            <a-table
              ref="table"
              size="middle"
              bordered
              rowKey="taskKey"
              :columns="columns"
              :dataSource="dataSource"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}">

            </a-table>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>


  </a-modal>
</template>


<script>
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import nextUsers from './nextUsers'
  import {getAction, postAction} from '@/api/manage'


  export default {
    name: "reCallModal",
    mixins: [JeecgListMixin],
    components: {
      nextUsers
    },
    data() {
      return {
        title: '撤回',
        taskMsg: '',
        visible: false,
        confirmLoading: false,
        columns: [
          {
            title: '节点',
            align: "center",
            dataIndex: 'taskName'
          }
        ],
        url: {
          reCallTask: '/wf/task/reCallTask',
        }

      }
    },
    created() {
    },
    methods: {
      show() {
        this.visible = true
      },
      ok() {
        if (this.selectionRows.length <= 0) {
          this.$message.error("请选择撤回节点")
          return
        }
        let taskId = this.taskMsg.id
        let reCallTaskKey = this.selectedRowKeys[0]
        let param = {
          taskId: taskId,
          reCallTaskKey: reCallTaskKey
        }

        getAction(this.url.reCallTask, param).then(res => {
          if (res.succes) {
            this.$message.success(res.message)
            this.handleCancel()
          } else {
            this.$message.error(res.message)
          }
        })


      },
      cancel() {

      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.dataInit()
      },
      dataInit() {
        this.selectionRows = []
        this.selectedRowKeys = []
      }
    }
  }
</script>