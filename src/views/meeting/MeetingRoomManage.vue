<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">

          <a-row :gutter="24">
            <a-col :md="10" :sm="8">
            <span style="display: flex" class="table-page-search-submitButtons">
               <div>查询条件</div>
              <a @click="handleToggleSearch" style="margin-left: 20px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
            </a-col>
          </a-row>
        <template v-if="toggleSearchStatus">
          <div class="inputbox" >
            <a-row :gutter="24" >
              <a-col :md="6" :sm="15">
                <a-form-item label="会议室名称">
                  <a-input placeholder="" v-model="queryParam.sTitle"></a-input>
                </a-form-item>
              </a-col>
              <a-col style="margin-left: 100px;" :md="6" :sm="8">
                <a-form-item label="办公室地点">
                  <a-input placeholder="" v-model="queryParam.sVarchar1"></a-input>
                </a-form-item>
              </a-col>

            </a-row>
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item label="房间号">
                  <a-input style="margin-left:25px; " placeholder="" v-model="queryParam.sVarchar2"></a-input>
                </a-form-item>
              </a-col>
              <a-col style="margin-left: 100px;" :md="10" :sm="8">
                <a-form-item label="容纳人数">
                  <span>介于</span>
                  <a-input placeholder="" v-model="queryParam.iIs1" style="width:50px"></a-input>
                  <span>和</span>
                  <a-input placeholder="" v-model="queryParam.iIs2" style="width: 50px"></a-input>
                  <span>之间</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="6" :sm="8">
                <a-form-item label="会议室设施">
                  <a-input placeholder="" v-model="queryParam.sVarchar4"></a-input>
                </a-form-item>
              </a-col>
              <a-col style="margin-left: 100px;" :md="6" :sm="8">
                <a-form-item label="录入年份">
                  <a-input placeholder="" v-model="queryParam.iCreateYear"></a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="10" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
              </a-col>
            </a-row>

          </div>

        </template>
      </a-form>
    </div>
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
      :customRow="customRow">
    </a-table>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <meeting-room-file ref="meetingRoomFile" @refrensh="refrensh"></meeting-room-file>
  </a-card>
</template>

<script>
  import {getAction, postAction} from "../../api/manage";
  import {JeecgListMixin} from '@/mixins/JeecgListMixin2'
  import meetingRoomFile from '../mytask/taskList/meetingRoomFile'
  import ARow from "ant-design-vue/es/grid/Row";
  import PageContent from "../../components/layouts/PageView";

  export default {
    name: "MeetingRoomManage",
    mixins: [JeecgListMixin],
    components: {
      PageContent,
      ARow,
      meetingRoomFile
    },
    data() {
      return {
        description: '会议室管理',
        taskDetail: {data: {}, busFunction: {}, detailList: {}},
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '会议室名称',
            align: "center",
            dataIndex: 'stitle'
          },
          {
            title: '办公地点',
            align: "center",
            dataIndex: 'svarchar1',
          },
          {
            title: '房间号',
            align: "center",
            dataIndex: 'svarchar2'
          },
          {
            title: '容纳人数',
            align: "center",
            dataIndex: 'svarchar3'
          },
          {
            title: '会议设施',
            align: "center",
            dataIndex: 'svarchar4'
          },
          {
            title: '录入时间',
            align: "center",
            dataIndex: 'dcreateTime',
            customRender: (text) => {
              text = this.dateFormat(text);
              return text;
            }
          }
        ],
        customRow: (record) => {
          return {
            on: { // 事件
              click: (event) => {
                // console.log(record)
                this.openMeetingFile(record);
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
        url: {
          list: "/oaBus/meetingRoom/list",
          queryMeeting: 'oaBus/oaBusdata/queryBusdataById'
        },
      }
    },
    computed: {},
    methods: {
      openMeetingFile: function (record) {
        // 查询---业务数据--流程信息
        var taskDetail = {}
        postAction(this.url.queryMeeting, {tableName: "oa_busdata40", busdataId: record.iid}).then((res) => {

          taskDetail.data = res.oaBusdata
          taskDetail.data['iprocSetId'] = res.proSetId
          // taskDetail.data['key'] = "openMeetingFile"
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
      },
      refrensh() {
        this.loadData(1)
      }
    }
  }
</script>
<style scoped lang="less">
  /*@import '~@assets/less/common.less'*/
  .inputbox{
    width: 100%;


    /*background: darkblue;*/
    margin: 0 auto;
  }
</style>