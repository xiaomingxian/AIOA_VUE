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

          <a-select v-decorator="[ 'ititleRuleId', {}]">
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
          label="附件名称">
          <a-input v-model="upFileName"/>
          <a-button type="primary"
                    icon="download"
                    size="small"
                    @click="downFileName" v-if="upFailId === 1 && upFileName !== ''">下载</a-button>
        </a-form-item>
        <a-input v-show="false" v-model="downFilePath" />
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import Vue from 'vue'
  import axios from 'axios'
  import {ACCESS_TOKEN} from "../../../store/mutation-types";
  import { deleteAction, getAction,downFile } from '@/api/manage'
  export default {
    name: "OaTemplateModal",
    data () {
      return {
        title:"操作",
        visible: false,
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        upFileName:'',
        upFailId:0,
        downFilePath:'',
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
          download:"/papertitle/oaTemplate/download"
        },
      }
    },
    created(){
      this.getSelection();
    },
    methods: {
      add (record) {
        if (record.ifileId){
          this.upFailId = 1;
        } else {
          this.upFailId = 0;
        }
        this.getFileNameById(record.ifileId);
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','itype','sname','ifileId','ititleRuleId','sremarks'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.upFileName = '';
      },
      handleOk () {
        this.close()
      },
      handleCancel () {
        this.close()
      },
      getFileNameById(id){
        let that=this
        let url = "/papertitle/oaTemplate/getFileNameById";
        getAction(url,{ifileId:id}).then((res)=>{
          console.log(res.result)
          that.upFileName = res.result.sfileName;
          that.downFilePath = res.result.sfilePath;
        })
      },
      getSelection(){
        let url = "/papertitle/paperTitleSetting/paperTitleList";
        getAction(url).then((res)=>{
          this.selectData = res.result;
        })
      },
      downFileName() {
        let url = window._CONFIG['domianURL'] + this.url.download;
        window.open(url+"/"+this.downFilePath);
        }
    }
  }
</script>

<style lang="less" scoped>

</style>