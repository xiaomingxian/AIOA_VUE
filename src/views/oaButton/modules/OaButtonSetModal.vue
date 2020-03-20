<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading" style="height: 360px;overflow: auto">
      <a-form :form="form">
      
       <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主键id">
          <a-input-number v-decorator="[ 'iId', validatorRules.iid ]" />
        </a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="流程按钮关联ID">-->
          <!--<a-input-number v-decorator="[ 'iprocButtonId', {}]" />-->
        <!--</a-form-item>-->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="按钮名称">
          <a-select v-model="selectButton"
                    @change="getButtonId()"
                    placeholder="按钮名称"
                    :disabled="disableSubmit">
            <a-select-option  v-for="(oaButton,index) in data" :key="index" :value="oaButton.iid">
              {{ oaButton.sbtnName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="按钮（oa_button表）">-->
          <!--<a-input-number v-decorator="[ 'ibuttonId', {}]" />-->
        <!--</a-form-item>-->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="顺序号">
          <a-input-number maxLength="9" v-decorator="[ 'iorder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="控制">
          <a-radio-group v-model="ipermitType">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拟稿人">
          <a-radio-group v-model="iisCreater">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="读者">
          <a-radio-group v-model="iisReader">
            <a-radio :value="1">是</a-radio>
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
  import AFormItem from "ant-design-vue/es/form/FormItem";

  export default {
    name: "OaButtonSetModal",
    components: {AFormItem},
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
        data:[],
        buttonInfo:'',
        selectButton:'',
        iprocButtonId:'',
        ipermitType:0,
        iisCreater:0,
        iisReader:0,
        // sbtnName:'',
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oabuttonset/oaButtonSet/add",
          edit: "/oabuttonset/oaButtonSet/edit",
          buttonList: "/oabutton/oaButton/buttonList",
          queryById: "/oabutton/oaButton/queryById"
        },
      }
    },
    created () {
      this.getButtonList();
    },
    methods: {
      add (res) {
        this.iprocButtonId=res;
        this.ipermitType=0;
        this.iisCreater=0;
        this.iisReader=0;
        // console.log("6666666666666666666666666666666666666");
        // console.log(res);
        // console.log(this.model);
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        //---------------根据按钮ID 请求名字--------------
        getAction(this.url.queryById,{id:this.model.ibuttonId}).then(res=>{
          this.buttonInfo = res.result;
          this.selectButton=this.buttonInfo.sbtnName;
        });

        this.ipermitType=this.model.ipermitType;
        this.iisCreater=this.model.iisCreater;
        this.iisReader=this.model.iisReader;
        // iisCreater:0,
          // iisReader:0,
        // this.selectButton=this.model.sbtnName;


        //------------------------------
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','procdefKey','taskdefKey','iprocButtonId','ibuttonId','iorder','ipermitType','iisCreater','iisReader','iisLastsender','iisTransactors','iisDefault','itaskDefKey','smanagerRoleId'))
		  //时间格式化
        });

      },
      getButtonList(){
        getAction(this.url.buttonList,{}).then(res=>{
          this.data = res.result;
        });
      },
      getButtonId(){
        this.model.ibuttonId=this.selectButton;
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
              console.log("0000000000000000000000000");
              this.model.iprocButtonId=this.iprocButtonId;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            this.model.ipermitType=this.ipermitType;
            this.model.iisCreater=this.iisCreater;
            this.model.iisReader=this.iisReader;
            console.log(this.model);
            let formData = Object.assign(this.model, values);
            //时间格式化
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