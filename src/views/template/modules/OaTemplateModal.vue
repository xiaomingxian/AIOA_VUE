<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模版名称">
          <a-input placeholder="" v-decorator="['sname', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="稿纸头规则">
          <!--<a-input-number v-decorator="[ 'ititleRuleId', {}]" />-->
          <!--<a-select defaultValue="selected ${value}" v-decorator="[ 'ititleRuleId', {}]">-->
            <!--<a-select-option value="0">稿纸头列表</a-select-option>-->
            <!--</a-select-option>-->
          <!--</a-select>-->

          <a-select
            v-decorator="[ 'ititleRuleId', {}]">
            <a-select-option  v-for="(item,index) in selectData" :key="index" :value="item.iid">{{item.stitleName}}</a-select-option>

          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模版类型">
          <!--<a-input placeholder="" v-decorator="['itype', {}]" />-->
          <a-radio-group v-model="value" v-decorator="['itype', {}]" >
            <a-radio :value="1">上报</a-radio>
            <a-radio :value="2">下发</a-radio>
            <a-radio :value="3">办文单</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="" v-decorator="['sremarks', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="附件上传">
          <a-upload name="file" :fileList="fileList" :beforeUpload="beforeUpload" :showUploadList="false" :multiple="false" :headers="headers" @change="handleChange">
            <a-button :disabled="uploading"><a-icon type="upload" />点击上传</a-button>
          </a-upload>
        </a-form-item>

        <a-form-item
          v-if="upFailId === 1"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="附件名称">
          <a-input v-model="upFileName"/>
          <a-button type="primary" icon="plus" @click="deleteFileName">删除</a-button>
          <a-input v-show="false"  v-model="fileId" v-decorator="['ifileId', {}]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import AFormItem from "ant-design-vue/es/form/FormItem";
  export default {
    name: "OaTemplateModal",
    components: {AFormItem},
    data () {
      return {
        upFileName:'',
        upFailId: 0,
        fileId:'',
        fileList: [],
        uploading: false,
        headers: {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        },
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        selectData:[],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        // iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/papertitle/oaTemplate/add",
          edit: "/papertitle/oaTemplate/edit",
          upload:'/papertitle/oaTemplate/upload'
        },
      }
    },
    created(){
    },
    methods: {
      add () {
        this.getSelection();
        this.upFailId = 0;
        this.upFileName = '';
        this.fileUpload = window._CONFIG['domianURL'] +'/papertitle/oaTemplate/upload';
        this.form.resetFields();
        this.model = Object.assign({}, {});
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','itype','sname','ifileId','ititleRuleId','sremarks'))
        });

      },
      edit (record) {
        this.getSelection();
        if (record.ifileId){
          this.upFailId = 1;
          this.uploading = true;
        } else {
          this.upFailId = 0;
          this.uploading = false;
        }
        this.getFileNameById(record.ifileId);
        this.fileUpload = window._CONFIG['domianURL'] +'/papertitle/oaTemplate/upload';
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','itype','sname','ifileId','ititleRuleId','sremarks'))
        });
      },
      getFileNameById(id){
        let url = "/papertitle/oaTemplate/getFileNameById";
        getAction(url,{ifileId:id}).then((res)=>{
          this.upFileName = res.result.sfileName;
        })
      },
      beforeUpload:function(file,fileList){
        this.upFailId = 1;
        this.upFileName = file.name;
        this.uploading = true;
        this.fileList = [...this.fileList, file];
        return false;
      },
      deleteFileName(){
        let  that = this;
        that.upFailId = 0;
        that.upFileName = '';
        this.model.ifileId = "";
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'ifileId'))
        });
        this.uploading = false;
      },
      close () {
        this.upFailId = 0;
        this.uploading = false;
        this.$emit('close');
        this.visible = false;
      },

      handleUpload() {
        const { fileList } = this;
        const data = new FormData();
        fileList.forEach(file => {
          data.append('file', file);
        });
        this.uploading = true;
        let url = this.url.upload;
        let method = 'post';

        httpAction(url,data,method).then((res)=>{
          this.fileList = [];
          this.uploading = false;
          this.model.ifileId = res.result.iid;
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'ifileId'))
          });
        });
      },
      handleOk () {
        const that = this;
        that.handleUpload();
       setTimeout(()=>{
         // 触发表单验证
         this.form.validateFields((err, values) => {
           if (!err) {
             that.confirmLoading = true;
             let httpurl = '';
             let method = '';
             if(!this.model.iid){
               httpurl+=this.url.add;
               method = 'post';
             }else{
               httpurl+=this.url.edit;
               method = 'put';
             }

             let formData = Object.assign(this.model, values);
             console.log( formData);
             httpAction(httpurl,formData,method).then((res)=>{
               if(res.success){
                 that.$message.success(res.message);
                 that.$emit('ok');
               }else{
                 that.$message.warning(res.message);
               }
             }).finally(() => {
               that.confirmLoading = false;
               that.close();
             })



           }
         })
       },800)
      },
      handleCancel () {
        this.close()
      },
      getSelection(){
        let url = "/papertitle/paperTitleSetting/paperTitleList";
        getAction(url).then((res)=>{
          this.selectData = res.result;
        })
      },
      handleChange(info){
        if (info.file.status !== 'uploading'){
          console.log(info.file,info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            this.upFailId = 1;
            this.upFileName = info.file.name;
            this.model.ifileId = info.file.response.result.iid;
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'ifileId'))
            });
            this.$message.success(`${info.file.name} 文件上传成功`);
          }else {
            this.$message.error(`${info.file.name} ${info.file.response.message}.`);
          }
        }else if (info.file.status ==='error'){
          this.$message.error(`文件上传失败: ${info.file.msg} `);
        }

      }
    }
  }
</script>

<style lang="less" scoped>

</style>