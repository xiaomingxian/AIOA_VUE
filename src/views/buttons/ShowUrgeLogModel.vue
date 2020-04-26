<template>
  <div class="setting-drawer">
    <a-drawer
      :title="title"
      :width="scrWidth*0.7"
      placement="right"
      :closable="visible"
      @close="handleCancel"
      :visible="visible"
    >
      <div>
        <div class="bingpai" >
          <a-button @click="postponeLog" block>延期记录</a-button>
          <a-button @click="urgeLog" block>催办记录</a-button>
        </div>
        <div :style="{overflow: 'auto', position: 'relative',backgroundColor: '#f6f6f6',height:scrHeight}">
          <!--<div style="width:100%;position: relative" v-if="showPic">-->
            <!--<div v-for="item in styles" class="div" :style='item'></div>-->
            <!--<img :src="picurl" v-show="visible"/>-->
          <!--</div>-->
          <div v-if="trace" style="width: 98%;margin: 1%;">

            <a-table
              ref="table"
              size="middle"
              rowKey="taskKey"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="false"
              :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }">

            </a-table>


          </div>
          <div v-if="backRecord" style="width: 98%;margin: 1%;">
            <a-table
              ref="table"
              size="middle"
              rowKey="taskKey"
              :columns="columns2"
              :dataSource="dataSource"
              :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }">
            </a-table>
          </div>
          <a-button style="position: fixed;bottom:5px;right:22px" type="primary" @click="handleCancel">关闭</a-button>
        </div>
      </div>
    </a-drawer>
  </div>

</template>
<style type="text/css">

  .bingpai {
    display: flex;
    width: fit-content;
  }

</style>

<script>

  import {getAction, picUrl, postAction} from '@/api/manage'


  export default {
    name: "showUrgeLog",
    inject: ['reload'],
    data() {
      return {
        scrWidth: window.innerWidth,
        scrHeight: window.innerHeight-150 + 'px',//- 320
        // scrHeight: window.innerHeight + 'px',
        // scrHeight: 500 + 'px',
        styles: [],
        title: '督办日志',
        // confirmLoading: false,
        visible: false,
        // isEnd: false,//流程是否已经结束
        // endTime: '',
        // visible: false,
        // full: false,
        trace: false,
        // showPic: true,
        // picurl: '',
        // locationUrl: '',
        record: '',
        paramData:{},
        stable:'',
        tableId:'',
        //************* table **************
        dataSource: [],
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
            title: '操作用户',
            align: "center",
            dataIndex: 'screateName'
          },
          {
            title: '所属部门',
            align: "center",
            dataIndex: 'screateDept'
          },
          {
            title: '原办理时限',
            align: "center",
            dataIndex: 'dDatetime1'
          },
          {
            title: '新办理时限',
            align: "center",
            dataIndex: 'dDatetime2'
          },

        ],
        backRecord: false,
        columns2: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 80,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '催办用户',
            align: "center",
            width: 300,
            dataIndex: 'userName'
          },
          {
            title: '所属部门',
            align: "center",
            width: 300,
            dataIndex: 'log'
          },
          {
            title: '催办时间',
            align: "center",
            dataIndex: 'backReason'
          },
        ]
      }
    },
    created() {
      // this.show(newVal);

    },

    mounted() {
      window.addEventListener('dblclick', e => this.handleCancel(e))
    },
    methods: {
      rowClick(res) {
        return {
          on: {
            click: () => {

            }
          }
        }
      },
      postponeLog() {
        this.trace = true
        this.backRecord = false
        let url="/oadeferlog/oaDeferLog/selecturgeLog"
        getAction(url,{sTable:this.stable,iTableId:this.tableId}).then(res =>{
          this.dataSource=res.result;
          // console.log("--------->>",JSON.stringify(this.dataSource))
        })
      },
      showDrawer(data) {
        // console.log("--------->>",JSON.stringify(data))
        this.paramData=data;
        this.tableId=data.i_id;
        this.stable=data.table;
        this.trace=true
        let url="/oadeferlog/oaDeferLog/selecturgeLog"
        getAction(url,{sTable:this.stable,iTableId:this.tableId}).then(res =>{
          this.dataSource=res.result;
          // console.log("--------->>",JSON.stringify(this.dataSource))
        })
        this.visible = true
      },
      show(record) {
        this.record = record
        this.title=record.title
        this.visible = true
      },

      urgeLog() {
        this.backRecord=true;
        this.trace=false;
        let url="/oadeferlog/oaDeferLog/selecturgeInform"
        getAction(url,{iTableId:this.tableId}).then(res =>{
          this.dataSource=res.result;
        })
      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
      },
      onSelectChange() {
      }
    },
  }
</script>

<style lang="less" scoped>
  /deep/.ant-drawer-right{
    /deep/.ant-drawer-content-wrapper{
      background: #2eabff !important;
      /deep/.ant-drawer-content{
        /deep/.ant-drawer-wrapper-body{
          background: #2eabff !important;
        }
      }

    }
  }
  .ant-drawer-wrapper-body{

  }

  /*/deep/.setting-drawer{*/
    /*background: red !important;*/
  /*}*/
  .ant-btn {
    border-color: transparent;
  }

  .ant-btn:focus {
    border: 2px solid #bcbcbc;
    border-bottom: transparent;
  }
</style>