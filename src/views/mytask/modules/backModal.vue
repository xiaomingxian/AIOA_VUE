<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="jump"
    @cancel="handleCancel"
    destroyOnClose
    okText="确定"
    cancelText="取消">

    <div style="overflow: auto; position: relative" :style="{height: scrHeight}">


      <a-layout id="components-layout-demo-top-side-2">
        <a-layout>
          <a-layout style="padding: 2px 2px 2px">
            <a-layout-content
              :style="{ background: '#fff', padding: '10px', margin: 0, minHeight: '280px' }">


              <!--展示可跳转节点-->
              <div v-if="!isCurrentUsers">
                <div v-if="isBack">
                  <div style="width:100%;">
                    <h4 style="width: 7%;margin: 1.5% 0% 0% 1%;float: left;">退回原因</h4>
                    <a-textarea style="width: 91.9%;margin-bottom: 1.1%;" rows="5" v-model="reason"></a-textarea>
                  </div>


                  <!--  :customRow="showForm"-->
                  <div style="width: 100%;margin-top: 2%;">
                    <h4 style="width: 7%;margin: 1.5% 0% 0% 1%;float: left;">退回步骤</h4>
                    <a-table
                      style="width: 91.9%;float: left;" ref="table"
                      size="middle"
                      bordered
                      rowKey="id"
                      :customRow="setRowRadio"
                      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}"
                      :columns="columns4"
                      :dataSource="dataSource">

                      <!--<span slot="action" slot-scope="text, record">-->

                      <!--<a @click="showForm(record)">{{title}}</a>-->
                      <!--</span>-->
                    </a-table>
                  </div>
                </div>
                <div v-if="!isBack">
                  <a-table
                    ref="table"
                    size="middle"
                    bordered
                    rowKey="id"
                    :customRow="showForm"
                    :columns="columns"
                    :dataSource="dataSource">

                    <!--<span slot="action" slot-scope="text, record">-->

                    <!--<a @click="showForm(record)">{{title}}</a>-->
                    <!--</span>-->
                  </a-table>
                </div>

              </div>



              <!--选部门-->
              <div style="display: flex;align-items: center;justify-content: space-between;" class="box" v-if="isDept && isCurrentUsers">
                <!--左侧部门-->
                <!--:loading="loading"-->

                <div class="left">
                  <a-table
                    ref="table"
                    size="small"
                    bordered
                    rowKey="id"
                    :columns="columns2"
                    :dataSource="mockData"
                    :customRow="setRowCheck"
                    :pagination="ipagination"
                    @change="handleTableChange"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
                  </a-table>
                </div>

                <!--右侧选择-->
                <div class="right">
                  <div v-for="item in deptsList">
                    <!--左右布局-->
                    <div class="box1">
                      <!--选部门-->
                      <div class="rightLeft" style="margin-top: 20px;">
                        <a-button @click="toRight(item)">
                          <a-icon type="right"/>
                          添加到{{item}}
                        </a-button>
                        <a-button @click="toLeft(item)">
                          <a-icon type="left"/>
                          从{{item}}删除
                        </a-button>
                      </div>
                      <!--选中的部门-->
                      <div class="rightRight">
                        <template>
                          <h4 color="red">{{item}}部门</h4>
                          <a-checkbox :id="item" @change="onCheckAllChange"></a-checkbox>
                          <a-row v-for="i in departSelect[item]">
                            <a-col :span="100">
                              <a-checkbox :ref="item" :key="i.id" :value="i.id+'-'+item" @change="onChangeCheck">
                                {{i.departName}}
                              </a-checkbox>
                            </a-col>
                          </a-row>
                        </template>
                      </div>
                      <div class="rightRight1">
                        <template>
                          <a-button type="primary" size="small" @click="queryUser(item)">【{{item}}】人员</a-button>
                          <a-row v-for="i in departUsers[item]">
                            <a-col :span="100">
                              {{i.username}}
                            </a-col>
                          </a-row>
                        </template>
                      </div>
                    </div>
                  </div>

                </div>
              </div>


            </a-layout-content>
          </a-layout>
        </a-layout>
      </a-layout>

    </div>
    <j-select-user-by-dep-check-box ref="checkBox" @senUserId="senUserId"></j-select-user-by-dep-check-box>
    <j-select-user-by-dep-single ref="single" @senUserId="senUserId"></j-select-user-by-dep-single>


    <next-users ref="nextUsers"></next-users>
    <user-select ref="userSelect" @func="userSelectCallBcak"></user-select>


  </a-modal>
