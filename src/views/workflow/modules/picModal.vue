<template>


  <div class="setting-drawer">
    <a-drawer
      :title="title"
      :width="scrWidth"
      placement="right"
      :closable="visible"
      @close="handleCancel"
      :visible="visible"
      :style="{}"
    >

  <!--<a-modal-->
    <!--:title="title"-->
    <!--:width="scrWidth"-->
    <!--:visible="visible"-->
    <!--:confirmLoading="confirmLoading"-->
    <!--@ok="handleCancel"-->
    <!--@cancel="handleCancel"-->
    <!--cancelText="取消"-->
    <!--okText="关闭">-->


    <div id="pic"  :style="{overflow: 'auto', position: 'relative',backgroundColor: '#f6f6f6',border: '1px solid #e0e0e0',height: scrHeight}">

      <div style="width:100%;position: relative">
        <!--@click='showPicFull'-->
        <img :src="picurl"  v-if="visible"  />
        <!--<a-button style="position: absolute;bottom:0px;right:0px" @click="handleCancel">关闭</a-button>-->

        <!--<a-button style="float: right" @click="handleCancel">关闭</a-button>-->
        <a-button style="position: fixed;bottom:5px;right:5px" type="primary"  @click="handleCancel">关闭</a-button>


      </div>

    </div>

    </a-drawer>
  </div>
  <!--</a-modal>-->
</template>

<script>

  import {getAction, httpAction, picUrl} from '@/api/manage'
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
        scrWidth: window.innerWidth,
        scrHeight: window.innerHeight-95+'px'
        // scrHeight: 500+ 'px'
      }
    },
    created() {


    },
    mounted() {
      window.addEventListener('dblclick', e => this.handleCancel(e))
    },
    methods: {
      showPicFull(){
        const img = new Image();
        img.src = this.picurl;
        const newWin = window.open("", "_blank");
        newWin.document.write(img.outerHTML);
        newWin.document.title = this.title
        newWin.document.close();
      },

      show(processDefinitionId) {


        this.picurl = '/wf/process/resource/read?processDefinitionId=' + processDefinitionId + '&resourceType=image'


        picUrl(this.picurl).then(res => {
          this.picurl = 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.visible = true;
        })

        this.visible = true

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