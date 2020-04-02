<template>
  <div @mouseleave="mouseLeave" @mouseover="mouseOver" class="wrap">
    <div class="nav">
      <div class="postList">
        <div class="title">
          <!--<img src="" alt="">-->
          <div class="imgzhanwei">
            <img src="../../assets/post.png" alt="">
          </div>
          <span>公告</span>
        </div>
        <div class="listsBox">
          <div class="lineitem" v-for="(item,index) in postLists" :key="index"
               @click="openDetialModel('oa_busdata30',item.i_id)">
            <div class="left">
              <i></i>
              <p class="tongzhi">[{{item.s_varchar5}}]</p>
              <span :title="item.s_title">{{item.s_title}}</span>
              <!--<i></i>-->
            </div>
            <span class="time">{{item.d_create_time|timeStrings}}</span>
          </div>
      </div>
        <span @click="postMore" class="postMore">查看更多  <a-icon class="icon0" type="double-right"></a-icon></span>
      </div>
      <div class="searchBox">
        <div class="div0">
          <img class="img0" @click="leftclick" src="../../assets/left.png" alt="">
          <div class="swiper-container swiper-no-swiping bottom">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(atom,index) in LinkList" :key="index"
                   @click="openUrl(atom.s_varchar4)">
                <div class="div1">
                  <img class="img1" v-if="atom.picUrl1=='data:image/png;base64,dHJ1ZQ=='"
                       src="../../assets/2.png" :title="atom.s_title" alt="">
                  <img v-else :src="atom.picUrl1" :title="atom.s_title" alt="">
                  <span v-show="false" :ref="(index+1)+'item'" v-html="atom.url"></span>
                </div>
              </div>
            </div>
            <!--Add Arrows-->
            <div ref="left" class="swiper-button-next arrow"></div>
            <div ref="right" class="swiper-button-prev arrow"></div>
          </div>
          <img class="img2" @click="rightclick" alt="" src="../../assets/right.png">
        </div>


        <div class="top"
             @keyup.13="openSearch">
          <!--<a-input placeholder="请输入关键字">-->
          <!---->
          <!--</a-input>-->
          <span class="table-page-search-submitButtons">
              <!--<a-button type="primary" icon="search"></a-button>-->
            <a-icon type="search" @click="openSearch"></a-icon>
            </span>
          <!--<a-icon type="search"></a-icon>-->
          <a-select
            class="select"
            mode="combobox"
            labelInValue
            placeholder="公文检索"
            @search="fetchUser"
            @change="handleChange"
            :showArrow="false"
            :allowClear="true"
            :defaultActiveFirstOption="false"
            :notFoundContent="fetching ? undefined : null"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
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
               <b v-if="total"> {{total}}</b>
            </span>
            <span class="more" @click="DaiBanMore(0)">更多  <a-icon type="plus"></a-icon> </span>
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
                  <!--{{item.title|filterText1}}-->
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
        <div class="right">
          <p class="titlebox">
            <span>
               <span class="shuline"></span>
              <span>{{model1.sName}}</span>
            </span>
            <span class="more" @click="openmore(model1.url,model1.sName)">更多 <a-icon type="plus"></a-icon> </span>
          </p>
          <div class="itemline">
            <p class="each" v-for="(item,index) in model1Lists" :key="index"
               @click="openDetialModel(model1.tableName,item.i_id)">
              <section>
                <i></i>
                <span :style="iisFontSize" :title="item.s_title+'      '+item.d_create_time">
                  {{item.s_title}}
                  <!--{{item.s_title|filterText}}-->
                </span>
              </section>
              <span :style="iisFontSize">{{item.d_create_time|timeText}}</span>
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
              <span :style="iisFontSize" @click="openmore(model2.url,model2.sName)" class="more">更多<a-icon
                type="plus"></a-icon> </span>
            </p>
            <div class="itemline">
              <p class="each" v-for="(item,index) in model2Lists" :key="index"
                 @click="openDetialModel(model2.tableName,item.i_id)">
                <section>
                  <i></i>
                  <span :style="iisFontSize" :title="item.s_title+'                     '+item.d_create_time">
                      {{item.s_title}}
                    <!--{{item.s_title|filterText}}-->
                  </span>
                </section>
                <span :style="iisFontSize">{{item.d_create_time|timeText}}</span>
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
              <span :style="iisFontSize" @click="openmore(model3.url,model3.sName)" class="more">更多  <a-icon
                type="plus"></a-icon> </span>
            </p>
            <div class="itemline">
              <p class="each" v-for="(item,index) in model3Lists" :key="index"
                 @click="openDetialModel(model3.tableName,item.i_id)">
                <section>
                  <i></i>
                  <span :style="iisFontSize" :title="item.s_title+'                     '+item.d_create_time">
                    {{item.s_title}}
                    <!--{{item.s_title|filterText}}-->
                  </span>
                </section>
                <span :style="iisFontSize">{{item.d_create_time|timeText}}</span>
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
            <span class="more" @click="openmore(model4.url,model4.sName)">更多 <a-icon type="plus"></a-icon> </span>
          </p>
          <div class="itemline">
            <p class="each" v-for="(item,index) in model4Lists" :key="index"
               @click="openDetialModel(model4.tableName,item.i_id)">
              <section>
                  <i></i>
                <span :style="iisFontSize" :title="item.s_title+'                 '+item.d_create_time">
                  {{item.s_title}}
                  <!--{{item.s_title|filterText}}-->
                  </span>
              </section>
              <span :style="iisFontSize">{{item.d_create_time|timeText}}</span>
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
  import {getAction, httpAction, postAction} from '@/api/manage'
  import debounce from 'lodash/debounce';
  import Vue from 'vue'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import detailFile from '../mytask/taskList/detailFile'
  import Swiper from 'swiper/js/swiper.min.js'
  import 'swiper/css/swiper.min.css'
  import axios from "axios";
  import {ACCESS_TOKEN} from "../../store/mutation-types";

  export default {
    components: {
      HeadInfo
    },
    data() {
      this.lastFetchId = 0;
      this.fetchUser = debounce(this.fetchUser, 800);
      return {
        iisFontSize: {
          fontSize: '14px'
        },
        mouseFlag: false,
        // lastFetchId: 0,
        // fetchUser: debounce(this.fetchUser, 800),
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
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
      filterText(text) {
        if (text != undefined) {
          if (text.length > 16) {
            return text.substring(0, 12) + '...'
          } else {
            return text
          }
        }
      }, filterText2(text) {
        if (text != undefined) {
          if (text.length > 16) {
            return text.substring(0, 14) + '...'
          } else {
            return text
          }
        }
      },
      filterText1(text) { //电子公告
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
      //公告列表
      // this.getPostLists();

      postAction(this.url.Posturl, {modelId: 49, condition: {function_id: 64, selType: 1}}).then((res) => {
        // console.log(res.result.records);
        this.postLists = res.result.records.splice(0, 4);
      });


      //獲取用戶基本信息
      const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
      // console.log(userid);
      this.userid = userid;


      this.$nextTick(() => {
        this.homeLists(this.userid);
      })

      this.waiteDoWith();

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




      postAction(this.url.LinkLists).then((res) => {
        // console.log(res.length);
        this.LinkList = res;
       if( this.LinkList.length==1){
         this.show(this.LinkList[0].i_id, 0)
           this.LinkList.push(
             {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
             {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
             {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
             {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
           )

          }else if( this.LinkList.length==2){
             this.show(this.LinkList[0].i_id, 0)
             this.show(this.LinkList[1].i_id, 1)
             this.LinkList.push(
               {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
               {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
               {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
               {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},

             )
          }else if( this.LinkList.length==3){
         this.show(this.LinkList[0].i_id, 0)
         this.show(this.LinkList[1].i_id, 1)
         this.show(this.LinkList[2].i_id, 2)

           this.LinkList.push(
             {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
             {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
             {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
             {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
           )
          }else if( this.LinkList.length==0){
            this.LinkList.push(
              {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
              {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
              {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
              {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.baidu.com'},
            )
          }else{
           // this.LinkList = JSON.parse(JSON.stringify(res));
         for (var i = 0; i < this.LinkList.length; i++) {

           this.show(this.LinkList[i].i_id, i)


         }
          }







        setTimeout(() => {

          var mySwiper = new Swiper('.swiper-container', {
            initialSlide: 0,
            slidesPerView: 4,
            spaceBetween: 13,
            lazyLoading: true,
            loop: false,
            obeserver: true,
            obeserverParents: true,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }

          });
        }, 1000)
        // console.log(this.LinkList.length)


      });
    },
    components: {
      //业务
      detailFile,
    },
    methods: {

      mouseOver() {
        //console.log(this.mouseFlag)
        if (!this.mouseFlag) {
          this.mouseFlag = true;
          this.waiteDoWith();
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
      handleChange(obj) {

        //判断  全文检索搜索框是否输入    检测输入变化则赋值  否则清空变量
        if (obj) {
          // console.log(obj);
          this.search = obj.key;
        } else {
          this.search = '';
        }
        // Object.assign(this, {
        //   value,
        //   data: [],
        //   fetching: false,
        // });
      },
      openSearch() {

        this.$router.push({path: '/ioaBus/busModel/search', query: {searchWords: this.search}})

      },
      postMore() {
        this.$router.push('/' + 'publicMessage/electronicFile');
      },
      openmore(url, moduleName) { //四个模块的跳转

        this.$router.push('/' + url + '?moduleName=' + moduleName);
        // console.log(url)
      },
      DaiBanMore() { //待办任务的跳转
        this.$router.push('/' + 'mytask/taskToDo');
      },
      LinkMore(e) { //常用链接的跳转
        // console.log(e)

        this.$router.push('/' + e);


      },
      //动态模块儿  业务详情
      openDetialModel(tableName, i_id) {

        // alert(taskDetail)
        // this.$refs.detailFile.show(taskDetail)

        let params = {tableName: tableName, busdataId: i_id};

        this.$store.commit('pushNewDetial', params)
        // console.log(this.$store.state.postDetialLists);

        // window,open('http://localhost:4000/mytask/taskList/Test-detailFile?tableName=oa_busdata10&busdataId=515')
        window, open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + tableName + '&busdataId=' + i_id + '&navisshow=false')
        // this.$router.push({path:'/mytask/taskList/Test-detailFile',query:params})

      },
      //事件委托 向左切换
      leftclick() {
        this.$refs.left.click();
      },
      //事件委托 向右切换
      rightclick() {
        this.$refs.right.click();
      },
      //  数据初始化  收文  发文数据
      homeLists(userid) {
        getAction(this.url.HomeList, {userId: userid, createTime: ''}).then((res) => {

          this.model1 = res.model1;
          this.model2 = res.model2;
          this.model3 = res.model3;
          this.model4 = res.model4;

          this.model1Lists = res.model1.list.splice(0, 4);
          this.model2Lists = res.model2.list.splice(0, 4);
          this.model3Lists = res.model3.list.splice(0, 4);
          this.model4Lists = res.model4.list.splice(0, 4);

        });
      },
      waiteDoWith() {
        getAction(this.url.list).then((res) => {
          // console.log(res);
          //  过长截取  显示数组前五
          this.waitDoData = res.result.records.splice(0, 4);
          this.total = res.result.total;

        });
      },
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
      confirm2() {
        if (this.selectedRowKeys2.length <= 0) {
          this.$message.error("请选择环节")
          return
        }
        this.taskRecord.taskDefinitionKey = this.selectedRowKeys2[0]
        this.taskRecord.name = this.selectedRows2[0].name
        this.taskRecord.id = this.selectedRows2[0].id


        getAction('/wf/task/taskStatus?taskid=' + this.taskRecord.id).then(res => {
          if (res.success) {
            if (res.message == 'todo') {
              window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + this.taskRecord.table + '&busdataId=' + this.taskRecord.tableId + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(this.taskRecord))
              this.haveMore = false
            } else if (res.message == 'done') {
              this.$message.error('该任务已被办理,请刷新页面')
              return
            } else if (res.message == 'del') {
              this.$message.error('该流程数据已被删除,请刷新页面')
              return
            }
          }

        })




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
      getPostLists() {
        postAction(this.url.Posturl, {modelId: 49, condition: {function_id: 64, selType: 1}}).then((res) => {
          // console.log(res.result.records);
          this.postLists = res.result.records;
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../assets/less/indexStyle1.less";
</style>