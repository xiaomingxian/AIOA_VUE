<template>
  <div style="padding: 10px">
    <a-radio-group v-model="iIsLimits"  @change="selectJG">
      <a-radio @click="selectFun(1)" :value="1">全行</a-radio>
      <a-radio @click="selectFun(2)" :value="2">部门</a-radio>
      <a-radio @click="selectFun(3)" :value="3">用户</a-radio>
    </a-radio-group>
      <a-row :gutter="24" v-show='iIsLimits==2'>
        <a-col :span="24" >
          <a-form-item  label="选择部门">
            <j-select-notice-depart v-model="departId" :multi="true"  @change="change" @getUD1="getUD1"></j-select-notice-depart>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-show='iIsLimits==3'>
        <a-col :span="24" >
          <a-form-item  label="选择用户" >
            <j-select-notice-user-by-dep  @senUserId="senUserId" :meetingUserId="meetingUserId"  v-model="userRealName" @getUD2="getUD2" @change="change"></j-select-notice-user-by-dep>
          </a-form-item>
        </a-col>
      </a-row>
  </div>
</template>

<script>
  import JSelectNoticeDepart from '@/components/jeecgbiz/JSelectNoticeDepart'
  import {getAction, postAction} from "@/api/manage";
  import JSelectNoticeUserByDep from '@/components/jeecgbiz/JSelectNoticeUserByDep'

  export default {
    name: 'releaseScope',
    components: {
      JSelectNoticeDepart,
      JSelectNoticeUserByDep
    },
    props: {
      backData: {
        type: Object,
        required: false
      },
      modalWidth: {
        type: Number,
        default: 1250,
        required: false
      },
      value: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data() {
      return {
        selectedDepUsers: "",
        iIsLimits: '',
        departId: '',
        userRealName: '',
        sTittle: '',
        meetingUserId: '',
        url: {
          queryAllUser: '/sys/user/queryAllUser',
          sendMeetingInform: '/oaBus/meetingInform/sendMeetingInform'  //发送通知
        },
      }
    },

    created(){
      // this.backData  为父组件回传backdata 数据     回显
      if (this.backData.s_varchar7 != undefined ||this.backData.s_varchar7 != null){
        // console.log('============1111111',this.backData.s_varchar7);
        this.meetingUserId = this.backData.s_varchar7
        // console.log('============2222',this.meetingUserId);
      }
      if (this.backData.s_varchar5 == undefined ){
        this.iIsLimits = 1;
      } else {
        this.iIsLimits = Number(this.backData.s_varchar5);
      }
      //判断显示类型 1 是全行   2是部门  3是人员     状态为 单选对应选中并数据回显
      if (Number(this.backData.s_varchar5)==2){
        this.departId = this.backData.s_varchar4;
      }else if(Number(this.backData.s_varchar5)==3){
        this.userRealName = this.backData.s_varchar4;
      }
    },

    mounted() {
      this.selectedDepUsers = this.value
    },
    watch: {
      value(val) {
        this.selectedDepUsers = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      //监听选择范围
      selectJG(e) {
        //全行
        if (e.target.value == 1) {
          let publish = {};
          publish.iIsLimits = e.target.value;
          this.$emit("change1", publish)
        }
      },

      //获取选择范围数据
      change(e) {
        let publish = {};
        publish.iIsLimits = this.iIsLimits;
        if (this.iIsLimits == 2) {
          publish.departId = e;
        }
        if (this.iIsLimits == 3) {
          publish.userRealName = this.userRealName;
        }
        this.$emit("change1", publish)
      },

      senUserId(userId) {
        this.meetingUserId = userId;
      },

      //通过组织机构筛选选择用户
      onSearchDepUser() {
        this.onSearchDepUserCallBack('')
      },
      onSearchDepUserCallBack(selectedDepUsers) {
        this.selectedDepUsers = selectedDepUsers
        this.$emit("change", selectedDepUsers)
      },

      selectFun(index) {
        if (index == 1 ){
          this.$emit('getDUS', 1, 1)
        }
        if (index == 2) {
          this.meetingUserId = [];
        }
        if (index == 3) {
          this.departId = '';
          this.onSearchDepUserCallBack('')
        }
      },

      //部门id传父组件
      getUD1(data) {
        this.$emit('getDUS', data, this.iIsLimits)
      },

      //用户id传父组件
      getUD2() {
        this.$emit('getDUS', this.userRealName, this.iIsLimits,this.meetingUserId)
      },

      sendUser() {
        let json = {
          iIsLimits: this.iIsLimits,
          meetingUserId: this.meetingUserId.toString(),
          // userRealName: this.userRealName,
          departId: this.departId,
          tableName: this.backData.table,
          busdataId: this.backData.i_id,
          functionId: this.backData.i_bus_function_id,
          sTittle: this.backData.s_varchar2,
          sAddress: this.backData.s_varchar6,
          // sAddress : address,
          dStartTime: this.backData.d_create_time,
          // dEndTime:time,
          dEndTime: this.backData.d_datetime1,
          // sCreateBy :this.backData.s_create_name,
          dCreateTime: this.backData.d_create_time,
          iBusModelId: this.backData.i_bus_model_id,
        };
        postAction(this.url.sendMeetingInform, json).then((res) => {
        });
      },
    }
  }
</script>

<style scoped>

</style>