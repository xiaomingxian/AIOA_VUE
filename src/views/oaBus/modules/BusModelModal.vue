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
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <a-input-number v-decorator="[ 'iorder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务菜单名称">
          <a-input placeholder="请输入业务菜单名称" v-decorator="['sname', {rules:[{required:true}]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务路径名称">
          <a-input placeholder="请输入业务路径名称" v-decorator="['senName', {rules:[{required:true}]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务分类">
          <a-select placeholder="请选择业务分类" v-decorator="['sbusdataTable', {rules:[{required:true}]}]">
            <a-select-option  v-for="(item,index) in dbtable" :key="index" :value="item.value" >{{item.text}}</a-select-option>
          </a-select>
          <!--<a-input placeholder="" @change="updateOher" v-model="busDataTable" v-decorator="['sbusdataTable', {}]" />-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否为页签方式">
          <a-radio-group  :defaultValue="0" v-decorator="['iisRadio', {}]">
            <a-radio :value="1" >是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
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
    name: "BusModelModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        dbtable:[],
        checkTrue:0,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        busDataTable: '',
        busPermit:'',
        busOpinion:'',
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oaBus/busModel/add",
          edit: "/oaBus/busModel/edit",
          getDbtable :"/sys/dict/getDictItems/dbtable"
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
        getAction(this.url.getDbtable).then(res => {
          this.dbtable = res.result ;
        }) ;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iorder','sname','senName','sbusdataTable','iisRadio'))
		  //时间格式化
        });

      },
      close () {
        this.busPermit = '';
        this.busOpinion = '';
        this.$emit('close');
        this.visible = false;
      },

      updateOher(){
        this.busPermit = this.busDataTable + '_permit';
        this.busOpinion = this.busDataTable + '_opinion';
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