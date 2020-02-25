<template>

  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="confirm"
    @cancel="cancel"
    destroyOnClose
    :okText="okText"
    cancelText="取消">
    <div id="pic" style="overflow: auto;" :style="{height: scrHeight}">

      <a-layout id="components-layout-demo-top-side-2">
        <a-layout>
          <div v-if="endType">
            <center><h3 style="color: red; font-weight: 600; font-size: 20px">下一节点为结束节点</h3></center>
          </div>

          <a-layout-sider v-if="!endType" width="200" style="background: #fff">
            <a-menu
              mode="inline"
              :defaultSelectedKeys="defaultSelectedKeys"
              :defaultOpenKeys="['sub1']"
              :style="{ height: '100%', borderRight: 80 }">
              <!--...................................................................................................-->
              <a-sub-menu key="sub1">

                <span slot="title"><a-icon type="user"/>可追加环节</span>

                <a-menu-item :key="item.oaProcActinst.actId" v-for="item in nextsActs" @click="clickAct(item)">
                  {{item.oaProcActinst.actName}}
                </a-menu-item>

              </a-sub-menu>

              <!--...................................................................................................-->
            </a-menu>
          </a-layout-sider>
          <!--.........................//////////////////////////////////////////..........................................................................-->
          <a-layout v-if="!endType" style="padding: 2px 2px 2px">

            <!--<a-breadcrumb style="margin: 16px 0">-->
            <!--<div>-->
            <!--&nbsp;&nbsp;&nbsp;&nbsp;-->
            <!--<a-radio-group name="radioGroup" @change="changeChoice" :defaultValue="1">-->
            <!--<a-radio :value="1">不限时间</a-radio>-->
            <!--<a-radio :value="2">限制时间</a-radio>-->
            <!--</a-radio-group>-->
            <!--&nbsp;&nbsp;&nbsp;&nbsp; 期望任务办理结束时间:-->
            <!--<a-date-picker @change="onChange" showTime format="YYYY-MM-DD HH:mm:ss"-->
            <!--placeholder="请选择结束时间"/>-->
            <!--</div>-->
            <!--</a-breadcrumb>-->
            <a-layout-content
              :style="{ background: '#fff', padding: '10px', margin: 0, minHeight: '280px' }">
              <!--********************************* 下一办理人选用户(区分：普通/并行/包容网关) [仅记录选择记录] ********************************-->
              <!--可多选 1 数据分类(单选/多选/部门选) -->
              <!--1 普通-->
              <div v-if="!isDept">
                <div v-if="!isMul">
                  <a-table
                    ref="table"
                    size="middle"
                    bordered
                    :pagination="false"
                    :customRow="setRowRadio"
                    rowKey="uid"
                    :columns="columns"
                    :dataSource="dataSource"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableChangeMy,type:'radio'}"
                  >
                  </a-table>
                </div>
                <div v-if="isMul">
                  <a-table
                    ref="table"
                    size="middle"
                    bordered
                    :pagination="false"
                    rowKey="uid"
                    disabled
                    :customRow="setRowCheck"
                    :columns="columns"
                    :dataSource="dataSource"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: handleTableChangeMy,type:'checkbox'}"
                  >
                    <!--onSelectChange-->
                  </a-table>
                </div>
              </div>

              <!--选部门-->
              <div class="box" v-if="isDept">
                <!--左侧部门-->
                <div class="left">
                  <a-table
                    ref="table"
                    size="small"
                    bordered
                    rowKey="id"
                    rowSelection
                    :loading="loading"
                    :columns="columns2"
                    :customRow="departClickCheck"
                    :dataSource="mockData"
                    :pagination="false"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    @change="handleTableChange"
                  >
                  </a-table>
                </div>

                <!--右侧选择-->
                <div class="rightt">
                  <div ref="itemPartBox" class="itemPartBox" v-for="item in deptsList">

                    <div class="partBox">
                      <div style="padding: 6px;background: #d6ebff !important;">
                        <a-checkbox :id="item" @change="onCheckAllChange"></a-checkbox>

                        {{item==null||item==undefined||item==''?singleDept:item}}部门
                      </div>
                      <!--<hr> style="overflow: hidden"-->
                      <div class="partBoxChild">
                        <a-row v-for="i in departSelect[item]">
                          <a-col :span="100">
                            <a-checkbox :ref="item" :key="i.id" :value="i.id+'-'+item" @change="onChangeCheck">

                              <span :title="i.departName"> {{i.departName}}</span>
                            </a-checkbox>
                          </a-col>
                        </a-row>
                      </div>
                    </div>

                    <div class="optionBox">
                      <!--<center>-->
                      <a-button @click="toRight(item)" size="small">
                        <!--<a-icon type="right"/>-->
                        <a-icon type="add"/>
                        <!--添加到{{item}}-->
                        添加

                      </a-button>
                      &nbsp;
                      <a-button @click="toLeft(item)" size="small">
                        <!--<a-icon type="left"/>-->
                        <a-icon/>
                        <!--从{{item}}删除-->
                        删除
                      </a-button>
                      <!--</center>-->


                    </div>


                    <div class="userBox">
                      <h1 class="usertitle">待发送用户</h1>
                      <div class="userList">
                        <template>
                          <a-row v-for="i in departUsersMsg[item]">
                            <a-col :span="100">
                              {{i.username}} ( {{i.departName}})
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

      <a-modal
        title="请确认所选择的节点"
        :width="600"
        :visible="visible2"
        :confirmLoading="confirmLoading"
        @ok="confirm2"
        @cancel="cancel2"
        destroyOnClose
        okText="确认"
        cancelText="重新选择">

        <!--:customRow="departClickCheck"-->
        <!--:pagination="ipagination"-->

        <a-table
          ref="table"
          size="small"
          bordered
          rowKey="id"
          rowSelection
          :loading="loading"
          :customRow="customRowMy"
          :columns="columns3"
          :dataSource="actChoice"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys2,selectedRows:selectedRows2, onChange: onSelectChangeMy2}"
          @change="handleTableChange"
        >
        </a-table>


      </a-modal>
    </div>

  </a-modal>

