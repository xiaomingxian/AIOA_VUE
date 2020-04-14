<template>
  <a-modal
    :title="title"
    :width="800"
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
          label="名称">
          <!--<a-input placeholder="请输入名称" v-decorator="['itemText', {rules:[{required:true,message:'请输入字典编码！！！'},{ min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }]}]" />-->
          <a-input placeholder="请输入名称" maxLength="100" v-decorator="['itemText',  {rules:[{required:true,message:'请输入名称！！！'}]}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数据值">
          <!--<a-input placeholder="请输入数据值" v-decorator="['itemValue', validatorRules.itemValue]"/>-->
          <a-input placeholder="请输入数据值" maxLength="100" v-decorator="['itemValue', {rules:[{required:true,message:'请输入数据值！！！'}]}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-textarea placeholder="请输入描述" maxLength="1000" v-decorator="['description', {rules:[{required:false ,message:'请输入描述!'}] }]"/>
          <!--<a-input v-decorator="['description', {rules:[{required:true,message:'请输入描述！！！'},{ min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }]}]" />-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序值">
          <a-input placeholder="请输入排序值" maxLength="10" v-decorator="[ 'sortOrder',{rules:[{required:false ,message:'请输入排序值!'},{pattern: new RegExp(/^[0-9]\d*$/), message: '请输入数字'}] }]"/>
          <!--<a-input :min="1" maxLength="10"  v-decorator="['sortOrder',{}]" />-->
          值越小越靠前，支持小数
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门">
          <a-select style="width: 100%;" mode="multiple" @change="getSelectDepartLists"   v-decorator="[ 'departs', {}]">
            <a-select-option   v-for="(each,eachindex) in departList" :key="eachindex" :value="each.id">
              {{ each.departName }}
            </a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否启用"
          hasFeedback>
          <a-switch checkedChildren="启用" unCheckedChildren="禁用" @change="onChose" v-model="visibleCheck"/>
        </a-form-item>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {addDictItem, editDictItem} from '@/api/api'
  import {httpAction, getAction} from '@/api/manage'


  export default {
    name: "DictItemModal",
    data() {
      return {
        deparstMsg:'',
        departslistid: [],//所选部门id  为字符串拼接
        departList: [],
        title: "操作",
        visible: false,
        visibleCheck: true,
        model: {},
        dictId: "",
        status: 1,
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          itemText: {rules: [{required: true, message: '请输入名称!'}]},
          itemValue: {rules: [{required: true, message: '请输入数据值!'}]},
        },
      }
    },
    created() {
      //部门列表  多选  edit feng 修改为请求机构
      let url = "/sys/sysDepart/query?orgType=1";
      getAction(url).then((res) => {
        console.log(res.result);
        this.departList = res.result;
      })
    },
    methods: {
      //获取所选人员列表
      getSelectDepartLists(departLists) {
        this.departslistid = Array.from(departLists)
      },
      add(dictId) {
        this.dictId = dictId;
        this.edit({});
      },
      edit(record) {
        if (record.id) {
          this.dictId = record.dictId;
          this.visibleCheck = (record.status == 1) ? true : false;
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.dictId = this.dictId;
        this.model.status = this.status;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'itemText', 'itemValue', 'description', 'sortOrder','departs'))
        });
      },
      onChose(checked) {
        if (checked) {
          this.status = 1;
          this.visibleCheck = true;
        } else {
          this.status = 0;
          this.visibleCheck = false;
        }
      },
      // 确定
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            values.itemText = (values.itemText || '').trim()
            values.itemValue = (values.itemValue || '').trim()
            values.description = (values.description || '').trim()
            let formData = Object.assign(this.model, values);
            formData.status = this.status;
            let obj;
            if (!this.model.id) {
              obj = addDictItem(formData);
            } else {
              obj = editDictItem(formData);
            }
            obj.then((res) => {
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
      // 关闭
      handleCancel() {
        this.close();
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
    }
  }
</script>