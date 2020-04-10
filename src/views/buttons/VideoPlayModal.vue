<template>
  <a-modal
    :modal-append-to-body="false"
    :title="title"
    :width="800"
    :visible="visible"
    @cancel="handleCancel"
    cancelText="关闭">
    <template slot="footer">
      <a-button type="primary" @click.stop="close()">关闭</a-button>
      <!--      <a-button type="primary" @click.stop="confrimUpLoad()">确定</a-button>-->
    </template>
    <div>
      <!--      <video id="example_video_1" class="video-js vjs-default-skin" width="140" height="164">-->
      <video v-if="isPlay" width="100%" height="30%" preload=“none” controls autoplay>
        <source :src="address" type="video/mp4">
      </video>
    </div>
  </a-modal>
</template>

<script>
  import {httpAction, postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction} from '@/api/manage'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import Vue from 'vue'
  import InputElement from "ant-design-vue/es/auto-complete/InputElement";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import axios from 'axios'
  import Uploader from "vue-simple-uploader/src/components/uploader";
  import qs from 'qs'

  export default {
    name: "VideoPlayModal",
    components: {Uploader, ATextarea, InputElement},
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        isPlay: false,
        address: "",
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        headers: {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        },
        clickTotal: 0,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          currentUserMsg: '/sys/user/getLoginInfo',
        },
        fileList: [],
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      show(path) {
        getAction(this.url.currentUserMsg).then(res => {
          if (res) {
            var schema = '';
            if (res.orgSchema != undefined && res.orgSchema != ''){
              schema= res.orgSchema+"\\";
            }
            // this.currentUserMessage = res.result
            console.log(JSON.stringify(res))
            this.address = window._CONFIG['domianURL'] + "\\videos\\"+schema+path;
            // this.address = window._CONFIG['domianURL'] + "\\videos\\123.mp4";
            this.isPlay = true;
            this.visible = true
          } else {
            this.$message.error(res.message)
          }
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
        console.log(this.fileList)
        this.fileList = [];
        this.clickTotal = 0;
        this.address = "";
        this.isPlay = false;
      },
      handleCancel() {
        this.close()
      },
      handleOk() {
        this.close()
      },

    }
  }
</script>
<style scoped>
</style>
