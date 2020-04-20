<template>
  <div>
    <div class="setting-drawer">
      <a-drawer
        :title="title"
        :width="900"
        placement="right"
        :closable="visible"
        @close="handleCancel"
        :visible="visible"
        :style="{}"
      >

        <div>
          <!--<div class="bingpai" >-->
            <!--<a-button @click="showPict"  block>个人进展</a-button>-->
            <!--<a-button @click="traceP" block>共享进展</a-button>-->
            <!--<a-button @click="backRecordClick" block>所有进展</a-button>-->
          <!--</div>-->
          <div>
            <a-radio-group :value="size" @change="handleSizeChange">
              <a-radio-button value="0" @click="showPersonage" >个人进展</a-radio-button>
              <a-radio-button value="1" @click="showShare">共享进展</a-radio-button>
              <a-radio-button value="2" @click="showAll">所有进展</a-radio-button>
            </a-radio-group>
          <div :style="{overflow: 'auto', position: 'relative',backgroundColor: '#f6f6f6',border: '1px solid #e0e0e0',height: scrHeight}">
            <div  style="width: 98%;margin: 1%;">

                  <a-table
                    ref="table"
                    size="middle"
                    rowKey="taskKey"
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="false"
                    :rowSelection="{selectedRowKeys: selectedRowKeys2,selectedRows:selectedRows2, onChange: onSelectChangeMy2}"
                    :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"ss
                  >
                  </a-table>

            </div>
          </div>
            <a-button style="position: fixed;bottom:5px;right:100px" type="primary" @click="addDetail">新增</a-button>
            <a-button style="position: fixed;bottom:5px;right:22px" type="primary" @click="handleCancel">关闭</a-button>
          </div>
        </div>
      </a-drawer>
    </div>
    <detailed-inst ref="detailedInst"></detailed-inst>
  </div>
</template>

<script>

  import {getAction, httpAction, picUrl} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types";
  import detailedInst from "./detailedInst"
  export default {
    name: "oaDatadetailedInstModal",
    components: {
      detailedInst
    },
    data() {
      return {
        size: '0',
        index: [],
        length: [],
        selectedRowKeys2:[],
        selectedRows2:[],
        columns: [
          {
            title: '部门',
            align: "center",
            dataIndex: 'screateDept',
          },
          {
            title: '创建人',
            align: "center",
            dataIndex: 'screateName'
          },
          {
            title: '办理进展',
            align: "center",
            dataIndex: 'sopinion'
          },
          {
            title: '办理时间',
            align: "center",
            dataIndex: 'dDatetime1'
          },
          {
            title: '附件',
            align: "center",
            dataIndex: 'endTime'
          },
          {
            title: '办理状态',
            align: "center",
            dataIndex: 'iis1',
            customRender: function (iis1) {
              if (iis1 == '0') {
                return "办理中";
              } else if (iis1 == "1") {
                return "已办结";
              } else {
                return text;
              }
            }
          },
        ],
        newArr:[[]],        //表头

        dataSource: [

        ],
        detailData:{
          iId:0,
          sTable:"",
          iTableId:0,
          sOpinion:"",
          iIsOpen:0,
          iIs1:0,
          iIs2:0,
          dDatetime1:'',
          sCreateName:"",
          sCreateBy:"",
          sCreateDept:"",
          sCreateDeptid:"",
          cmd:1,
        },
        confirmLoading: false,
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        visible: false,
        visible1: false,
        title: "办理进展",
        scrWidth: window.innerWidth,
        scrHeight: window.innerHeight-118+'px'
        // scrHeight: 500+ 'px'
      }
    },
    created() {

    },
    // mounted() {
    //   window.addEventListener('dblclick', e => this.handleCancel(e))
    // },
    methods: {
      onSelectChangeMy2(rowKeys, rows) {
        this.selectedRowKeys2 = rowKeys
        this.selectedRows2 = rows
      },
      showPersonage(){
        let myurl="/oadatafetailedinst/oaDatadetailedInst/selectdetailedInst"
        getAction(myurl,{sCreateBy:this.detailData.sCreateBy,sCreateDeptid:this.detailData.sCreateDeptid}).then(res =>{
          this.dataSource = res.result;
        });
      },
      showShare(){
        let shareurl="/oadatafetailedinst/oaDatadetailedInst/selectSharedetailedInst"
        getAction(shareurl,{sTable:this.detailData.sTable,iTableId:this.detailData.iTableId,
          sCreateBy:this.detailData.sCreateBy,sCreateDeptid:this.detailData.sCreateDeptid}).then(res =>{
          this.dataSource = res.result;
        });
      },
      showAll(){
        let allurl="/oadatafetailedinst/oaDatadetailedInst/selectAlldetailedInst"
        getAction(allurl,{sTable:this.detailData.sTable,iTableId:this.detailData.iTableId}).then(res =>{
          this.dataSource = res.result;
        });
      },
      handleSizeChange(e) {
        this.size = e.target.value;
      },
      addDetail(){
        this.$refs.detailedInst.showDrawer(this.detailData);
      },

      show(data) {
        this.detailData.sTable=data.table;
        this.detailData.iTableId=data.i_id;
        this.detailData.sCreateName=data.s_create_name;
        this.detailData.sCreateBy=data.s_create_by;
        this.detailData.sCreateDept=data.s_create_dept;
        this.detailData.sCreateDeptid=data.s_create_deptid;


        let myurl="/oadatafetailedinst/oaDatadetailedInst/selectdetailedInst"
        getAction(myurl,{sCreateBy:this.detailData.sCreateBy,sCreateDeptid:this.detailData.sCreateDeptid}).then(res =>{
          // console.log("+++++++---------------------------!!!!",JSON.stringify(res.result));
          this.dataSource = res.result;
        });
        this.visible = true
      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
      }

    }
  }
</script>

<style lang="less" scoped>

</style>