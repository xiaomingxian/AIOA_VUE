<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @ok="handleUpload"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          >
          <h3 style="display: inline-block;margin-left: 30px; font-weight: bolder">附件：</h3>
          <!--<a-textarea v-model="upFileName"></a-textarea>-->
          <a-upload style="margin-left: 15px;" name="file" :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload"
                    :showUploadList="true" :multiple="true" :headers="headers">
            <a-button>
              <a-icon type="upload"/>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction,postAction} from '@/api/manage'
  // import pick from 'lodash.pick'
  import {getAction} from '@/api/manage'
  import InputElement from "ant-design-vue/es/auto-complete/InputElement";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "YinRuYiJuModal",
    components: {ATextarea, InputElement},
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
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
        fileList: [],
        tableSelection: [],
        fileData: {
          sTable: "",
          iTableId: 0,
          sFileType: 0
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          upload: "/papertitle/oaTemplate/uploads",
        },

      }
    },
    created() {
    },
    methods: {

      show(data) {
        console.log(data)
        this.fileData.sTable = data.table;
        this.fileData.iTableId = data.i_id;
        this.fileData.sFileType = 6;
        this.visible = true;
      },
      beforeUpload: function (file, fileList) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      },
      handleUpload() {
        const {fileList} = this;
        const data = new FormData();
        let url = this.url.upload;
        let method = 'post';
        fileList.forEach(file => {
          data.append('file', file);
        });
        data.append("sTable", this.fileData.sTable)
        data.append("iTableId", this.fileData.iTableId)
        data.append("sFileType", this.fileData.sFileType)
        this.axios({url, method, data, processData: false}).then(res => {
          if (res.success){
            let param={};
            param.table = this.fileData.sTable;
            param.i_id = this.fileData.iTableId;
            param.i_is_file = 1;
            postAction('/oaBus/dynamic/updateData',param).then(res=>{
            })
          }
          this.$emit('watchSub', true);
          this.close();
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.fileList = [];
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