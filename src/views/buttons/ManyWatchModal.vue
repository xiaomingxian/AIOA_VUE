<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间">
        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss"></a-date-picker>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
        <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss"></a-date-picker>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import moment from  'moment'
    export default {
        name: "ManyWatchModal",
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
            // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
          },
          url: {
            add: "/papertitle/docNumSet/addDocNum"
          },

        }
      },
      created () {
      },
      methods: {
        moment,
        piliang(record) {
          this.form.resetFields();
          this.model = Object.assign({}, {});
          this.visible = true;
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'ibusFunctionId','iorder','sname','sdocRule','idocNum','iutemplateId','idtemplateId','iatemplateId','sremarks','screateBy','supdateBy'))

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
              httpurl+=this.url.add;
              method = 'post';

              let formData = Object.assign(this.model, values);
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

<style scoped>

</style>