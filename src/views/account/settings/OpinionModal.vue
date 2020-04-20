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
           <a-input placeholder="请输入主键id" v-decorator="['iid', validatorRules.iid ]" />
         </a-form-item>-->
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户id">
          <a-input placeholder="请输入用户id" v-decorator="['suserId', {}]" />
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <a-input  placeholder="请输入序号" style="width: 100px" v-decorator="['iorder', {rules:[{required:true,message:'序号必须输入！！！'},{ min: 1, max: 10, message: '长度在不超过10位的整数', trigger: 'blur' },{pattern: new RegExp(/^[1-9]\d*$/), message: '请输入数字！'}]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="意见内容">
          <a-input placeholder="请输入意见内容"  v-decorator="['scontent', {rules:[{required:true,message:'意见内容必须输入！！！'},{ min: 1, max: 50, message: '长度不超过50位', trigger: 'blur' }]}]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "OpinionModal",
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

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/sys_user_opinion/sysUserOpinion/add",
          edit: "/sys_user_opinion/sysUserOpinion/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.form.resetFields();
        this.visible = true;
        // this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','suserId','iorder','scontent'))
          this.form.setFieldsValue({iorder:String(this.model.iorder)})
          //时间格式化
        });

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
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>