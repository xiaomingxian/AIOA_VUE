<template>
  <a-modal
    :title="title"
    :width="710"
    :height="450"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <!--<p class="title"><span>{{item.depart_name}}</span></p>-->
    <a-table ref="table"
             size="middle"
             bordered
             :columns="columns"
             :dataSource="mockData1"
             :pagination="false"
             :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    >
    </a-table>

  </a-modal>
</template>
<script>

  import {getAction, postAction} from "@/api/manage";
  import {taskBth} from "./btn-js/taskBtn";


  export default {
    name: "selectUnitName",
    mixins: [taskBth],
    data() {
      return {
        columns: [
          {
            title: '县行',
            dataIndex: 'depart_name',
            width: 300,
            align: "center",
          }],
        busData: [],
        userData: [],
        selectedRowKeys: [],
        selectionRows: [],
        mockData1: [],
        usersAndTable: [],
        visible: false,
        url: {
          queryDownUnits: '/oaBus/dynamic/queryUnitsByUser',
          downSendFile: '/oaBus/dynamic/downSendFile',
          updateBusdata: '/oaBus/dynamic/update',
          updateData: '/oaBus/dynamic/updateData', //普通修改数据
          insertPermit: '/oaBus/dynamic/insertPermit', //普通修改数据
          copyFile: '/oaBus/oaFile/copyFile' //复制附件
        }
      }
    },
    methods: {

      show(data) {
        // console.log(data)
        this.busData = data;
        this.initData();
        this.visible = true;
      },
      //初始化数据，查出部门名称对应的数据字典数据
      initData() {
        let url = this.url.queryDownUnits;
        postAction(url).then((rec) => {
          this.mockData1 = rec.result;
        })
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      handleOk() {
        let departs = [];
        let obj = this.selectionRows;
        if (obj.length <= 0) {
          alert("请选择下发县行")
          return;
        }
        //组装县行id
        for (let i in obj) {
          departs.push(obj[i].id)
        }
        var map = {};
        map['unit'] = departs;
        //查询县行角色管理员用户
        let flag = false;
        postAction(this.url.downSendFile, map).then((res) => {
          if (res.success) {

            let unitData = res.result["unitTables"];
            this.userData = res.result;
            //遍历县行
            for (let i in unitData) {
              let param = {};
              param.modelId = unitData[i].modelId;
              param.functionId = unitData[i].functionId;
              let unitId = unitData[i].unitId;
              //新建任务
              postAction("/oaBus/oaBusdata/queryNewTaskMsg", param).then(res => {
                if (res.success) {
                  /**
                   * 收文页面数据
                   * s_title 标题
                   * s_create_name  登记人员
                   * d_create_time 收文日期
                   * d_datetime1 成文日期
                   * s_file_num 文件字号
                   * s_varchar4 来文文种
                   * s_receive_num 来文字号
                   * s_varchar5  来文机关
                   */
                  let receiveData = {};
                  receiveData.s_title = this.busData.s_title  //标题
                  receiveData.d_sealdate = this.busData.d_sealdate//成文日期  d_sealdate
                  receiveData.s_receive_num = this.busData.s_file_num //来文字号 s_file_num
                  receiveData.s_varchar5 = this.busData.s_unit_name//来文机关 s_unit_name
                  receiveData.i_urgency = this.busData.i_urgency; //缓急 i_urgency
                  receiveData.i_bigint1 = this.busData.i_bigint1  //印发份数
                  receiveData.i_bigint2 = this.busData.i_bigint2  //正文页数
                  receiveData.table = res.result.tableName
                  receiveData.i_id = res.result.busdataId
                  receiveData.s_create_by = "";
                  let user = this.userData[unitId];
                  for (let j = 0; j < user.length; j++) {
                    receiveData.s_create_by += user[j].userId + ","; //创建人
                  }
                  //更新数据
                  postAction(this.url.updateData, receiveData).then(res => {
                    if (res.success) {
                      //开启流程
                      postAction(this.url.updateBusdata, {updateBusdata: res.result}).then(res => {
                        if (res.success) {
                          for (var key in this.userData) {
                            if (key == unitId) {
                              let users = [];
                              users = this.userData[key];
                              postAction(this.url.insertPermit, {
                                list: users,
                                functionId: param.functionId,
                                iBusdataId: receiveData.i_id,
                                table: receiveData.table
                              }).then(res => {
                                if (res.success){
                                  //复制发文附件
                                  let fileParam = {};
                                  fileParam.sTable = this.busData.table; //发文业务表
                                  fileParam.iTableId = this.busData.i_id; //发文业务数据id
                                  fileParam.sFileType = 4; //附件类型
                                  fileParam.receiveTable = receiveData.table;
                                  fileParam.receiveId = receiveData.i_id
                                  postAction(this.url.copyFile,fileParam).then(res => {
                                    if (res.success) {
                                      //组装参数--传输日志记录
                                      let oaOutLog = {};
                                      oaOutLog.i_bus_model_id = this.busData.i_bus_model_id;
                                      oaOutLog.i_bus_function_id = this.busData.i_bus_function_id;
                                      oaOutLog.s_busdata_table = this.busData.table;
                                      oaOutLog.i_busdata_id = this.busData.i_id;
                                      oaOutLog.i_type = 1;
                                      oaOutLog.s_rec_unitid = unitId;
                                      this.insertOaOutLog(oaOutLog);  //记录传输日志；

                                      if (i == unitData.length-1){
                                        flag = true;
                                        this.$message.success("下发成功！")
                                      }
                                    } else {
                                      this.$message.error("附件复制失败！")
                                    }
                                  })
                                }else {
                                  this.$message.error("用户权限写入失败！")
                                }
                              })
                            }
                          }
                        } else {
                          this.$message.error("开启流程失败！")
                        }
                      })

                    } else {
                      this.$message.error("业务数据更新失败！")
                    }

                  })
                } else {
                  this.$message.error("新建任务失败！")
                }
              })
            }
            this.close()
          } else {
            this.$message.error("查询角色管理员失败！")
          }
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.selectionRows = [];
        this.selectedRowKeys = [];
        this.busData = [];
      },

      handleCancel() {
        this.close();
      },

    },
  }
</script>




