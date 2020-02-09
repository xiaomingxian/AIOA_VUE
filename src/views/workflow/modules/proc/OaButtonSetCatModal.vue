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
          label="按钮（oa_button表）">
          <a-select v-model="ibuttonId"
                    @change="getButtonId()"
                    placeholder="按钮（oa_button表）"
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
          <a-input-number v-decorator="[ 'iorder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限类型（0、不控制；1、控制）">
          <a-radio-group v-decorator="['ipermitType', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建人（拟稿人）">
          <a-radio-group v-decorator="['iisCreater', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否读者身份显示">
          <a-radio-group v-decorator="['iisReader', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否已办用户">
          <a-radio-group v-decorator="['iisLastsender', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否当前处理人显示">
          <a-radio-group v-decorator="['iisTransactors', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否默认按钮配置（1是、0否）">
          <a-radio-group v-decorator="['iisDefault', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="任务环节:">
          <a-select
            mode="tags"
            tokenSeparators=","
            style="width: 60%"
            placeholder="请选择任务环节"
            :defaultValue="[]"
            @change="handelChange"
            v-model="taskDefKey">
            <a-select-option v-for="Activity in TaskLink" :value="Activity.id">
              {{ Activity.name }}
            </a-select-option>
          </a-select>
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
        ibuttonId:'',
        taskDefKey:[],
        buttonInfo:'',
        TaskLink:[],//流程定义Id  //任务环节列表
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oabuttonset/oaButtonSet/add",
          edit: "/oabuttonset/oaButtonSet/edit",
          buttonList: "/oabutton/oaButton/buttonList",
          queryById: "/oabutton/oaButton/queryById",
          TaskLink:"/wf/process/actsList"
        },
      }
    },
    created () {
      this.getButtonList();
    },
    methods: {
      handelChange(value){
        console.log("----------任务环节赋值-------------"+value);
        this.model.taskDefKey=value.toString();
      },
      getButtonList(){
        getAction(this.url.buttonList,{}).then(res=>{
          this.data = res.result;
        });
      },
      getButtonId(){
        this.model.ibuttonId=this.ibuttonId;
      },
      add (record,TaskLinkId) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        //---------------任务环节---------------
        getAction(this.url.TaskLink,{processDefinitionId:TaskLinkId}).then(res=>{
          this.TaskLink = res.result;
        });

        this.ibuttonId=this.model.ibuttonId;
        //分割-数据=数组
        this.taskDefKey=this.model.taskDefKey.split(',');
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','procdefKey','taskDefKey','iprocButtonId','ibuttonId','iorder','ipermitType','iisCreater','iisReader','iisLastsender','iisTransactors','iisDefault','itaskDefKey','smanagerRoleId'))
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