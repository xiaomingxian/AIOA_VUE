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
          label="稿纸头">
          <a-input placeholder="" v-decorator="['stitleName', validatorRules.stitleName]" />
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
          <a-input placeholder="" v-decorator="['sleftParameter', validatorRules.sleftParameter]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="中部">
          <a-input placeholder="" v-decorator="['smddleParameter', validatorRules.smddleParameter]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="后缀">
          <a-input placeholder="" v-decorator="['srightParameter', validatorRules.srightParameter]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="固定参数">
          <a-textarea rows="3" placeholder="" v-decorator="['sotherParameter', validatorRules.sotherParameter]" />
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
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "PaperTitleSettingModal",
    components: {ATextarea},
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
          stitleName:{rules: [
              { required: true, message: '请输入红头名称！' },
              { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
            ]},
          sleftParameter:{rules: [
              { min: 1, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur'}
            ]},
          smddleParameter:{rules: [
              { min: 1, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur'}
            ]},
          srightParameter:{rules: [
              { min: 1, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur'}
            ]},
          sotherParameter:{rules: [
              { min: 1, max: 255, message: '长度在 0 到 255 个字符', trigger: 'blur'}
            ]},
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
      add () {
        let  record = {}
        record.iisUnit = 0
        record.iisDept = 0
        record.iisDefault =0
        this.edit(record);
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','stitleName','iisUnit','iisDept','sleftParameter','smddleParameter','srightParameter','sotherParameter','iisDefault','screateBy','supdateBy'))
		  //时间格式化
      //     this.form.setFieldsValue({dCreateTime:this.model.dCreateTime?moment(this.model.dCreateTime):null})
      //     this.form.setFieldsValue({dUpdateTime:this.model.dUpdateTime?moment(this.model.dUpdateTime):null})
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
            // formData.dCreateTime = formData.dCreateTime?formData.dCreateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dUpdateTime = formData.dUpdateTime?formData.dUpdateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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