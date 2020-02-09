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
          label="iId">
          <a-input-number v-decorator="[ 'iid', validatorRules.iid ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户id">
          <a-input-number v-decorator="[ 'suserId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否AI阅读">
          <a-radio-group v-model="value" v-decorator="['iisAi', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="待办工作是否即时消息提醒">
          <a-radio-group v-model="value" v-decorator="['iisMessages', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否折叠展示数据">
          <a-radio-group v-model="value" v-decorator="['iisFold', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否默认首页风格是日程办公">
          <a-radio-group v-model="value" v-decorator="['iisCalendar', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="首页区域1对应业务模块">
          <a-select v-model="selectedModel" v-decorator="[ 'ibus1Id', {}]">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="首页区域2对应业务模块">
          <a-select v-model="selectedModel" v-decorator="[ 'ibus2Id', {}]">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="首页区域3对应业务模块">
          <a-select v-model="selectedModel" v-decorator="[ 'ibus3Id', {}]">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="首页区域4对应业务模块">
          <a-select v-model="selectedModel" v-decorator="[ 'ibus4Id', {}]">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import AFormItem from "ant-design-vue/es/form/FormItem";

  export default {
    name: "SysUserSetModal",
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

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入iId!' }]},
        },
        url: {
          add: "/testt/sysUserSet/add",
          edit: "/testt/sysUserSet/edit",
        },
        selectedModel: null,
        modelData: [],
      }
    },
    created () {
      this.getBusModelList();
    }, watch: {
      selectedModel: 'getBusModelList'
    },
    methods: {
      //下拉选列表-所属模块
      getBusModelList() {
        let url = "/papertitle/docNumSet/busModelList";
        getAction(url).then((res) => {
          console.log(res.result);
          this.modelData = res.result;
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
          this.form.setFieldsValue(pick(this.model,'iid','suserId','iisAi','iisMessages','iisFold','iisCalendar','ibus1Id','ibus2Id','ibus3Id','ibus4Id'))
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