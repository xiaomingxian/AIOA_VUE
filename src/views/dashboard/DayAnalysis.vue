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
                                <span class="content" style="font-size: 12px;color: #333333">{{item.stitle|filterText}}</span>
                                <span style="visibility: hidden">
                                    <img style="width: 22px;" src="../../assets/check.png" @click="editstitle(publictitleLists[index],1)">
                                </span>
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
                                <span class="content" style="font-size: 12px;color: #333333">{{myitem.stitle|filterText}}</span>
                                <span >
                                   <!-- <img style="width: 22px;" src="../../assets/check.png" @click.stop="editstitle1(mytitleLists[index],1)">-->
                                    <img style="width: 22px;" src="../../assets/edit.png" @click.stop="editstitle(mytitleLists[index])">
                                    <img style="width: 22px;" src="../../assets/del.png" @click.stop="delstitle(myitem.iid)">
                                </span>
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
                                <span class="content" style="font-size: 12px;color: #333333">{{publicitem.stitle|filterText}}</span>
                               <span style="visibility: hidden">
                                    <img style="width: 22px;" src="../../assets/check.png" @click="editstitle(publictitleLists[index],1)">
                                </span>
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
                          <p class="tongzhi">[系统通知]</p>
                          <span>{{postitem.s_title}}</span>
                          <i></i>
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
                          <div class="swiper-slide" v-for="(item,index) in LinkList" :key="index" @click="openmore1(item.s_title)">
                            <div>
                              <img src="../../assets/1.png" :title="item.s_title" alt="">
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
                  </div>
                </div>
              </a-col>
              <a-col :span="12" >
                <div class="daiban" style="height: 100%;">
                  <p class="titlebox" style="display: flex;align-items: center;justify-content: space-between">
                    <civ style="display: flex;align-items: center;justify-content: flex-start">
                       <span @click="doWill(0)" class="firstspan"  :style="willdoindex==0?'background:#009dee;color:#ffffff':'background:#7fbbff; color:#333333 !important'">
                       <span class="shuline"></span>
                       <span>待办工作</span>
                       <b style="color: #ffffff;font-weight: 400"  v-if="total"> {{total}}</b>
                    </span>
                      <span @click="doWill(1)"  class="secondspan" :style="willdoindex==1?'background:#009dee;color:#ffffff':'background:#7fbbff;color: #333333;!important'" >
                       <span>{{this.model1}}</span>
                       <b style="color: #ffffff;font-weight: 400"  v-if="total1"> {{total1}}</b>
                    </span>
                    </civ>
                    <span class="more" style=" margin-right: 20px;" @click="openmore1(willdoindex)">MORE  <a-icon type="plus"></a-icon> </span>
                  </p>
                  <div class="itemline" style="height: 62%;">
                      <div class="each" v-if="findwaitdataLists" v-for="(item,index) in findwaitdataLists" :key="index" @click="openDetialModel(item.table,item.iid)"  :style="index%2==0? '':'background: #e2f1f6; border-left: 5px solid  #95d9fd;'">
                        <p class="p">
                          <span :title="item.title+'   '+item.createTime+item.name">
                            <i></i>
                            {{item.title}}
                            <img src="../../assets/zhong.png" alt="">
                          </span>
                          <span >{{item.dCreateTime}}</span>
                        </p>
                      </div>
                      <div v-else>
                        暂无待办工作
                      </div>
                  </div>
                  <hr>
                  <hr/>
                  <hr>
                  <div class="top" style="width: 90%;height: 38%;display: flex;align-items: center; border-top: 1px solid #999999;  margin: 0 auto">
                    <a-input placeholder="请输入公文链接">
                      <a-icon slot="prefix" type="search"></a-icon>
                    </a-input>
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
    </div>
</template>

