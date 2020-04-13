<template>
  <a-modal
    title="未办理信息"
    :width="500"
    :visible="visible"

    @cancel="closeUndo"
    destroyOnClose

    cancelText="取消">
    <template slot="footer">
      <a-button type="primary" @click.stop="closeUndo()">关闭</a-button>
      <!--      <a-button type="primary" @click.stop="confrimUpLoad()">确定</a-button>-->
    </template>
    <a-table
      :columns="columns2"
      :dataSource="dataSource2">

    </a-table>

  </a-modal>

</template>


<script>



  export default {
    name: "undoMSg",
    mixins: [],
    data() {
      return {
        visible:false,
        dataSource2:[],
        // 表头
        columns2: [
          {
            title: '环节',
            dataIndex: 'taskDefName',
            align: "center",
          },
          {
            title: '部门',
            dataIndex: 'deptName',
            align: "center",
          },
          {
            title: '用户',
            dataIndex: 'userName',
            align: "center",
          },

        ],
      }
    },
    created() {
    },
    methods: {
      closeUndo(){
        this.visible=false
      },
    }
  }
</script>