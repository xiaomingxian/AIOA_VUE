<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleCancel"
    @cancel="handleCancel"
    cancelText="取消"
    okText="关闭">


    <div id="pic" style="overflow: auto;" :style="{height: scrHeight}">

      <img :src="picurl" style="width:100%" v-if="visible"/>


    </div>


  </a-modal>
</template>

<script>

  import {httpAction, getAction, picUrl} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "../../../store/mutation-types";

  export default {
    name: "picModal",
    data() {
      return {
        confirmLoading: false,
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        visible: false,
        picurl: '',
        // scrHeight: window.innerHeight - 250 + 'px'
        scrHeight: 500+ 'px'
      }
    },
    created() {


    },
    methods: {

      show(processDefinitionId) {


        this.picurl = '/wf/process/resource/read?processDefinitionId=' + processDefinitionId + '&resourceType=image'


        picUrl(this.picurl).then(res => {
          this.picurl = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.visible = true;
        })

      },
      handleCancel() {
        this.$emit('close');
        this.visible = false;
      }


    }
  }
</script>

<style lang="less" scoped>

</style>