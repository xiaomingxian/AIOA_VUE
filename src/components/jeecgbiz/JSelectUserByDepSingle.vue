<template>
  <div>
    <div style="display: flex">
      <a-input-search
        v-model="selectedDepUsers"
        placeholder="请先选择用户"
        disabled
        @search="onSearchDepUser">
        <!--<a-button slot="enterButton" :disabled="disabled">选择用户</a-button>-->
      </a-input-search>
      <a-button slot="enterButton" @click="onSearchDepUser" :disabled="disabled">选择用户</a-button>
    </div>


    <j-select-user-by-dep-modal-single
      ref="selectModal"
      @getUserId="getUserId"
      :modal-width="modalWidth"
      @ok="onSearchDepUserCallBack"/>
  </div>
</template>

<script>
  import JSelectUserByDepModalSingle from './modal/JSelectUserByDepModalSingle'

  export default {
    name: 'JSelectUserByDepSingle',
    components: {JSelectUserByDepModalSingle},
    props: {
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
      show() {
        this.$refs.selectModal.showModal()
        this.onSearchDepUserCallBack('')
      },
      getUserId(data) {
        this.$emit('senUserId', data);
        this.$emit('getUD2')
      },
      getSelectUsers() {
        return this.$refs.selectModal.chooseUserId
      },
      //通过组织机构筛选选择用户
      onSearchDepUser() {
        this.$refs.selectModal.showModal()
        this.onSearchDepUserCallBack('')
      },
      onSearchDepUserCallBack(selectedDepUsers) {
        this.selectedDepUsers = selectedDepUsers
        this.$emit("change", selectedDepUsers)
      },
  getUserName(data) {
    this.$emit('senUserName', data);
    this.$emit('getUD2')
  },

    }
  }
</script>

<style scoped>

</style>