<script>

  import { httpAction,getAction,postAction,deleteAction} from '@/api/manage'
  import oaCalendarCatModal from '../oaBus//modules/oaCalendarCatModal'
  import oaCalendarModal from '../oaBus/modules/oaCalendarModal'
  import detailFile from '../mytask/taskList/detailFile'
  import DetailModel from './DetailModel'

  import Swiper from 'swiper/js/swiper.min.js'
  import  'swiper/css/swiper.min.css'
  import moment from 'moment'


  export default {
      name: "Dayanalysis",
      data () {
        return {
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
            },
          total:'',//代办数量
          total1:'',//模块的数量
          day:'',
          week:'',
          nongli:'',//农历
          ESM:'',
          willdoindex:0,   //  待办已办高亮
        }
      },
      filters:{
        filterText(text){
          if(text.length>18){
            return text.substring(0,15)+'...'
          }else{
            return text
          }

        },
        timeStrings(time){
          let oneTime = new Date(time);
          let Y = oneTime.getFullYear();
          let M = oneTime.getMonth()+1;
          let D = oneTime.getDate();
          return  Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+oneTime.toTimeString().substr(0,8);

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

        this.homeLists(this.userid);

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

        this.newTime = newTime;

        //  领导日程
        this.leaderList(newTime);

        //  我的日程
        this.myDayLists(newTime);

        //  共享日程
        this.publicLists(newTime);

      // 代办日程
    setTimeout(()=>{
      this.findwaitLists();
    },500)

      //公告列表lineitem
        this.getPostLists();


      // / 初始化时只获取条目已办条目

      getAction(this.url.findwaiturl,{operstatus:'task_done'}).then((res) => {
       // this.total1 = res.result.total;

      });

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
      },1200)




      postAction(this.url.MostUserLink).then((res) => {
        console.log(res.length);
        if(res.length==1){
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
        }

        console.log( this.LinkList.length);
      });



    },

    methods:{
      postMore(){
        this.$router.push('/'+'publicMessage/electronicFile');
      },
      doWill(e){
        console.log(e);
        this.willdoindex = e;
        if(e==0){
          // 代办日程
          // alert(e)
          this.findwaitLists('task_todo');
        }else{

          // alert(e)
          // this.findwaitLists('task_done');
        this.homeLists(this.userid)



        }
      },
      openmore(url){
        alert('111')
        if(url){
          // alert(url)
          this.$router.push('/'+url);
        }else{
          this.$router.push('/mytask/taskToDo');
        }

      },
      openmore1(e){  //待办/模块的跳转
        if(e){ //是0就跳待办
          let url = this.path
          this.$router.push('/'+url);

        }else{ //否则就跳别的模块
          this.$router.push('/mytask/taskToDo');
        }

      },
      //动态模块儿  业务详情
      openDetialModel(tableName,i_id){

        let taskDetail = {
          tableName: tableName,
          busdataId: i_id,
        }


        window.open(window.location.origin+'/mytask/taskList/Test-detailFile?tableName='+tableName+'&busdataId='+i_id+'&navisshow=false')


        // this.$refs.detailFile.show(taskDetail)
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
            console.log(Array.isArray(res.result.records));

            this.findwaitdataLists =res.result.records.splice(0,3)

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
            this.findwaitdataLists = res.model1.list.splice(0,3);
            this.model2Lists = res.model2.list;

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
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-left: 8px;
                font-size: 12px;
                margin-top: 3px;
                line-height: 8px;
                span:last-child{
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
            /*background: darkcyan;*/
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            /*justify-content: space-between;*/
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
                width: 58%;
                display: flex;
                align-items: center;
                /*justify-content: space-between;*/
                margin: 0;
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
                    width: 90px;
                    height: 90px;
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
            height: 40px;
            height: 55px;
            border-bottom: 2px solid #009dee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0;

            span:hover{
              cursor: pointer;
            }
            .firstspan{
              min-width: 120px;
              height: 40px;
              padding: 0 8px;
              padding-left: 0;
              background: #009dee;
              font-size: 16px;
              font-weight: bold;
              /*color: #ffffff;*/
              display: flex;
              align-items: center;

              .shuline{
                width: 5px;
                height: 40px;
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
              min-width: 120px;
              height: 40px;
              padding: 0 10px;
              padding-left: 10px;
              background: #7fbbff;
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
              p{
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
                  width: 60%;
                  /*height: 20px;*/
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
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
          }

          .itemline:hover{
            cursor: pointer;
          }
        }


      }
    }
</style>