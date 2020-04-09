<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字典名称">
          <!--<a-input placeholder="请输入字典名称" v-decorator="[ 'dictName', {rules: [{ required: true, message: '请输入字典名称!'},{min:0, max:20, message: '长度在0到20个字符', tarigger:'blur'}] ] @blur="dictNameChange"/>  /^[0-9a-zA-Z]*$/g   -->
          <a-input maxLength="100" placeholder="请输入字典名称" v-decorator="['dictName', {rules:[{required:true,message:'请输入字典名称！！！'}]}]" />
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字典编码">
          <!--<a-input placeholder="请输入字典编码" v-decorator="[ 'dictCode', validatorRules.dictCode]" @blur="dictCodeChange" ,{pattern: new RegExp(/^[A-Za-z0-9_]\d*$/), message: '请输入数字或字母或_！'} />-->
          <a-input maxLength="100" placeholder="请输入字典编码" v-decorator="['dictCode', {rules:[{required:true,message:'请输入字典编码！！！'}]}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea placeholder="请输入备注" maxLength="255" v-decorator="['description', {rules:[{required:false ,message:'请输入备注!'}] }]"/>
          <!--<a-input maxLength="255" v-decorator="[ 'description', {rules:[{required:true,message:'请输入描述！！！'}] }]" />-->
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction,getAction } from '@/api/manage'
  import { addDict, editDict, duplicateCheck } from '@/api/api'

  export default {
    name: 'DictModal',
    data() {
      return {
        dictNamecha:'',
        dictCodecha:'',
        descriptioncha:'',
        value: 1,
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          // dictName: { rules: [{ required: true, message: '请输入字典名称!'},{min:0, max:20, message: '长度在0到20个字符', tarigger:'blur'}] },
          dictCode: {
            rules: [{ required: true, message: '请输入字典编码!' },
              { validator: this.validateDictCode }]
          }
        }
      }
    },
    created() {
      this.initialUserList();
    },
    methods: {
      dictNameChange(e){
        this.dictNamecha = e.target.value;
      },
      dictCodeChange(e){
        this.dictCodecha = e.target.value;
      },
      descriptionChange(e){
        this.descriptioncha = e.target.value;
      },
      validateDictCode(rule, value, callback) {
        // 重复校验
        var params = {
          tableName: 'sys_dict',
          fieldName: 'dict_code',
          fieldVal: value,
          dataId: this.model.id
        }
        duplicateCheck(params).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      },
      handleChange(value) {
        this.model.status = value
      },
      add() {
        this.edit({})
      },
      edit(record) {
        if (record.id) {
          this.visiblekey = true
        } else {
          this.visiblekey = false
        }
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'dictName', 'dictCode', 'description','departs'))
        })
      },
      // 确定
      handleOk() {

        console.log("111111")
        console.log(this.dictNamecha.length);
        console.log(this.dictCodecha.length);
        console.log(this.descriptioncha.length);


        /*if (this.dictNamecha != null){
          if (this.dictNamecha.length >5){
            this.$message.warning("字典名称长度不得超过40");
          }
        }
        if (this.dictCodecha != null){

          var re = new RegExp("[\\u4E00-\\u9FFF]+","g");
          if(re.test(this.dictCodecha)){
            this.$message.warning("含有汉字");
          }else {
            this.$message.warning("不含有汉字");
          }

          if (this.dictCodecha.length > 30){
            this.$message.warning("字典编码长度不得超过30");
          }
        }
        if (this.descriptioncha != null){
          if (this.descriptioncha.length > 100){
            this.$message.warning("描述长度不得超过100");
          }
        }*/

        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            values.dictName = (values.dictName || '').trim()
            values.dictCode = (values.dictCode || '').trim()
            values.description = (values.description || '').trim()
            let formData = Object.assign(this.model, values)
            let obj
            console.log(formData)
            if (!this.model.id) {
              obj = addDict(formData)
            } else {
              obj = editDict(formData)
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })

      },
      // 关闭
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      }
    }
  }
</script>