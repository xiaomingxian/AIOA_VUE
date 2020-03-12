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
  import axios from 'axios'
  import {taskBth} from "./btn-js/taskBtn";


  export default {
    name: "selectCityName",
    mixins: [taskBth],
    data() {
      return {
        columns: [
          {
            title: '地市中支',
            dataIndex: 'text',
            width: 300,
            align: "center",
          },
          {
            title: '发送状态',
            dataIndex: 'send_status',
            width: 300,
            align: "center",
            customRender: function (id) {
              if (id == "1") {
                return "已发送";
              } else if (id == "0") {
                return "未发送";
              } else {
                return id;
              }
            }
          },
        ],
        busData: [],
        userData: [],
        clientType: "",
        selectedRowKeys: [],
        selectionRows: [],
        mockData1: [],
        usersAndTable: [],
        visible: false,
        oaOutLogList: [],
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
      show(data, type) {
        this.clientType = type;
        this.busData = data;
        this.initData();
        this.visible = true;
      },
      //初始化数据，查出部门名称对应的数据字典数据
      initData() {
        let param = {};
        param.iBusModelId = this.busData.i_bus_model_id
        param.iBusFunctionId = this.busData.i_bus_function_id
        param.sBusdataTable = this.busData.table
        param.iBusdataId = this.busData.i_id
        param.iType = 2  //1.机构id 2.数据字典值id
        if (this.clientType == 1) {
          param.sSendName = '省会转地市收文';
          this.getUserMessage(param);
        }
        if (this.clientType == 2) {
          param.sSendName = '省会转地市传阅'
          this.getUserMessage(param);
        }

        // this.queryOaOutLogById(param);
      },
      //获取用户信息，判断是否用orgshema
      getUserMessage(param) {
        getAction('/sys/user/getLoginInfo').then(res => {
          if (res.orgSchema == null || res.orgSchema == '') {
            //查询不带orgSchema--字典值（btn_sdSendUrl）
            this.getSendUrl(param);
          } else if (res.orgSchema != null) {
            //带orgSchema--查字典值（org_schema）
            this.queryOaOutLogById(param)
          } else {
            this.$message.error(res.message)
          }
        })
      },
      getSendUrl(param) {
        getAction('oaBus/dynamic/queryOaOutLogById', param).then(res => {
          this.oaOutLogList = res.result;
          if (res.success) {
            if (res.result.length > 0) {
              getAction('/sys/dict/getDictByKeyObj', {dictKey: 'btn_sdSendUrl'}).then(res => {
                res.result.map((item) => {
                  item.description = item.value;
                  item.value = null;
                  if (this.oaOutLogList.includes(item.id)) {
                    item.send_status = 1;
                  } else {
                    item.send_status = 0;
                  }
                })
                this.mockData1 = res.result;
              })
            } else {
              getAction('/sys/dict/getDictByKeyObj', {dictKey: 'btn_sdSendUrl'}).then(res => {
                res.result.map((item) => {
                  item.description = item.value;
                  item.value = "";
                  item.send_status = 0;
                })
                this.mockData1 = res.result;
              })
            }
          }

        })

      },
      //查询对外传输日志
      queryOaOutLogById(param) {
        getAction('oaBus/dynamic/queryOaOutLogById', param).then(res => {
          if (res.success) {
            if (res.result.length > 0) {
              this.oaOutLogList = res.result;
              getAction('/sys/dict/getDictByKeyObj', {dictKey: 'org_schema'}).then(res => {
                if (res.result.length > 0) {
                  res.result.map((item) => {
                    if (this.oaOutLogList.includes(item.id)) {
                      item.send_status = 1;
                    } else {
                      item.send_status = 0;
                    }
                  })
                  this.mockData1 = res.result
                }
              })
            } else {
              getAction('/sys/dict/getDictByKeyObj', {dictKey: 'org_schema'}).then((res) => {
                res.result.map((item) => {
                  item.send_status = 0;
                })
                this.mockData1 = res.result
              })
            }

          }
        })
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      handleOk() {
        let busdata = this.busData;
        let obj = this.selectionRows;
        let data = this.busData;
        if (obj.length <= 0) {
          this.$message.error("请选择地市")
          return;
        }
        let param = {};
        // param.cityUrl = obj;  //地市url
        param.busData = data; //业务数据
        // alert(JSON.stringify(obj))
        if (this.clientType == 1) {
          for (let i in obj){
            param.cityUrl = obj[i];  //地市url
            postAction('oaBus/dynamic/provinceToCity', param).then(res => {
              // alert(JSON.stringify(res))
              if (res.success === true && res.code === 200) {
                this.close();
                //组装参数--传输日志记录
                let oaOutLog = {};
                oaOutLog.i_bus_model_id = busdata.i_bus_model_id;
                oaOutLog.i_bus_function_id = busdata.i_bus_function_id;
                oaOutLog.s_busdata_table = busdata.table;
                oaOutLog.i_busdata_id = busdata.i_id;
                oaOutLog.i_type = 2;
                oaOutLog.s_rec_unitid = obj[i].id;
                this.insertOaOutLog(oaOutLog, 4);  //记录传输日志；
                // this.$message.success("地市传输成功！");
                if (i == obj.length-1){
                  this.$message.success(res.message);
                }
                // setTimeout(function () {
                //   this.close()
                // }, 500)
              } else {
                this.$message.error(obj[i].text+res.message)
              }
            })
          }

        }
        if (this.clientType == 2) {
          for (let i in obj) {
            param.cityUrl = obj[i];  //地市url
            postAction('oaBus/dynamic/provinceToCityInside', param).then(res => {
              if (res.success === true && res.code === 200) {
                //组装参数--传输日志记录
                let oaOutLog = {};
                oaOutLog.i_bus_model_id = busdata.i_bus_model_id;
                oaOutLog.i_bus_function_id = busdata.i_bus_function_id;
                oaOutLog.s_busdata_table = busdata.table;
                oaOutLog.i_busdata_id = busdata.i_id;
                oaOutLog.i_type = 2;
                oaOutLog.s_rec_unitid = obj[i].id;
                this.insertOaOutLog(oaOutLog, 5);  //记录传输日志；
                if (i == obj.length-1){
                  this.$message.success(res.message);
                }
                this.close()
                // setTimeout(function () {
                // }, 500)
              } else {
                this.$message.error(obj[i].text + res.message)
              }
            })
          }
        }
      },
      insertLog(obj, type) {
        for (var i in  obj) {
          //组装参数--传输日志记录
          let oaOutLog = {};
          oaOutLog.i_bus_model_id = this.busData.i_bus_model_id;
          oaOutLog.i_bus_function_id = this.busData.i_bus_function_id;
          oaOutLog.s_busdata_table = this.busData.table;
          oaOutLog.i_busdata_id = this.busData.i_id;
          oaOutLog.i_type = 2;
          oaOutLog.s_rec_unitid = obj[i].id;
          this.insertOaOutLog(oaOutLog, type);
        }
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




