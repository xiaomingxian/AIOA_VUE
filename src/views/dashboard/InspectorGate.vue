<template>
  <div @mouseleave="mouseLeave" @mouseover="mouseOver" class="wrap">
    <div class="box">
      <div  style="display: inline-flex">
        <div class="top ttop" style="width: 60.3%">
          <div class="left"  style="width: 100%">
            <p class="titlebox">
            <span>
               <span class="shuline"></span>
               <span>待办工作</span>
               <b v-if="total"> {{total}}</b>
            </span>
              <span :style="iisFontSize" class="more" @click="DaiBanMore(0)">更多  <a-icon type="plus"></a-icon> </span>
            </p>
            <div class="itemline">
              <!--<div class="each" v-for="(item,index) in waitDoData" :key="index" @click="openDetialModel(item.table,item.tableId)" :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">-->
              <div class="each" v-for="(item,index) in waitDoData" :key="index" @click="openTodoTaskModel(item)"
                   :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">
                <p class="p">
                <span :title="item.title+'   '+item.createTime+item.name">

                    <section>
                        <i></i>
                      <span :style="iisFontSize">{{item.title}}</span>
                    </section>
                  <!--{{item.title|filterText}}-->
                  <!--等待修改   字段返回1,2,3，4   receiveFile.vue   中有缓急设置-->
                   <div class="div2" v-if="item.important==1">
                      <img src="../../assets/zhong.png" alt="">
                   </div>


                </span>
                  <span :style="iisFontSize">{{item.createTime|timeText}}</span>
                </p>
                <!--<a @click="doTask(item)">办理</a>-->
              </div>
            </div>
          </div>

        </div>


        <div class="top ttop" style="width: 39%;margin-left: 12px;position: relative;top: 121px;">

          <div class="right" style="width: 100%;height: 203%">
            <p class="titlebox">
            <span>
               <span class="shuline"></span>
              <!--<span>{{model1.sName}}</span>-->
              <span>数据分析</span>
            </span>
              <!--<span :style="iisFontSize" class="more" @click="openmore(model1.url,model1.sName)">更多 <a-icon type="plus"></a-icon> </span>-->
            </p>

            <div class="table-page-search-wrapper" style="width: 100%;margin-left: 7%;">
              <a-form>
                <a-row :gutter="12" style="width: 100%;display: inline-flex">
                  <a-col :md="7" :sm="24">
                      <a-form-item label="分析维度" style="display: inline-flex">
                      <a-select v-model="queryParam.d_create_time" style="width:200px;">
                        <a-select-option value="" disabled selected hidden>年份</a-select-option>
                        <a-select-option v-for="(item,index) in timeList" :key="index" :value="item">{{item}}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :md="7" :sm="24" style="width:200px;margin-left: 20%">
                    <a-form-item label="年度" style="display: inline-flex">
                      <a-select v-model="queryParam.d_create_time" style="width:200px;">
                        <a-select-option value="" disabled selected hidden>年份</a-select-option>
                        <a-select-option v-for="(item,index) in analysisDate" :key="index" :value="item">{{item.year}}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>




              <pei-chart v-show="showtype==1&&typeChart==1?true:false" ref="pie"> </pei-chart>
            </div>

          </div>
        </div>
      </div>






      <div class="bottom bbottom" style="width: 60.3%">
      <div class="left" style="width: 100%; height: 235px;text-align: center;display: inline-block">

          <a-card class="aCard">
            <p>领导批示办结率</p>
            <p>99%</p>
          </a-card>
        <a-card class="aCard">
          <p>办结率</p>
          <p>56%</p>
        </a-card>
        <a-card class="aCard">
          <p>督办件</p>
          <p>2030件</p>
        </a-card>



      </div>
      </div>



      <div class="bottom bbottom">

        <div class="right" style="width: 100%;height: 349px;">
          <p class="titlebox">
              <span>
                 <span class="shuline"></span>
                 <!--<span>{{model4.sName}}</span>-->
                 <span>部门分布</span>
                <!--<span>{{model4}}</span>-->
              </span>
            <!--<span :style="iisFontSize" class="more" @click="openmore(model4.url,model4.sName)">更多 <a-icon type="plus"></a-icon> </span>-->
          </p>


            <a-tabs @change="callback" type="card" style="width: 100%">
              <a-tab-pane tab="主办数量" key="1">
                <bar-chart ref="bar"></bar-chart>
              </a-tab-pane>
              <a-tab-pane tab="协办数量" key="2">
                <bar-chart ref="bar"></bar-chart>
              </a-tab-pane>
              <a-tab-pane tab="办结数量" key="3">
                <bar-chart ref="bar"></bar-chart>
              </a-tab-pane>
              <a-tab-pane tab="超期数量" key="4">
                <bar-chart ref="bar"></bar-chart>
              </a-tab-pane>
            </a-tabs>

          <!--<script>-->
            <!--export default {-->
              <!--data() {-->
                <!--return {};-->
              <!--},-->
              <!--methods: {-->
                <!--callback(key) {-->
                  <!--console.log(key);-->
                <!--},-->
              <!--},-->
            <!--};-->
          <!--</script>-->




        </div>
      </div>
    </div>
    <!--业务页面-->

    <detail-file ref="detailFile"></detail-file>

    <a-modal
      title="您当前有多个环节的待办，请选择一个环节"
      :width="600"
      :visible="haveMore"
      :confirmLoading="loading"
      @ok="confirm2"
      @cancel="cancel2"
      destroyOnClose
      okText="确认"
      cancelText="关闭">


      <!--      :customRow="customRowMy"-->

      <a-table
        ref="table"
        size="small"
        bordered
        rowKey="key"
        :loading="loading"
        :columns="columns3"
        :dataSource="dataSource3"
        :pagination="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys2,selectedRows:selectedRows2, onChange: onSelectChangeMy2,type:'radio'}"
      >
        <!--@change="handleTableChange"-->

      </a-table>


    </a-modal>

  </div>
