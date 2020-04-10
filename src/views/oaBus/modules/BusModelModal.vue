<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <!--<a-input-number  :min="0" :max="10000" v-decorator="[ 'iorder', {}]" />-->
          <a-input  v-decorator="[ 'iorder', {rules:[{ pattern: /^[1-9]\d{0,3}$/, message: '输入0到4位的非零正整数' }]}]" />
<!--
          <a-input  v-decorator="[ 'iorder', {rules:[{validator:validateNum}]}]" />
-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务菜单名称">
          <a-input placeholder="请输入业务菜单名称" v-decorator="['sname', {rules:[{required:true,message:'业务菜单名称不能为空'},{ min: 1, max: 50, message: '长度在 1到 50 个字符', trigger: 'blur' }]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务路径名称">
          <a-input placeholder="请输入业务路径名称" v-decorator="['senName', {rules:[{required:true,message:'业务路径名称不能为空'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务分类">
          <a-select placeholder="请选择业务分类" v-decorator="['sbusdataTable', {rules:[{required:true,message:'业务分类不能为空'}]}]">
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
      validateNum(rule, value, callback){
        // console.log(typeof(parseInt(value)));
        // console.log(value);
        //var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regPos = /^\d{0,4}$/; //非负浮点数

        console.log(regPos.test(value));
        console.log(String(value).length);

          if(regPos.test(value)&&String(value).length<=4){
            callback();
          }else{
          callback('请输入整数并小于四位数');
          }
      },
      //长度校验
      dealLenth(rule, value, callback){
        if (value.length <= 30 ) {
          callback();
        } else {
          callback('长度不可以超过15个汉字或者30个字符！！');
        }
      },
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