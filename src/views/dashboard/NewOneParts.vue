<template>
  <div class="wrap">
    <div class="nav">
      <div class="postList" style="position: relative">
        <div class="title">
          <!--<img src="" alt="">-->
          <div class="imgzhanwei">
            <img src="../../assets/post.png" alt="">
          </div>
          <span>公告</span>
        </div>
        <div class="listsBox" style="position: relative">
          <div class="lineitem" v-for="(item,index) in postLists" :key="index" @click="openDetialModel('oa_busdata30',item.i_id)">
            <div class="left">
              <i></i>
              <p class="tongzhi">[{{item.s_varchar5}}]</p>
              <span :title="item.s_title">{{item.s_title|filterText2}}</span>
              <i></i>
            </div>
            <span class="time">{{item.d_create_time|timeStrings}}</span>
          </div>
          <img style="position: absolute;left: 0;bottom: -8px;width: 50px;" src="../../assets/bottomleft.png" alt="">
          <img style="position: absolute;top: 10px;right: 10px;width: 100px;" src="../../assets/topright.png" alt="">
        </div>
        <span @click="postMore"  class="postMore" style="position: absolute;bottom: 3px;right: -10px; width: 100px; font-size: 14px;color: #009cff ">查看更多  <a-icon style="font-size: 12px;color: #009cff " type="double-right"></a-icon></span>
      </div>
      <div class="searchBox">
        <div style="display: flex;align-items: center;min-height: 90px;">
          <img @click="leftclick" style="width: 20px;height: 30px;margin-left: 20px;" src="../../assets/left.png" alt="">
          <div class="swiper-container swiper-no-swiping bottom">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(atom,index) in LinkList" :key="index" @click="openUrl((index+1)+'item')">
                <div>
                  <img src="../../assets/1.png" :title="atom.s_title" alt="">
                  <img :src="atom.path" :title="atom.s_title" alt="">
                  <span v-show="false" :ref="(index+1)+'item'" v-html="atom.url"></span>
                </div>
              </div>
              <!--<div class="swiper-slide">-->
              <!--<div>-->
              <!--<img src="../../assets/2.png" alt="">-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="swiper-slide">-->
              <!--<div>-->
              <!--<img src="../../assets/3.png" alt="">-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="swiper-slide">-->
              <!--<div>-->
              <!--<img src="../../assets/4.png" alt="">-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="swiper-slide">-->
              <!--<div>-->
              <!--<img src="../../assets/3.png" alt="">-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="swiper-slide">-->
              <!--<div>-->
              <!--<img src="../../assets/4.png" alt="">-->
              <!--</div>-->
              <!--</div>-->
            </div>
            <!--Add Arrows-->
            <div ref="left" style="display: none" class="swiper-button-next"></div>
            <div ref="right" style="display: none" class="swiper-button-prev"></div>
          </div>
          <img @click="rightclick" style="width: 20px;height: 30px;margin-right: 20px;"  src="../../assets/right.png" alt="">
        </div>





        <div class="top">
          <!--<a-input placeholder="请输入关键字">-->
            <!---->
          <!--</a-input>-->
          <span class="table-page-search-submitButtons" style="position: relative;left: -17px;top: 27px;cursor: pointer;">
              <!--<a-button type="primary" icon="search"></a-button>-->
            <a-icon type="search"  @click="openSearch"></a-icon>
            </span>
          <!--<a-icon type="search"></a-icon>-->
          <a-select
            mode="combobox"
            labelInValue
            placeholder="公文检索"
            style="width: 100%"
            @search="fetchUser"
            @change="handleChange"
            :showArrow="false"
            :allowClear="true"
            :defaultActiveFirstOption="false"
            :notFoundContent="fetching ? undefined : null"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in data" :key="d.text">{{d.text}}</a-select-option>
          </a-select>
        </div>




      </div>
    </div>
    <div class="box">
      <div class="top ttop">
        <div class="left">
          <p class="titlebox">
            <span>
               <span class="shuline"></span>
               <span>待办工作</span>
               <b style="color: #ffffff;font-weight: 400" v-if="total" > {{total}}</b>
            </span>
            <span class="more" @click="DaiBanMore(0)">MORE  <a-icon type="plus"></a-icon> </span>
          </p>
          <div class="itemline">
            <!--<div class="each" v-for="(item,index) in waitDoData" :key="index" @click="openDetialModel(item.table,item.tableId)" :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">-->
            <div class="each" v-for="(item,index) in waitDoData" :key="index" @click="openTodoTaskModel(item)" :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">
              <p class="p">
                <span :title="item.title+'   '+item.createTime+item.name">
                  <i></i>
                  {{item.title|filterText1}}
                  <!--等待修改   字段返回1,2,3，4   receiveFile.vue   中有缓急设置-->
                   <div v-if="item.important==1">
                      <img src="../../assets/zhong.png" alt="" >
                   </div>


                </span>
                <span >{{item.createTime|timeText}}</span>
              </p>
              <!--<a @click="doTask(item)">办理</a>-->
            </div>
          </div>
        </div>
        <div class="right">
          <p class="titlebox">
            <span>
               <span class="shuline"></span>
              <span>{{model1.sName}}</span>
            </span>
            <span class="more" @click="openmore(model1.url)">MORE <a-icon type="plus"></a-icon> </span>
          </p>
          <div class="itemline">
            <p  class="each"  v-for="(item,index) in model1Lists"  :key="index" @click="openDetialModel(model1.tableName,item.i_id)">
                <span :title="item.s_title+'      '+item.d_create_time">
                  <i></i>
                  {{item.s_title|filterText}}
                </span>
              <span>{{item.d_create_time|timeText}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="bottom bbottom">
        <div class="bottomleft">
          <div class="first">
            <p class="titlebox">
              <span>
                 <span class="shuline"></span>
                 <span>{{model2.sName}}</span>
              </span>
              <span class="more"  @click="openmore(model2.url)">MORE  <a-icon type="plus"></a-icon> </span>
            </p>
            <div class="itemline">
              <p  class="each"  v-for="(item,index) in model2Lists"  :key="index" @click="openDetialModel(model2.tableName,item.i_id)">
                <span :title="item.s_title+'                     '+item.d_create_time">
                  <i></i>
                    {{item.s_title|filterText}}
                </span>
                <span>{{item.d_create_time|timeText}}</span>
              </p>
            </div>
          </div>
          <div class="last">
            <p class="titlebox">
              <span>
                 <span class="shuline"></span>
                 <span>{{model3.sName}}</span>
                <!--<span>{{model3}}</span>-->
              </span>
              <span class="more" @click="openmore(model3.url)">MORE  <a-icon type="plus"></a-icon> </span>
            </p>
            <div class="itemline">
              <p  class="each"  v-for="(item,index) in model3Lists"  :key="index" @click="openDetialModel(model3.tableName,item.i_id)">
                 <span :title="item.s_title+'                     '+item.d_create_time">
                  <i></i>
                  {{item.s_title|filterText}}
                </span>
                <span>{{item.d_create_time|timeText}}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="right">
          <p class="titlebox">
              <span>
                 <span class="shuline"></span>
                 <span>{{model4.sName}}</span>
                <!--<span>{{model4}}</span>-->
              </span>
            <span class="more" @click="openmore(model4.url)">MORE <a-icon type="plus"></a-icon> </span>
          </p>
          <div class="itemline">
            <p  class="each"  v-for="(item,index) in model4Lists"  :key="index" @click="openDetialModel(model4.tableName,item.i_id)">
                 <span :title="item.s_title+'                     '+item.d_create_time">
                  <i></i>
                  {{item.s_title|filterText}}
                </span>
              <span>{{item.d_create_time|timeText}}</span>
            </p>
          </div>
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
      cancelText="取消">


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
  import { httpAction,getAction,postAction } from '@/api/manage'
  import debounce from 'lodash/debounce';
  import Vue from 'vue'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import detailFile from '../mytask/taskList/detailFile'
  import Swiper from 'swiper/js/swiper.min.js'
  import  'swiper/css/swiper.min.css'
  export default {
    components: {
      HeadInfo
    },
    data () {
      this.lastFetchId = 0;
      this.fetchUser = debounce(this.fetchUser, 800);
      return {
        // lastFetchId: 0,
        // fetchUser: debounce(this.fetchUser, 800),
        data: [],
        fetching: false,
        search: '',
        postLists:[],// 公告列表
        userid:'',
        iisCalendar:0,
        model1:[],
        model2:[],
        model3:[],
        model4:[],
        total:'',
        waitDoData:[],
        model1Lists:[],
        model2Lists:[],
        model3Lists:[],
        model4Lists:[],
        LinkList:[], //常用链接
        url: {
          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
          list: "/wf/task/queryTask?operstatus=task_todo",
          HomeList:'/oaBus/homeAnalysis/HomeList',
          Posturl:'/oaBus/oaBusdata/queryByModelId',
          MostUserLink:'/oaBus/Calendar/oaCalendar/MostUserLink',
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
    filters:{
      filterText(text){
        if(text!=undefined) {
          if (text.length > 20) {
            return text.substring(0, 17) + '...'
          } else {
            return text
          }
        }
      }, filterText2(text){
        if(text!=undefined) {
          if (text.length > 25) {
            return text.substring(0, 22) + '...'
          } else {
            return text
          }
        }
      },
      filterText1(text){ //电子公告
        if(text!=undefined) {
          if (text.length >55) {
            return text.substring(0, 35) + '...'
          } else {
            return text
          }
        }
      },
      timeText(text){
        if(text!=undefined) {
          if (text.length > 15){
            return text.substring(0, 10)
          } else {
            return text
          }
        }
      },
      timeStrings(time){
        let oneTime = new Date(time);
        let Y = oneTime.getFullYear();
        let M = oneTime.getMonth()+1;
        let D = oneTime.getDate();
        return  Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);

      },
    },
    created () {
      //公告列表
      // this.getPostLists();

      postAction(this.url.Posturl,{modelId:49,condition:{function_id:64,selType:1}}).then((res) => {
        console.log(res.result.records);
        this.postLists = res.result.records.splice(0,4);
      });



      //獲取用戶基本信息
      const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
      console.log(userid);
      this.userid = userid;


      this.$nextTick(()=>{
        this.homeLists(this.userid);
      })

      this.waiteDoWith();

    },
    mounted(){

      let height = document.body.clientHeight-145;
      document.querySelector('.nav').style.height = height*.25 +'px'
      document.querySelector('.box').style.height = height*.75+'px'

      // this.$nextTick(()=>{
      //
      // })

      document.querySelector('.ttop').style.height = (height*.75)/2+'px'
      document.querySelector('.bbottom').style.height =  (height*.75-20)/2+'px'

      window.onresize = function () {

        let height = document.body.clientHeight-145;
        document.querySelector('.nav').style.height = height*.25 +'px'
        document.querySelector('.box').style.height = height*.75+'px'

        document.querySelector('.ttop').style.height = (height*.75)/2+'px'
        document.querySelector('.bbottom').style.height =  (height*.75-20)/2+'px'
      }




      setTimeout(()=>{

        var mySwiper = new Swiper('.swiper-container',{
          initialSlide:0,
          slidesPerView:4,
          spaceBetween:13,
          lazyLoading:true,
          loop:true,
          obeserver:true,
          obeserverParents:true,
          navigation:{
            nextEl:'.swiper-button-next',
            prevEl:'.swiper-button-prev',
          }

        });
      },3500)

      postAction(this.url.MostUserLink).then((res) => {
        console.log(res.length);
        /*  if(res.length==1){
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
          }else if(res.length==2){
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
          }else if(res.length==3){
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
            this.LinkList.push(JSON.parse(JSON.stringify(res)))
          }else if(res.length==0){
            this.LinkList.push(
              {s_title:'mytask/taskToDo',value:0},
              {s_title:'mytask/taskToDo',value:1},
              {s_title:'mytask/taskToDo',value:2},
              {s_title:'mytask/taskToDo',value:3},
              )
          }else{
            this.LinkList = JSON.parse(JSON.stringify(res));
          }*/
        this.LinkList =  res;
        console.log( this.LinkList.length);
      });
    },
    components: {
      //业务
      detailFile,
    },
    methods: {
      openUrl(e){
        console.log(e);
        console.log(this.$refs[e][0].lastChild);
        let lastChildNode = this.$refs[e][0].lastChild;

        console.log(lastChildNode.childNodes[0].nodeType);
        //判断文本节点3     还是元素节点1
        let nodeType = lastChildNode.childNodes[0].nodeType;
        if(nodeType=='3'){
          console.log(lastChildNode.childNodes[0].nodeValue);
          let nodeValueUrl = lastChildNode.childNodes[0].nodeValue;
          window.open('http://'+nodeValueUrl)
        }else{
          console.log(lastChildNode.childNodes[0].childNodes[0].getAttribute('href'));

          let nodeValueUrl1 = lastChildNode.childNodes[0].childNodes[0].getAttribute('href');
          window.open(nodeValueUrl1)
        }

      },
      fetchUser(value) {
        // console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.data = [];
        this.fetching = true;
        let url = "/oaEs/oaelasticsearch/getsearch";
        let reg = new RegExp("^[0-9]*$");
        if(!reg.test(value)) {
          postAction(url, {keyWord: value}).then((res) => {
            if (fetchId !== this.lastFetchId) {
              // for fetch callback order
              return;
            }
            for(let i = 0;i<res.result.length;i++){
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
      handleChange(obj) {

        //判断  全文检索搜索框是否输入    检测输入变化则赋值  否则清空变量
        if(obj){
          // console.log(obj);
          this.search = obj.key;
        }else{
          this.search = '';
        }
        // Object.assign(this, {
        //   value,
        //   data: [],
        //   fetching: false,
        // });
      },
      openSearch(){

        this.$router.push({path:'/ioaBus/busModel/search',query:{searchWords : this.search}})

      },
      postMore(){
        this.$router.push('/'+'publicMessage/electronicFile');
      },
      openmore(url){ //四个模块的跳转

        this.$router.push('/'+url);
        // console.log(url)
      },
      DaiBanMore(){ //待办任务的跳转
        this.$router.push('/'+'mytask/taskToDo');
      },
      LinkMore(e){ //常用链接的跳转
        console.log(e)

        this.$router.push('/'+e);


      },
      //动态模块儿  业务详情
      openDetialModel(tableName,i_id){

        // alert(taskDetail)
        // this.$refs.detailFile.show(taskDetail)

        let params = {tableName:tableName,busdataId:i_id};

        this.$store.commit('pushNewDetial',params)
        console.log(this.$store.state.postDetialLists);

        // window,open('http://localhost:4000/mytask/taskList/Test-detailFile?tableName=oa_busdata10&busdataId=515')
        window,open(window.location.origin+'/mytask/taskList/Test-detailFile?tableName='+tableName+'&busdataId='+i_id+'&navisshow=false')
        // this.$router.push({path:'/mytask/taskList/Test-detailFile',query:params})

      },
      //事件委托 向左切换
      leftclick(){
        this.$refs.left.click();
      },
      //事件委托 向右切换
      rightclick(){
        this.$refs.right.click();
      },
      //  数据初始化  收文  发文数据
      homeLists(userid){
        getAction(this.url.HomeList,{userId:userid,createTime:''}).then((res) => {

          this.model1 = res.model1;
          this.model2 = res.model2;
          this.model3 = res.model3;
          this.model4 = res.model4;

          this.model1Lists = res.model1.list.splice(0,5);
          this.model2Lists = res.model2.list.splice(0,5);
          this.model3Lists = res.model3.list.splice(0,5);
          this.model4Lists = res.model4.list.splice(0,5);

        });
      },
      waiteDoWith(){
        getAction(this.url.list).then((res) => {
          console.log(res);
          //  过长截取  显示数组前五
          this.waitDoData = res.result.records.splice(0,4);
          this.total = res.result.total;

        });
      },
      openTodoTaskModel(record){

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

            let  record2 = Object.values(map)[0]
            this.taskRecord.taskDefinitionKey = record2.key
            this.taskRecord.name = record2.name
            this.taskRecord.id = record2.id

            window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + record.table + '&busdataId=' + record.tableId + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))
          }


        } else {
          window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + record.table + '&busdataId=' + record.tableId + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(record))
        }


      },
      confirm2() {
        if (this.selectedRowKeys2.length <= 0) {
          this.$message.error("请选择环节")
          return
        }
        this.taskRecord.taskDefinitionKey = this.selectedRowKeys2[0]
        this.taskRecord.name = this.selectedRows2[0].name
        this.taskRecord.id = this.selectedRows2[0].id


        window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + this.taskRecord.table + '&busdataId=' + this.taskRecord.tableId + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))
        this.haveMore = false


      },
      cancel2() {
        this.haveMore = false
      },
      onSelectChangeMy2(rowKeys, rows) {
        this.selectedRowKeys2 = rowKeys
        this.selectedRows2 = rows
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

      // 公告
      getPostLists(){
        postAction(this.url.Posturl,{modelId:49,condition:{function_id:64,selType:1}}).then((res) => {
          console.log(res.result.records);
          this.postLists = res.result.records;
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ant-input{
    border-color: #054c9c !important;
  }
  .more:hover{
    cursor: pointer;
  }
  .postMore:hover{
    cursor: pointer;
  }
  .wrap{
    width: 100%;
    .nav{
      width: 100%;
      /*height: 138px;*/
      min-height: 183.5px;
      overflow: hidden;
      background: #ffffff;
      display:flex;
      align-items: center;
      /*margin-top: 100px;*/
      .postList{
        width: 60%;
        /*height: 198px;*/
        height: 100%;
        min-height: 183.5px;
        background: #ffffff;
        background-image: url("../../assets/postBg.png");
        background-repeat: no-repeat;
        background-size:cover;
        /*background-position: bottom right;*/
        display: flex;
        align-items: flex-start;

        .title{
          width: 120px;
          /*height: 198px;*/
          background: transparent !important;
          margin-left: 10px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          .imgzhanwei{
            width: 50px;
            height: 50px;
            /*background: #2eabff;*/
            margin-right: 10px;
            img{
              width: 100%;

            }
          }
          span{
            font-size: 16px;
            font-weight: 800;
          }
        }
        .listsBox{
          /*margin-left: 20px;*/
          width: 100%;
          height: 80%;
          min-height: 163.5px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          padding: 15px;
          padding-bottom: 20px;


          .lineitem{
            width: 98%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;

            .left{
              width: 75%;
              display: flex;
              align-items: center;
              .tongzhi{
                background: #f8ffbb;
                font-weight: 600;
                margin: 0;
                margin-left: 6px;
              }
              span{
                margin: 0 10px;
              }
              i{
                width: 5px;
                height: 5px;
                background: firebrick;
                -webkit-border-radius: 5px;
                -moz-border-radius: 5px;
                border-radius: 5px;
              }
              i:first-child{
                background: #2eabff;
              }
            }

          }
          .lineitem:hover{
            /*background: #2eabff;*/
            /*color: #ffffff;*/
            cursor: pointer;
          }

        }
      }
      .searchBox{
        width: 40%;
        /*height: 198px;*/
        /*background: firebrick;*/
        padding: 10px;
        /deep/img:hover{
          cursor: pointer;
        }
        .top{
          width: 75%;
          margin: 0 auto;
          /*margin-top: 10px;*/
        }
        .bottom{
          width: 75%;
          /*height: 145px;*/
          /*height: 130px;*/
          /*background: darkcyan;*/
          margin: 0px auto;


          /deep/.swiper-wrapper{
            width: 60%;
            /*margin-left: 20px;*/
            .swiper-slide{
              /*width: 100px;*/
              /*height: 100%;*/
              /*background: red;*/
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-around;
              /*margin-right: 0px !important;*/
              /*margin-left: 5px !important;*/
              div{
                width: 90px;
                height: 90px;
                border-radius: 50%;
                /*background: #2eabff;*/
                img{
                  width: 100%;
                }
              }
              span{
                font-size: 14px;
                color: #333333;
              }
            }
          }

        }
      }

    }


    .box{
      width: 100%;
      height: auto;
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top,.bottom{
        width: 100%;
        // min-height: 245px;
        min-height: 235px;

        /*min-height: 260px;*/

        /*background: #dddddd;*/
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left,.right{
          width: 60.3%;
          height: 100%;
          /*padding: 10px;*/
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden !important;

          .titlebox{
            width: 100%;
            height: 40px;
            border-bottom: 2px solid #009dee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0;
            span:first-child{
              width: auto;
              height: 40px;
              padding: 0 8px;
              padding-left: 0;
              background: #009dee;
              font-size: 16px;
              font-weight: bold;
              color: #ffffff;
              display: flex;
              align-items: center;
              span{
                color: #ffffff;
              }
              .shuline{
                width: 5px;
                height: 40px;
                background: #1174b9;
                padding: 0;
                margin-right: 10px;
              }
              span:nth-child(2){
                  min-width: 50px;
              }
              b{
                min-width: 15px;
                height: 15px;
                border-radius: 10px;
                background: #f02d13;
                margin-left: 10px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-bottom: 3px;
                padding-right: .5px;
                font-size: 12px;
              }
            }
            span:last-child{
              /*background: none;*/
              color: #333333;
              margin-right: 20px;
              font-weight: 600;
            }

          }

          .itemline{
            width: 100%;
            min-height: 200px;
            /*background: #999999;*/
            /*padding: 10px;*/
            padding-top: 0;
            display: flex;
            flex-direction: column;
            /*margin: 0;*/

            .each{
              width: 100%;
              /*background: red;*/
              display: flex;
              align-items: center;
              justify-content: space-between;

              border-left: 5px solid #c7ecff;
              /*margin-left: 10px;*/
              .p{
                width:100%;
                height: 46px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                /*line-height: 40px;*/
                margin: 0;
                font-size: 14px;
                margin-left: 20px;
                /*margin-top: 19px;*/
                span:first-child{
                  display: block;
                  /*line-height: 40px;*/
                  // width: 60%;
                  /*height: 20px;*/
              //  overflow:hidden;
              //   white-space:no-wrap;
              //   text-overfow:ellipsis;
              //   -webkit-line-clamp: 1;
              //   white-space: nowrap;
                  display: flex;
                  align-items: center;
                  i{
                    width: 5px;
                    height: 5px;
                    background: #2eabff;
                    margin-right: 10px;
                  }
                  img{
                    width: 40px;
                    margin-bottom: 18px;
                    margin-left: 5px;
                  }


                }
                span:last-child{
                  display: block;
                  line-height: 40px;
                  margin-right: 20px;
                }
              }
              a{

                margin-top: 5px;

              }
            }

            .each:hover{
              /*background: rgb(226, 241, 246);*/
              cursor: pointer;
              color: #333333;
            }
          }
        }


        .right{
          width: 39%;
          height: 100%;
          /*padding: 10px;*/
          /*background: #dddddd;*/
          /*display: flex;*/
          /*flex-direction: column;*/
          /*align-items: center;*/
          /*justify-content: flex-start;*/
          /*overflow: no-content;*/
          .itemline{
            min-height: 200px;

            /*background: red;*/
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;


            .each{
              width: 95%;
              border-left: none ;
              /*padding-bottom: 5px;*/
              margin: 0px;
              margin-top: 16px;
              span{
                display: flex;
                align-items: center;
                font-size: 14px;
                i{
                  display: block;
                  width: 5px;
                  height: 5px;
                  background: #2eabff;
                  margin-right: 5px;
                }
              }
            }
          }

        }
      }
      .bottom{
        margin-top: 7px;

        .bottomleft{
          width: 60.3%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          .first,.last{
            width: 49.4%;
            height: 100%;
            /*background: firebrick;*/
            background: #ffffff;

            /*padding: 10px;*/
            .titlebox{
              width: 100%;
              height: 40px;
              border-bottom: 2px solid #0074b9;
              margin: 0px;
              /*background: #f2dede;*/
              display: flex;
              align-items: center;
              justify-content: space-between;
              span{
                width: auto;
                height: 40px;
                padding: 0 8px;
                padding-left: 0;
                background: #009dee;
                font-size: 14px;
                font-weight: bold;
                color: #ffffff;
                display: flex;
                align-items: center;
                span:nth-child(2){
                  min-width: 75px;
                  color: #ffffff !important;
                  font-size: 16px !important;
                  font-weight: bold;
                }
                .shuline{
                  width: 5px;
                  height: 40px;
                  background: #1174b9;
                  padding: 0;
                  margin-right: 10px;
                }
              }
              span:last-child{
                background: none;
                color: #333333;
              }

            }

            .itemline{
              width: 100%;
              min-height:200px;
              /*background: #999999;*/
              padding: 10px;
              /*color: #ffffff;*/
              overflow: hidden;
              p{
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                // padding-bottom: 3px;
                /*border-bottom: 1px solid #f0f2f5;*/

                span{
                  display: flex;
                  align-items: center;
                  font-size: 14px;
                  i{
                    display: block;
                    width: 5px;
                    height: 5px;
                    background: #2eabff;
                    margin-right: 5px;
                  }
                }
              }
              p:hover{
                /*background: rgb(226, 241, 246);*/
                cursor: pointer;
                color: #333333;
              }
            }


          }

        }
      }
    }
  }
</style>