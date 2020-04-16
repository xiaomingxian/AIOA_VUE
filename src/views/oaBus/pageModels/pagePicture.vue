<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <div>
      <img :src="picurl" width="750" alt="">
    </div>
  </a-modal>

</template>

<script>
  import {httpAction} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "../../../store/mutation-types";
  import axios from 'axios'
  export default {
    name: 'pagePicture',
    components: {
    },

    data() {
      return {
        visible:false,
        title:'图片预览',
        confirmLoading: false,
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        picurl: ''
      }
    },
    created() {

    },
    methods: {
      //监听选择范围
      show(pageId) {
        this.picurl = window._CONFIG['domianURL'] + '/oaBus/busPage/readPicture?pageId=' + pageId + '&resourceType=image'

        axios.get(this.picurl, {
          responseType: 'arraybuffer',
          headers: {
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
          }
        }).then(res => {
          console.log(res)
          if(res){
            this.picurl='data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            this.visible = true;
          }else{
            this.$message.error("图片不存在，请上传后再试！！！")
          }


        })
      },
      handleOk() {
        this.close();
      },
      close(){
        this.visible = false;
      },
      handleCancel() {
        this.close();
      },

    }
  }
</script>

<style>

</style>