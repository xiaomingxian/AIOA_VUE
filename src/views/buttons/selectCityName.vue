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
            title: '地市',
            dataIndex: 'text',
            width: 300,
            align: "center",
          }],
        busData: [],
        userData: [],
        clientType:"",
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
      show(data,type) {
        this.clientType = type;
        this.busData = data;
        this.initData();
        this.visible = true;
      },
      //初始化数据，查出部门名称对应的数据字典数据
      initData() {
        getAction('/sys/dict/getDictByKeyObj', {dictKey: 'org_schema'}).then(res => {
          console.log(res.result);
          this.mockData1 = res.result;
        })
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      handleOk() {
        let obj = this.selectionRows;
        let data = this.busData;
        if (obj.length <= 0) {
          this.$message.error("请选择地市")
          return;
        }
        let param = {};
        // param.cityUrl = obj;  //地市url
        param.busData = data; //业务数据
        param.cityUrl = obj;  //地市url
        if (this.clientType == 1){
          postAction('oaBus/dynamic/provinceToCity',param).then(res=>{
            if(res.success && res.result == 200){
              this.$message.success("地市传输成功！");
              this.insertLog(obj);//记录传输日志；
              setTimeout(function () {
                this.close()
              }, 500)
            }else {
              this.$message.error(obj[i].text+"调用接口失败")
            }
          })
        }
        if (this.clientType == 2){
          postAction('oaBus/dynamic/provinceToCityInside',param).then(res=>{
            if(res.success && res.result == 200){
              this.$message.success("地市传输成功！");
              this.insertLog(obj);//记录传输日志；
              setTimeout(function () {
                this.close()
              }, 500)
            }else {
              this.$message.error(obj[i].text+"调用接口失败")
            }
          })
        }
      },
      insertLog(obj){
        for (var  i in  obj) {
          //组装参数--传输日志记录
          let oaOutLog = {};
          oaOutLog.i_bus_model_id = this.busData.i_bus_model_id;
          oaOutLog.i_bus_function_id = this.busData.i_bus_function_id;
          oaOutLog.s_busdata_table = this.busData.table;
          oaOutLog.i_busdata_id = this.busData.i_id;
          oaOutLog.i_type = 2;
          oaOutLog.s_rec_unitid = obj[i].id;
          this.insertOaOutLog(oaOutLog);
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




