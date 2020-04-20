<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="附件名称">
          <a-input v-model="fileName"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  // import {httpAction} from '@/api/manage'
  import {postAction} from '@/api/manage'

  export default {
    name: "DelTime",
    data() {
      return {
        title: "修改附件名称",
        visible: false,
        model: {},
        fileData: {
          i_id: '',
          s_file_name: '',
          s_file_path: ''
        },
        fileName:'',
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {},

      }
    },
    created() {
    },
    methods: {
      show(file) {
        this.fileData.i_id = file.iid;
        this.fileData.s_file_name = file.sfileName.slice(0, file.sfileName.lastIndexOf('.'));
        this.fileData.s_file_path = file.sfilePath;
        this.fileName = this.fileData.s_file_name
        this.visible = true;
      },
      close() {
        this.$emit('close');
        this.fileData = {};
        this.visible = false;
      },
      handleOk() {
        this.fileData.s_file_name = this.fileName
        postAction('/oaBus/oaFile/updateFileName', this.fileData).then(res => {
          this.close();
          this.$emit("reloadAfterUpdate")
        })
        // this.close()
      },
      handleCancel() {
        this.close()
      },


    }
  }
</script>

<style scoped>

</style>