</template>

<script>
  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import DictItemList from "../../system/DictItemList";


  export default {
    name: "nextUsers",
    mixins: [JeecgListMixin],
    components: {DictItemList},
    data() {
      return {
        singleDept: null,
        defaultSelectedKeys: [],
        scrHeight: window.innerHeight - 300 + 'px',
        title: '追加用户',
        okText: '确定',
        //控制组件数据可见
        isMul: false, //下一任务是单选/多选
        isDept: false,
        endType: false,//是否是结束节点
        nextsActs: [],
        endTime: '',
        //穿梭框数据
        mockData: [],
        //部门信息
        deptsList: [],
        //部门选择集合
        departSelect: {},
        //部门对应用户id
        departUsersId: {},
        departUsersMsg: {},
        userGroupByDepts:{},
        //环节分类，从属于 排他，并行，包容网关
        gateWayTypeSelect: {
          parallel: {},
          inclusive: {},
          normal: {}//有的话只会存在一个
        },
        typeCount: {
          normal: [],
          inclusive: [],
          parallel: [],
        },
        preCilck: null,
        //当前点击的节点
        currentClick: null,
        timeCheck: false,//是否限制时间
        columns: [

          {
            title: '用户姓名',
            align: "center",
            dataIndex: 'uname'
          }, {
            title: '所在部门',
            align: "center",
            dataIndex: 'dname'
          },
          // {
          //   title: '状态',
          //   align: "center",
          //   dataIndex: 'status',
          // },
        ],
        columns2: [
          {
            title: '部门名称',
            align: "center",
            dataIndex: 'departName'
          }
        ],
        columns3: [
          {
            title: '部门名称',
            align: "center",
            dataIndex: 'name'
          }
        ],
        dataSource: [],
        visible: false,
        visible2: false,
        confirmLoading: false,
        actChoice: [],
        selectedRowKeys2: [],
        selectedRows2: [],

        urls: {
          departUsetQuery: '/oaBus/taskInAct/deptUsersQuery'
        }
      }
    },
    computed: {},
    methods: {
      statusJudge() {
      },
      //进页面 初始数据
      showNextUsers(nextsActs) {
        this.nextsActs = nextsActs
        //统计数量
        for (let i of nextsActs) {
          let inclusiveGateway = i.actMsg.inclusiveGateway
          let parallelGateway = i.actMsg.parallelGateway
          if (inclusiveGateway) {
            this.typeCount.inclusive.push(i)
          } else if (parallelGateway) {
            this.typeCount.parallel.push(i)
          } else {
            this.typeCount.normal.push(i)
          }
          //记录节点
          this.showPreClick(i, false, false, true)
        }
        //---------默认选择 第一个环节----------
        this.defaultSelectedKeys.push(this.nextsActs[0].oaProcActinst.actId)
        this.clickAct(this.nextsActs[0]);

        this.visible = true
      },
      handleTableChangeMy(rowKeys, rows) {
        console.log(rows)
        //排除掉不可追加
        for (let i in rows){
          if (rows[i].status=='处理人') {
            this.$message.error('处理人不可选')
            return
          }
        } 

        this.onSelectChange(rowKeys, rows)
        //并记录用户
        this.showPreClick(this.currentClick, false, true, false)
      },
      onSelectChangeMy2(rowKeys, rows) {
        this.selectedRowKeys2 = rowKeys
        this.selectedRows2 = rows
      },
      //点击部门行 选中
      departClickCheck(res) {
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
      //点击单选行 选中
      setRowRadio(res) {
        return {
          on: {
            click: () => {
              let keys = [];
              keys.push(res.uid);
              this.selectedRowKeys = keys;

              //记录用户选择
              this.showPreClick(this.currentClick, false, true, false)
            }
          }
        }
      },
      //点击复选行 选中
      setRowCheck(res) {
        return {
          on: {
            click: (e) => {
              if (res.status == '处理人') {
                this.$message.error('处理人不可选')
                return
              }
              let rowkeys = this.selectedRowKeys;
              let rows = this.selectionRows;
              if (rowkeys.length > 0 && rowkeys.includes(res.uid)) {
                rowkeys.splice(rowkeys.indexOf(res.uid), 1);
                rows.splice(rowkeys.indexOf(res.uid), 1);
              } else {
                rowkeys.push(res.uid);
                rows.push(res)
              }
              this.selectedRowKeys = rowkeys;
              this.selectionRows = rows;
              //记录用户选择
              this.showPreClick(this.currentClick, false, true, false)
            }
          }
        }
      },
      customRowMy(res) {
        return {
          on: {
            click: () => {
              let rowkeys = this.selectedRowKeys2;
              if (rowkeys.length > 0 && rowkeys.includes(res.id)) {
                rowkeys.splice(rowkeys.indexOf(res.id), 1);
              } else {
                rowkeys.push(res.id);
              }
              this.selectedRowKeys2 = rowkeys;
            }
          }
        }
      },
      //部门选
      onChangeCheck(item) {
        var id = (item.target.value).split('-')[0]
        var type = (item.target.value).split('-')[1]
        //修改数据属性(修改选中状态用来向左边传)
        for (var i in  this.departSelect[type]) {
          if (id == this.departSelect[type][i].id) {
            this.departSelect[type][i].checked = true
          }
        }
      },

      /**
       * 记录本次点击
       * 包容，并行：第一次点击：仅记录初始信息 每勾选/变更一次用户 就更新本节点选择
       * 普通[不记录暂时]：每次都是新数据
       * come 标识部门选择的来源(或者change事件过来的) false true
       */
      showPreClick(item, isMock, isChange, isShowNext) {


        //TODO 仅标识 @1.1 ###################################### 各种属性判断 #############################################
        //记录当前点击的节点 用于属性填充
        this.currentClick = item
        //是否是多选
        this.isMul = item.actMsg.allowMulti && item.oaProcActinst.multAssignee
        //是否选部门
        this.isDept = (item.oaProcActinst.userOrRole) == 'dept'

        if (this.isDept) {

          var length = item.oaProcActinst.deptsList.length == 0 ? 1 : item.oaProcActinst.deptsList.length

          setTimeout(() => {
            let domItemPartBox = document.querySelectorAll('.itemPartBox');

            console.log(domItemPartBox);

            for (let itemPartBox of domItemPartBox) {
              console.log(itemPartBox)
              if (length == 1) {
                itemPartBox.style.width = '100%'
              } else if (length == 2) {
                itemPartBox.style.width = '49.8%'
              }
            }
          }, 1000)
        }

        //TODO 仅标识 @1.2 ############################################  数据源 ###########################################
        if (!this.isDept) {
          this.dataSource = item.nextUsers
        }

        //节点性质(普通节点还是并行/包容)
        let isNormal = true


        //判断是否是已经记录过
        let haveRecord = false
        let isParallel = item.actMsg.parallelGateway
        let isInclusive = item.actMsg.inclusiveGateway

        //如果不是并行/包容就 不是普通性质
        if (isParallel || isInclusive) isNormal = false

        // if (!isNormal) {//不是普通节点 判断是否记录过
        let act = this.gateWayTypeSelect.inclusive[item.actMsg.id]
        let act1 = this.gateWayTypeSelect.parallel[item.actMsg.id]
        let act2 = this.gateWayTypeSelect.normal[item.actMsg.id]
        if (act != undefined || act1 != undefined || act2 != undefined) {
          haveRecord = true
        }
        // }


        //TODO 仅标识  @2 ############################################ 数据回显/初始化 ###################################

        //判断类型是并行还是包容//并记录选择的内容
        let select = {}
        //记录节点属性
        select['activity'] = item
        if (this.isDept) {
          this.selectedRowKeys = []
          this.selectionRows = []
          //部门
          if (haveRecord && !isNormal) {
            let current = null
            //使用已经记录的数据
            if (isMock) {//是穿梭框过来的用选择的数据覆盖记录数据
              // this.deptsList = item.oaProcActinst.deptsList
              select['deptsList'] = this.deptsList
              select['departSelect'] = this.departSelect
              select['departUsersId'] = this.departUsersId
              select['departUsersMsg'] = this.departUsersMsg
              current = select
            } else {//用记录的数据覆盖 显示数据
              //是并行里的还是 包容里的

              if (isParallel) {
                current = this.gateWayTypeSelect.parallel[item.actMsg.id]
              }
              if (isInclusive) {
                current = this.gateWayTypeSelect.inclusive[item.actMsg.id]
              }
              select = current
              this.deptsList = current.deptsList
              this.departSelect = current.departSelect
              this.departUsersId = current.departUsersId
              this.departUsersMsg = current.departUsersMsg
            }

            this.mockData = []

            if (current != undefined && current != null) {
              let ids = []
              for (let k in current.departSelect) {
                for (let u in current.departSelect[k]) {
                  ids.push(current.departSelect[k][u].id)
                }
              }
              for (let i in item.nextUsers) {
                let id = item.nextUsers[i].id
                if (ids.indexOf(id) == -1) {
                  this.mockData.push(item.nextUsers[i])
                }
              }
            }
          }
          if ((isNormal && !isMock) || !haveRecord) {//是普通性质，或者初次点击进入
            this.selectionRows = []
            this.selectedRowKeys = []
            this.deptsList = item.oaProcActinst.deptsList
            select['deptsList'] = item.oaProcActinst.deptsList
            select['departSelect'] = {}
            select['departUsersId'] = {}
            select['departUsersMsg'] = {}
            for (var x in  select.deptsList) {
              //TODO 仅标识*******备选信息用于页面展示
              this.departSelect[this.deptsList [x]] = []
              this.departUsersId[this.deptsList [x]] = []
              this.departUsersMsg[this.deptsList [x]] = []
              //TODO 仅标识******** 记录节点属性用于回显(包容/并行)
              //构造备选集合
              select['departSelect'][select.deptsList [x]] = []
              //部门选择用户集合构造
              select['departUsersId'][select.deptsList [x]] = []
              //备选用户完整信息
              select['departUsersMsg'][select.deptsList [x]] = []
            }
            this.mockData = item.nextUsers
          }

        } else {//选人的


          if (isChange) {//用选择的数据覆盖 记录数据
            select.selectedRowKeys = this.selectedRowKeys
            select.selectionRows = this.selectionRows
          }
          if (haveRecord && !isNormal) {
            //已经记录并且是 (包容/并行)性质 用记录的覆盖
            //是点击进来的还是 通过change事件进来的
            // isChange
            if (!isChange) {//用记录的数据回显 显示数据
              let current = null
              if (isParallel) {
                current = this.gateWayTypeSelect.parallel[item.actMsg.id]
              }
              if (isInclusive) {
                current = this.gateWayTypeSelect.inclusive[item.actMsg.id]
              }
              select = current
              if (current != null && current != undefined) {
                this.selectedRowKeys = current.selectedRowKeys
                this.selectionRows = current.selectionRows
              }
            }
          }

          //默认选中第一个
          if (this.dataSource.length > 0 && !isShowNext && !isChange) {
            if (this.selectedRowKeys.length == 0 || isNormal) {
              let defaultSelected = []

              for (let i of this.dataSource) {
                if (i.status != '处理人') {
                  defaultSelected.push(i.uid)
                  this.selectedRowKeys = defaultSelected
                  this.selectionRows.push(i)
                  break;
                }
              }


              select.selectedRowKeys = this.selectedRowKeys
              select.selectionRows = this.selectionRows
            }
          }
          if ((isNormal && !isChange) || !haveRecord) {//普通节点 或者是 初次点击

            //没有选的情况下默认选中表格第一个
            // this.selectedRowKeys = []
            // this.selectionRows = []
            select.selectedRowKeys = this.selectedRowKeys
            select.selectionRows = this.selectionRows
          }
        }

        if (isInclusive) {
          this.gateWayTypeSelect.inclusive[item.actMsg.id] = select
        }
        if (isParallel) {
          this.gateWayTypeSelect.parallel[item.actMsg.id] = select
        }
        if (isNormal) {
          this.gateWayTypeSelect.normal = {}
          this.gateWayTypeSelect.normal[item.actMsg.id] = select
        }

        // ////console.log('----------------网关记录：：：', JSON.stringify(this.gateWayTypeSelect))
      },
      //点击某一节点---选择节点相关信息
      clickAct(item) {
        this.singleDept = item.actMsg.name

        /**
         *  (包容/并行网关)展示上一节点的选择信息
         */
        this.showPreClick(item, false, false, false)

      },
      confirm() {

        // //时间校验
        // this.timeCheckMethod()
        //校验并行与包容
        let palllen = this.typeCount.parallel.length
        let ialllen = this.typeCount.inclusive.length
        if (palllen == 0 && ialllen == 0) {//非包容/并行
          this.singleType()
        } else {//包容/并行
          this.gateWayCheck()
          // this.moreThanOneType()
        }
      },
      //并行或包容
      moreThanOneType() {

        this.$emit('confirmNextUsersMore', this.gateWayTypeSelect, this.endTime)
      },
      //时间校验
      timeCheckMethod() {
        if (this.timeCheck) {
          if (this.endTime == '') {
            this.$message.error('请选择办理结束时间')
            return
          }
          if (new Date() > new Date(this.endTime)) {
            this.$message.error('办理结束时间不得小于当前时间')
            return
          }
        }
      },
      confirm2() {

        let isPass = this.moreThanOneUserCheck();
        if (isPass) {
          this.moreThanOneType()
          //关闭
          this.visible2 = false
          this.visible = false
        }
      },
      cancel2() {
        // this.dataInit()
        this.visible2 = false
        this.visible = false
      },
      recordChoice(acts, choices) {

        for (let i in choices) {
          let act = choices[i]
          let isDept = act.activity.oaProcActinst.userOrRole == 'dept'
          if (isDept) {
            let deptSelect = act.departSelect
            for (let i in deptSelect) {
              if (deptSelect[i].length > 0) {
                acts.push(act.activity.actMsg)
                this.selectedRowKeys2.push(act.activity.actMsg.id)
                break
              }
            }
          } else {
            if (act.selectedRowKeys.length > 0) {
              acts.push(act.activity.actMsg)
              this.selectedRowKeys2.push(act.activity.actMsg.id)
            }
          }
        }

      },
      //并行网关校验
      parallelCheck(acts) {
        let keys = []
        for (let i in this.gateWayTypeSelect.parallel) {
          keys.push(i)
        }

        for (let i in acts) {
          keys.splice(keys.indexOf(acts[i].id), 1)
        }

        if (keys.length > 0) {
          const h = this.$createElement;

          let names = []
          for (let i of keys) {
            names.push(h('p', `${this.gateWayTypeSelect.parallel[i].activity.actMsg.name}`))
          }

          let content_ = h('div', {}, names)

          const modal = this.$error({
            title: '以下节点共属于并行网关，必须选择用户',
            content: content_,
          });

          return false
        } else {
          return true
        }
      },
      //包容/并行网关校验
      gateWayCheck() {

        let acts = []
        this.selectedRowKeys2 = []
        this.recordChoice(acts, this.gateWayTypeSelect.parallel)
        this.recordChoice(acts, this.gateWayTypeSelect.inclusive)
        this.recordChoice(acts, this.gateWayTypeSelect.normal)

        this.selectedRows2 = acts

        let isShow = this.parallelCheck(acts);

        if (isShow) {
          this.visible2 = true
          this.actChoice = acts
        }

      },
      moreThanOneUserCheck() {


        for (let i in this.selectedRowKeys2) {
          let act = this.selectedRows2[i]
          let id = act.id
          let inclusiveGateway = act.inclusiveGateway
          let parallelGateway = act.parallelGateway

          let currentAct = null
          if (inclusiveGateway) {
            currentAct = this.gateWayTypeSelect.inclusive[id]
          }
          if (parallelGateway) {
            currentAct = this.gateWayTypeSelect.parallel[id]
          }
          if (!parallelGateway && !inclusiveGateway) {
            currentAct = this.gateWayTypeSelect.normal[id]
          }

          let isDept = currentAct.activity.oaProcActinst.userOrRole == 'dept'
          let name = currentAct.activity.actMsg.name

          if (isDept) {
            let haveUser = false
            for (let i in currentAct.departUsersId) {
              let uids = currentAct.departUsersId[i]
              if (i.indexOf("主办") >= 0) {
                if (uids.length <= 0) {
                  this.$message.error(name + " 环节，主办部门必须选择用户")
                  return false
                }
              }
              if (uids.length > 0) {
                haveUser = true
              }

              if (!haveUser) {
                this.$message.error(name + ' 环节,部门至少选择一组用户')
                return false
              }
            }

          } else {
            if (currentAct.selectedRowKeys.length <= 0) {
              this.$message.error(name + ' 环节未选择用户')
              return false
            }
          }
        }
        //构造参数
        // keys
        this.constructorParams(this.selectedRowKeys2, this.gateWayTypeSelect.parallel)
        this.constructorParams(this.selectedRowKeys2, this.gateWayTypeSelect.inclusive)
        this.constructorParams(this.selectedRowKeys2, this.gateWayTypeSelect.normal)

        // console.log('~~~~~~~~~~~~~~~~~~', JSON.stringify(this.gateWayTypeSelect))

        return true
      },
      constructorParams(keys, tasks) {
        //console.log('-----------keys:::', JSON.stringify(keys))
        for (let k in tasks) {
          if (keys.indexOf(k) < 0) {
            //改变完成条件
            let conditionContext = tasks[k].activity.actMsg.conditionContext
            if (conditionContext != undefined && conditionContext != null) {
              for (let i in conditionContext) {
                conditionContext[i] = 'no-' + conditionContext[i]
              }
            }
          }
        }

      },
      //非包容/并行网关办理方式
      singleType() {
        var ids = []
        if (this.isDept) {

          let ids = []
          let depMSg = {}
          for (let i in this.departUsersId) {

            if (i.indexOf("主办") >= 0 && this.departUsersId[i].length == 0) {
              this.$message.error(i + "部门必须选择用户")
              return
            }

            if (this.departUsersId[i].length > 0) {
              // ids.push(this.departUsersId[i])
              depMSg[i] = this.departUsersId[i]
            }
          }
          for (let k of Object.keys(this.userGroupByDepts)) {
            ids.push(this.userGroupByDepts[k])
          }
          if (ids.length==0){
            this.$message.error('请选择用户')
            return
          }
          // ////console.log('==========部门：：：', ids, JSON.stringify(this.currentClick))
          //校验
          this.$emit('func', ids, this.currentClick, this.endTime, depMSg)
          this.cancel()
        } else if (this.endType) {
          this.$emit('func', ids, this.currentClick, this.endTime)
          this.cancel()
        } else {
          //办理人校验
          if (this.selectedRowKeys.length <= 0) {
            this.$message.error("请选择办理人")
            return
          }
          ids = this.selectedRowKeys

          console.log('------普通：' + ids, JSON.stringify(this.currentClick))
          //办理流程
          this.$emit('func', ids, this.currentClick, this.endTime)
          this.cancel()
        }
      },
      //穿梭方法实现
      toRight: function (item) {
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
        // 更新用户显示
        this.currentDeptUserQuery(item)


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
        // 更新用户显示
        this.currentDeptUserQuery(item)

      },
      /**
       * 选中部门的用户查询
       * @param item
       */
      currentDeptUserQuery(item) {

        var role = this.currentClick.oaProcActinst.candidates
        var depts = this.departSelect

        var param = {}
        param.role = role
        param.depts = depts

        if (depts[item].length == 0) {
          this.departUsersId[item] = []
          this.departUsersMsg[item] = []
          let keys = []
          let rows = []
          this.onSelectChange(keys, rows)
          return
        }

        //查询部门对应的用户id 分组
        postAction(this.urls.departUsetQuery, param).then(res => {
          if (res.success) {
            // ////console.log('-------------->>>', JSON.stringify(res.result[item]))
            if (res.result[item].length == 0) {
              this.$message.error('所选' + item + '部门没有对应角色的用户')
              this.departUsersId[item] = []
              this.departUsersMsg[item] = []
              let keys = []
              let rows = []
              this.onSelectChange(keys, rows)
              return
            } else {
              let ids = []
              this.userGroupByDepts={}

              for (let i in res.result[item]) {
                ids.push(res.result[item][i].id)
                if (this.userGroupByDepts[res.result[item][i].departId]==undefined){
                  this.userGroupByDepts[res.result[item][i].departId]=[]
                  this.userGroupByDepts[res.result[item][i].departId].push(res.result[item][i].id)
                } else {
                  this.userGroupByDepts[res.result[item][i].departId].push(res.result[item][i].id)
                }
              }
              this.departUsersId[item] = ids
              this.departUsersMsg[item] = res.result[item]

              let keys = []
              let rows = []
              this.onSelectChange(keys, rows)

              //记录用户选择
              this.showPreClick(this.currentClick, true, false)
            }
          } else {
            this.$message.error(res.message)
            return
          }
        })

      }
      ,
      cancel() {
        //初始数据
        this.dataInit()

        this.$emit('close');
        this.visible = false;
      }
      ,
      onChange(date, dateString) {
        this.endTime = dateString
      }
      ,
      changeChoice(e) {
        if (e.target.value == 1) {
          //不限时间
          this.timeCheck = false
        } else {
          this.timeCheck = true
        }
      }
      ,
      dataInit() {
        this.singleDept = null
        this.defaultSelectedKeys = []
        // this.scrHeight = ''
        scrHeight: window.innerHeight-300+ 'px',

        this.isMul = false //下一任务是单选/多选
        this.isDept = false
        this.endType = false//是否是结束节点
        this.nextsActs = []
        this.endTime = ''
        //穿梭框数据
        this.mockData = []
        //部门信息
        this.deptsList = []
        //部门选择集合
        this.departSelect = {}
        //部门对应用户id
        this.departUsersId = {}
        this.departUsersMsg = {}
        //环节分类，从属于 排他，并行，包容网关
        this.gateWayTypeSelect = {
          parallel: {},
          inclusive: {},
          normal: {}//有的话只会存在一个
        }
        this.typeCount = {
          normal: [],
          inclusive: [],
          parallel: [],
        }
        this.preCilck = null
        //当前点击的节点
        this.currentClick = null
        this.timeCheck = false//是否限制时间

        this.dataSource = []
        this.actChoice = []
        this.selectedRowKeys = []
        this.selectedRows2 = []


        this.endTime = ''
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
    },

  }
</script>

<style scoped lang="less">
  .box {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .left {
      width: 30%;
      height: 380px;
      overflow-y: scroll;

      /deep/ .ant-table-small > .ant-table-content > .ant-table-body {
        margin: 0 !important;
      }
    }

    .rightt {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 69%;
      /*height: px;*/
      background: #ffffff;
      /*overflow-y: scroll;*/

      .itemPartBox {

        width: 33%;
        /*height: 100%;*/
        /*background: red;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        border: 1px solid #dddddd;
        padding: 10px;
        /*margin-top: 30px;*/
        margin-left: 8px;

        .partBox {
          width: 100%;
          height: 190px;
          overflow-y: scroll;

          /*background: #2eabff;*/

          /*padding-bottom: 20px;*/

          .partBoxChild {
            height: 150px;
            overflow-y: scroll;
          }

        }

        .optionBox {
          width: 100%;
          /*width: 30%;*/
          /*height: 30px;*/
          display: flex;
          align-items: center;
          justify-content: center;

          /*border-bottom: 1px solid #dddddd;*/
          padding-bottom: 5px;
          margin-top: 1px;

        }

        .userBox {
          /*width: 90%;*/
          width: 100%;


          .usertitle {
            padding: 5px;
            font-size: 15px;
            text-align: left;
            background: #d6ebff !important;
            /*border-bottom: 1px solid #dddddd;*/


          }

          .userList {
            height: 105px;
            background: #fff;
            /*margin-left: 150px;*/
            /*margin-right: 1px;*/
            /*margin-top: 20px;*/
            overflow-y: scroll;
          }
        }
      }


    }

    /*.rightRight1 {*/
    /*!*width: 90%;*!*/
    /*width: 50%;*/
    /*height: 120px;*/
    /*!*background: #fff;*!*/
    /*margin-left: 1px;*/
    /*margin-right: 10px;*/
    /*margin-top: 10px;*/
    /*overflow-y: scroll;*/
    /*}*/


    /*.rightLeft {*/
    /*width: 5%;*/
    /*}*/


  }
</style>