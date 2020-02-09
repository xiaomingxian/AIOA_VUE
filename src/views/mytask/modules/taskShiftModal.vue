<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="confirm"
    @cancel="handleCancel"
    destroyOnClose
    :okText="title"
    cancelText="取消">


    <!--<a-layout id="components-layout-demo-top-side-2">-->
      <!--<a-layout>-->
        <!--<a-layout style="padding: 2px 2px 2px">-->
          <!--<a-layout-content-->
            <!--:style="{ background: '#fff', padding: '10px', margin: 0, minHeight: '280px' }">-->

            <!--&lt;!&ndash;<a-form>&ndash;&gt;-->
              <!--&lt;!&ndash;<a-form-item&ndash;&gt;-->
                <!--&lt;!&ndash;:labelCol="labelCol"&ndash;&gt;-->
                <!--&lt;!&ndash;:wrapperCol="wrapperCol"&ndash;&gt;-->
                <!--&lt;!&ndash;label="请选择用户">&ndash;&gt;-->
              <!--&lt;!&ndash;</a-form-item>&ndash;&gt;-->
            <!--&lt;!&ndash;</a-form>&ndash;&gt;-->


          <!--</a-layout-content>-->
        <!--</a-layout>-->
      <!--</a-layout>-->
    <!--</a-layout>-->

    <j-select-user-by-dep-single ref="single"  @senUserId="senUserId"></j-select-user-by-dep-single>

  </a-modal>

</template>


<script>
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import {deleteAction, downFile, getAction, postAction} from '@/api/manage'
  import JSelectUserByDepSingle from "../../../components/jeecgbiz/JSelectUserByDepSingle";


  export default {
    name: "taskShiftModal",
    mixins: [JeecgListMixin],
    components: {
      JSelectUserByDepSingle
    },
    data() {
      return {
        title: '任务移交',
        visible: false,
        confirmLoading: false,
        task: '',
        userIds: [],
        url: {
          taskShift: '/wf/task/taskShift',
        }

      }
    },
    created() {
    },
    methods: {
      show() {
        // this.visible = true

        // this.$refs.single.show()

        // this.visible = false


      },
      confirm() {

        if (this.userIds.length == 0) {
          this.$message.error('请选择' + this.title + '人')
          return
        }

        getAction(this.url.taskShift + "?taskId=" + this.task.id + "&destUserId=" + this.userIds[0]
          + "&sourceUserId=" + this.task.assignee).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.handleCancel()
          } else {
            this.$message.error(res.message)
          }
        })
      },
      cancel() {
        this.handleCancel()
      }, handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.dataInit()
      },
      dataInit() {
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      senUserId(ids) {
        this.userIds = ids
        this.confirm()
      }
    }
  }
</script>