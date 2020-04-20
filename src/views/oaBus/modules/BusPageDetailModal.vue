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
      
        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主键id">
          <a-input-number v-decorator="[ 'iId', validatorRules.iId ]" />
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务页面id">
          <a-input-number v-decorator="[ 'ibusPageId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务功能id">
          <a-input-number v-decorator="[ 'ibusFunctionId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务数据表名">
          <a-input placeholder="请输入业务数据表名" v-decorator="['sbusdataTable', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务数据表列名">
          <a-input placeholder="请输入业务数据表列名" v-decorator="['stableColumn', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="页面显示的数据项名">
          <a-input placeholder="请输入页面显示的数据项名" v-decorator="['scolumnName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否作为列表标题列">
          <a-input placeholder="请输入是否作为列表标题列" v-decorator="['iisListtitle', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否作为列表查询条件">
          <a-input placeholder="请输入是否作为列表查询条件" v-decorator="['iisListquery', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否必填校验">
          <a-input placeholder="请输入是否必填校验" v-decorator="['icheckIsNull', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="java校验规则，正则表达式">
          <a-input placeholder="请输入java校验规则，正则表达式" v-decorator="['scheckExpjava', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="数据校验sql">
          <a-input placeholder="请输入数据校验sql" v-decorator="['scheckExpsql', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="js校验规则，正则表达式（从数据字典查）">
          <a-input placeholder="请输入js校验规则，正则表达式（从数据字典查）" v-decorator="['scheckExpjs', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="校验提示信息">
          <a-input placeholder="请输入校验提示信息" v-decorator="['scheckShowmsg', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="对应公文传输字段">
          <a-input placeholder="请输入对应公文传输字段" v-decorator="['ssendKey', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="档案系统对应字段">
          <a-input placeholder="请输入档案系统对应字段" v-decorator="['sarchivesKey', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否模板业务原型含义（1是、0否）">
          <a-input placeholder="请输入是否模板业务原型含义（1是、0否）" v-decorator="['iisDefault', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="含义设置方式（1、可修改、0、不可更改）">
          <a-input placeholder="请输入含义设置方式（1、可修改、0、不可更改）" v-decorator="['isetType', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务数据列备注">
          <a-input placeholder="请输入业务数据列备注" v-decorator="['scolumnRemarks', {}]" />
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
    name: "BusPageDetailModal",
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
          add: "/oaBus/busPageDetail/add",
          edit: "/oaBus/busPageDetail/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','ibusPageId','ibusFunctionId','sbusdataTable','stableColumn','scolumnName','iisListtitle','iisListquery','icheckIsNull','scheckExpjava','scheckExpsql','scheckExpjs','scheckShowmsg','ssendKey','sarchivesKey','iisDefault','isetType','scolumnRemarks'))
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
            if(!this.model.id){
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