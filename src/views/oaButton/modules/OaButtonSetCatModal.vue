<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading" style="height: 360px;overflow: auto">
      <a-form :form="form">
      
       <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主键id">
          <a-input-number v-decorator="[ 'iId', validatorRules.iid ]" />
        </a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="流程按钮关联ID">-->
          <!--<a-input-number v-decorator="[ 'iprocButtonId', {}]" />-->
        <!--</a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="按钮名称">
          <a-select v-model="selectButton"
                    @change="getButtonId()"
                    placeholder="按钮名称"
                    :disabled="disableSubmit">
            <a-select-option  v-for="(oaButton,index) in data" :key="index" :value="oaButton.iid">
              {{ oaButton.sbtnName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="按钮ID（oa_button表）">-->
          <!--<a-input-number v-decorator="[ 'ibuttonId', {}]" />-->
        <!--</a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <a-input-number maxLength="9" v-decorator="[ 'iorder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="控制">
          <a-radio-group v-decorator="['ipermitType', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拟稿人">
          <a-radio-group v-decorator="['iisCreater', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="读者">
          <a-radio-group v-decorator="['iisReader', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "OaButtonSetModal",
    data () {
      return {
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
        data:[],
        selectButton:'',
        buttonInfo:'',
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oabuttonset/oaButtonSet/add",
          edit: "/oabuttonset/oaButtonSet/edit",
          buttonList: "/oabutton/oaButton/buttonList",
          queryById: "/oabutton/oaButton/queryById"
        },
      }
    },
    created () {
    },
    methods: {
      //add () {
        //this.edit({});
      //},
      getButtonList(){
        getAction(this.url.buttonList,{}).then(res=>{
          this.data = res.result;
        });
      },
      getButtonId(){
        this.model.ibuttonId=this.selectButton;
      },
      add (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        //---------------根据按钮ID 请求名字--------------
        getAction(this.url.queryById,{id:this.model.ibuttonId}).then(res=>{
          this.buttonInfo = res.result;
          this.selectButton=this.buttonInfo.sbtnName;
        });
        this.getButtonList();
        //------------------------------
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','procdefKey','taskdefKey','iprocButtonId','ibuttonId','iorder','ipermitType','iisCreater','iisReader','iisLastsender','iisTransactors','iisDefault','itaskDefKey','smanagerRoleId'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.close()
      },
      handleCancel () {
        this.close()
      }


    }
  }
</script>

<style lang="less" scoped>

</style>