</template>

<script>
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import nextUsers from './nextUsers'
  import {deleteAction, downFile, getAction, postAction} from '@/api/manage'
  import JSelectUserByDepSingle from "../../../components/jeecgbiz/JSelectUserByDepSingle";
  import JSelectUserByDepCheckBox from "../../../components/jeecgbiz/JSelectUserByDepCheckBox";
  import userSelect from './userSelect'
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "backModal",
    mixins: [JeecgListMixin],
    components: {
      ATextarea,
      nextUsers,
      JSelectUserByDepSingle,
      JSelectUserByDepCheckBox,
      userSelect
    },
    data() {
      return {
        scrHeight: window.innerHeight - 250 + 'px',
        title: '回退',
        visible: false,
        confirmLoading: false,
        taskMsg: '',
        destMsg: '',//目标节点
        dataSource: [],
        isCurrentUsers: false,
        checkBox: false,
        isDesignMul: false,//是否是设计上的多实例
        asssigneeEl: '',
        isBack: false,
        reason: null,//退回原因
        mulEl: '',
        mulSizeEl: '',
        isDept: false,
        //穿梭框数据
        mockData: [],
        //部门信息
        deptsList: [],
        //部门选择集合
        departSelect: {},
        //部门用户
        departUsers: {},
        //当前选中的类型
        currentDepType: '',
        //普通节点选中的数据(非部门)
        userIds: [],
        //传后台的部门用户的id
        deptMsg: {},
        columns: [
          {
            title: '环节',
            align: "center",
            dataIndex: 'name'
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align: "center",
          //   scopedSlots: {customRender: 'action'},
          // }
        ],
        columns4: [
          {
            title: '环节',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '用户',
            align: "center",
            dataIndex: 'userNames',
            customRender: function (t, r, index) {

              return t.join(',')
            }
          }
        ],
        columns2: [
          {
            title: '部门',
            align: "center",
            dataIndex: 'departName'
          }
        ],
        columns3: [
          {
            title: '用户',
            align: "center",
            dataIndex: 'username'
          }
        ],
        url: {
          currentUserQuery: '/oaBus/taskInAct/currentUserQuery',
          departUsetQuery: '/oaBus/taskInAct/deptUsersQuery',
          jump: '/wf/task/jump',
          back: '/wf/task/back',
          getUserByDeparts: '/sys/user/queryUserByDepts'
        },
      }
    },
    created() {
    },
    methods: {

      setRowRadio(res) {
        return {
          on: {
            click: () => {

              let keys = [];
              let rows = [];
              keys.push(res.id);
              rows.push(res);
              this.selectedRowKeys = keys;
              this.selectionRows = rows

              this.doShowForm(res)
            }
          }
        }
      },
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
      //穿梭方法实现
      toRight(item) {
        //从部门列表中移除--添加到对应的list中
        //1 主办部门只能有一个
        if (item.indexOf("主办") >= 0) {
          //判断是否已经有元素了
          if (((this.departSelect[item].length == 0 && this.selectionRows.length > 1)) || (this.departSelect[item].length > 0)) {
            this.$message.error("主办部门只允许有一个")
            return
          }
        }
        //2 添加到右边--移除左边
        var del = {}
        for (var i in this.selectionRows) {
          this.selectionRows[i].checked = false
          //右边
          this.departSelect[item].push(this.selectionRows[i])
          //移除元素
          del[this.selectionRows[i].id] = 1
        }
        //移除元素(采用重新赋值的方式)
        var mockData2 = []
        for (var j = 0; j < this.mockData.length; j++) {
          if (del[this.mockData[j].id] != 1) {
            mockData2.push(this.mockData[j])
          }
        }
        this.mockData = mockData2
        //清空所选
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      toLeft(item) {
        //添加到部门列表中--从list中移除
        var right = []
        for (var i in this.departSelect[item]) {
          var itt = this.departSelect[item][i]
          if (itt.checked) {
            itt.checked = false
            this.mockData.push(itt)
          } else {
            right.push(itt)
          }
        }
        //改变右边
        this.departSelect[item] = right
        //判断对应的选人
        this.departUsers[this.currentDepType] = []
        this.deptMsg[this.currentDepType] = []
        // //出发后才能选上 原因未知
        let keys = []
        let rows = []
        this.onSelectChange(keys, rows)
      },
      show() {
        //console.log('-------------',this.title)
        this.isCurrentUsers = false
        if (this.title == '回退') this.isBack = true
        else this.isBack = false

        this.visible = true
      },
      onChangeCheck(item) {
        var id = (item.target.value).split('-')[0]
        var type = (item.target.value).split('-')[1]
        //修改数据属性
        for (var i in  this.departSelect[type]) {
          if (id == this.departSelect[type][i].id) {
            this.departSelect[type][i].checked = true
          }
        }
      },
      showForm(record) {
        return {
          on: {
            click: () => {
              //console.log('~~~~~~~~~~~~~~~~~~~~~~~')
              this.doShowForm(record)
            }
          }
        }

      },
      doShowForm(record) {
        //console.log('------------->>>>', JSON.stringify(record))


        this.isDept = record.userOrRole == 'dept'

        //单选或者复选
        this.checkBox = record.allowMulti
        //办理人变量及其相关设置
        if (record.allowMulti) {//多实例
          this.isDesignMul = true
          this.mulEl = record.multiAssignee
          this.mulSizeEl = (record.loopSize).indexOf("${") >= 0 ? (record.loopSize).split("${")[1].split("}")[0] : (record.loopSize)
        } else {//不允许多实例

          if (record.multiAssignee == null) {//判断是不是 设计上的多实例

            //不是设计上的多实例----解析办理人表达式
            this.isDesignMul = false
            //console.log((record.assignee).split("${")[1].split("}")[0])
            this.asssigneeEl = (record.assignee).indexOf("${") >= 0 ? (record.assignee).split("${")[1].split("}")[0] : (record.assignee)

          } else {

            //设计上是多实例
            this.isDesignMul = true
            this.mulEl = record.multiAssignee
            this.mulSizeEl = (record.loopSize).indexOf("${") >= 0 ? (record.loopSize).split("${")[1].split("}")[0] : (record.loopSize)
          }
        }

        this.destMsg = record

        if (this.title == '回退') return

        //展示节点所需要的办理人
        getAction(this.url.currentUserQuery, {
          procDefKey: record.procDefKey,
          taskId: record.id,
          taskName: record.name,
          drafterId: this.taskMsg.drafterId,
        }).then(res => {
          if (res.success) {
            //console.log('-------------success:::::::')
            if (this.isDept) {//是部门任务
              //console.log('-------------isDept:::::::')


              //校验部门
              this.mockData = res.result
              this.deptsList = record.deptsList

              for (var x in  this.deptsList) {
                //构造备选集合
                this.departSelect[this.deptsList[x]] = []
                //构造部门用户集合
                this.departUsers[this.deptsList[x]] = []
                //传后台数据
                this.deptMsg[this.deptsList[x]] = []
              }
              this.visible = true
              //部门任务才展示
              this.isCurrentUsers = true

            } else {
              //console.log('-----sasssssss----------------')

              if (this.checkBox) {
                //console.log('---------------------')
                this.$refs.checkBox.show()

              } else {
                //console.log('========================')

                this.$refs.single.show()
              }

            }

          } else {
            this.$message.error(res.message)
          }
        })
      },
      jump() {
        if (this.title == '回退') {
          if (this.reason == null || this.reason.length == 0) {
            this.$message.error('请先填写意见')
            return
          }
        }

        //办理人信息
        var vars = {}
        var taskWithDepts = {}
        let assignee = []//记录参与人
        if (this.isDesignMul) {//多实例
          vars[this.mulEl] = []
          //记录部门信息
          taskWithDepts = {
            deptMsg: this.deptMsg,
            taskDefKey: this.destMsg.id
          }

          //如果是部门任务做特殊处理
          if (this.isDept) {

            let uids = []
            for (let i in this.deptMsg) {
              uids.push(this.deptMsg[i])
              for (let index in this.deptMsg[i]) {
                assignee.push(this.deptMsg[i][index])
              }
            }
            if (this.title == '回退') {
              if (this.selectionRows.length <= 0) {
                this.$message.error('请选择要退回的环节')
                return
              }
              uids = this.selectionRows[0].userIds
            }

            vars[this.mulEl] = uids
            vars[this.mulSizeEl] = vars[this.mulEl].length
          } else {
            assignee = this.userIds
            vars[this.mulEl] = this.userIds
            vars[this.mulSizeEl] = this.userIds.length
          }
        } else {//非多实例

          if (this.title == '回退') {
            if (this.selectionRows.length <= 0) {
              this.$message.error('请选择要退回的环节')
              return
            }
            this.userIds = this.selectionRows[0].userIds
          }
          assignee = this.userIds
          vars[this.asssigneeEl] = this.userIds[0]
        }
        //构造参数
        let taskId = this.taskMsg.id
        if (taskId == undefined) taskId = this.taskMsg.hiTaskId

        console.log(':::::::::::::::',JSON.stringify(this.taskMsg))
        var data = {
          processDefinitionId: this.taskMsg.processDefinitionId,
          taskId: taskId,
          executionId: this.taskMsg.executionId,
          processInstanceId: this.taskMsg.processInstanceId,
          destActDefKey: this.destMsg.id,
          destActDefName: this.destMsg.name,
          currActDefKey: this.taskMsg.taskDefinitionKey,
          deleteReason: this.title == '回退' ? 'completed_back' : 'completed_jump',
          //办理人信息
          vars: vars,
          isDept: this.isDept,
          taskWithDepts: taskWithDepts,
          //存储参与人信息
          table: this.taskMsg.table,
          tableId: this.taskMsg.tableId,
          functionId: this.taskMsg.functionId,
          assignee: assignee
        }


        if (this.title == '回退') {
          data['backReason'] = this.reason

          console.log('""""""""""',JSON.stringify(data))
          postAction(this.url.back, data).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              setTimeout(function () {
                window.close()
              }, 500)

            } else {
              this.$message.error(res.message)
            }
          })


        } else {
          postAction(this.url.jump, data).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              setTimeout(function () {
                window.close()
              }, 500)

            } else {
              this.$message.error(res.message)
            }
          })
        }

        this.handleCancel()
      },
      cancel() {

      }, handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.dataInit()
      },
      dataInit() {
        this.selectionRows = []
        this.selectedRowKeys = []
      },
      queryUser(item) {
        this.currentDepType = item
        //主办/辐办/传阅
        let departs = this.departSelect[item]

        if (departs.length == 0) {
          this.$message.error('请先选择部门')
          return
        }
        var ids = []

        for (var i of departs) {
          ids.push(i.id)
        }

        //根据部门查用户
        postAction(this.url.getUserByDeparts, {ids: ids}).then(res => {
          this.$refs.userSelect.dataSource = res.result
          this.$refs.userSelect.show()
        })
      },
      userSelectCallBcak(ids) {
        this.departUsers[this.currentDepType] = []
        this.deptMsg[this.currentDepType] = []

        for (var i of  ids) {
          let data = {
            id: i.id,
            username: i.username
          }
          //
          this.departUsers[this.currentDepType].push(data)
          this.deptMsg[this.currentDepType].push(i.id)
        }
        //出发后才能选上 原因未知
        let keys = []
        let rows = []
        this.onSelectChange(keys, rows)
      },
      senUserId(ids) {
        this.userIds = ids
        this.jump()
      },
      /**
       * 全选/不选
       */
      onCheckAllChange(e) {
        let checked = e.target.checked
        let type = e.target.id


        if (checked) {
          //修改数据属性
          for (var i in  this.departSelect[type]) {
            this.departSelect[type][i].checked = true
            this.$refs[type][i].checked = true
          }
        } else {
          for (var i in  this.departSelect[type]) {
            this.departSelect[type][i].checked = false
            this.$refs[type][i].checked = false

          }
        }
      },

    }
  }
</script>
<style>
  .left {
    width: 30%;
  }


  .right {
    width: 69%;
    height: 400px;
    /*background: #dddddd;*/
    overflow-y: scroll;
  }

  .box1 {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  /*background: darkcyan;*/

  .rightRight {
    /*width: 90%;*/
    width: 200px;
    height: 120px;
    /*background: #fff;*/
    margin-left: 150px;
    margin-right: 1px;
    margin-top: 10px;
    overflow-y: scroll;
  }

  .rightRight1 {
    /*width: 90%;*/
    width: 200px;
    height: 120px;
    /*background: #fff;*/
    margin-left: 1px;
    margin-right: 10px;
    margin-top: 10px;
    overflow-y: scroll;
  }

  .rightLeft {
    width: 3%;
  }

</style>