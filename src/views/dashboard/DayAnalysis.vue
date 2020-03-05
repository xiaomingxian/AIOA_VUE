<template>
    <div class="wrap">
        <div class="topp">
            <template>

              <a-row type="flex" style="height: 100%">
                  <a-col :span="6" style="height: 100%;background: #FBF2DC">
                    <div class="part1">
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
                                <a-calendar style="width:100%" :showToday="true"  :fullscreeb = "false" @select="getdateVal" />
                              </div>
                            </template>
                        </div>
                    </div>
                  </a-col>
                  <a-col :span="18" style="background: #ffffff;height: 100%">
                    <a-row type="flex" style="height: 100%">
                      <a-col :span="8">
                        <div class="part2">
                          <div class="title" >
                            <div style="width: 95%;margin: 0 auto;  display: flex;align-items: center;justify-content: space-between;">
                              <div style="width: 90%;height:auto;line-height:0px;padding:0px 0px;display: flex;align-items: center;justify-content: space-between;border-bottom: 2px solid  #ffbc90;margin: 0 auto">
                                <p style="margin: 0;padding: 13px 0px;border-bottom: 2px solid  #ff816c;font-size: 14px;font-weight: 600;color: #7d0900">领导日程</p>
                                <span><a-icon @click="openMore(2)"type="right" style="color: #ff816c;font-weight: 600"/></span>
                              </div>
                            </div>
                          </div>
                          <!-- v-if="stitleLists!=''"-->
                          <div class="itembox"  v-if="stitleLists!=''">
                            <div class="itemline"  v-for="(item,index) in stitleLists" :key="index" @click="chakan(item.iid)">

                              <!--<p class="time">-->
                                <!--<i></i>-->
                                <!--&lt;!&ndash;<span style="font-size: 12px;color: #666666">{{item.dCreateTime}}</span>&ndash;&gt;-->
                              <!--</p>-->
                              <div class="contentbox" >
                                <p class="content" :title="item.stitle+'('+item.suserNames+')'" style="font-size: 12px;color: #333333">{{item.stitle +"("+ item.suserNames+")"|filterText}}</p>
                                <div style="visibility: hidden">
                                    <img style="width: 22px;" src="../../assets/check.png" @click="editstitle(publictitleLists[index],1)">
                                </div>
                              </div>
                            </div>
                          </div>
                          <!--暂无日程显示-->
                          <div v-else style=" width: 98%;   min-height: 200px;margin: 0 auto;  margin-top: 10px; padding: 0 20px;  border-right: 1px solid #9b9b9b; color: #dddddd;display: flex;align-items: center;justify-content: center">暂无日程</div>
                        </div>
                      </a-col>
                      <a-col :span="8">
                        <div class="part2">
                          <div class="title" style="display: flex;align-items: center;justify-content: center">
                            <div style="width:85%;height:auto;line-height:0px;padding:0px 0px;display: flex;align-items: center;justify-content: space-between;border-bottom: 2px solid  #ffbc90;margin: 0 auto">
                              <p style="margin: 0;padding: 13px 0px;border-bottom: 2px solid  #ff816c;font-size: 14px;  font-weight: 600;color: #001843">我的日程</p>
                              <span><a-icon @click="openMore(1)"type="right" style="color: #ff816c;font-weight: 600"/></span>
                            </div>
                          </div>
                          <!--mytitleLists-->
                          <div class="itembox"  v-if="mytitleLists!=''">
                            <div class="itemline" v-for="(myitem,index) in mytitleLists" :key="index"  @click="chakan(myitem.iid)">
                              <!--<p class="time">-->
                                <!--<i></i>-->
                                <!--<span style="font-size: 12px;color: #666666">{{myitem.dCreateTime}}</span>-->
                              <!--</p>-->
                              <div class="contentbox" >
                                <p class="content"  :title="myitem.stitle+'('+myitem.suserNames+')'" style="font-size: 12px;color: #333333">{{myitem.stitle+"("+ myitem.suserNames+")"|filterText}}</p>
                                <div >
                                   <!-- <img style="width: 22px;" src="../../assets/check.png" @click.stop="editstitle1(mytitleLists[index],1)">-->
                                    <img style="width: 22px;" src="../../assets/edit.png" @click.stop="editstitle(mytitleLists[index])">
                                    <img style="width: 22px;" src="../../assets/del.png" @click.stop="delstitle(myitem.iid)">
                                </div>
                              </div>
                            </div>
                          </div>
                          <!--暂无日程显示-->
                          <div v-else style=" width: 98%;   min-height: 200px;margin: 0 auto;  margin-top: 10px; padding: 0 20px;  border-right: 1px solid #9b9b9b; color: #dddddd;display: flex;align-items: center;justify-content: center;">暂无日程</div>
                        </div>
                      </a-col>
                      <a-col :span="8">
                        <div class="part2">
                          <div class="title">
                            <div style="width:90%;height:auto;line-height:0px;padding:0px 0px;display: flex;align-items: center;justify-content: space-between;border-bottom: 2px solid  #ffbc90;margin: 0 auto">
                              <p style="margin: 0;padding: 13px 0px;border-bottom: 2px solid  #ff816c;font-size: 14px;  font-weight: 600;color: #24005f">共享日程</p>
                              <span><a-icon @click="openMore(3)"type="right" style="color: #ff816c;font-weight: 600"/></span>
                            </div>
                            <!--<span>共享日程<a-icon @click="openMore(2)" type="right"/></span>-->
                          </div>
                          <div class="itembox"   v-if="publictitleLists!=''" style="border: none" >
                            <div class="itemline" v-for="(publicitem,index) in publictitleLists" :key="index" @click="chakan(publicitem.iid)">
                              <div class="contentbox">
                                <p class="content"  :title="publicitem.stitle+'('+publicitem.suserNames+')'" style="font-size: 12px;color: #333333">{{publicitem.stitle+"("+ publicitem.suserNames+")"|filterText}}</p>
                               <div style="visibility: hidden">
                                    <img style="width: 22px;" src="../../assets/check.png" @click="editstitle(publictitleLists[index],1)">
                                </div>
                              </div>
                            </div>
                          </div>
                          <!--暂无日程显示-->
                          <div v-else style=" width: 98%;   min-height: 200px;margin: 0 auto;  margin-top: 10px; padding: 0 20px;color: #dddddd;display: flex;align-items: center;justify-content: center;">暂无日程</div>
                        </div>
                      </a-col>
                    </a-row>
                  </a-col>
              </a-row>
            </template>
        </div>

        <div class="bottom">
          <template>
            <a-row type="flex" style="height: 100%;" justify="space-between">
              <a-col :span="12" >
                <div class="part1">
                  <div class="listsBox" style="position: relative;height: 50%">
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
                          <span :title="postitem.s_title">{{postitem.s_title|filterText2}}</span>
                          <!--<i></i>-->
                        </div>
                        <span class="time">{{postitem.d_create_time|timeStrings}}</span>
                        <!--</a-popover>-->
                      </div>
                    </template>
                    <img style="position: absolute;left: 10px;bottom: 0px;width: 50px;" src="../../assets/bottomleft.png" alt="">
                    <img style="position: absolute;top: 42px;right: 10px;width: 100px;" src="../../assets/topright.png" alt="">
                    <span @click="postMore"  class="postMore" style="position: absolute;bottom: 1px;right: -10px;width: 100px; font-size: 14px;color: #009cff ">查看更多  <a-icon style="font-size: 12px;color: #009cff " type="double-right"></a-icon></span>

                  </div>
                  <div class="searchBox" style="height: 50%;">
                    <div style="display: flex;align-items: center">
                      <img @click="leftclick" style="width: 20px;height: 30px;margin-left: 20px;" src="../../assets/left.png" alt="">
                      <div class="swiper-container swiper-no-swiping bottomm">
                        <div class="swiper-wrapper">
                          <div class="swiper-slide" v-for="(item,index) in LinkList" :key="index" @click="openUrl((index+1)+'item')">
                            <div style="display:flex;align-items: center;justify-content: center">


                              <img style="width:60px;height: 60px;" :src="item.picUrl1=='data:image/png;base64,dHJ1ZQ=='?'/img/1.faaedd76.png':item.picUrl1" :title="item.s_title" alt="">

                              <span v-show="false" :ref="(index+1)+'item'" v-html="item.url"></span>
                            </div>
                          </div>

                        </div>
                        <!--Add Arrows-->
                        <div ref="left" style="display: none" class="swiper-button-next"></div>
                        <div ref="right" style="display: none" class="swiper-button-prev"></div>
                      </div>
                      <img @click="rightclick" style="width: 20px;height: 30px;margin-right: 20px;"  src="../../assets/right.png" alt="">
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span="12" >
                <div class="daiban" style="height: 100%;">
                  <div class="titlebox" style="display: flex;align-items: center;justify-content: space-between">
                    <div style="width: 100%; height: 45.8px;   margin: 0;padding: 0;  display: flex;align-items: center;justify-content: flex-start">
                      <span @click="doWill(0)" class="firstspan"  :style="willdoindex==0?'color:#333333':' color:#999999 !important'">
                       <span class="shuline"></span>
                       <span>待办工作</span>
                       <b style="color: #ffffff;font-weight: 400"  v-if="total"> {{total}}</b>
                      </span>
                      <span v-if="this.model1">|</span>
                      <span @click="doWill(1)"  class="secondspan" :style="willdoindex==1?'color:#333333':'color: #999999;!important'" >
                       <span>{{this.model1}}</span>
                       <b style="color: #ffffff;font-weight: 400"  v-if="total1"> {{total1}}</b>
                       </span>
                    </div>
                    <span class="more" style="width: 100px;" @click="openmore1(willdoindex)">MORE  <a-icon type="plus"></a-icon> </span>
                  </div>



                  <div class="itemline" style="height: 62%;">
                      <div class="each" v-if="findwaitdataLists" v-for="(item,index) in findwaitdataLists" :key="index" @click="openDetialModelTaskToDo(item)"  :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">
                        <div class="p">

                          <template v-if="willdoindex==0">
                             <p>
                              <i></i>
                              <span :title="item.title+'   '+item.createTime+item.name">
                                <span>{{item.title|filterText1}}
                                  <div v-if="item.important==1">
                                       <img src="../../assets/zhong.png" alt="" >
                                  </div>
                                </span>

                              </span>
                            </p>
                            <span >{{item.createTime|timeText}}</span>
                          </template>

                          <template v-else>
                             <p>
                              <span :title="item.s_title+'   '+item.d_create_time">
                               <i></i>
                              <span>  {{item.s_title|filterText1}}
                                <div v-if="item.important==1">
                                   <img src="../../assets/zhong.png" alt="" >
                                </div>
                              </span>


                             </span>
                            </p>
                            <span >{{item.d_create_time|timeText}}</span>
                          </template>


                        </div>
                      </div>
                      <div v-else>
                        暂无待办工作
                      </div>
                  </div>
                  <hr>
                
                  <div class="top" style="width: 90%;height: 38%;display: flex;align-items: center; border-top: 1px solid #999999;  margin: 0 auto">
                    <!--<a-input placeholder="请输入关键字">-->
                      <!--<a-icon slot="prefix" type="search"></a-icon>-->
                    <!--</a-input>-->
                    <span class="table-page-search-submitButtons" style="position: relative;left: -4px;top: -1px;cursor: pointer;">
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
      <oa-calendar-cat-modal ref="modalCatForm"  @ok="modalFormOk"></oa-calendar-cat-modal>
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

  import { httpAction,getAction,postAction,deleteAction} from '@/api/manage'
  import debounce from 'lodash/debounce';
  import oaCalendarCatModal from '../oaBus//modules/oaCalendarCatModal'
  import oaCalendarModal from '../oaBus/modules/oaCalendarModal'
  import detailFile from '../mytask/taskList/detailFile'
  import DetailModel from './DetailModel'

  import Swiper from 'swiper/js/swiper.min.js'
  import  'swiper/css/swiper.min.css'
  import moment from 'moment'
  import axios from "axios";
  import Vue from "vue";
  import {ACCESS_TOKEN} from "../../store/mutation-types";


  export default {
      name: "Dayanalysis",
      data () {
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
        return {
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
          path:'',
          stitleLists:[],//领导日程列表
          mytitleLists:[],//我的日程列表
          publictitleLists:[],//共享日程列表
          findwaitdataLists:[],//待办日程列表
          LinkList:[],//常用链接
           userid:'',
          userinfo:'',
          model1Lists:[],
          model2Lists:[],
          postLists:[],// 公告列表
            url:{
              findByLeader:'/oaBus/Calendar/oaCalendar/findByLeader',
              MostUserLink:'/oaBus/Calendar/oaCalendar/MostUserLink',
              // findwaiturl:'/oaBus/Calendar/oaCalendar/findwait ',
              findById:'/oaBus/Calendar/oaCalendar/queryById',
              findwaiturl:'/wf/task/queryTask',
              queryPageList:'/oaBus/Calendar/oaCalendar/queryPageList',
              list:'/oaBus/Calendar/oaCalendar/list',
              HomeList:'/oaBus/homeAnalysis/HomeList',
              delete: "/oaBus/Calendar/oaCalendar/delete",
              Posturl:'/oaBus/oaBusdata/queryByModelId',
              busDataAndColums: 'oaBus/oaBusdata/queryBusdataById',
              LinkLists:'/oaBus/Calendar/oaCalendar/LinkList',
            },
          total:'',//代办数量
          total1:'',//模块的数量
          day:'',
          week:'',
          nongli:'',//农历
          ESM:'',
          willdoindex:0,   //  待办已办高亮

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
            if (text.length > 17) {
              return text.substring(0, 14) + '...'
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
            if(text.length>25){
              return text.substring(0,22)+'...'
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
          return  Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);

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
        console.log(userinfo);
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
        for(var i=0;i<this.LinkList.length;i++){
          this.show(this.LinkList[i].i_id,i)
        }
        setTimeout(()=>{

          var mySwiper = new Swiper('.swiper-container',{
            initialSlide:0,
            slidesPerView:4,
            spaceBetween:13,
            lazyLoading:true,
            loop:false,
            obeserver:true,
            obeserverParents:true,
            navigation:{
              nextEl:'.swiper-button-next',
              prevEl:'.swiper-button-prev',
            }

          });
        },1000)
        console.log(this.LinkList.length)
      });
    },
    methods:{
      //监听选择范围
      show(id,index) {
        let requestpicurl = window._CONFIG['domianURL'] + '/oaBus/Calendar/oaCalendar/MostUserLink?id=' + id + '&resourceType=image'
        axios.get(requestpicurl, {
          responseType: 'arraybuffer',
          headers: {
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
          }
        }).then(res => {
          console.log(res)
          if(res!='true'){
            this.LinkList[index].picUrl1 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            console.log(this.LinkList)

          }else{
            this.LinkList[index].picUrl1 = '../../assets/1.png'
          }
        })
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
      postMore(){

        this.$router.push('/'+'publicMessage/electronicFile');
      },
      doWill(e){
        console.log(e);
        this.willdoindex = e;
        if(e==0){
          // 代办日程
          // alert(e)
          this.willdoindex = 0;
          this.findwaitLists('task_todo');
        }else{

          // alert(e)
          // this.findwaitLists('task_done');
          this.willdoindex = 1;
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

        console.log(e);
        if(e=='1'){ //是0就跳待办
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
          console.log(e);
          // let timestamp = e.valueOf();
          let currtentTime = new Date(e);
          let Y = currtentTime.getFullYear();
          let M = currtentTime.getMonth()+1;
          let D = currtentTime.getDate();
          // let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+currtentTime.toTimeString().substr(0,8);
          let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D);
          console.log(newTime);
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
        delstitle(e){
          this.mystitltid = e;
          this.visible = true;
        },
        //我的日程编辑成功模态框关闭，刷新父级列表
        myrichenClose(e){
          console.log(e);
          if(e){
            getAction(this.url.list,{username:this.userinfo.username}).then((res) => {
              console.log(res);
              this.mytitleLists = res.result.records;

            });
          }
        },
        //查看更多
        openMore(type){
         /* this.$refs.moremodel.showTableDetail(type,this.newTime);*/
            console.log(type);
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
            console.log(res);
            if(res.success){
              this.visible = false;
              getAction(this.url.list,{username:this.userinfo.username}).then((res) => {
                console.log(res);
                this.mytitleLists = res.result.records;

              });

            }

          });
        },
        handleCancel(){
          this.visible = false;
        },
        //编辑我的日程
        editstitle(e,d){
          console.log(e);
          this.$refs.modalForm.update(e,d);
        },
        //查看日程
        chakan(iid){
          getAction(this.url.findById,{id:iid }).then((res) => {
            this.$refs.modalCatForm.dayAnnalysis1(res.result);

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
            console.log(res);
            let stitleLists = res.result.records.splice(0,4);
            this.stitleLists = stitleLists;

          });

        },
        //  我的日程
        myDayLists(timestamp){
          getAction(this.url.list,{username:this.userinfo.username,date:timestamp}).then((res) => {
            console.log(res);
            this.mytitleLists = res.result.records.splice(0,5);
          });
        },
        //共享日程
        publicLists(timestamp){
          getAction(this.url.queryPageList,{date:timestamp}).then((res) => {
            console.log(res);
            // alert( res.result.records.length)
            this.publictitleLists = res.result.records.splice(0,5);

          });
        },
        //待办 已办   日程  .replace(0,3);
        findwaitLists(operstatus='task_todo'){

          getAction(this.url.findwaiturl,{operstatus:operstatus}).then((res) => {
            console.log(res.result.records);
            console.log(Array.isArray(res.result.records));

            this.findwaitdataLists =res.result.records.splice(0,5)
            console.log(this.findwaitdataLists);


            if(operstatus=='task_todo'){
              this.total = res.result.total;
            }else{
             // this.total1 = res.result.total;
            }


          });
        },
       //  数据初始化  收文  发文数据
        homeLists(userid,createtime=''){
          getAction(this.url.HomeList,{userId:userid,createTime:createtime}).then((res) => {
            console.log(res);
            this.model1 = res.model1.sName;
            this.path = res.model1.url
            this.model2 = res.model2.sName;
            this.total1 = res.model1.list.length
            this.findwaitdataLists = res.model1.list.splice(0,5);
            this.model2Lists = res.model2.list;

            if(this.willdoindex == 0){//如果是待办任务才会调用此方法
              this.findwaitLists();
            }


          });
        },
      // 公告
        getPostLists(){
          postAction(this.url.Posturl,{modelId:49,condition:{function_id:64,selType:1}}).then((res) => {
            console.log(res.result.records);

            this.postLists = res.result.records.splice(0,3);
            // alert( JSON.stringify(this.postLists ))
          });
        }
      }
    }
</script>


<style scoped lang="less">
  .anticon:hover{
    cursor: pointer;
    color: #2eabff;
  }

  .itembox:hover{
    cursor: pointer;
    /*color: #2eabff;*/
  }
  .postMore:hover{
    cursor: pointer;
  }


  /deep/ .ant-input{
    border-color: #054c9c !important;
  }

  /deep/.ant-fullcalendar-full{
    /*height: 900px;*/
  display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  /*此处style 无效  alt单机class 在GlobalLayout中设置*/
  /deep/.ant-layout-footer{
    background: red;
  }
  .wrap{
      /*日期组件部分隐藏  年月切换   否则页面布局会乱掉*/
      /deep/.ant-fullcalendar-fullscreen .ant-fullcalendar-header .ant-radio-group{
        /*visibility: hidden; rgb(255, 188, 144)*/
        display: none;
      }

    /*/deep/.ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-date{*/
      /*background:  rgb(255, 188, 144);*/
    /*}*/
    /*/deep/ .ant-fullcalendar-fullscreen .ant-fullcalendar-today .ant-fullcalendar-date{*/
      /*border-top-color: rgb(255, 129, 108);*/
    /*}*/
    /deep/.ant-fullcalendar-header{
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /deep/.ant-select-selection{
      /*border: none;*/
      font-weight: bold;
    }




      .topp{
        width: 100%;
        min-height: 327px;
        background: #ffffff;
        .part1{
          border-top: 2px solid #00c6ff;
          /*width: 300px;*/
          height: 100%;
          width: 100%;
          /*background: red !important ;*/
          .timeCard{
            width: 100%;
            /*height: 80px;*/

            /*margin:  0 auto;*/
            background-image: url('../../assets/bgTime.png') ;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            padding-top: 1px;


            .month{
              width: 100%;
              font-weight: 600;
              color: #ffffff;
              margin-left: 10px;
              margin-top: 5px;
              margin-bottom: 0;
            }
            .day{
              width: 100%;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              font-size: 40px;
              color: #ffffff;
              margin: 0;
              font-weight: 600;
              margin-top: -10px;
            }
            .weekday{
              color: #ffffff;
              width: 100%;
              text-align: center;
            }
          }
          .rilibox{
            /deep/.ant-fullcalendar {
              height: auto !important;
            }
            /deep/.ant-fullcalendar-full{
              height: auto !important;
            }
            /deep/.ant-fullcalendar-fullscreen{
              height: auto !important;

            }
            /deep/.ant-fullcalendar-header{
              padding: 11px 16px 0 0;
            }
            /deep/ .ant-fullcalendar-calendar-body{
              padding: 12px 12px;
            }
            /deep/.ant-fullcalendar-calendar-body{
              /*padding-bottom: 30px;*/


            }
            /*height: 100%;*/
            /*width: auto !important;*/
            /*border: none !important;*/
            margin: 0 auto;
            /*background: #ffffff;*/
            /deep/.ant-fullcalendar-calendar-body{
              /*background: #e4e6ff;*/
              background: #FBF2DC;
              margin-top: 20px;
            }
            /deep/.ant-fullcalendar-date{
              height: auto;
            }
            /deep/.ant-fullcalendar-content{
              height: 0;
            }

          }
        }

        .part2{
          border-top: 2px solid #00c6ff;
          .title{
            width: 100%;
            height: 50px;
            line-height: 50px;
            background: #f4f4f4 !important;
            background: transparent !important;
            text-align: left;
            display: flex;
            align-items: center;
            span{
              font-size: 16px;
              font-weight: 600;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }

          .itembox{

            width: 98%;
            /*min-height: 350px;*/
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            margin-top: 10px;
            padding: 0 20px;
            border-right: 1px solid #9b9b9b;

            .itemline{
              width:98%;
              /*height: 52px;*/
              height: 38px;
              /*height: auto;*/
              /*padding: 20px;*/
              background: #FBF2DC;
              /*background: red;*/
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
              padding: 5px;
              /*margin: 10px auto;*/
              margin: 6px auto;
              border-left: 3px solid #FFBC90;

              /*padding-bottom: 20px;*/
              .time{
                width: 100%;
                display: flex;
                align-items: center;
                /*margin: 0;*/
                /*margin-bottom: 3px;*/
                i{
                  width: 5px;
                  height: 5px;
                  background: red;
                  -webkit-border-radius: 5px;
                  -moz-border-radius: 5px;
                  border-radius: 5px;
                  margin-left: 5px;

                }
                span{
                  margin-left: 10px;
                  font-size: 12px;
                }

              }

              .contentbox{
                width: 100%;
                /*background: #00ff80;*/

                margin-left: 8px;
                font-size: 12px;
                margin-top: 3px;
                line-height: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .content{
                  margin: 0px !important;
                  padding: 0px !important;
                  /*background: #000c17;*/
                }
                div:last-child{
                  margin-right: 20px;
                  font-size: 14px;

                  img{
                    margin-left: 10px;
                  }
                  img:hover{
                    cursor: pointer;
                  }
                }
              }
            }

          }
        }

      }

      .bottom{

        margin-top: 12px;
        min-height: 327px;
        height: 100%;
        background: 100%;

        .part1{
          background: #ffffff;
          /*padding-top: 10px;*/
          padding-bottom: 10px;
          /*height: 300px;*/
          height: 100%;
          .listsBox{
            padding-top: 0px !important;
            width: 100%;
            min-height: 180px;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content:flex-start;
            /*padding: 15px;*/
            background-image: url("../../assets/postBg.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: bottom right;
            margin: 0 auto;

            /*padding-bottom: 8px;*/
            .title{
              width: 120px;
              background: transparent !important;
              margin-left: 10px;
              margin-top: 10px;
              /*margin-bottom: 10px;*/

              display: flex;
              align-items: center;
              .imgzhanwei{
                width: 40px;
                height: 40px;
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
            /*margin-left: 20px;*/


            .lineitem{
              width: 90%;
              /*height: 50px;*/
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin: 0 auto;
              margin-top: 8px;

              /*background: darkcyan;*/

              .left{
                width: 65%;
                display: flex;
                align-items: center;
                /*justify-content: space-between;*/
                margin: 0;
                .tongzhi{
                  min-width: 90px;
                  /*width: auto;*/
                  background: #f8ffbb;
                  font-weight: 600;
                  margin: 0;
                  margin-left: 6px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                span{
                  width: 75%;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  margin: 0 10px;
                }
                i{
                  width: 5px;
                  height: 5px;
                  background: #da251c;
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
              cursor: pointer;
            }

          }
          .searchBox{
            /*width: 40%;*/

            min-height: 147px;
            padding: 10px;
            width: 100%;
            /*display: flex;*/
            /*align-items: center;*/
            /*justify-content: center;*/
            /*margin-top:50px;*/
            /*background: darkcyan;*/
            /deep/img:hover{
              cursor: pointer;
            }
            /*.top{*/
              /*width: 95%;*/
              /*margin: 0 auto;*/
              /*margin-top: 10px;*/
            /*}*/
            .bottomm{
              width: 100%;
              /*height: 145px;*/
              /*height: 80px;*/
              /*background: red;*/
              min-height: 147px;
              margin: 0px auto;
              /*margin-top: 30px;*/

              display: flex;
              align-items: center;
              /deep/.swiper-wrapper{

                width: 100%;
                margin: 0 auto;

                /*margin-left: 20px;*/
                .swiper-slide{
                  /*width: 100px;*/
                  height: 100%;
                  /*background: red;*/
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: space-around;
                  /*margin-right: 0px !important;*/
                  /*margin-left: 5px !important;*/
                  div{
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    /*background: #2eabff;*/
                    img{
                      width: 100%;
                    }
                    img:hover{
                      cursor: pointer;
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


        .daiban{
          /*width: 60%;*/
          /*height: 100%;*/
          /*padding: 10px;*/
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          margin-left: 12px;

          .titlebox{
            width: 100%;
            /*height: 40px;*/
            height: 45.8px;
            background: #f4f4f4;
            border-bottom: 2px solid #009dee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0;

            span:hover{
              cursor: pointer;
            }
            .firstspan{
              min-width: 100px;
              height: 40px;
              padding: 0 8px;
              padding-left: 0;
              /*background: #009dee;*/
              font-size: 16px;
              font-weight: bold;
              /*color: #ffffff;*/
              display: flex;
              align-items: center;

              .shuline{
                width: 5px;
                height: 45.8px;
                background: #1174b9;

                padding: 0;
                margin-right: 10px;
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
            .secondspan{
              min-width: 100px;
              height: 40px;
              padding: 0 10px;
              padding-left: 10px;
              /*background: #7fbbff;*/
              font-size: 16px;
              font-weight: bold;
              color: #333333;
              display: flex;
              align-items: center;

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

          }

          .itemline{
            width: 100%;
            /*min-height:230px;*/
            /*background: #999999;*/
            /*padding: 10px;*/
            padding-top: 0;
            display: flex;
            flex-direction: column;
            margin: 0;



            .each{
              width: 100%;
              /*background: red;*/
              display: flex;
              align-items: center;
              justify-content: space-between;
              /*line-height: 40px;*/
              /*padding-bottom: 20px;*/
              /*border-bottom: 1px solid #f0f2f5;*/
              border-left: 5px solid #c7ecff;
              /*margin-left: 10px;*/



              .p{
                width:95%;

                height: 46px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                /*line-height: 40px;*/
                margin: 0 auto;
                font-size: 14px;
                // margin-left: 20px;
                /*margin-top: 19px;*/



                p{
                  /*display: block;*/
                  /*line-height: 40px;*/
                  width: 65%;

                  height: 80% !important;
                  /*height: 20px;*/
                  /*background: #dddddd;*/
                  margin: 0 !important;
                  padding: 0 !important;

                  display: flex;
                  align-items: center;
                  justify-content: flex-start;

                  i{
                    /*display: block;*/
                    width: 5px;
                    height: 5px;
                    background: #2eabff;
                    margin-right: 10px;
                    /*margin-left: 10px;*/
                  }


                  span{
                    width: 95%;
                    /*width: 200px;*/

                    height: 100%;


                    display: flex;
                    align-items: center;

                    /*padding-right:10px*/
                    span{
                      width: 95%;
                      height: 100%;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }

                  }

                  img{
                    width: 40px;
                    margin-bottom: 18px;
                    margin-left: 5px;
                  }


                }
                /*span:last-child{*/
                  /*display: block;*/
                  /*line-height: 40px;*/
                  /*margin-right: 20px;*/
                /*}*/
              }
              a{

                margin-top: 5px;

              }
            }
          }

          .itemline:hover{
            cursor: pointer;
          }
        }


      }
    }
</style>