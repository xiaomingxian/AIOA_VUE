<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="文件标题">
              <a-input placeholder="文件标题" v-model="queryParam.dataTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="文件字号">
              <a-input placeholder="文件字号" v-model="queryParam.fileNum"></a-input>
            </a-form-item>
          </a-col>




          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="待办用户">
                <!--v-model="queryParam.createName"-->
                <a-input @click="selectShiftUser" v-model="selectedDepUsers" placeholder="待办用户"></a-input>
                <j-select-user-by-dep-check-box ref="checkSelect"
                                                @senUserId="senUserIdCheck"></j-select-user-by-dep-check-box>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="拟稿用户">
                <a-input placeholder="拟稿用户" v-model="queryParam.createName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
<!--style="width: 150px"-->
              <a-form-item label="任务类型">
                <a-select  @change="taskTypeChange" v-model="taskType">
                  <a-select-option value="全部">全部</a-select-option>
                  <a-select-option value="传阅">传阅</a-select-option>
                  <a-select-option value="主办">主办</a-select-option>
                  <a-select-option value="辅办">辅办</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="主办部门">
                <a-input placeholder="主办部门" v-model="queryParam.mainDept"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="8">
              <a-form-item label="开始时间">
                <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" style="width: 230px"
                               v-model='startTimeFake' @change="startTime"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="结束时间">
                <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" style="width: 230px"
                               v-model='endTimeFake' @change="endTime"/>
              </a-form-item>
            </a-col>



          </template>


          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" ref="reSearchQuery" @click="searchQueryMy" icon="search">查询</a-button>
              <a-button type="primary" @click="searchResetMy" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchShift">
            <a-icon type="delete"/>
            批量移交
          </a-menu-item>
          <a-menu-item v-if="(this.queryParam.deptType=='传阅')"
                       key="1" @click="batchPiYue">
            <a-icon type="delete"/>
            批量批阅
          </a-menu-item>
        </a-menu>

        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>

    </div>

    <!-- table区域-begin -->
    <div>

      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :customRow="doTask"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text, record">

          <a @click.stop="taskShift(record)">任务移交</a>
          <a-divider type="vertical"/>

          <a @click.stop="unDo(record)">未办理信息</a>
          <a-divider type="vertical"/>
          <a @click.stop="showPic(record)">查看流程图</a>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <pic2-modal ref="pic2Modal" @ok="modalFormOk"></pic2-modal>


    <!--业务页面-->
    <detail-file ref="detailFile"></detail-file>
    <task-shift-modal ref="taskShiftModal"></task-shift-modal>

    <div v-show="false">
      <j-select-user-by-dep-single ref="single" @senUserId="senUserId"></j-select-user-by-dep-single>
    </div>

  </a-card>
</template>

