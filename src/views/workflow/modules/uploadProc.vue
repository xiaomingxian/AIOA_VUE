<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="upload"
    @cancel="handleCancel"
    cancelText="取消"
    okText="上传">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >

            <a-upload name="file" :multiple="true" :action="uploadUrl" :fileList="fileList"
                      :beforeUpload="beforeUpload" @change="handleChange">
              <a-button type="primary" icon="plus">
                <a-icon typeof="upload"/>
                选择文件
              </a-button>
            </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import {httpAction, getAction, postAction, uploadProc} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import InputElement from "ant-design-vue/es/auto-complete/InputElement";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "uploadProc",
    components: {ATextarea, InputElement},
    data() {
      return {
        haveClick:false,
        form: this.$form.createForm(this),
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        headers: {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN),
          'Content-Type': 'multipart/form-data'
        },
        fileList: [],
        confirmLoading: false,
        visible: false,
        uploadUrl: '/wf/process/deploy',
        scrHeight: window.innerHeight - 300 + 'px'
      }
    },
    created() {


    },
    methods: {
      show() {
        this.fileList = []
        this.visible = true
      },
      handleChange(info) {
        this.fileList = info.fileList


        if (info.file.status == 'done') {

          this.$message.success(`${info.file.name} 文件上传成功`)

          this.reload()
        } else if (info.file.status == 'error') {
          this.$message.error(`${info.file.name} 文件上传失败`)
          this.reload()
        }
        // this.fileList=[]

      },
      beforeUpload: function (file, fileList) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      upload() {

        if (this.haveClick) {
          this.$message.error('请勿重复点击')
          return
        }
        this.haveClick=true
        const {fileList} = this;
        const data = new FormData();

        if(this.fileList.length<=0){
          this.$message.error('请选择要上传的文件')
          return
        }
        for(let i in fileList){
          data.append('file', fileList[i].originFileObj);
        }


        let url=this.uploadUrl
        let method='post'

        this.axios({ headers:{
            'Content-Type': 'multipart/form-data'
          },url, method, data,processData: false}).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.haveClick=false
              this.$emit('reload')
              this.handleCancel()
            } else {
              this.haveClick=false
              this.fileList = []
              this.$message.error(res.message)
            }
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