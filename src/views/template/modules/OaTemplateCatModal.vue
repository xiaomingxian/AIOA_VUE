<template>
  <a-modal
    :title="title"
    :width="800"
    @cancel="handleCancel"
    :visible="visible">
    <template slot="footer">
      <a-button type="primary" @click.stop="close()">关闭</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模板名称">
          <a-input placeholder="" v-decorator="['sname', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="红头规则">
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
          label="模板类型">
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
          label="模板文件">
          <a-input v-model="upFileName"/>
          <a-button type="primary"
                    icon="download"
                    size="small"
                    @click="downFileName" v-if="upFailId === 1 && upFileName !== ''">下载</a-button>
        </a-form-item>
        <a-input v-show="false" v-model="downFilePath" />
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea placeholder="" v-decorator="['sremarks', {}]" />
        </a-form-item>
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
  import ATextarea from "ant-design-vue/es/input/TextArea";
  export default {
    name: "OaTemplateModal",
    components: {ATextarea},
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
          // console.log(res.result)
          if (res.result.sfileName.lastIndexOf("\\") != -1){
            res.result.sfileName = res.result.sfileName.slice(res.result.sfileName.lastIndexOf("\\")+1)
          }
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
        downFile(this.url.download, {filePath: this.downFilePath}).then(res => {
          let filename =  this.upFileName
          let url = window.URL.createObjectURL(new Blob([res]));
          let edik = document.createElement('a');
          edik.style.display = 'none';
          edik.href = url;
          edik.setAttribute('download', filename);
          document.body.appendChild(edik);
          //点击下载
          edik.click();
          // 释放掉blob对象
          window.URL.revokeObjectURL(edik);
          // 下载完成移除元素
          document.body.removeChild(edik);
        })
        // let url = window._CONFIG['domianURL'] + this.url.download;
        // window.open(url+"/"+this.downFilePath);
        }
    }
  }
</script>

<style lang="less" scoped>

</style>