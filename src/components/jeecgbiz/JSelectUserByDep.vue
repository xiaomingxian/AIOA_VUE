<template>
  <div>
    <!--<a-input-search-->
      <!--style="height: 100px;"-->
      <!--v-model="selectedDepUsers"-->
      <!--placeholder="请先选择用户"-->
      <!--disabled-->
      <!--@search="onSearchDepUser">-->
      <!--<a-button slot="enterButton" :disabled="disabled">选择用户</a-button>-->
    <!--</a-input-search>-->
    <textarea
      style=" width: 100%; height: 100px;background: #fff;border-color: #d9d9d9;border-radius: 5px;"
      v-model="selectedDepUsers"
      placeholder="请先选择用户"
      disabled
    >
    </textarea>
    <a-button v-show="!isChaKan" slot="enterButton"   @click="onSearchDepUser" >选择用户</a-button>
    <j-select-user-by-dep-modal
      ref="selectModal"
      @getUserId="getUserId"
      @getUserName="getUserName"
      :modal-width="modalWidth"
      :userIdLists = 'userIdLists'
      @ok="onSearchDepUserCallBack"/>
  </div>
</template>

<script>
  import JSelectUserByDepModal from './modal/JSelectUserByDepModal'
  import AInputSearch from "ant-design-vue/es/input/Search";

  export default {
    name: 'JSelectUserByDep',
    components: {AInputSearch, JSelectUserByDepModal},
    props: {
      isChaKan:{
        type:Boolean,
        default: false,
      },
      userIdLists:{
        type:Array,
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
      },
      defaultUser:{
        type: '',
      }
    },
    data() {
      return {
        selectedDepUsers: "",
        selectedDepUsersid:''
      }
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
    created(){
      console.log(this.defaultUser);
      this.selectedDepUsers = this.defaultUser.username;
      this.selectedDepUsersid = this.defaultUser.id;
      this.userIdLists.push(this.defaultUser.id)
      console.log(this.selectedDepUsers);

      // alert(this.defaultUser)
    },
    mounted() {
      if(this.value){
        this.selectedDepUsers = this.value
      }

    },
    methods: {

      myselfColse(){
        this.$refs.selectModal.letMeClear();
      },
      getUserId(data) {
        this.$emit('senUserId', data);
        this.$emit('getUD2')
      },
      getUserName(data) {
        this.$emit('senUserName', data);
        this.$emit('getUD2')
      },
      getSelectUsers() {
        return this.$refs.selectModal.chooseUserId
      },
      //通过组织机构筛选选择用户
      onSearchDepUser() {
          // alert(this.userIdLists)
        this.$refs.selectModal.showModal(this.userIdLists)
         // this.onSearchDepUserCallBack('')
      },
      show() {
        this.$refs.selectModal.showModal()
        this.onSearchDepUserCallBack('')
      },
      onSearchDepUserCallBack(selectedDepUsers) {
        this.selectedDepUsers = selectedDepUsers
        this.$emit("change", selectedDepUsers)

      }
    }
  }
</script>

<style scoped>

</style>