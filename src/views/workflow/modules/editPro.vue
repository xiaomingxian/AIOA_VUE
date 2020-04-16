<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="save"
    @cancel="handleCancel"
    okText="保存"
    cancelText="取消">

    <div id="pic">

      <textarea  style="width: 100%;padding: 0;box-sizing: border-box;" v-if="visible" autofocus="autofocus" contenteditable="true" rows="20" cols="140" v-model="xml"></textarea>

    </div>

  </a-modal>
</template>

<script>

  import {httpAction,getAction,postAction} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "../../../store/mutation-types";
  import axios from 'axios'

  export default {
    name: "editPro",
    components: {},
    data() {
      return {
        name: '',
        xml: '',
        confirmLoading: false,
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        visible: false,
        picurl: ''
      }
    },
    created() {
    },
    methods: {

      editPro(processDefinitionId, name) {


        this.name = name

        this.picurl = '/wf/process/resource/xml?processDefinitionId=' + processDefinitionId

        getAction(this.picurl).then(res=>{
          this.xml = res.message
          this.visible = true;
        })

      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
        this.$emit('reload')
      }, save() {

        var save = window._CONFIG['domianURL']+'/wf/process/xml/save'

        axios({
          method: 'post',
          url: save,
          data: {
            name: this.name,
            xml: this.xml
          },
          headers: this.headers,
        }).then(res => {
          this.$message.success('更新成功')
          console.log('---------------->' + JSON.stringify(res))

        })

        this.handleCancel();

      }


    }
  }
</script>

<style lang="less" scoped>

</style>