<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    @ok="confirm"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消">


    <!--<a-select  style="width: 400px" v-model="selectInit"  @change="selectTaskType" placeholder="请选任务类型">-->
    <!--<a-select-option v-for="(item,index) in tasks" :value="item.modelid" :key="index">{{item.modelSName}}</a-select-option>-->
    <!--</a-select>-->

    <!--<a-select style="width: 400px;margin-top: 30px;" v-model="selectInit2" @change="selectTaskDetail" placeholder="请选任务详情">-->
    <!--<a-select-option v-for="item2 in tasksDetialsLists" :value="item2.functionid">-->
    <!--{{item2.functionSName}}-->
    <!--</a-select-option>-->
    <!--</a-select>-->

    <!---->

    <div class="listTwoBox">
      <div class="titleBox">
        <div class="titlenav">
          <img style="width: 22px;" src="../../../assets/newTask.png">
          <span>请选任务类型</span>
        </div>
        <div class="titlenav">
          <img style="width: 22px;" src="../../../assets/newTask.png">
          <span>请选任务详情</span>
        </div>
      </div>

      <div class="childBoxs">
        <div class="childBox" style="height: 400px; overflow-y: scroll ">
          <a-list bordered>
            <!-- //functionSName   :style="index%2==0?'background:#d6ebff ;':'background:#fff'"-->
            <a-list-item class="eachitem" :style="parentIndex==index?' background: #dae8f5;':''"
                         v-for="(item,index) in parentsData" @click="selectTaskType(item.modelid,index)">
              {{item.modelSName}}
            </a-list-item>
          </a-list>
        </div>
        <div class="childBox" style="height: 400px; overflow-y: scroll ">
          <a-list bordered>
            <!--functionSName-->
            <a-list-item class="eachitem" :style="childIndex==index?' background: #dae8f5;':''"
                         v-for="(item,index) in childData" @dblclick="confirm"
                         @click="selectTaskDetail(item.functionid,index)">

              <img v-if="item.status == 1" style="position: absolute;right: 14px;" @click="dissaved(item)" src="../../../assets/saved.png"/>
              <img v-else style="position: absolute;right: 14px;" @click="saved(item)" src="../../../assets/dissaved.png"/>

            </a-list-item>
          </a-list>
        </div>
      </div>


      <!--loading-->
      <div class="exaple" v-show="loading">
        <a-spin></a-spin>
      </div>
    </div>


    <receive-file ref="receiveFile"></receive-file>
    <meeting-room-file ref="meetingRoomFile"></meeting-room-file>
    <meeting-Inform ref="meetingInform"></meeting-Inform>
    <meeting-Notice ref="meetingNotice"></meeting-Notice>
    <detail-File ref="detailFile"></detail-File>
  </a-modal>
</template>


