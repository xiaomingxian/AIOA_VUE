<template>
  <a-modal
    :title="title"
    :width="900"
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
          label="按钮">
          <a-select
                    placeholder="按钮名称"
                    :disabled="disableSubmit"
                    v-model="ibuttonId"
                    @change="getButtonId">
            <a-select-option  v-for="(oaButton,index) in data" :key="index" :value="oaButton.iid">
              {{ oaButton.sbtnName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <a-input-number v-decorator="[ 'iorder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否控制权限类型">
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
        buttonInfo:[],
        // selectButton:'',
        ibuttonId:'',
        TaskLinkId:'',
        taskDefKey:[],
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

    },
    methods: {
      add (TaskLinkId,iprocButtonId) {
        this.model.iprocButtonId=iprocButtonId;
        this.form.resetFields();
        this.getButtonList();
        this.TaskLinkId=TaskLinkId;
        //---------------任务环节---------------
        getAction(this.url.TaskLink,{processDefinitionId: this.TaskLinkId}).then(res=>{
          this.TaskLink = res.result;
        });
        this.visible = true;
        // this.edit({});
      },
      edit (record,TaskLinkId) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        // console.log(this.model);
        this.getButtonList();
        this.TaskLinkId=TaskLinkId;
        //---------------任务环节---------------
        getAction(this.url.TaskLink,{processDefinitionId: this.TaskLinkId}).then(res=>{
          this.TaskLink = res.result;
        });

        this.ibuttonId=this.model.ibuttonId;
        this.taskDefKey=this.model.taskDefKey.split(',');
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','procdefKey','taskDefKey','iprocButtonId','ibuttonId','iorder','ipermitType','iisCreater','iisReader','iisLastsender','iisTransactors','iisDefault','itaskDefKey','smanagerRoleId'))
		  //时间格式化
        });
      },
      getButtonList(){//按钮列表
        getAction(this.url.buttonList,{}).then(res=>{
          this.data = res.result;
        });
      },
      getButtonId(){//按钮改变-赋值
        this.model.ibuttonId=this.ibuttonId;
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
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
            //时间格式化
            
            console.log(formData)
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
      },
      handelChange(value){
        console.log("----------任务环节赋值-------------"+value);
        this.model.taskDefKey=value.toString();
      },
      handleCancel () {
        this.close()
      }

    }
  }
</script>

<style lang="less" scoped>

</style>