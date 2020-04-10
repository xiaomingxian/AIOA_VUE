<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible">
    <template slot="footer">
      <a-button type="primary" @click.stop="close()">关闭</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="稿纸头">
          <a-input placeholder="" v-decorator="['stitleName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="单位名称">
          <!--<a-input placeholder="" v-decorator="['iisUnit', {}]" />-->
          <a-radio-group  v-decorator="['iisUnit', {}]" >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门">
          <!--<a-input placeholder="" v-decorator="['iisDept', {}]" />-->
          <a-radio-group  v-decorator="['iisDept', {}]" >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="前缀">
          <a-input placeholder="" v-decorator="['sleftParameter', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="中部">
          <a-input placeholder="" v-decorator="['smddleParameter', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="后缀">
          <a-input placeholder="" v-decorator="['srightParameter', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="固定参数">
          <a-input placeholder="" v-decorator="['sotherParameter', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="默认稿纸头">
          <!--<a-input placeholder="" v-decorator="['iisDefault', {}]" />-->
          <a-radio-group  v-decorator="['iisDefault', {}]" >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          <!--<a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['iisDefaultb', {}]"/>-->
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
    name: "PaperTitleSettingModal",
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
        // iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/papertitle/paperTitleSetting/add",
          edit: "/papertitle/paperTitleSetting/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','stitleName','iisUnit','iisDept','sleftParameter','smddleParameter','srightParameter','sotherParameter','iisDefault','screateBy','supdateBy'))
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
      },


    }
  }
</script>

<style lang="less" scoped>

</style>