</template>


<script>
  import HeadInfo from '@/components/tools/HeadInfo'
  import {getAction, httpAction, postAction} from '@/api/manage'
  import debounce from 'lodash/debounce';
  import Vue from 'vue'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import detailFile from '../mytask/taskList/detailFile'
  import axios from "axios";
  import {ACCESS_TOKEN} from "../../store/mutation-types";
  import { getLoginfo,getVisitInfo } from '@/api/api'
  import PeiChart from '../../views/data/dataGram/chartComponents/PieChart'
  import BarChart from '../../views/data/dataGram/chartComponents/BarChart'
  import { filterObj } from '@/utils/util';

  export default {
    mixins:[JeecgListMixin],
    components: {
      HeadInfo,
      BarChart,
      PeiChart
    },
    data() {
      this.lastFetchId = 0;
      this.fetchUser = debounce(this.fetchUser, 800);
      return {
        // 查询参数
        queryParam: {
          function_id: '',
          i_is_state: '',
          selType: '',
          s_create_name: '',
          d_create_time: '',
          orderFlag: '',    //排序字段
        },
        analysisDate: '',
        iisFontSize: {
          fontSize: '14px'
        },
        mouseFlag: false,
        // lastFetchId: 0,
        // fetchUser: debounce(this.fetchUser, 800),
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        baseData: [],
        data: [],
        fetching: false,
        search: '',
        postLists: [],// 公告列表
        userid: '',
        iisCalendar: 0,
        model1: [],
        model2: [],
        model3: [],
        model4: [],
        total: '',
        total1: '',
        total2: '',
        willdoindex: 1,
        pic: '',
        picurlLists: [],
        waitDoData: [],
        model1Lists: [],
        model2Lists: [],
        model3Lists: [],
        model4Lists: [],
        LinkList: [], //常用链接
        url: {
          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
          list: "/wf/task/queryTask?operstatus=task_todo",
          DaiBanlist: "/oaBus/supervisionPage/queryTask?operstatus=task_todo",
          analysisDate: "/data/dataAnalysis//analysis",
          Supervision:"/oaBus/supervisionPage/SupervisorSum",
          HostNum:"/oaBus/supervisionPage/HostNum",
          organizeNum:"/oaBus/supervisionPage/organizeNum",
          HomeList: '/oaBus/homeAnalysis/HomeList',
          Posturl: '/oaBus/oaBusdata/queryByModelId',
          MostUserLink: '/oaBus/Calendar/oaCalendar/MostUserLink',
          LinkLists: '/oaBus/Calendar/oaCalendar/LinkList',
        },
        //---------------------------------环节选择相关
        loading: false,
        haveMore: false,
        taskRecord: null,
        selectedRowKeys2: [],
        selectedRows2: [],
        dataSource3: [],
        columns3: [
          {
            title: '环节名称',
            align: "center",
            dataIndex: 'name'
          }
        ],

      }
    },
    filters: {
      filterText(text) { //电子公告
        if (text != undefined) {
          if (text.length > 55) {
            return text.substring(0, 35) + '...'
          } else {
            return text
          }
        }
      },
      timeText(text) {
        if (text != undefined) {
          if (text.length > 15) {
            return text.substring(0, 10)
          } else {
            return text
          }
        }
      },
      timeStrings(time) {
        let oneTime = new Date(time);
        let Y = oneTime.getFullYear();
        let M = oneTime.getMonth() + 1;
        let D = oneTime.getDate();
        // return Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D);
        //修改为永州需求  只显示月日
        return (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D);

      },
    },
    created() {

      //獲取用戶基本信息
      const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
      // console.log(userid);
      this.userid = userid;


      // this.$nextTick(() => {
      //   this.homeLists(this.userid);
      // })

      // this.waiteDoWith();

      this.DaiBan();
      this.dataAnalysis();
      this.sectorDistribution();

    },
    mounted() {

      //设置字体大小
      const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
      let url = "/testt/sysUserSet/queryByUserId";
      getAction(url, {userId: userid}).then((res) => {
        if (res.result.iisFontSize == 1) {
          this.iisFontSize.fontSize = '18px';
        } else if (res.result.iisFontSize == 3) {
          this.iisFontSize.fontSize = '14px';
        } else {
          this.iisFontSize.fontSize = '16px';
        }
        // document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
      })

      let height = document.body.clientHeight - 145;
      document.querySelector('.nav').style.height = height * .25 + 'px'
      document.querySelector('.box').style.height = height * .75 + 'px'


      document.querySelector('.ttop').style.height = (height * .75) / 2 + 'px'
      document.querySelector('.bbottom').style.height = (height * .75 - 20) / 2 + 'px'

      window.onresize = function () {

        let height = document.body.clientHeight - 145;
        document.querySelector('.nav').style.height = height * .25 + 'px'
        document.querySelector('.box').style.height = height * .75 + 'px'

        document.querySelector('.ttop').style.height = (height * .75) / 2 + 'px'
        document.querySelector('.bbottom').style.height = (height * .75 - 20) / 2 + 'px'
      }

    },
    components: {
      //业务
      detailFile,
    },
    methods: {
      callback(key) {
      console.log(key);
      },
      mouseOver() {
        //console.log(this.mouseFlag)
        if (!this.mouseFlag) {
          this.mouseFlag = true;
          this.DaiBan();
        }
      },
      mouseLeave() {
        //console.log(this.mouseFlag)
        this.mouseFlag = false;
      },
      //监听选择范围
      show(id, index) {
        let requestpicurl = window._CONFIG['domianURL'] + '/oaBus/Calendar/oaCalendar/MostUserLink?id=' + id + '&resourceType=image'
        axios.get(requestpicurl, {
          responseType: 'arraybuffer',
          headers: {
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
          }
        }).then(res => {
          // console.log(res)
          if (res) {
            this.LinkList[index].picUrl1 = 'data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            // console.log(this.LinkList)
          }
          // if(res.data.byteLength>4){
          //   this.LinkList[index].picUrl1 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          //   console.log(this.LinkList)
          //
          // }else{
          //   console.log("1112")
          //   this.LinkList[index].picUrl1 = '../../assets/1.png'
          // }
        })
      },
      openUrl(e) {
        if (!e) {
          this.$message.warn('此链接为空')
        }else{
          if (e.startsWith('http')) {
            window.open(e)
          } else {
            window.open('http://' + e)
          }
        }


        // console.log(e);
        // console.log(this.$refs[e][0]);
        // let lastChildNode = this.$refs[e][0].lastChild;
        // console.log(lastChildNode.childNodes[0].nodeType);
        //判断文本节点3     还是元素节点1
        // let nodeType = lastChildNode.childNodes[0].nodeType;
        // if (nodeType == '3') {
        //   console.log(lastChildNode.childNodes[0].nodeValue);
        //   let nodeValueUrl = lastChildNode.childNodes[0].nodeValue;
        //   window.open('http://' + nodeValueUrl)
        // } else {
        //   console.log(lastChildNode.childNodes[0].childNodes[0].getAttribute('href'));
        //   let nodeValueUrl1 = lastChildNode.childNodes[0].childNodes[0].getAttribute('href');
        //   console.log(lastChildNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getAttribute('href'))
        //   let nodeValueUrl2 = lastChildNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getAttribute('href')
        //   if(nodeValueUrl1!=null){
        //     window.open(nodeValueUrl1)
        //   }else{
        //     window.open(nodeValueUrl2)
        //   }
        //   console.log(nodeValueUrl1)
        // }

      },
      fetchUser(value) {
        // console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.data = [];
        this.fetching = true;
        let url = "/oaEs/oaelasticsearch/getsearch";
        let reg = new RegExp("^[0-9]*$");
        if (!reg.test(value)) {
          postAction(url, {keyWord: value}).then((res) => {
            if (fetchId !== this.lastFetchId) {
              // for fetch callback order
              return;
            }
            for (let i = 0; i < res.result.length; i++) {
              this.data.push({
                text: res.result[i].keyWord,
                value: res.result[i].id
              });
            }
            this.fetching = false;
          });

        } else {

          // this.$message.error('请输入搜索内容')
          return;

        }

      },
      DaiBanMore() { //待办任务的跳转
        this.$router.push('/' + 'mytask/taskToDo');
      },
      DaiBan(){

        getAction(this.url.DaiBanlist).then((res) => {

          this.waitDoData = res.result.records.splice(0, 4);
          this.total = res.result.total;

        })

        getAction(this.url.Supervision).then((res) => {

          // console.log('00000000000000000000000000000000000000000000000000')
          // console.log(res)

        })

      },
      dataAnalysis(){

        getAction(this.url.organizeNum).then((res) => {

          console.log('2222222222222222222222222222222222222222')
          console.log(res)
          this.baseData = res;
          this.$refs.bar.getData(this.baseData)


        })

        getAction(this.url.analysisDate).then((res) => {

          this.analysisDate = res.year;

        })

     },
      sectorDistribution(){

        getAction(this.url.HostNum).then((res) => {

          console.log('111111111111111111111111111111')
          console.log(res)

        })

      },
      //动态模块儿  业务详情
      openDetialModel(tableName, i_id) {

        // alert(taskDetail)
        // this.$refs.detailFile.show(taskDetail)

        let params = {tableName: tableName, busdataId: i_id};

        this.$store.commit('pushNewDetial', params)
        // console.log(this.$store.state.postDetialLists);

        window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + tableName + '&busdataId=' + i_id + '&navisshow=false')
        // this.$router.push({path:'/mytask/taskList/Test-detailFile',query:params})

      },
      //  数据初始化  收文  发文数据
      // homeLists(userid) {
      //   getAction(this.url.HomeList, {userId: userid, createTime: ''}).then((res) => {
      //
      //     this.model1 = res.model1;
      //     this.model2 = res.model2;
      //     this.model3 = res.model3;
      //     this.model4 = res.model4;
      //
      //     this.model1Lists = res.model1.list.splice(0, 4);
      //     this.model2Lists = res.model2.list.splice(0, 4);
      //     this.model3Lists = res.model3.list.splice(0, 4);
      //     this.model4Lists = res.model4.list.splice(0, 4);
      //
      //     // console.log('00000000000000000000000000000000000000000000000')
      //     // console.log(this.model2)
      //     // console.log(this.model3)
      //
      //     this.total1 = this.model2.total;
      //     this.total2 = this.model3.total;
      //
      //   });
      // },
      // waiteDoWith() {
      //   getAction(this.url.list).then((res) => {
      //     // console.log(res);
      //     //  过长截取  显示数组前五
      //     this.waitDoData = res.result.records.splice(0, 4);
      //     this.total = res.result.total;
      //
      //   });
      // },
      openTodoTaskModel(record) {

        this.taskRecord = record


        if (record.id.indexOf(",") >= 0) {
          let keys = record.taskDefinitionKey.split(",")
          let names = record.name.split(",")
          let ids = record.id.split(",")
          this.dataSource3 = []
          let map = {}
          for (let i in keys) {
            //构造集合 去重 同一环节去id最大的
            let data = {key: keys[i], name: names[i], id: ids[i]}
            let act = map[keys[i]]
            if (act == undefined) {
              map[keys[i]] = data
            } else {
              if (parseInt(ids[i]) > parseInt(act.id)) {
                map[keys[i]] = data
              }
            }
          }
          //如果去重之后只有一个
          if (Object.values(map).length > 1) {
            this.dataSource3 = Object.values(map)
            this.haveMore = true
          }
          if (Object.values(map).length == 1) {

            let record2 = Object.values(map)[0]
            this.taskRecord.taskDefinitionKey = record2.key
            this.taskRecord.name = record2.name
            this.taskRecord.id = record2.id

            getAction('/wf/task/taskStatus?taskid=' + this.taskRecord.id).then(res => {
              if (res.success) {
                if (res.message == 'todo') {
                  window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + record.table + '&busdataId=' + record.tableId + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))

                } else if (res.message == 'done') {
                  this.$message.error('该任务已被办理,请刷新页面')
                  return
                } else if (res.message == 'del') {
                  this.$message.error('该流程数据已被删除,请刷新页面')
                  return
                }
              }

            })

          }


        } else {
          getAction('/wf/task/taskStatus?taskid=' + record.id).then(res => {
            if (res.success) {
              if (res.message == 'todo') {
                window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + record.table + '&busdataId=' + record.tableId + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(record))
              } else if (res.message == 'done') {
                this.$message.error('该任务已被办理,请刷新页面')
                return
              } else if (res.message == 'del') {
                this.$message.error('该流程数据已被删除,请刷新页面')
                return
              }
            }

          })


        }


      },
      doTask(record) {


        this.$refs.receiveFile.show(record);

        // this.$refs.doTaskModal.showTask();

        // this.$refs.doTaskModal.showTask();

        //  console.log(record);
        //查询---业务数据--流程信息
        // var taskDetail = {}
        // postAction(this.url.yewuDataQuery, {i_id: record.tableId, table: record.table}).then(res => {
        //   if (res.success) {
        //     taskDetail = res.result.records[0]
        //     //业务和流程关联配置表（流程KEY、按钮、意见） 主键
        //     taskDetail['iprocSetId'] = record.busAndActId
        //     taskDetail['taskDefinitionKey'] = record.taskDefinitionKey
        //     this.$refs[record.pageRef].showTaskInAct(taskDetail, record)
        //     this.$refs.doTaskModal.title = '任务办理'
        //   } else {
        //     this.$message.error(res.message)
        //     return
        //   }
        // })

      },

    }
  }
</script>
<style lang="less" scoped>
  @import "../../assets/less/indexStyle1.less";

  .aCard{
    width: 300px;
    display: inline-block;
    margin: 3.3% 1%;
    font-size: x-large;
    border-radius: 14%;
  }
</style>