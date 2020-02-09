<template>
    <a-modal
    :title="title"
    :width="1400"
    :visible="visible"
    @ok="handOk"
    @cancel="handCancel"
    >
      <div class="tableHeader">
        <div class="div">
          <!--searchType-->
          <div class="searchType">
            <template>
              <span>选择查询方式</span>
              <a-select :defaultValue="searchTypeVal" style="width: 280px;" @change="getSearchType">
                <a-select-option v-for="(item,index) in searchTypeLists" :value="item.value">{{item.typeName}}</a-select-option>
              </a-select>
            </template>
          </div>

          <!--查询方式集合-->
          <div class="searchBox">
            <!--按日程对象查询-->
            <div v-if="searchTypeVal===0" class="searchObj">
              <template>
                <span style="width: auto">{{searchTypeName}}</span>
                <!--<a-input :placeholder="placeholder" v-model="objOrCreateName"></a-input>-->
                <a-select style="width:330px;" mode="multiple" :placeholder="placeholder" @change="getSelectUserLists"  v-decorator="[ 'suserId', {}]">
                  <a-select-option v-for="(user,userindex) in userList" :key="userindex" :value="user.id">
                    {{ user.username }}
                  </a-select-option>
                </a-select>
              </template>
            </div>

            <!--按创建者查询-->
            <div v-else-if="searchTypeVal===1" class="searchObj">
              <template>
                <span>{{searchTypeName}}</span>
                <a-input :placeholder="placeholder" v-model="objOrCreateName"></a-input>
              </template>
            </div>

            <!--按开始时间 结束时间-->
            <div v-else-if="searchTypeVal===2||searchTypeVal===3" class="searchTime">
              <template>
                <span :style="searchTypeVal===2||searchTypeVal===3 ? 'width:auto':'width:160px'">{{searchTypeName}}</span>
                <a-date-picker  showTime  format="YYYY-MM-DD HH:mm" :showToday="false" :allowClear="false" :placeholder="placeholder" @change="selectTime" @ok="confirmTime"/>
              </template>
            </div>

            <!--按时间段查询-->
            <div v-else="searchTypeVal===4" class="searchTime">
              <template>
                <span :style="searchTypeVal===4 ? 'width:auto':'width:160px'">{{searchTypeName}}</span>
                <a-range-picker
                  style="width: 300px;"
                  :showTime="false"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间','结束时间']"
                  @change="selectTime" @ok="confirmTime"
                />
              </template>
            </div>

          </div>

        </div>

        <!--确认查询 ，更多查询方式按钮 -->
        <div class="btn">
          <template>
            <div>
              <a-button @click="subSearch" icon="search">开始查询</a-button>
              <a-button @click="init" icon="reload">刷新列表</a-button>
            </div>
          </template>
        </div>
      </div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
            <p class="each">
               <a  @click="editstitle(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="delstitle(record)">删除</a>
            </p>
        </span>


      </a-table>
      <!--模态框-->
      <a-modal
        title="温馨提示"
        :visible="visibleDel"
        @ok="handleModelOk"
        @cancel="handleModelCancel"
      >
        <p>请确认是否要删除该条数据</p>
      </a-modal>
      <oaCalendar-modal ref="modalForm" @myrichenClose="myrichenClose" @ok="modalFormOk"></oaCalendar-modal>
    </a-modal>
  <!-- 表单区域 -->