<script>


  import DetailFile from "../taskList/detailFile";

  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
  import receiveFile from '../taskList/receiveFile'
  import meetingRoomFile from '../taskList/meetingRoomFile'
  import meetingInform from '../taskList/meetingInform'
  import meetingNotice from "../taskList/meetingNotice";


  export default {
    name: "doTaskModal",
    mixins: [JeecgListMixin],
    components: {DetailFile, meetingNotice, receiveFile, meetingRoomFile, meetingInform},
    inject: ['reload'],
    data() {
      return {
        userId: '',
        loading: false,// 加载状态
        parentIndex: '',
        childIndex: '',
        parentsData: [],
        childData: [],
        saveData:[],
        selectInit: '请选任务类型',
        selectInit2: '请选任务详情',
        visible: false,
        title: '新建任务',
        confirmLoading: false,
        ModelId: '',
        FunctionId: '',
        tasks: [],
        task: [],
        taskDetail: {data: {}, busFunction: {}, detailList: {}},
        typeDetail: {},
        tasksDetialsLists: [],// 任务详情
        userName: '',
        userdept: '',
        //展示哪个页面可见
        isShow: {
          receiveFile: false,
        },
        url: {
          selectTaskType: '/oaBus/newTask/findModelPermit1',
          selectTaskDetail: '/oaBus/newTask/findFunctionPermit',
          selectTask: '/oaBus/busFunction/list',
          refGet: '/oaBus/busPage/list',
          userMsgGet: '/sys/user/getUserSectionInfoByToken',
        },

      }
    },
    created() {

      this.loading = true;
      // 初始化任务类型
      getAction(this.url.selectTaskType).then(res => {
        console.log(res.result);
        this.parentsData = res.result;
        //初始化 ModelId   FunctionId
        this.ModelId = res.result[0].modelid;


      })
    },
    methods: {
      saved(event){

        event.status = 1;

      },
      dissaved(event){

        event.status = 0;

      },
      show(e) {
        // console.log('------------------------<<<' + e);
        this.userId = e;
        this.selectInit = '请选任务类型';
        this.selectInit2 = '请选任务详情';

        //选择任务类型
        getAction(this.url.selectTaskType).then(res => {
          if (res.success) {
            this.tasks = res.result
            console.log("---------------------"+JSON.stringify(res.result))
          }
        })
        this.visible = true

        // 初始化任务详情
        this.getTaskData(this.ModelId,this.userId);
      },

      selectTaskType(e, index) {
        console.log(e);
        this.ModelId = e;
        console.log(index);
        this.parentIndex = index;
        this.getTaskData(e);
        this.loading = true;

      },
      selectTaskDetail(e, index) {
        console.log(e);
        this.FunctionId = e;
        this.childIndex = index;

        this.$emit('close');
      },
      getTaskData(e,u) {
        //选择任务类型
        getAction(this.url.selectTaskDetail, {modelId: e,userId:u}).then(res => {
          if (res.success) {
            this.loading = false;
            this.childData = res.result;
            //初始化 ModelId   FunctionId
            console.log("==================="+JSON.stringify(res.result))
            this.FunctionId = res.result[0].functionid;
            // getAction("/sys/user/showUserFunStatus",{userId:this.userId}).then(res =>{
            //   console.log(JSON.stringify(res.result))
            //   this.saveData = res.result;
            // })
          }
        })

        // for(let i=0;i<this.saveData.length;i++){
        //   for(let j=0;j<this.childData.length;j++){
        //     if(this.saveData[i].functionId === this.childData[j].functionId){
        //       // this.childData = Object.assign(this.childData,this.childData[j],this.saveData[i].status)
        //       // this.childData=Vue.set(this.childData,"status",this.saveData[i].status);
        //       console.log('999999999999999999999999999')
        //       console.log(this.childData)
        //     }
        //   }
        // }


      },

      //展示页面
      //show() {
      /*   this.selectInit = '请选任务类型'
         this.selectInit2 = '请选任务详情'
         //选择任务类型
         getAction(this.url.selectTaskType).then(res => {
           if (res.success) {
             this.tasks = res.result
           }
         })
         this.visible = true


         //查看当前用户信息和部门信息
         getAction(this.url.userMsgGet).then(res => {
           if (res.success) {
             //业务数据
             this.taskDetail.data.s_create_by = res.result.sysUserId
             this.taskDetail.data.s_create_name = res.result.sysUserName
             this.taskDetail.data.s_create_dept = res.result.sysDeptName
             this.taskDetail.data.s_create_deptid = res.result.deptId
             this.taskDetail.data.s_create_unitid = res.result.parentId
           }
         })*/

      // },
      /*     //一级选择
           selectTaskType(idAndTable) {

             var id = idAndTable.split(',')[0]
             getAction(this.url.selectTask, {
               iBusModelId: id
             }).then(res => {
               if (res.success) {
                 this.task = res.result.records
               }
             })
             this.selectInit2 = '请选任务详情'

           },
           //二级选择
           taskSelect(typeDetail) {

             this.typeDetail = JSON.parse(typeDetail)


           },*/
      //确定:打开具体的任务页面
      confirm() {
        // window.open('http://localhost:4000/mytask/taskList/detailFile');
        //校验数据
        let param = {
          modelId: this.ModelId,
          functionId: this.FunctionId,
        }
        // if(this.tasksDetialsLists.length<=0){
        //   this.$message.warning("没有对应的业务功能");
        //   return ;
        //   this.visible = true;
        // }

        postAction("/oaBus/oaBusdata/queryNewTaskMsg", param).then(res => {
          if (res.success) {
            window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + res.result.tableName + '&busdataId=' + res.result.busdataId + '&status=newtask&navisshow=false')
          } else {
            this.$message.error(res.message)
          }
        });
        //-----------------------------
        let paramUser = {
          userId: this.userId,
          modelId: this.ModelId,
          functionId: this.FunctionId
        };

        postAction("/sys/user/addUserFun", paramUser).then(res => {
          alert(res.success())
        })

        //清空数据
        this.$emit('close');
        // this.tasksDetialsLists = []
        this.visible = false


      },
      handleCancel() {
        //清空数据
        this.initData()
        this.tasksDetialsLists = []
        this.$emit('close');
        this.visible = false;
      }, initData() {
        this.tasks = []
        this.task = []
        this.taskDetail = {data: {}, busFunction: {}, detailList: {}}
        this.userName = ''
        this.userdept = ''
      },
      //校验选框
      jiaoYan() {
        if ((this.selectInit).indexOf('请选任务类型') >= 0 || (this.selectInit2).indexOf('请选任务详情') >= 0) {
          this.$message.error('请选择数据')
          return true
        }
      }
    }
  }
</script>
<style lang="less" scoped>

  .eachitem {
    font-weight: bold;
    font-size: 14px;
  }

  .eachitem:hover {
    background: #dae8f5;
    cursor: pointer;
  }

  .listTwoBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;


    .titleBox {
      position: relative;
      width: 100%;
      /*height: 50px;*/
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .titlenav {
        width: 40%;
        /*height: 50px;*/
        display: flex;
        align-items: center;
        justify-content: flex-start;

        span {
          margin-left: 15px;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
        }
      }

      .titlenav:last-child {
        width: 58%;
      }

    }

    .childBoxs {
      width: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-top: 15px;

      .childBox {
        width: 40%;

      }

      .childBox:last-child {
        width: 58%;

      }
    }

    .exaple {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, .7);
      opacity: .8;
      /*text-align: center;*/
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }


</style>