<script>
  import Vue from 'vue'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {ACCESS_TOKEN} from "../../store/mutation-types";
  import {getAction, postAction} from "../../api/manage";
  import pic2Modal from './modules/pic2Modal'
  //业务页面
  import detailFile from './taskList/detailFile'
  //移交
  import taskShiftModal from './modules/taskShiftModal'
  import JSelectUserByDepSingle from "../../components/jeecgbiz/JSelectUserByDepSingle";
  import JSelectUserByDepCheckBox from "../../components/jeecgbiz/JSelectUserByDepCheckBox";


  export default {
    name: "taskToDo",
    mixins: [JeecgListMixin],
    components: {
      pic2Modal,
      //业务
      detailFile,
      taskShiftModal,
      JSelectUserByDepSingle,
      JSelectUserByDepCheckBox,
    },
    data() {
      return {
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        description: '任务移交',
        iisFontSize: '16px',
        datasource: [],
        loginInfo: '',
        task: '',
        checkUserIds: [],
        selectedDepUsers: '',
        isBatchShift: false,
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
            title: '文号',
            width: 100,
            align: "center",
            sorter: (i, ii, type) => {

              this.queryParam.tableOrder = true
              this.nullOther('orederByWenHao')

              this.queryParam.orederByWenHao = type == 'descend' ? -1 : 1;
              return true
            },
            dataIndex: 'wenHao'
          },
          {
            title: '标题',
            width: 350,
            align: "left",
            sorter: (i, ii, type) => {
              //descend倒叙
              //ascend正序

              this.queryParam.tableOrder = true
              //置空其他环节
              this.nullOther('orederByTile')
              this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
              return true
            },
            align: "left",
            dataIndex: 'title'
          },
          {
            title: '当前环节',
            align: "center",
            sorter: (i, ii, type) => {
              this.queryParam.tableOrder = true
              this.nullOther('orederByHuanJie')

              this.queryParam.orederByHuanJie = type == 'descend' ? -1 : 1
              return true
            },
            dataIndex: 'name'
          },
          {
            title: '拟稿人',
            align: "center",
            sorter: (i, ii, type) => {
              this.queryParam.tableOrder = true
              this.nullOther('orederByDrafter')

              this.queryParam.orederByDrafter = type == 'descend' ? -1 : 1;
              return true
            },
            dataIndex: 'drafter'
          },
          {
            title: '转发时间',
            align: "center",
            sorter: (i, ii, type) => {
              this.queryParam.tableOrder = true
              this.nullOther('orederByTime')

              this.queryParam.orederByTime = type == 'descend' ? -1 : 1;
              return true
            },
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            sorter: (i, ii, type) => {
              return true
            },
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/wf/task/queryTask?operstatus=shift",
          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
          yewuDataQuery: "/oaBus/dynamic/query",
          actShowQuery: '/oaBus/busPage/queryActShowByPageRef',
          batchEnd: '/wf/task/batchEnd',
          batchPiYue: '/wf/task/batchPiYue',
          currentUnDo: '/wf/task/queryTaskUnDoCurrent',
          taskShift: '/wf/task/taskShift',
          batchShift: '/wf/task/batchShift',
        },
        startTimeFake: null,
        endTimeFake: null,
        taskType: null,
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created() {
      //默认不带部门类型
      this.queryParam.isDept = false
      getAction("/sys/user/getLoginInfo").then(res => {
        this.loginInfo = res
      });

      this.setFontSize();
    },
    methods: {
      setFontSize(){
        const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url,{userId:userid}).then((res) => {
          if(res.result.iisFontSize == 1){
            this.iisFontSize = '18px';
          }else if(res.result.iisFontSize == 3){
            this.iisFontSize = '14px';
          }else{
            this.iisFontSize = '16px';
          }
          document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
        })
      },
      batchShift() {
        this.isBatchShift = true
        console.log(this.selectedRowKeys)
        this.$refs.single.show()
      },
      selectShiftUser() {
        this.$refs.checkSelect.show()
      },
      //清空其他排序条件
      nullOther(type) {
        let orderColums = ['orederByWenHao', 'orederByTile', 'orederByHuanJie', 'orederByDrafter', 'orederByTime']
        for (let i in orderColums) {
          if (i != type) {
            this.queryParam[orderColums[i]] = undefined
          }
        }
      },
      taskShift(record) {
        this.isBatchShift = false
        this.task = record
        this.$refs.single.show()
        // this.$refs.taskShiftModal.task = record
        // this.$refs.taskShiftModal.show()
      },
      unDo(record) {
        let procInstId = record.processInstanceId
        getAction(this.url.currentUnDo, {
          procInstId: procInstId
        }).then(res => {
          if (res.success) {

            const h = this.$createElement;
            let content = []
            for (let i in res.result) {
              let msg = res.result[i]
              content.push(h('p', `【${msg.taskDefName}】 ${msg.deptName} ：${msg.userName}`))
            }

            let content_ = h('div', {}, content)

            const modal = this.$success({
              title: '未办理信息',
              content: content_,
            });
          } else {
            this.$message.error(res.message)
          }
        })


      },
      //类型选择
      taskTypeChange(type) {
        if (type != '全部') {
          this.queryParam.isDept = true
          this.queryParam.deptType = type
        } else {
          this.queryParam.isDept = false
        }
      },
      searchQueryMy() {
        this.queryParam.tableOrder = false

        this.searchQuery()
        this.selectionRows = []
        this.selectedRowKeys = []

      },
      searchQueryMy() {
        this.searchQuery()
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      searchResetMy() {
        this.selectedDepUsers=[]
        this.queryParam.tableOrder = false
        this.queryParam.shiftUsers = undefined
        this.checkUserIds = ''

        this.searchReset()
        // this.startTimeFake = null
        // this.endTimeFake = null
        this.taskType = null
        this.queryParam.isDept = false
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      endTime(a, time) {
        this.queryParam.endQueryTime = time
      },
      startTime(a, time) {
        this.queryParam.startQueryTime = time
      },
      reload() {
        this.loading = true;
        getAction(this.url.list).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      cancel() {
      },
      showPic(record) {
        this.$refs.pic2Modal.show(record)
        this.$refs.pic2Modal.title = '当前环节'
      },
      doTask(record, index) {

        return {
          on: {
            click: (event) => {
              // let taskDetail = {
              //   tableName: record.table,
              //   busdataId: record.tableId,
              //   haveTask: true,
              //   task: record
              // }
              window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + record.table + '&busdataId=' + record.tableId + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(record))

            }
          }
        }
      },
      senUserId(ids) {
        this.userIds = ids
        if (this.userIds.length == 0) {
          this.$message.error('请选择移交人')
          return
        }

        if (this.isBatchShift) {
          //批量移交
          if (this.selectedRowKeys <= 0) {
            this.$message.error('请选择要移交的任务')
            return
          }
          //遍历判断用户是不是同一个人
          let taskIds = this.selectedRowKeys.join(',')
          let rows = this.selectionRows
          let firstUserId = this.selectionRows[0].assignee
          if (firstUserId == this.userIds[0]) {
            this.$message.error('移交人与被移交人不能是同一个人')
            return
          }
          for (let i in  rows) {
            if (rows[i].assignee != firstUserId) {
              this.$message.error('请选择同一办理人的任务')
              return
            }
          }
          getAction(this.url.batchShift + "?taskIds=" + taskIds + "&destUserId=" + this.userIds[0]
            + "&sourceUserId=" + firstUserId).then(res => {
            if (res.success) {
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })

        } else {
          getAction(this.url.taskShift + "?taskId=" + this.task.id + "&destUserId=" + this.userIds[0]
            + "&sourceUserId=" + this.task.assignee).then(res => {
            if (res.success) {
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      senUserIdCheck(ids, selectedDepUsers) {
        this.checkUserIds = ids
        this.selectedDepUsers = selectedDepUsers
        if (ids.length > 0) {
          this.queryParam.shiftUsers = ids.join(",")
        }
      }
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>