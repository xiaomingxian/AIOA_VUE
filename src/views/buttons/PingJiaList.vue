<template>
  <a-card :bordered="false">
      <a-table
        class="pointer"
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        :customRow="doTask"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text,record">
          <a @click.stop="handleEdit1(record,1)">编辑</a>
          <a-divider type="vertical" />
           <a @click.stop="handleDelete1(record.iid,record.screateBy)">删除</a>
        </span>

      </a-table>
    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visibleDel"
      @ok="comfirmDelOrBatchDel"
      @cancel="handleCancel"
    >
      <p>请确认是否要删除该条数据</p>
    </a-modal>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {httpAction, getAction,putAction, postAction, getRoleList, getUserList, getServiceList} from '@/api/manage'
  export default {
        name: "PingJiaList",
        url:{List:'/oadatafetailedinst/oaDatadetailedInst/findJinZhanList'},
       mixins: [JeecgListMixin],
        data() {
          return {
            dataSource:[],
            columns: [
             /* {
                title: '环节名称',
                align: "center",
                dataIndex: 'taskDefName'
              },*/
              {
                title: '负责人',
                align: "center",
                dataIndex: 'userName'
              },
              {
                title: '部门',
                align: "center",
                dataIndex: 'deptName'
              },
              {
                title: '评分',
                align: "center",
                dataIndex: 'sum'
              },
              {
                title: '完成时间',
                align: "center",
                dataIndex: 'endTime'
              },

            ],
          };
        },

        methods:{
          traceP(e,c) {
            let url = '/oadatafetailedinst/oaDatadetailedInst/findJinZhanList'
            getAction(url, {
              proInstId: e,
              tableid:c,
              endTime: this.endTime

            }).then(res => {
              console.log(res);
              if (res.success) {
                this.dataSource = res.result
                this.showPic = false
                this.trace = true
                this.backRecord = false
              } else {
                this.$message.error(res.message)
              }
            })


          },
        }
    }
</script>

<style scoped>

</style>