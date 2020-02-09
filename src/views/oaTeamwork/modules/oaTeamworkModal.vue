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
          label="协同业务名称">
          <a-input placeholder="请输入协同业务名称" v-decorator="['steamworkName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-input placeholder="请输入描述" v-decorator="['description', {}]" />
        </a-form-item>
     <!--   <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="版本号">
          <a-input-number v-decorator="[ 'iversion', {}]" />
        </a-form-item>-->
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "oaTeamworkModal",
    data () {
      return {
        title:"操作",
        visible: false,
        selectList:[],
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
          add: "/oateamwork/oaTeamwork/add",
          edit: "/oateamwork/oaTeamwork/edit",
          selectTaskDetail: '/oaTea/oaTeamworkInst/findlist',
        },
      }
    },
    created () {
      this.getFunctionList();
    },
    filters:{
      capitalize:function(value){
        if(value == null) return value =value.toString()
      }
    },
    methods: {
      getFunctionList(){
        getAction(this.url.selectTaskDetail).then((res)=>{
          this.selectList = res.result;
        })

      },
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','steamworkName','description','screateBy','screateDeptid','screateUnitid','iversion'))
		  //时间格式化
          this.form.setFieldsValue({dCreateTime:this.model.dCreateTime?moment(this.model.dCreateTime):null})
          this.form.setFieldsValue({dUpdateTime:this.model.dUpdateTime?moment(this.model.dUpdateTime):null})
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
         /*   formData.dCreateTime = formData.dCreateTime?formData.dCreateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dUpdateTime = formData.dUpdateTime?formData.dupdateTime.format('YYYY-MM-DD HH:mm:ss'):null;*/
            
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