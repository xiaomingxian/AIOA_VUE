<template>
  <a-modal
    :title="title"
    :width="470"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="confirm"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消">
<!--v-model="selectInit"-->
    <a-select  style="width: 400px" v-model="selectInit"  @change="selectTaskType" placeholder="请选任务类型">
      <a-select-option v-for="(item,index) in tasks" :value="item.modelid" :key="index">{{item.modelSName}}</a-select-option>
    </a-select>
<!-- v-model="selectInit2"-->
    <a-select style="width: 400px;margin-top: 30px;" v-model="selectInit2" @change="taskSelect" placeholder="请选任务详情">
      <a-select-option v-for="item2 in tasksDetialsLists" :value="JSON.stringify(item2)">{{item2.functionSName}}</a-select-option>
    </a-select>

    <receive-file ref="receiveFile"></receive-file>
    <meeting-room-file ref="meetingRoomFile"></meeting-room-file>
    <meeting-Inform ref="meetingInform"></meeting-Inform>
    <meeting-Notice ref="meetingNotice"></meeting-Notice>
  </a-modal>
</template>

<script>
  import DetailFile from "../taskList/detailFile";
  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from "../../../mixins/JeecgListMixin2";
    export default {
        name: "CreateTask",
      mixins: [JeecgListMixin],
        components:{DetailFile},
        data(){
          return {
            selectInit: '请选任务类型',
            selectInit2: '请选任务详情',
            visible: false,
            title: '新建任务',
            confirmLoading: false,
            tasks: [],
            task: [],
            tasksDetialsLists:[],// 任务详情
            taskDetail: {data: {}, busFunction: {}, detailList: {}},
            typeDetail: {},
            userName: '',
            userdept: '',
            //展示哪个页面可见
            isShow: {
              receiveFile: false,
            },
            url: {
              selectTaskType: '/oaBus/newTask/findModelPermit1',
              selectTaskDetail: '/oaBus/newTask/findFunctionPermit',

            },

          }
        },
       created(){
         let userdata  = localStorage.getItem('userdata')
          // alert(userdata.userInfo.username)
         this.userName = userdata.userInfo.username;

         console.log('++++++++++++++++++++++++',userdata.userInfo.username);
       },
        methods:{
          show() {
            this.selectInit = '请选任务类型'
            this.selectInit2 = '请选任务详情'

            //选择任务类型
            getAction(this.url.selectTaskType).then(res => {
              if (res.success) {
                this.tasks = res.result
              }
            })
            this.visible = true

          },
          handleCancel() {
            //清空数据
            this.$emit('close');
            this.visible = false;
          },
          selectTaskType(e){
            console.log(e);
            this.getTaskData(e);
            this.selectInit2 = ''
          },
          getTaskData(e){
            //选择任务类型
            getAction(this.url.selectTaskDetail,{modelId:e}).then(res => {
              if (res.success) {
                this.tasksDetialsLists = res.result
              }
            })
          }
        }
    }
</script>

<style scoped>

</style>