</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction,postAction,deleteAction} from '@/api/manage'
  import oaCalendarModal from '../oaBus/modules/oaCalendarModal'


  export default {
        name: "DetailModel.vue",
       mixins:[JeecgListMixin],
        data(){
          return {
            title: "",
            visible:false,
            visibleDel:false,
            dataSource:'',
            mystitltid:'',
            userinfo:'',
            ListsType:'',// 列表类型   0是领导日程  1我的日程  2共享日程
            userlistid:'',//人员id 列表
            userList:[],
            searchTypeLists:[
              {value:0,typeName:'按日程对象查询'},
              {value:1,typeName:'按创建者查询'},
              // {value:2,typeName:'按开始时间查询'},
              // {value:3,typeName:'按结束时间查询'},
              {value:4,typeName:'按结束时间间隔查询'},
            ],//查询方式列表， 我的日程时不可取消按创建者查询 因为我的日程就是创建者列表无需过滤查询

            objOrCreateName:'',//查询对象名称
            starOrEndTime:'',// 开始或者结束时间
            starAndTime:'',// 时间段开始时间，
            endAndTime:'',// 时间段结束时间，
            isSearchTimeShow:false,
            searchTypeVal:0,
            placeholder:'请输入日程对象',
            searchTypeName:'请输入日程对象',
            pagination:{
              total:'',
              showTotal:total=>`共计${total}条`,
              showSizeChanger:false,
              showQuickJumper:false
            },
            url:{
              findByLeader:'/oaBus/Calendar/oaCalendar/findByLeader',
              queryPageList:'/oaBus/Calendar/oaCalendar/queryPageList',
              list:'/oaBus/Calendar/oaCalendar/list',
              delete: "/oaBus/Calendar/oaCalendar/delete",
            },
            columns: [
              {
                title: '日程内容',
                align:"center",
                dataIndex: 'stitle'
              },
              {
                title: '日程对象',
                align:"center",
                dataIndex: 'suserNames',
                customRender: function (text) {
                  //  操作userid 最后一位的逗号
                  if( text.endsWith(',')){
                    // alert(res.result.suserId)
                   return text.substring(0,text.lastIndexOf(','))

                  }else{
                    return text
                  }
                }
              },
              {
                title: '日程发生地点',
                align:"center",
                dataIndex: 'saddress'
              },
              {
                title: '是否置顶',
                align:"center",
                dataIndex: 'iisTop',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '是否领导日程',
                align:"center",
                dataIndex: 'iisLeader',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '即时消息提醒类型',
                align:"center",
                dataIndex: 'iremindType',
                customRender: function (text) {
                  if (text == '1') {
                    return "10分钟前";
                  } else if (text == "2") {
                    return "30分钟前";
                  } else if (text == "3") {
                    return "1小时前";
                  } else if (text == "4") {
                    return "2小时前";
                  } else {
                    return text;
                  }
                }


              },
              {
                title: '公开类型',
                align:"center",
                dataIndex: 'iopenType',
                customRender: function (text) {
                  if (text == '1') {
                    return "全行";
                  } else if (text == "2") {
                    return "分管";
                  } else if (text == "3") {
                    return "部门内";
                  } else {
                    return text;
                  }}
              },
              {
                title: '开始时间',
                align:"center",
                dataIndex: 'dstartTime'
              },
              {
                title: '结束时间',
                align:"center",
                dataIndex: 'dendTime'
              },
              {
                title: '创建者',
                align:"center",
                dataIndex: 'screateBy'
              },
              {
                title: '操作',
                dataIndex: 'action',
                align:"center",
                scopedSlots: { customRender: 'action' },
              }
            ],
          }
        },
    components: {
      oaCalendarModal,
    },
      created () {
        //初始换日程对象列表
        this. initialUserList();
        const  userinfo =JSON.parse( localStorage.getItem('userdata')).userInfo;
        console.log(userinfo);
        this.userinfo = userinfo;
      },
      methods: {
        myrichenClose(){
          this.init();
        },
        //  用户初始化数据
        init(){
          if(this.ListsType==0){
            //领导日程
            this.findLeaderFuc();
          }else if(this.ListsType==1){
            //  我的日程
            this.myListsFuc();
          }else{
            //  共享日程
            this.pulicListsFuc();
          }
        },
        //编辑我的日程
        editstitle(data){
          // this.editvisible = true;
          this.$refs.modalForm.dayAnnalysis(data);
        },
        delstitle(e){
          console.log(e);
          this.mystitltid = e.iid;
          this.visibleDel = true;
        },
        //添加我的日程
        add(){
          this.$refs.modalForm.add();
        },
        //人员列表  多选
        initialUserList() {
          let url = "/oaBus/busFunctionPermit/userList";
          getAction(url).then((res) => {
            console.log(res.result);
            this.userList = res.result;
          })
        },
        //获取所选人员列表
        getSelectUserLists(userlists){
          console.log(userlists.toString());
          this.userlistid = userlists.toString();
        },
        //父页面点击查看更多时  调用此方法
        showTableDetail(type,newTime){

          console.log(type);
          console.log(newTime);
          this.ListsType = type;
          this.visible = true;

          if(this.ListsType==0){
            //领导日程
            this.findLeaderFuc();
            this.columns = [
              {
                title: '日程内容',
                align:"center",
                dataIndex: 'stitle'
              },
              {
                title: '日程对象',
                align:"center",
                dataIndex: 'suserNames',
                customRender: function (text) {
                  //  操作userid 最后一位的逗号
                  if( text.endsWith(',')){
                    // alert(res.result.suserId)
                    return text.substring(0,text.lastIndexOf(','))

                  }else{
                    return text
                  }
                }
              },
              {
                title: '日程发生地点',
                align:"center",
                dataIndex: 'saddress'
              },
              {
                title: '是否置顶',
                align:"center",
                dataIndex: 'iisTop',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '是否领导日程',
                align:"center",
                dataIndex: 'iisLeader',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '即时消息提醒类型',
                align:"center",
                dataIndex: 'iremindType',
                customRender: function (text) {
                  if (text == '1') {
                    return "10分钟前";
                  } else if (text == "2") {
                    return "30分钟前";
                  } else if (text == "3") {
                    return "1小时前";
                  } else if (text == "4") {
                    return "2小时前";
                  } else {
                    return text;
                  }
                }


              },
              {
                title: '公开类型',
                align:"center",
                dataIndex: 'iopenType',
                customRender: function (text) {
                  if (text == '1') {
                    return "全行";
                  } else if (text == "2") {
                    return "分管";
                  } else if (text == "3") {
                    return "部门内";
                  } else {
                    return text;
                  }}
              },
              {
                title: '开始时间',
                align:"center",
                dataIndex: 'dstartTime'
              },
              {
                title: '结束时间',
                align:"center",
                dataIndex: 'dendTime'
              },
              {
                title: '创建者',
                align:"center",
                dataIndex: 'screateBy'
              },
            ];
            console.log('=========================================',this.columns);

            this.title = '领导日程详情';
          }else if(this.ListsType==1){
            //  我的日程 调用日程方法   过滤查询条件  去除按创建者查询
            this. searchTypeLists=[
              {value:0,typeName:'按日程对象查询'},
              // {value:1,typeName:'按创建者查询'},
              // {value:2,typeName:'按开始时间查询'},
              // {value:3,typeName:'按结束时间查询'},
              {value:4,typeName:'按结束时间间隔查询'},
            ];//查询方式列表， 我的日程时不可取消按创建者查询 因为我的日程就是创建者列表无需过滤查询
            this.columns = [
              {
                title: '日程内容',
                align:"center",
                dataIndex: 'stitle'
              },
              {
                title: '日程对象',
                align:"center",
                dataIndex: 'suserNames',
                customRender: function (text) {
                  //  操作userid 最后一位的逗号
                  if( text.endsWith(',')){
                    // alert(res.result.suserId)
                    return text.substring(0,text.lastIndexOf(','))

                  }else{
                    return text
                  }
                }
              },
              {
                title: '日程发生地点',
                align:"center",
                dataIndex: 'saddress'
              },
              {
                title: '是否置顶',
                align:"center",
                dataIndex: 'iisTop',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '是否领导日程',
                align:"center",
                dataIndex: 'iisLeader',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '即时消息提醒类型',
                align:"center",
                dataIndex: 'iremindType',
                customRender: function (text) {
                  if (text == '1') {
                    return "10分钟前";
                  } else if (text == "2") {
                    return "30分钟前";
                  } else if (text == "3") {
                    return "1小时前";
                  } else if (text == "4") {
                    return "2小时前";
                  } else {
                    return text;
                  }
                }


              },
              {
                title: '公开类型',
                align:"center",
                dataIndex: 'iopenType',
                customRender: function (text) {
                  if (text == '1') {
                    return "全行";
                  } else if (text == "2") {
                    return "分管";
                  } else if (text == "3") {
                    return "部门内";
                  } else {
                    return text;
                  }}
              },
              {
                title: '开始时间',
                align:"center",
                dataIndex: 'dstartTime'
              },
              {
                title: '结束时间',
                align:"center",
                dataIndex: 'dendTime'
              },
              {
                title: '创建者',
                align:"center",
                dataIndex: 'screateBy'
              },
              {
                title: '操作',
                dataIndex: 'action',
                align:"center",
                scopedSlots: { customRender: 'action' },
              }
            ]
            this.title = '我的日程详情';
            this.myListsFuc();
          }else{
            //  共享日程
            this.pulicListsFuc();
            this.columns = [
              {
                title: '日程内容',
                align:"center",
                dataIndex: 'stitle'
              },
              {
                title: '日程对象',
                align:"center",
                dataIndex: 'suserNames',
                customRender: function (text) {
                  //  操作userid 最后一位的逗号
                  if( text.endsWith(',')){
                    // alert(res.result.suserId)
                    return text.substring(0,text.lastIndexOf(','))

                  }else{
                    return text
                  }
                }
              },
              {
                title: '日程发生地点',
                align:"center",
                dataIndex: 'saddress'
              },
              {
                title: '是否置顶',
                align:"center",
                dataIndex: 'iisTop',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '是否领导日程',
                align:"center",
                dataIndex: 'iisLeader',
                customRender: function (text) {
                  if (text == '1') {
                    return "是";
                  }  else {
                    return "否";
                  }
                }
              },
              {
                title: '即时消息提醒类型',
                align:"center",
                dataIndex: 'iremindType',
                customRender: function (text) {
                  if (text == '1') {
                    return "10分钟前";
                  } else if (text == "2") {
                    return "30分钟前";
                  } else if (text == "3") {
                    return "1小时前";
                  } else if (text == "4") {
                    return "2小时前";
                  } else {
                    return text;
                  }
                }


              },
              {
                title: '公开类型',
                align:"center",
                dataIndex: 'iopenType',
                customRender: function (text) {
                  if (text == '1') {
                    return "全行";
                  } else if (text == "2") {
                    return "分管";
                  } else if (text == "3") {
                    return "部门内";
                  } else {
                    return text;
                  }}
              },
              {
                title: '开始时间',
                align:"center",
                dataIndex: 'dstartTime'
              },
              {
                title: '结束时间',
                align:"center",
                dataIndex: 'dendTime'
              },
              {
                title: '创建者',
                align:"center",
                dataIndex: 'screateBy'
              },
            ];
            this.title = '共享日程详情';

          }


        },
        handleModelOk(){
          deleteAction(this.url.delete,{id:this.mystitltid,sCreateBy:this.userinfo.username}).then((res) => {
            console.log(res+"/////////////////");
            if(res.success){
              this.visible = true;
              this.visibleDel = false;

              getAction(this.url.list,{username:this.userinfo.username}).then((res) => {
                console.log(res);
                this.dataSource = res.result.records;
                this.pagination.total = res.result.total;

              });

            }

          });

        },
        handleModelCancel(){
          this.visibleDel = false;
        },
        //关闭外层table列表
        handOk(){
          this.visible = false;
        },
        //关闭外层table列表
        handCancel(){
          this.visible = false;
        },
        getSearchType(e){
          console.log(e);
          this.searchTypeVal = e;
          switch (e) {
            case 0:
              this.searchTypeName = '按日程对象查询'
              this.placeholder = '请输入日程对象'
              //初始换日程对象列表
              this. initialUserList();
                  break;
            case 1:
              this.searchTypeName = '按创建者查询'
              this.placeholder = '请输入创建者'
              break;
            case 2:
              this.searchTypeName = '按开始时间查询'
              this.placeholder = '请选择开始时间'
              break;
            case 3:
              this.searchTypeName = '按结束时间查询'
              this.placeholder = '请选择结束时间'
              break;

          }
        },
        //----------------时间变化检测---------------
        selectTime(e,t){
          console.log(e);
          console.log(t);
          // //此处确定时间为  单项选择开始、单项结束时间、双向时间段选择提供服务   判断 this.searchTypeVal  确定是那种状态
          // if(this.searchTypeVal===2||this.searchTypeVal===3){
          //   console.log(e._d);
          //   this.starOrEndTime = this.timeStrings(e._d);
          //   console.log( this.starOrEndTime);
          // }else{
          //   // 时间段选择    为时间段的开始和结束时间赋值
          //   console.log(e);
          //   this.starAndTime = this.timeStrings(e[0]._d);
          //   this.endAndTime = this.timeStrings(e[1]._d);
          //
          // }

          this.starAndTime = t[0];
          this.endAndTime = t[1];
        },
        //----------------确定时间---------------
        confirmTime(){},
      //  -------------时间转换----------------
        timeStrings(time){
          let oneTime = new Date(time);
          let Y = oneTime.getFullYear();
          let M = oneTime.getMonth()+1;
          let D = oneTime.getDate();
          return  Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+oneTime.toTimeString().substr(0,8);

        },
      //  -------------开始查询-------------
        subSearch(){
          console.log(this.searchTypeVal);

          //----------------判断列表类型  领导日程 我的日程  共享日程---------------
          if(this.ListsType==0){
            //领导日程
                  //二层判断 查询类型
                  switch (this.searchTypeVal) {
                    case 0:
                      if(this.userlistid){
                        let subData ={
                          more:1,
                          sUserId:this.userlistid,// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.findLeaderFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请输入日程对象')
                      }
                      break;
                    case 1:
                      if(this.objOrCreateName){
                        // 方法调用
                        // this.findLeaderFuc({paramName:'screateBy',paramVal:this.objOrCreateName});
                        let subData ={
                          more:1,
                          sUserId:'',// 日程对象 多人名称id 拼接
                          sCreateBy:this.objOrCreateName,// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.findLeaderFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请输入创建者')
                      }
                      break;
                    case 2:
                      if(this.starOrEndTime){
                        let subData ={
                          more:1,
                          sUserId:'',// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:this.starOrEndTime,// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.findLeaderFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择开始时间')
                      }
                      break;
                    case 3:
                      if(this.starOrEndTime){
                        let subData ={
                          more:1,
                          sUserId:'',// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:this.starOrEndTime,// 单\双项选择结束时间赋值

                        }
                        this.findLeaderFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择结束时间')
                      }
                      break;
                    case 4:
                      if(this.starAndTime&&this.endAndTime){
                        let subData ={
                          more:1,
                          sUserName:'',// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:this.starAndTime,// 单\双项选择开始时间赋值
                          Enddate:this.endAndTime,// 单\双项选择结束时间赋值

                        }
                        this.findLeaderFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择开始或结束时间')
                      }
                      break;

                  }

          }else if(this.ListsType==1){
            //  我的日程
                  //二层判断 查询类型
                  switch (this.searchTypeVal) {
                    case 0:
                      if(this.userlistid){
                        let subData ={
                          more:1,
                          username:this.userinfo.username,
                          sCreateBy:'',// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }

                        this.myListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请输入日程对象')
                      }
                      break;
                    case 1:
                      if(this.objOrCreateName){
                        // 方法调用
                        // this.findLeaderFuc({paramName:'screateBy',paramVal:this.objOrCreateName});
                        let subData ={
                          more:1,
                          username:this.userinfo.username,
                          sCreateBy:this.objOrCreateName,// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.myListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请输入创建者')
                      }
                      break;
                    case 2:
                      if(this.starOrEndTime){
                        let subData ={
                          more:1,
                          username:this.userinfo.username,
                          sCreateBy:'',// 创建者名称
                          Strdate:this.starOrEndTime,// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.myListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择开始时间')
                      }
                      break;
                    case 3:
                      if(this.starOrEndTime){
                        let subData ={
                          more:1,
                          username:this.userinfo.username,
                          sCreateBy:'',// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:this.starOrEndTime,// 单\双项选择结束时间赋值

                        }
                        this.myListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择结束时间')
                      }
                      break;
                    case 4:
                      if(this.starAndTime&&this.endAndTime){
                        let subData ={
                          more:1,
                          username:this.userinfo.username,
                          sCreateBy:'',// 创建者名称
                          Strdate:this.starAndTime,// 单\双项选择开始时间赋值
                          Enddate:this.endAndTime,// 单\双项选择结束时间赋值

                        }
                        this.myListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择开始或结束时间')
                      }
                      break;

                  }

          }else{
            //  共享日程
                  //二层判断 查询类型
                  switch (this.searchTypeVal) {
                    case 0:
                      if(this.userlistid){
                        let subData ={
                          more:1,
                          sUserId:this.userlistid,// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.pulicListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请输入日程对象')
                      }
                      break;
                    case 1:
                      if(this.objOrCreateName){
                        // 方法调用
                        // this.findLeaderFuc({paramName:'screateBy',paramVal:this.objOrCreateName});
                        let subData ={
                          more:1,
                          sUserId:'',// 日程对象 多人名称id 拼接
                          sCreateBy:this.objOrCreateName,// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.pulicListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请输入创建者')
                      }
                      break;
                    case 2:
                      if(this.starOrEndTime){
                        let subData ={
                          more:1,
                          sUserId:'',// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:this.starOrEndTime,// 单\双项选择开始时间赋值
                          Enddate:'',// 单\双项选择结束时间赋值

                        }
                        this.pulicListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择开始时间')
                      }
                      break;
                    case 3:
                      if(this.starOrEndTime){
                        let subData ={
                          more:1,
                          sUserId:'',// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:'',// 单\双项选择开始时间赋值
                          Enddate:this.starOrEndTime,// 单\双项选择结束时间赋值

                        }
                        this.pulicListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择结束时间')
                      }
                      break;
                    case 4:
                      if(this.starAndTime&&this.endAndTime){
                        let subData ={
                          more:1,
                          sUserName:'',// 日程对象 多人名称id 拼接
                          sCreateBy:'',// 创建者名称
                          Strdate:this.starAndTime,// 单\双项选择开始时间赋值
                          Enddate:this.endAndTime,// 单\双项选择结束时间赋值

                        }
                        this.pulicListsFuc(subData);
                        // this.$message.success('成功')
                      }else{
                        this.$message.error('请选择开始或结束时间')
                      }
                      break;

                  }

          }


        },
        //  领导日程
        findLeaderFuc(subData={more:1}){
            console.log(subData);
          getAction(this.url.findByLeader,subData).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });
        },
        //  我的日程
        myListsFuc(subData={username:this.userinfo.username,more:1}){
          console.log(subData);
          getAction(this.url.list,subData).then((res) => {

            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });
        },
      //  共享日程
        pulicListsFuc(subData={more:1}){
          getAction(this.url.queryPageList,subData).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total
            console.log(this.total);
          });
        },

        //分页切换
        handleTableChange(pagination){
          // alert(e.current)
          console.log(pagination);
          const pager = {...this.pagination};
          pager.current = pagination.current;
          this.pagination = pager;
          console.log(pager);
          if(this.ListsType==0){
            //领导日程
            getAction(this.url.findByLeader,{pageNo:this.pagination.current,pageSize:10,more:1}).then((res) => {
              console.log(res);
              this.dataSource = res.result.records;
              this.pagination.total = res.result.total

            });
          }else if(this.ListsType==1){
            //  我的日程
            getAction(this.url.list,{username:this.userinfo.username,pageNo:this.pagination.current,pageSize:10,more:1}).then((res) => {
              console.log(res);
              this.dataSource = res.result.records;
              this.pagination.total = res.result.total

            });
          }else{
            getAction(this.url.queryPageList,{pageNo:this.pagination.current,pageSize:10,more:1}).then((res) => {
              console.log(res);
              this.dataSource = res.result.records;
              this.pagination.total = res.result.total
              console.log(this.total);
            });
          }
        }
      }
    }
</script>

<style scoped lang="less">
  /*!* 隐藏时间空间  “此刻功能”*!*/
/*/deep/.ant-calendar-time .ant-calendar-footer .ant-calendar-today-btn{*/
  /*display: none !important;*/
/*}*/
.tableHeader{
      width: 100%;
      min-height: 50px;
      /*border-bottom:1px solid #e8e8e8;*/
      background: #58adfb;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
  justify-content: space-between;

     .div{
       /*width: 80%;*/
       display: flex;
       align-items: center;
       justify-content: space-between;
       .searchType{
         width: auto;
         display: flex;
         align-items: center;
         margin-left: 15px;
         span{
           margin-right: 15px;
           color: #ffffff;
         }
       }

       .searchBox{
         width: auto;
         margin-left: 25px;
         display: flex;
         align-items: center;
         .searchObj,.searchTime{
           /*width: 300px;*/
           display: flex;
           align-items: center;
           span{
             width:160px;
             margin-right: 15px;
             color: #ffffff;
           }
         }

         .btn{

           float: right;
         }
       }
     }


      .btn{
        /*align-items: center;*/
        /*justify-content: flex-end;*/
        margin-right: 15px;
      }

    }


</style>