<template>
  <div>
    <div class="setting-drawer">
      <a-drawer
        :title="title"
        :width="scrWidth"
        placement="right"
        @close="closeDetailList"
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
              <a-radio-button value="0" @click="showPersonage">个人进展</a-radio-button>
              <a-radio-button value="1" @click="showShare">共享进展</a-radio-button>
              <a-radio-button value="2" @click="showAll">所有进展</a-radio-button>
            </a-radio-group>
            <div
              :style="{overflow: 'auto', position: 'relative',backgroundColor: '#f6f6f6',border: '1px solid #e0e0e0',height: scrHeight}">
              <div style="width: 98%;margin: 1%;">

                <a-table
                  ref="table"
                  size="middle"
                  rowKey="iid"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="false"
                  :customRow="doTask"
                  :expandRowByClick="true"
                  :rowClassName="(record,index) => {
                      let className  = 'light-row';
                      if (index % 2 === 1) className = 'dark-row';
                      return className;
          }"
                >

                </a-table>
              </div>
            </div>
            <a-button style="position: fixed;bottom:5px;right:100px" type="primary" @click="addDetail">新增</a-button>
            <a-button style="position: fixed;bottom:5px;right:22px" type="primary" @click="closeDetailList">关闭</a-button>
          </div>
        </div>
      </a-drawer>
    </div>
    <detailed-inst ref="detailedInst" @refresh="refresh"></detailed-inst>
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
        // selectedRowKeys2: [],
        // selectedRows2: [],
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
            dataIndex: 'dcreateTime'
          },
          {
            title: '有无附件',
            align: "center",
            dataIndex: 'iis2',
            customRender: function (iis2) {
              if (iis2 == '0') {
                return "无";
              } else if (iis2 == "1") {
                return "有";
              } else {
                return text;
              }
            }
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
        dataSource: [],
        expandedRowss: [],
        cmd: 1,
        // data1:{},
        detailData: {
          iid: 0,
          stable: "",
          itableId: 0,
          sopinion: "",
          iisOpen: 0,
          iis1: 0,
          iis2: 0,
          ddatetime1: '',
          screateName: "",
          screateBy: "",
          screateDept: "",
          screateDeptid: "",
        },
        confirmLoading: false,
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        visible: false,
        // visible1: false,
        title: "办理进展",
        scrWidth: window.innerWidth,
        scrHeight: window.innerHeight - 118 + 'px'
        // scrHeight: 500+ 'px'
      }
    },
    created() {

    },
    mounted() {
      // window.addEventListener('dblclick', e => this.handleCancel(e))
    },
    methods: {

      doTask(record, index) {
        return {
          on: {
            click: (event) => {
              // console.log(record);
              // console.log(index);
              // console.log(event);
              this.cmd = 2;
              // console.log("===========================>>>111111!!!"+JSON.stringify(record))
              this.$refs.detailedInst.showDrawerList(record, this.cmd);
            }
          }
        }
      },


      // getPgSecondList(expandedRows){
      // console.log(expandedRows)
      // this.expandedRowss = expandedRows[expandedRows.length - 1];
      // this.detailData=this.dataSource[this.expandedRowss]
      // this.detailData.cmd=2;
      // console.log("================================@@@@>>>列表"+JSON.stringify(this.detailData))
      // this.$refs.detailedInst.showDrawer22(this.detailData);
      // },
      // onSelectChangeMy2(rowKeys, rows) {
      //   // alert(rowKeys)
      //   // alert(JSON.stringify(rows))
      //   this.selectedRowKeys2 = rowKeys
      //   this.selectedRows2 = rows
      // },

      //个人
      showPersonage() {
        let myurl = "/oadatafetailedinst/oaDatadetailedInst/selectdetailedInst"
        getAction(myurl, {
          sTable: this.detailData.stable, iTableId: this.detailData.itableId,
          sCreateBy: this.detailData.screateBy, sCreateDeptid: this.detailData.screateDeptid
        }).then(res => {
          this.dataSource = res.result;
        });
      },
      //共享
      showShare() {
        let shareurl = "/oadatafetailedinst/oaDatadetailedInst/selectSharedetailedInst"
        getAction(shareurl, {
          sTable: this.detailData.stable, iTableId: this.detailData.itableId,
          sCreateBy: this.detailData.screateBy, sCreateDeptid: this.detailData.screateDeptid
        }).then(res => {
          this.dataSource = res.result;
        });
      },
      //所有
      showAll() {
        let allurl = "/oadatafetailedinst/oaDatadetailedInst/selectAlldetailedInst"
        getAction(allurl, {sTable: this.detailData.stable, iTableId: this.detailData.itableId}).then(res => {
          this.dataSource = res.result;
        });
      },
      handleSizeChange(e) {
        this.size = e.target.value;
      },

      addDetail() {
        this.cmd = 1;
        console.log("===========================>>>新增!!!" + JSON.stringify(this.detailData))

        this.$refs.detailedInst.showaddDrawer(this.detailData, this.cmd);
      },

      //列表展示
      show(data) {
        // this.data=data;
        this.detailData.stable = data.table;
        this.detailData.itableId = data.i_id;
        this.detailData.screateName = data.s_create_name;
        this.detailData.screateBy = data.s_create_by;
        this.detailData.screateDept = data.s_create_dept;
        this.detailData.screateDeptid = data.s_create_deptid;

        let myurl = "/oadatafetailedinst/oaDatadetailedInst/selectdetailedInst"
        getAction(myurl, {
          sTable: data.table, iTableId: data.i_id,
          sCreateBy: data.s_create_by, sCreateDeptid: data.s_create_deptid
        }).then(res => {
          this.dataSource = res.result;
        });
        this.visible = true
      },

      refresh(cmd) {
        console.log("================================@@@@>>>!!!!《《《刷新" + JSON.stringify(this.detailData))
        // console.log("================================@@@@>>>!!!!《《《"+JSON.stringify(this.detailData.sTable))
        console.log("================================@@@@>>>删除!!!!《《《"+JSON.stringify(cmd))
        let myurl = "/oadatafetailedinst/oaDatadetailedInst/selectdetailedInst";
        getAction(myurl, {
          sTable: this.detailData.stable, iTableId: this.detailData.itableId,
          sCreateBy: this.detailData.screateBy, sCreateDeptid: this.detailData.screateDeptid
        }).then(res => {
          this.dataSource = res.result;
        });

      },
      closeDetailList() {
        this.$emit('close');
        this.visible = false;
      },
    },


    // dataup(data){
    //   this.data1=data
    //   console.log("3333333333333333",JSON.stringify(this.data1))
    // }

  }
</script>

<style lang="less" scoped>

</style>