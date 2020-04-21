<template>
  <div @mouseleave="mouseLeave" @mouseover="mouseOver" class="wrap">
    <div class="topp">
      <template>

        <a-row class="row0" type="flex">
          <a-col class="col0" :span="6">
            <div class="part0">
              <div >
                <!--<div style="width: 100%;background: #ffffff;display: flex">-->
                <!--<div class="timeCard" style="width: 88%">-->
                <!--<p class="month">{{ESM}}</p>-->
                <!--<p class="day">{{day}}</p>-->
                <!--<p class="weekday">-->
                <!--<span>星期{{week}}</span>-->
                <!--<span>{{nongli}}</span>-->
                <!--</p>-->
                <!--</div>-->
                <!--<div style="width: 12%;height: 50px;background: #f4f4f4;display: flex;align-items: center;justify-content: space-between">-->
                <!--<i></i>-->
                <!--<img style="width: 20px;" src="../../assets/titlepng.png" alt="">-->
                <!--</div>-->
                <!--</div>-->

                <template>
                  <div class="rilibox">
                    <a-calendar class="calendar" :showToday="true"  :fullscreeb = "false" @select="getdateVal" />
                  </div>
                </template>
              </div>
            </div>
          </a-col>
          <a-col class="col1" :span="18">
            <a-row class="row1" type="flex">
              <a-col :span="8">
                <div class="part2">
                  <div class="title" >
                    <div class="div0">
                      <div class="div1">
                        <p class="p0">领导日程</p>
                        <span><a-icon class="icon0" @click="openMore(2)"type="right"/></span>
                      </div>
                    </div>
                  </div>
                  <!-- v-if="stitleLists!=''"-->
                  <div class="itembox"  v-if="stitleLists!=''">
                    <div class="itemline"  v-for="(item,index) in stitleLists" :key="index" @click.stop="chakan(item.iid)">

                      <!--<p class="time">-->
                      <!--<i></i>-->
                      <!--&lt;!&ndash;<span style="font-size: 12px;color: #666666">{{item.dCreateTime}}</span>&ndash;&gt;-->
                      <!--</p>-->
                      <div class="contentbox" >
                        <p :style="iisFontSize" class="content" :title="item.stitle+'('+item.suserNames+')'">{{item.stitle|filterText}}</p>
                        <div class="div2">
                          <!--<img class="img0 addSize" src="../../assets/check.png" @click.stop="chakan(publicitem.iid)">-->
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--暂无日程显示-->
                  <div class="itembox0" v-else></div>
                </div>
              </a-col>
              <a-col :span="16" class="col3">
                <div class="richeng">
                  <div class="titlebox">
                    <div class="div8">
                      <template>
                        <a-tabs defaultActiveKey="1" @change="doWill1" style="width: 95%;  position: absolute;top: -7px;">
                          <a-tab-pane key="1">
                        <span slot="tab">
                          <span class="shuline"></span>
                          我的日程
                          <b v-if="total2">({{total2}})</b>
                          <img src="../../assets/add.png" >
                           <a-icon class="icon1" @click="add" type="plus"/>
                        </span>
                              <!--mytitleLists-->
                              <div class="itembox"  v-if="mytitleLists!=''">
                                <div class="itemline" v-for="(myitem,index) in mytitleLists" :key="index"  @click.stop="chakan(myitem.iid)">
                                  <!--<p class="time">-->
                                  <!--<i></i>-->
                                  <!--<span style="font-size: 12px;color: #666666">{{myitem.dCreateTime}}</span>-->
                                  <!--</p>-->
                                  <div class="contentbox">
                                    <p :style="iisFontSize" class="content"  :title="myitem.stateName+myitem.stitle+'('+myitem.suserNames+')'">{{myitem.stateName+myitem.stitle+"("+ myitem.suserNames+")"|filterText3}}</p>
                                    <div v-if="myitem.stateName != ''" class="div5">
                                      <div >
                                        <!-- <img style="width: 22px;" src="../../assets/check.png" @click.stop="editstitle1(mytitleLists[index],1)">-->
                                        <img class="img1 addSize" src="../../assets/edit.png" :title="编辑" @click.stop="editstitle1(mytitleLists[index])">

                                        <img class="img1 addSize" src="../../assets/del.png"  :title="删除" @click.stop="delstitle1(myitem.iid)">
                                      </div>
                                    </div>
                                    <div v-else class="div5">
                                      <div >
                                        <!-- <img style="width: 22px;" src="../../assets/check.png" @click.stop="editstitle1(mytitleLists[index],1)">-->
                                        <img class="img1 addSize" src="../../assets/edit.png" :title="编辑" @click.stop="editstitle(mytitleLists[index])">
                                        <img class="img1 addSize" src="../../assets/del.png" :title="删除" @click.stop="delstitle(myitem.iid)">
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              </div>
                              <!--暂无日程显示-->
                              <div class="itembox1" v-else style=""></div>
                          </a-tab-pane>
                          <a-tab-pane key="2" >

                        <!--<span slot="tab">-->
                               <!--<span>{{this.model1}}</span>-->
                               <!--<b  v-if="total1">({{total1}})</b>-->
                        <!--</span>-->
                        <span slot="tab">
                          <span class="shuline"></span>
                          共享日程
                          <b v-if="total3">({{total3}})</b>
                        </span>
                              <div class="itemboxx"   v-if="publictitleLists!=''">
                                <div class="itemline" v-for="(publicitem,index) in publictitleLists" :key="index" @click.stop="chakan(publicitem.iid)">
                                  <div class="contentbox">
                                    <p :style="iisFontSize" class="content"  :title="publicitem.stitle+'('+publicitem.suserNames+')'">{{publicitem.stitle+"("+ publicitem.suserNames+")"|filterText3}}</p>
                                    <div class="div5">
                                      <img class="img2 addSize" src="../../assets/check.png" @click.stop="chakan(publicitem.iid)">
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!--暂无日程显示-->
                              <div class="itembox2" v-else></div>
                          </a-tab-pane>
                          <a-icon class="icon1" @click="openMore(doindex)" type="right" slot="tabBarExtraContent"/>
                          <!--<a-button type="primary" @click="openMore"  style="margin-top: 8px;"  slot="tabBarExtraContent">查看更多</a-button>-->
                        </a-tabs>
                      </template>
                    </div>
                  </div>
                </div>

                </a-col>

            </a-row>
          </a-col>
        </a-row>
      </template>
    </div>

    <div class="bottom">
      <template>
        <a-row class="row2" type="flex" justify="space-between">
          <a-col class="col2" :span="12" >
            <div class="part1">
              <div class="listsBox">
                <div class="title">
                  <!--<img src="" alt="">-->
                  <div class="imgzhanwei">
                    <img src="../../assets/post.png" alt="">
                  </div>
                  <span>公告</span>
                </div>
                <template>
                  <div class="lineitem"  v-for="(postitem,index) in postLists" :key="index" @click="openDetialModel('oa_busdata30',postitem.i_id)">
                    <!--<a-popover>-->
                    <div class="left">
                      <i></i>
                      <p class="tongzhi">[{{postitem.s_varchar5}}]</p>
                      <span :style="iisFontSize" :title="postitem.s_title">{{postitem.s_title|filterText2}}</span>
                      <!--<i></i>-->
                    </div>
                    <span class="time">{{postitem.d_create_time|timeStrings}}</span>
                    <!--</a-popover>-->
                  </div>
                </template>
             <span @click="postMore"  class="postMore">查看更多  <a-icon class="icon3" type="double-right"></a-icon></span>

              </div>
              <div class="searchBox">
                <div class="div6">
                  <img class="img3" @click="leftclick" src="../../assets/left.png" alt="">
                  <div class="swiper-container swiper-no-swiping bottomm">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide" v-for="(atom,index) in LinkList" :key="index"
                           @click="openUrl(atom.s_varchar4)">
                        <div class="div7">

                          <img class="img4" v-if="atom.picUrl1=='data:image/png;base64,dHJ1ZQ=='"
                               src="../../assets/2.png"
                               :title="atom.s_title" alt="">
                          <img v-else :src="atom.picUrl1"  :title="atom.s_title" alt="">
                          <span v-show="false" :ref="(index+1)+'item'" v-html="atom.url"></span>
                        </div>
                      </div>

                    </div>
                    <!--Add Arrows-->
                    <div ref="left" class="swiper-button-next arrow"></div>
                    <div ref="right" class="swiper-button-prev arrow"></div>
                  </div>
                  <img class="img5" @click="rightclick"  src="../../assets/right.png" alt="">
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="12" >
            <div class="daiban">
              <div class="titlebox">
                <div class="div8">
                  <template>
                    <a-tabs defaultActiveKey="1" @change="doWill" style="width: 95%;  position: absolute;top: -7px;">
                      <a-tab-pane key="1">
                        <span slot="tab">
                          <span class="shuline"></span>
                          待办任务
                          <b v-if="total">({{total}})</b>
                        </span>
                        <div class="itemline">
                          <div class="each" v-if="findwaitdataLists" v-for="(item,index) in findwaitdataLists" :key="index"
                               @click="openDetialModelTaskToDo(item)"
                               :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">
                            <div class="p">
                              <template v-if="willdoindex==1">
                                <p>
                                  <i></i>
                                  <span :title="item.title+'   '+item.createTime">
                <span :style="iisFontSize">{{item.title|filterText1}}
                  <div v-if="item.important==1">
                       <img alt="" src="../../assets/zhong.png">
                  </div>
                </span>

                </span>
                                </p>
                                <span :style="iisFontSize">{{item.createTime|timeText}}</span>
                              </template>
                            </div>
                          </div>
                          <div v-else>
                            暂无待办工作
                          </div>
                        </div>
                      </a-tab-pane>
                      <a-tab-pane key="2" >

                        <span slot="tab">
                               <span>{{this.model1}}</span>
                               <b  v-if="total1">({{total1}})</b>
                        </span>

                        <div class="itemline">
                          <div class="each" v-if="ModelList" v-for="(item,index) in ModelList" :key="index"
                               @click="openDetial(tableName,item.i_id)"
                               :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">
                            <div class="p">
                              <template v-if="willdoindex==2">
                                <p>
                              <span :style="iisFontSize" :title="item.s_title+'   '+item.d_create_time">
                               <i></i>
                              <span>  {{item.s_title|filterText1}}
                                <div v-if="item.important==1">
                                   <img src="../../assets/zhong.png" alt="">
                                </div>
                              </span>
                             </span>
                                </p>
                                <span >{{item.d_create_time|timeText}}</span>
                              </template>
                            </div>
                          </div>
                          <div v-else>
                            暂无工作
                          </div>
                        </div>
                      </a-tab-pane>
                      <a-button type="primary" @click="openmore1(willdoindex)"  style="margin-top: 8px;"  slot="tabBarExtraContent">查看更多</a-button>
                      <!--<span class="more" @click="openmore1(willdoindex)"> 更多53  <a-icon type="plus"></a-icon> </span>-->
                    </a-tabs>
                  </template>
                </div>
              </div>
              <hr>

              <div class="top"
                   @keyup.13="openSearch">
                <!--<a-input placeholder="请输入关键字">-->
                <!--<a-icon slot="prefix" type="search"></a-icon>-->
                <!--</a-input>-->
                <span class="table-page-search-submitButtons">
                    <!--<a-button type="primary" icon="search"></a-button>-->
                      <a-icon type="search"  @click="openSearch"></a-icon>
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
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in data" :key="d.text">{{d.text}}</a-select-option>
                </a-select>
              </div>
            </div>

          </a-col>
        </a-row>
      </template>
    </div>

    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <p>请确认是否要删除该条数据?</p>
    </a-modal>
    <!--编辑  新增-->
    <!-- 表单区域 -->
    <oaCalendar-modal ref="modalForm" @myrichenClose="myrichenClose" ></oaCalendar-modal>
    <oa-calendar-cat-modal ref="modalCatForm" ></oa-calendar-cat-modal>
    <!--详情列表-->
    <detail-file ref="detailFile"></detail-file>
    <detail-model ref="moremodel"></detail-model>


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

  import {deleteAction, getAction, httpAction, postAction,putAction} from '@/api/manage'
  import debounce from 'lodash/debounce';
  import oaCalendarCatModal from '../oaBus//modules/oaCalendarCatModal'
  import oaCalendarModal from '../oaBus/modules/oaCalendarModal'
  import detailFile from '../mytask/taskList/detailFile'
  import DetailModel from './DetailModel'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import Swiper from 'swiper/js/swiper.min.js'
  import 'swiper/css/swiper.min.css'
  import axios from "axios";
  import Vue from "vue";
  import {ACCESS_TOKEN} from "../../store/mutation-types";


  export default {
    name: "Dayanalysis",
    mixins: [JeecgListMixin],
    data () {

      this.lastFetchId = 0;
      this.fetchUser = debounce(this.fetchUser, 800);
      return {
        iisFontSize: {
          fontSize: '14px'
        },
        mouseFlag: false,
        data: [],
        fetching: false,
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        pic:'',
        picurlLists:[],
        search: '',
        iisCalendar:1,
        visible:false,
        editvisible:false,
        mystitltid:'',
        localTime:'',
        newTime:'',
        model1:'',
        model2:'',
        tableName:'',
        path:'',
        stitleLists:[],//领导日程列表
        mytitleLists:[],//我的日程列表
        publictitleLists:[],//共享日程列表
        findwaitdataLists:[],//待办日程列表
        ModelList:[],//待办右边模块的列表
        LinkList:[],//常用链接
        userid:'',
        userinfo:'',
        model1Lists:[],
        model2Lists:[],
        postLists:[],// 公告列表
        url:{
          findByLeader:'/oaBus/Calendar/oaCalendar/findByLeader',
          MostUserLink:'/oaBus/Calendar/oaCalendar/MostUserLink',
          //findwaiturl:'/oaBus/Calendar/oaCalendar/findwait ',
          findById:'/oaBus/Calendar/oaCalendar/queryById',
          findwaiturl:'/wf/task/queryTask',
          queryPageList:'/oaBus/Calendar/oaCalendar/queryPageList',
          list:'/oaBus/Calendar/oaCalendar/list',
          HomeList:'/oaBus/homeAnalysis/HomeList',
          delete: "/oaBus/Calendar/oaCalendar/delete",
          Posturl:'/oaBus/oaBusdata/queryByModelId',
          busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
          LinkLists:'/oaBus/Calendar/oaCalendar/LinkList',
          edit:"/oaBus/Calendar/oaCalendar/edit",
        },
        total:'',//代办数量
        total1:'',//模块的数量
        total2:'',//我的日程数量
        total3:'',//共享日程数量
        day:'',
        week:'',
        nongli:'',//农历
        ESM:'',
        willdoindex:1,   //  待办已办高亮
        doindex:1,//我的日程高亮

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
          if (text.length > 11) {
            return text.substring(0, 10) + '...'
          } else {
            return text
          }
        }
      },
      filterText3(text){
        if(text!=undefined) {
          if (text.length > 22) {
            return text.substring(0,20) + '...'
          } else {
            return text
          }
        }
      },
      filterText2(text){//电子公告
        if(text!=undefined){
          if(text.length>20){
            return text.substring(0,13)+'...'
          }else{
            return text
          }
        }
      },filterText1(text){
        if(text!=undefined){
          if (text.length > 22) {
            return text.substring(0, 16) + '...'
          }else{
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
        // return  Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);
        return (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D);

      },
    },
    components: {
      oaCalendarModal,
      detailFile,
      DetailModel,
      oaCalendarCatModal

    },

    created () {

      //获取用户基本信息
      const  userinfo =JSON.parse( localStorage.getItem('userdata')).userInfo;
      this.userinfo = userinfo;
      this.userid = userinfo.id;


      let currtentTime = new Date();
      let Y = currtentTime.getFullYear();
      let M = currtentTime.getMonth()+1;
      let D = currtentTime.getDate();
      let W = currtentTime.getDay();
      // let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+currtentTime.toTimeString().substr(0,8);
      let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);
      this.localTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);

      //---------------------获取农历  英语月份-------------------
      // this.day = (D<10? "0"+D:D);
      //
      // this.week = ['日','一','二','三','四','五','六'][W];
      //           //农历接口
      // getAction('/oaBus/Calendar/oaCalendar/findLunarDate',{year:Number(Y),month:Number(M),day:Number(D)}).then((res) => {
      //   console.log(res);
      //   this.nongli = res.result;
      //
      // });

      //英文月份
      // let EnglisgSimM = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct',' Nov','Dec'];
      // this.ESM = EnglisgSimM[M-1]
      // console.log('--------------------------------------------------------------------------------------',M);


      //----------------------------------------------------------

      this.homeLists(this.userid);


      this.newTime = newTime;

      //  领导日程
      this.leaderList(newTime);

      //  共享日程
      this.publicLists(newTime);

      //  我的日程
      this.myDayLists(newTime);

      // 代办日程
      //   setTimeout(()=>{
      //
      //
      //
      //
      // },500)

      //公告列表lineitem
      this.getPostLists();


      // / 初始化时只获取条目已办条目

      // getAction(this.url.findwaiturl,{operstatus:'task_done'}).then((res) => {
      //  // this.total1 = res.result.total;
      //
      // });

    },
    mounted(){

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


      let height = document.body.clientHeight-145;
      document.querySelector('.topp').style.height = height/2 +'px'
      document.querySelector('.bottom').style.height = height/2 +'px'
      document.querySelector('.ant-fullcalendar-full').style.height = height/2 +'px'
      document.querySelector('.ant-fullcalendar-full').style.marginTop = '-20px'

      window.onresize = function () {
        let height = document.body.clientHeight-145;
        document.querySelector('.topp').style.height = height/2 +'px'
        document.querySelector('.bottom').style.height = height/2 +'px'
        document.querySelector('.ant-fullcalendar-full').style.height = height/2 +'px'
      }







      // setTimeout(()=>{
      //
      //   var mySwiper = new Swiper('.swiper-container',{
      //     initialSlide:0,
      //     slidesPerView:4,
      //     spaceBetween:13,
      //     lazyLoading:true,
      //     loop:false,
      //     obeserver:true,
      //     obeserverParents:true,
      //     navigation:{
      //       nextEl:'.swiper-button-next',
      //       prevEl:'.swiper-button-prev',
      //     }
      //
      //   });
      // },4000)




      postAction(this.url.LinkLists).then((res) => {
        this.LinkList = res;
        if( this.LinkList.length==1){
          this.show(this.LinkList[0].i_id, 0)
          this.LinkList.push(
            {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
          )

        }else if( this.LinkList.length==2){
          this.show(this.LinkList[0].i_id, 0)
          this.show(this.LinkList[1].i_id, 1)
          this.LinkList.push(
            {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},

          )
        }else if( this.LinkList.length==3){
          this.show(this.LinkList[0].i_id, 0)
          this.show(this.LinkList[1].i_id, 1)
          this.show(this.LinkList[2].i_id, 2)

          this.LinkList.push(
            {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
          )
        }else if( this.LinkList.length==0){
          this.LinkList.push(
            {s_title:'未定义',value:0,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:1,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:2,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
            {s_title:'未定义',value:3,picUrl1:'/img/2.890a7b1c.png',s_varchar4:'www.icfcc.com'},
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


      });
    },
    methods:{


      mouseOver() {
        if (!this.mouseFlag) {
          this.mouseFlag = true;
          this.findwaitLists();
        }
      },
      mouseLeave() {
        this.mouseFlag = false;
      },

      //监听选择范围
      show(id,index) {
        let requestpicurl = window._CONFIG['domianURL'] + '/oaBus/Calendar/oaCalendar/MostUserLink?id=' + id + '&resourceType=image'
        axios.get(requestpicurl, {
          responseType: 'arraybuffer',
          headers: {
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
          }
        }).then(res => {
          if(res!='true'){
            this.LinkList[index].picUrl1 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          }else{
            this.LinkList[index].picUrl1 = '../../assets/1.png'
          }
        })
      },
      fetchUser(value) {
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
      openUrl(e){
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
        // console.log(this.$refs[e][0].lastChild);
        // let lastChildNode = this.$refs[e][0].lastChild;
        //
        // console.log(lastChildNode.childNodes[0].nodeType);
        // //判断文本节点3     还是元素节点1
        // let nodeType = lastChildNode.childNodes[0].nodeType;
        // if(nodeType=='3'){
        //   console.log(lastChildNode.childNodes[0].nodeValue);
        //   let nodeValueUrl = lastChildNode.childNodes[0].nodeValue;
        //   window.open('http://'+nodeValueUrl)
        // }else{
        //   console.log(lastChildNode.childNodes[0].childNodes[0].getAttribute('href'));
        //   let nodeValueUrl1 = lastChildNode.childNodes[0].childNodes[0].getAttribute('href');
        //   console.log(lastChildNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getAttribute('href'))
        //   let nodeValueUrl2 = lastChildNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getAttribute('href')
        //   if(nodeValueUrl1!=null){
        //     window.open(nodeValueUrl1)
        //   }else{
        //     window.open(nodeValueUrl2)
        //   }
        // }

      },
      postMore(){

        this.$router.push('/'+'publicMessage/electronicFile');
      },
      doWill(e){
        console.log(e);
        this.willdoindex = e;
        if(e==1){
          // 代办日程
          // alert(e)
          this.willdoindex = 1;
          this.findwaitLists('task_todo');
        }else{

          // alert(e)
          // this.findwaitLists('task_done');
          this.willdoindex = 2;
          this.homeLists(this.userid,)

        }
      },
      openmore(url){
        if(url){
          // alert(url)
          this.$router.push('/'+url);
        }else{
          this.$router.push('/mytask/taskToDo');
        }
      },
      openmore1(e){  //待办/模块的跳转
        if(e==2){ //是0就跳待办
          let url = this.path
          this.$router.push('/'+url+"?moduleName="+this.model1);

        }else{ //否则就跳别的模块
          this.$router.push('/mytask/taskToDo');
        }

      },
      openDetialModelTaskToDo(record){

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
            getAction('/wf/task/taskStatus?taskid=' +  this.taskRecord.id).then(res => {
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
      openDetial(tableName, i_id) {

        // alert(taskDetail
        // this.$refs.detailFile.show(taskDetail)
        let params = {tableName: tableName, busdataId: i_id};

        this.$store.commit('pushNewDetial', params)
        // console.log(this.$store.state.postDetialLists);

        // window,open('http://localhost:4000/mytask/taskList/Test-detailFile?tableName=oa_busdata10&busdataId=515')
        window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + tableName + '&busdataId=' + i_id + '&navisshow=false')
        // this.$router.push({path:'/mytask/taskList/Test-detailFile',query:params})

      },
      //动态模块儿  业务详情
      openDetialModel(tableName,i_id){

        let taskDetail = {
          tableName: tableName,
          busdataId: i_id,
        }


        window.open(window.location.origin+'/mytask/taskList/Test-detailFile?tableName='+tableName+'&busdataId='+i_id+'&navisshow=false')


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

      //事件委托 想左切换
      leftclick(){
        this.$refs.left.click();
      },
      //事件委托 想右切换
      rightclick(){
        this.$refs.right.click();
      },
      handChange(){

      },
      //修改日期
      getdateVal(e){
        // let timestamp = e.valueOf();
        let currtentTime = new Date(e);
        let Y = currtentTime.getFullYear();
        let M = currtentTime.getMonth()+1;
        let D = currtentTime.getDate();
        // let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+currtentTime.toTimeString().substr(0,8);
        let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);
        this.localTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);

        //  领导日程
        this.leaderList(newTime);

        //  我的日程
        this.myDayLists(newTime);

        //  共享日程
        this.publicLists(newTime);

        //  收文发文
        this.homeLists(this.userid,newTime);



      },

      //我的日程编辑成功模态框关闭，刷新父级列表
      myrichenClose(e){
        if(e){
          getAction(this.url.list,{sCreateBy:this.userinfo.username,date:this.localTime}).then((res) => {
            this.mytitleLists = res.result.records;
          });
        }
      },
      doWill1(e){
        console.log(e);
        this.doindex = e;
        if(e==1){
          // 代办日程
          // alert(e)
          this.doindex = 1;
          this.findwaitLists('oaCalendar');
        }else{

          // alert(e)
          this.doindex = 3;
          this.findwaitLists('oaShareCalendar');

        }
      },
      //查看更多
      openMore(type){
        /* this.$refs.moremodel.showTableDetail(type,this.newTime);*/
        if(type == 1){//我的日程
          this.$router.push('/ioaBus/oaCalendar');
        }else if(type ==2){//领导日程 /ioaBus/oaLeaderCalendar
          this.$router.push('/ioaBus/oaLeaderCalendar');
        }else{//共享日程
          this.$router.push('/ioaBus/oaShareCalendar');
        }



      },
      handleOk(){
        deleteAction(this.url.delete,{id:this.mystitltid,sCreateBy:this.userinfo.username}).then((res) => {
          if(res.success){
            this.visible = false;
            this.myDayLists(this.localTime);

          }

        });
      },
      handleCancel(){
        this.visible = false;
      },
      //编辑我的日程
      editstitle(e,d){
        this.$refs.modalForm.update(e,d);
      },
      editstitle1(e,d){
        this.$message.warning("转进来的业务不能进行修改操作");
      },
      //删除我的日程
      delstitle(e){
        this.mystitltid = e;
        this.visible = true;
      },
      delstitle1(e){
        this.$message.warning("转进来的业务不能进行删除操作");
      },
      //查看日程
      chakan(iid){
        getAction(this.url.findById,{id:iid }).then((res) => {
          if(res.result.stateName != "" ){
            let subdata = {
              dStartTime: res.result.dStartTime,
              dEndTime: res.result.dEndTime,
              dCreateTime: res.result.dCreateTime,
              dcreateTime: res.result.dcreateTime,
              screateBy: res.result.screateBy,
              ibusFunctionId: res.result.ibusFunctionId,
              ibusModelId: res.result.ibusModelId,
              suserNames: res.result.suserNames,
              iopenType: res.result.iopenType,
              dstartTime: res.result.dstartTime,
              iisTop: res.result.iisTop,
              iisLeader: res.result.iisLeader,
              stitle: res.result.stitle,
              ifunDataId: res.result.ifunDataId,
              dendTime: res.result.dendTime,
              iremindType: res.result.iremindType,
              iid:res.result.iid,
              taskId: res.result.taskId,
              taskUserId: res.result.taskUserId,
              ibusModelId: res.result.ibusModelId,
              ibusFunctionId: res.result.ibusFunctionId,
              saddress: res.result.saddress,
              state:4,
            }

            let params = {tableName: res.result.tableName, busdataId: res.result.ifunDataId};
            this.$store.commit('pushNewDetial', params)
            // window,open('http://localhost:4000/mytask/taskList/Test-detailFile?tableName=oa_busdata10&busdataId=515')
            window, open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + res.result.tableName + '&busdataId=' + res.result.ifunDataId + '&navisshow=false')
            if(res.result.stateName == "【未阅】"){
              putAction(this.url.edit,subdata).then((res) => {
                this.$message.success(res.message);

              })
            }
          }else{
            this.$refs.modalCatForm.dayAnnalysis1(res.result);
          }
        });

      },
      //添加我的日程
      add(){
        this.$refs.modalForm.add();
      },
      handleOkEdit(){
        // this.editvisible = true;

      },
      handleCancelEdit(){
        this.editvisible = false;
      },
      //  领导日程 &userId="+this.userid;
      leaderList(timestamp){
        getAction(this.url.findByLeader,{date:timestamp}).then((res) => {
          let stitleLists = res.result.records.splice(0,6);
          this.stitleLists = stitleLists;

        });

      },
      //  我的日程
      myDayLists(timestamp){
        getAction(this.url.list,{sCreateBy:this.userinfo.username,date:timestamp}).then((res) => {
          this.mytitleLists = res.result.records.splice(0,6);
          this.total2 = res.result.total;
        });
      },
      //共享日程
      publicLists(timestamp){
        getAction(this.url.queryPageList,{date:timestamp}).then((res) => {

          // alert( res.result.records.length)
          this.publictitleLists = res.result.records.splice(0,6);
          this.total3 = res.result.total;

        });
      },
      //待办 已办   日程  .replace(0,3);
      findwaitLists(operstatus='task_todo'){

        getAction(this.url.findwaiturl,{operstatus:operstatus}).then((res) => {
          this.findwaitdataLists =res.result.records.splice(0,5)
            this.total = res.result.total;
        });
      },
      //  数据初始化  收文  发文数据
      homeLists(userid,createtime=''){
        getAction(this.url.HomeList,{userId:userid,createTime:createtime}).then((res) => {
          this.model1 = res.model1.sName;
          this.path = res.model1.url
          this.model2 = res.model2.sName;
          this.tableName=res.model1.tableName;
          this.total1 = res.model1.total
          this.ModelList = res.model1.list.splice(0,5);
          this.model2Lists = res.model2.list;

          if(this.willdoindex == 0){//如果是待办任务才会调用此方法
            this.findwaitLists();
          }


        });
      },
      // 公告
      getPostLists(){
        postAction(this.url.Posturl,{modelId:49,condition:{function_id:64,selType:1}}).then((res) => {
          this.postLists = res.result.records.splice(0,3);
          // alert( JSON.stringify(this.postLists ))
        });
      }
    }
  }
</script>


<style scoped lang="less">
 @import "../../assets/less/indexStyle0.less";
</style>