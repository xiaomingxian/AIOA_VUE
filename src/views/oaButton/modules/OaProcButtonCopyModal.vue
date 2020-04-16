<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消">
    <a-spin :spinning="confirmLoading" style="height: 60px;margin-bottom: 20px">
      <a-form :form="form">

        <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol">
           <a-input-hide v-decorator="[ 'iid', {}]" />
         </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="新的按钮组合名称">
          <a-input maxLength="50" placeholder="请输入新的按钮组合名称" v-decorator="['sbuttonSetName', {rules: [{ required: true, message: '请输入新的按钮组合名称' }]}]" />
        </a-form-item>
        <a-form-item
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
                 <a-input-hide placeholder="请输入流程定义KEY" aria-disabled="true" v-decorator="['procDefKey', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'

  export default {
    name: "OaProcButtonCopyModal",
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
        // validatorRules:{
        //   iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        // },
        url: {
          // add: "/oaprocbutton/oaProcButton/add",
          // edit: "/oaprocbutton/oaProcButton/edit",
          copy: "/oaprocbutton/oaProcButton/copeConfig"
        },
      }
    },
    created () {
    },
    methods: {
      // add () {
      //   this.edit({});
      // },
      // edit
        copy(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','sbuttonSetName','procDefKey'))
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
            // if(!this.model.iid){
            //   httpurl+=this.url.add;
            //   method = 'post';
            // }else{
              httpurl+=this.url.copy;
              method = 'post';
            // }
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
              this.sbuttonSetName='';
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