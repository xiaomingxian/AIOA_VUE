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
          <!--<a-input-number v-decorator="[ 'iprocOpinionId', {}]" />-->
        <!--</a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="业务流程配置ID">-->
          <!--<a-input-number v-decorator="[ 'iprocSetId', {}]" />-->
        <!--</a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="意见框名称">
          <a-input v-decorator="[ 'itaskOpinionName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="意见框位置(数字)">
          <a-input-number v-decorator="[ 'itaskOpinionOrder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程定义Key">
          <a-input v-decorator="[ 'procDefKey', {}]" />
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
        <!--<a-form-item-->
        <!--optionFilterProp = "children"-->

          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="是否默认按钮配置（1是、0否）">-->
          <!--<a-radio-group v-decorator="['iisReader', {}]">-->
            <!--<a-radio :value="1">是</a-radio>-->
            <!--<a-radio :value="0">否</a-radio>-->
          <!--</a-radio-group>-->
        <!--</a-form-item>-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "OaOpinionSetModal",
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
        buttonInfo:'',
        ibuttonId:'',
        iprocOpinionId:'',
        taskDefKey:[],
        TaskLink:[],//流程定义Id  //任务环节列表
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oaopinionset/oaOpinionSet/add",
          edit: "/oaopinionset/oaOpinionSet/edit",
          buttonList: "/oabutton/oaButton/buttonList",
          queryById: "/oabutton/oaButton/queryById",
          TaskLink:"/wf/process/actsList"
        },
      }
    },
    created () {
      // this.getButtonList();
    },
    methods: {
      add (TaskLinkId,iprocOpinionId) {
        this.model.iprocOpinionId=iprocOpinionId;
        this.form.resetFields();
        //---------------任务环节列表---------------
        getAction(this.url.TaskLink,{processDefinitionId:TaskLinkId}).then(res=>{
          this.TaskLink = res.result;
        });
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','iprocOpinionId', 'iprocSetId',
            'itaskOpinionName','itaskOpinionOrder',
            'taskDefKey','procDefKey'))
          //时间格式化
        });
      },
      edit (record,TaskLinkId) {
        this.form.resetFields();
        this.model = Object.assign({}, record);

        //---------------任务环节列表---------------
        getAction(this.url.TaskLink,{processDefinitionId:TaskLinkId}).then(res=>{
          this.TaskLink = res.result;
        });
        this.ibuttonId=this.model.ibuttonId;
        //分割-数据=数组
          this.taskDefKey=this.model.taskDefKey.split(',');

        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','iprocOpinionId', 'iprocSetId',
            'itaskOpinionName','itaskOpinionOrder',
            'taskDefKey','procDefKey'))
		  //时间格式化
        });

      },
      // getButtonList(){//按钮列表
      //   getAction(this.url.buttonList,{}).then(res=>{
      //     this.data = res.result;
      //   });
      // },
      getButtonId(){//按钮-赋值
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