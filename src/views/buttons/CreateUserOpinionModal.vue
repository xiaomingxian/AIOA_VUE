<template>
  <a-modal
    :title="title"
    :width="800"
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
          label="意见内容">
          <a-input  v-decorator="['scontent',{}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <a-input v-decorator="['iorder',{}]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
    export default {
        name: "CreateUserOpinionModal",
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
          },
          url: {
            add: "/sys_user_opinion/sysUserOpinion/add"
          },

        }
      },
      created () {
      },
      methods: {
        show() {
          this.form.resetFields();
          this.model = Object.assign({}, {});
          this.visible = true;
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model,'iOrder','sContent'))
          });
        },
        handleOk() {
          const that = this;
          // 触发表单验证
          this.form.validateFields((err, values) => {
            if (!err) {
              that.confirmLoading = true;
              let httpurl = '';
              let method = 'post'
              httpurl += this.url.add;
              let formData = Object.assign(this.model, values);
              console.log(formData)
              httpAction(httpurl, formData,method).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.$emit('ok');
                } else {
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
                that.close();
              })

            }
          })
        },

        close () {
          this.$emit('close');
          this.visible = false;
        },

        handleCancel () {
          this.close()
        },


      }
    }
</script>

<style scoped>

</style>