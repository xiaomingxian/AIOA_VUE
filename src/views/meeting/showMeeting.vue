<template>
  <a-modal
    :title="title"
    :width="1300"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="ok"
    destroyOnClose
    @cancel="handleCancel"
    cancelText="取消">


    <a-table
      :columns="columnes"
      :dataSource="dataSources"
      :loading="loading"
      :pagination="paginations"
      @change="handleTableChange"
      bordered
      ref="table"
      rowKey="iid"
      size="middle"

    >


    </a-table>

  </a-modal>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin2'
  import {getAction} from "../../api/manage";

  export default {
    name: "showMeeting",
    mixins: [JeecgListMixin],
    components: {},

    data() {
      return {
        description: '会议室使用情况',
        visible: false,
        confirmLoading: false,
        title: '会议室使用情况',
        meetingRoom: '',
        // 表头
        columnes: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',

            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '会议内容',
            align: "center",

            dataIndex: 'svarchar2',

          },
          {
            title: '使用时间',
            align: "center",

            dataIndex: 'dDatetime1',
          },
          {
            title: '结束时间',
            align: "center",

            dataIndex: 'dDatetime2',
          },
          {
            title: '审批状态',
            align: "center",

            dataIndex: 'iisState',
            customRender: function (iisState) {
              if (iisState == '1') {
                return "已申请成功";
              } else if (iisState == "0") {
                return "办理申请中";
              } else if (iisState == null && iisState == undefined){
                return "准备申请中";
              } else {
                return " ";
              }
            }
          },
        ],
        dataSources: [],
        paginations: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: false,
          showTotal: (total, range) => {
            return range[0] + "/" + range[1] + "共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
        },
        url: {
          queryMeetingRoom: "oaBus/meetingInform/getMeetingRoom"
        },
      }
    },
    computed: {},
    methods: {
      showMeetingCase(e) {
        this.visible = true
        this.meetingRoom = e;
        getAction(this.url.queryMeetingRoom, {s_varchar1: this.meetingRoom}).then(res => {
          this.dataSources = res.result.records;
        })
      },

      handleTableChange(paginations){
        let currentClick=paginations.current;
        this.showMeetingCase(this.meetingRoom,currentClick)
      },

      ok() {
        this.close()
      },

      handleCancel() {
        this.close()
      },

      close() {
        this.$emit('close');
        this.visible = false;
      },

      dateFormat(date) {
        let date1 = new Date(date);
        let Y = date1.getFullYear();
        let M = date1.getMonth() + 1;
        let D = date1.getDate();
        let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
        return newTime;
      }
    }
  }
</script>
<style scoped lang="less">
  /*@import '~@assets/less/common.less'*/
</style>