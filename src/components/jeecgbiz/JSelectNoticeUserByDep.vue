<template>
  <div>
    <a-input-search
      v-model="selectedDepUsers"
      placeholder="请先选择用户"
      disabled
      @search="onSearchDepUser">
      <a-button slot="enterButton" :disabled="disabled">选择用户</a-button>
    </a-input-search>
    <j-select-user-by-dep-modal
      ref="selectModal"
      @getUserId = "getUserId"
      :modal-width="modalWidth"
      @ok="onSearchDepUserCallBack" />
  </div>
</template>

<script>
  import JSelectUserByDepModal from './modal/JSelectNoticeUserByDepModal'
  export default {
    name: 'JSelectNoticeUserByDep',
    components: { JSelectUserByDepModal },
    props:{

      meetingUserId:{
        type:Array,
        required:false
      },

      modalWidth:{
        type:Number,
        default:1250,
        required:false
      },
      value:{
        type:String,
        required:false
      },
      disabled:{
        type: Boolean,
        required: false,
        default: false
      }
    },
    data:{
      return:{
        meetingUserId:[]
      }
    },
    created(){
      // console.log("+++++++++++99999",this.meetingUserId);
      this.UserId=this.meetingUserId;
    },
    data() {
      return {
        selectedDepUsers:"",
        UserId:""
      }
    },
    mounted(){
      this.selectedDepUsers = this.value
    },
    watch:{
      value(val){
        this.selectedDepUsers = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      getUserId(data){
        this.meetingUserId = data;
        // console.log('-================================',data);
        this.$emit('senUserId',data);
        this.$emit('getUD2')
      },
      getSelectUsers() {
        return this.$refs.selectModal.chooseUserId
      },
      //通过组织机构筛选选择用户
      onSearchDepUser() {
        console.log(this.meetingUserId);
        this.$refs.selectModal.showModal(this.meetingUserId)
        // if (this.meetingUserId != undefined || this.meetingUserId != null) {
        //   this.$refs.selectModal.showModal(this.meetingUserId)
        // }else {
        //   this.$refs.selectModal.showModal()
        // }
        // // this.$refs.selectModal.showModal(this.meetingUserId)
        // this.onSearchDepUserCallBack('')
      },
      onSearchDepUserCallBack(selectedDepUsers) {
        this.selectedDepUsers = selectedDepUsers.toString()
        this.$emit("change",selectedDepUsers)
      }
    }
  }
</script>

<style scoped>

</style>