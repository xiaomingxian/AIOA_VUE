<template>
  <a-card :bordered="false">

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="iid"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :customRow="customRow"
      >

        <span slot="action" slot-scope="text, record">
          <!--<a @click="handleEdit(record)">编辑</a>

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
          </a-dropdown>-->
        </span>

      </a-table>
    </div>

    <meetingInform ref="meetingInform"></meetingInform>
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin2'
  import {getAction, postAction} from "../../api/manage";
  import meetingInform from '../mytask/taskList/meetingInform'

  export default {
    name: "ShowMeetingInfrom2",
    mixins: [JeecgListMixin],
    components: {
      meetingInform
    },

    data() {
      return {
        description: '会议申请页面',

        customRow: (record) => {
          return {
            on: { // 事件
              click: (event) => {
                this.openMeetingInfo(record);
              },       // 点击行
              dblclick: (event) => {
              },
              contextmenu: (event) => {
              },
              mouseenter: (event) => {
              },  // 鼠标移入行
              mouseleave: (event) => {
              }
            },
          }
        },
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 100,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '申请人员',
            align: "center",
            dataIndex: 'screateName'
          },
          {
            title: '申请部门',
            align: "center",
            dataIndex: 'screateDept'
          },
          {
            title: '申请会议室',
            align: "center",
            dataIndex: 'svarchar1'
          },
          {
            title: '会议内容',
            align: "center",
            width: 400,
            dataIndex: 'svarchar2',

          },
          {
            title: '申请时间',
            align: "center",
            width: 200,
            dataIndex: 'dCreateTime',

          },

        ],
        url: {
          list: "oaBus/meetingInform/getReadCase",
          exportXlsUrl: "system/qrtzBackUp/exportXls",
          importExcelUrl: "system/qrtzBackUp/importExcel",
          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById'
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      openMeetingInfo(record){


          //查询---业务数据--流程信息
          var taskDetail = {}
          postAction(this.url.busDataAndColums, {tableName: "oa_busdata50", busdataId: record.iid}).then((res) => {

            taskDetail.data = res.oaBusdata
            taskDetail.data['iprocSetId'] = res.proSetId
            taskDetail.data['key'] = res.taskDefKey
            taskDetail.data.act_show = res.actShow
            taskDetail.data.page_ref = res.pageRef

            taskDetail.busFunction = res.busFunction
            taskDetail.detailList = res.detailList

            this.$refs[res.pageRef].showTaskInAct(taskDetail, record)
            this.$refs[res.pageRef].title = '任务办理'

          })

      },

      //----------------时间变化检测---------------
      selectTime(e) {
      },
      //----------------确定时间---------------
      confirmTime(e) {
        // 此处确定时间为  单项选择开始、单项结束时间、双向时间段选择提供服务   判断 this.searchTypeVal  确定是那种状态
        if (this.searchTypeVal === 2 || this.searchTypeVal === 3) {
          console.log(e._d);
          this.starOrEndTime = this.timeStrings(e._d);
          console.log(this.starOrEndTime);
        } else {
          // 时间段选择    为时间段的开始和结束时间赋值
          console.log(e);
          this.queryParam.dStartTime = this.dateFormat(e[0]._d);
          this.queryParam.dEndTime = this.dateFormat(e[1]._d);

        }
        this.dateFormat(e._d);
        console.log(this.dateFormat(e._d));

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