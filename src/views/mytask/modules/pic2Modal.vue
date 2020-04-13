<template>
  <div class="setting-drawer">
    <a-drawer
      :width="scrWidth"
      placement="right"
      :closable="visible"
      @close="handleCancel"
      :visible="visible"
      :style="{}"
    >
      <div>
        <div class="bingpai" >
          <a-button @click="showPict" block>流程图查看</a-button>
          <a-button @click="traceP" block>流程跟踪表</a-button>
          <a-button @click="backRecordClick" block>撤回/回退记录</a-button>
        </div>
        <div :style="{overflow: 'auto', position: 'relative',backgroundColor: '#f6f6f6',border: '1px solid #e0e0e0',height: scrHeight}">


          <div style="width:100%;position: relative" v-if="showPic">


            <div v-for="item in styles" class="div" :style='item'></div>

            <img :src="picurl" v-show="visible"/>
            <!--position:fixed; bottom:0;right:0px-->
            <a-button style="position: absolute;bottom:0px;right:0px" @click="handleCancel">关闭</a-button>


          </div>
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
          }"
            >

            </a-table>
            <a-button style="position: absolute;bottom:0px;right:0px" @click="handleCancel">关闭</a-button>


          </div>

          <div v-if="backRecord" style="width: 98%;margin: 1%;">

            <!--  :customRow="rowClick"-->
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
          }"
            >

            </a-table>
            <a-button style="position: absolute;bottom:0px;right:0px" @click="handleCancel">关闭</a-button>

          </div>
          <!--position:fixed;-->

        </div>
      </div>
    </a-drawer>
  </div>

</template>
<style type="text/css">

  .div {
    border: 2px solid red;
    padding: 5px;
  }

  .bingpai {
    display: flex;
    width: fit-content;
  }

</style>

<script>

  import {getAction, picUrl, postAction} from '@/api/manage'


  export default {
    name: "pic2ModalFull",
    inject: ['reload'],
    data() {
      return {
        scrWidth: window.innerWidth,
        scrHeight: window.innerHeight + 'px',//- 320
        // scrHeight: window.innerHeight + 'px',
        // scrHeight: 500 + 'px',
        styles: [],
        title: '流程查看',
        confirmLoading: false,
        visible: false,
        isEnd: false,//流程是否已经结束
        endTime: '',
        // visible: false,
        full: false,
        trace: false,
        showPic: true,
        picurl: '',
        locationUrl: '',
        record: '',
        //************* table **************
        dataSource: [],
        columns: [
          {
            title: '环节名称',
            align: "center",
            dataIndex: 'taskDefName'
          },
          {
            title: '负责人',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '部门',
            align: "center",
            dataIndex: 'deptName'
          },
          {
            title: '完成时间',
            align: "center",
            dataIndex: 'endTime'
          },

        ],
        backRecord: false,
        columns2: [
          // {
          //   title: '环节名称',
          //   align: "center",
          //   dataIndex: 'name'
          // },
          {
            title: '撤回/回退人',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '撤回/回退记录',
            align: "left",
            dataIndex: 'log'
          }, {
            title: '回退原因',
            align: "left",
            dataIndex: 'backReason'
          },
          {
            title: '完成时间',
            align: "center",
            dataIndex: 'endTime'
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
              if (res.assignee.indexOf('回退') == 0) {
                //查询意见 table tableid 环节 任务id
                let url = '/oaBus/dynamic/query'
                let taskId = res.id
                let table = this.record.table + '_opinion'
                let dataId = this.record.tableId
                postAction(url, {
                  i_busdata_id: dataId,
                  table: table,
                  s_task_id: taskId,
                  s_opinion_type: -1
                }).then(res => {
                  if (res.success) {
                    console.log()


                    const h = this.$createElement;
                    let content = []
                    for (let i in res.result.records) {
                      let msg = res.result.records[i]
                      content.push(h('p', `${msg.s_name} (${msg.s_dept_name}) ：${msg.s_opinion}`))
                    }

                    if (content.length == 0) {
                      content = ['暂无数据']
                    }
                    let content_ = h('div', {}, content)

                    const modal = this.$success({
                      title: '回退原因',
                      content: content_,
                    });

                  } else {
                    this.$message.error('查询意见失败')
                  }
                })

              } else {
                console.log('---------->>>>撤回没有意见')
              }

            }
          }
        }
      },
      showDrawer() {
        this.visible = true
        this.showPict();
      },
      showPicFull() {
        // const img = new Image();
        // img.src = this.picurl;
        // const newWin = window.open("", "_blank");
        // newWin.document.write(img.outerHTML);
        // newWin.document.title = "流程图"
        // newWin.document.close();
      },
      backRecordClick() {
        var procInstId = this.record.processInstanceId


        let url = ''
        if (this.record.table == '' || this.record.table == undefined) {
          // this.$message.error('业务数据信息不完整,请检查是否是过期数据')
          url = 'wf/task/backRecordQuery?procInstId=' + procInstId
          // return
        } else {
          let table = this.record.table + '_opinion'

          url = 'wf/task/backRecordQuery?procInstId=' + procInstId + '&table=' + table + '&endTime=' + this.endTime
        }


        getAction(url).then(res => {
          if (res.success) {
            this.dataSource = res.result
            this.backRecord = true
            this.showPic = false
            this.trace = false
          } else {
            this.$message.error(res.message)
          }
        })


      },
      show(record) {
        this.record = record

        this.visible = true
        this.showPict();

      },
      showPict() {
        var procInstId = this.record.processInstanceId
        var taskDefinitionKey = this.record.taskDefinitionKey
        var processDefinitionId = this.record.processDefinitionId

        //查询图片
        // window._CONFIG['domianURL'] +
        // this.picurl = '/wf/process/resource/read?processDefinitionId='
        //   + processDefinitionId + '&resourceType=image'

        this.picurl = '/wf/task/queryProPlan?ProcessInstanceId='
          + procInstId + '&endTime=' + this.endTime
        this.oldPic = this.picurl
        // this.locationUrl = '/wf/task/pointLocationQuery?processId=' + procInstId + '&taskId=' + taskDefinitionKey
        //   + "&processDefinitionId=" + processDefinitionId


        picUrl(this.picurl).then(res => {
          this.picurl = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.visible = true;
        })


        //坐标
        // getAction(this.locationUrl).then(res => {
        //
        //   this.styles = []
        //   for (let i in res.result) {
        //     var x = res.result[i].x;
        //     var y = res.result[i].y;
        //     var width = res.result[i].width;
        //     var height = res.result[i].height;
        //     // let style = "position:absolute;left:" + x + "px;top:" + (y + 31) + "px;width:" + (width + 1) + "px;height:" + (height + 1) + "px"
        //     let style = "position:absolute;left:" + x + "px;top:" + y + "px;width:" + (width + 1) + "px;height:" + (height + 1) + "px"
        //     this.styles.push(style)
        //   }
        //
        // })


        this.showPic = true
        this.trace = false
        this.backRecord = false


      },

      traceP() {
        let url = 'oaBus/taskInAct/workTrack'


        getAction(url, {
          proInstId: this.record.processInstanceId,
          endTime: this.endTime

        }).then(res => {
          if (res.success) {
            this.dataSource = res.result
            this.showPic = false
            this.trace = true
            this.backRecord = false
          } else {
            this.$message.error(res.message)
          }
        })


      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
      }, onSelectChange() {
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