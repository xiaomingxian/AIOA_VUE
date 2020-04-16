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
          label="业务分类">
          <a-select  v-decorator="[ 'iteamworkId', {}]" @change="getVal">
            <a-select-option v-for="(item,index) in teamworkList" :key="index" :value="item.iid">{{item.steamworkName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务配置">
          <a-select  v-decorator="[ 'iteamworkSetId', {}]"  >
            <a-select-option v-for="(item,index) in teamworkSetList" :key="index" :value="item.iid">{{item.iid}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="步骤序号">
          <a-select  v-decorator="['iorder', {rules:[{required:true,message:'步骤序号必须输入！！！'},{ min: 1, max: 10, message: '步骤序号长度不能超过10位', trigger: 'blur' },{pattern: new RegExp(/^[1-9]\d*$/), message: '请输入数字！'},]}]">
            <a-select-option v-for="(item,index) in teamworkSetList" :key="index" :value="item.iid">{{item.iorder}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务模块">
          <a-select  v-decorator="[ 'ibusModelId',{rules:[{required:true,message:'业务模块必须选择！！！'}]}]" @change="getModelVal">
            <a-select-option v-for="(item,index) in modelList" :key="index" :value="item.modelid">{{item.modelSName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务功能">
          <a-select v-decorator="[ 'ibusFunctionId', {rules:[{required:true,message:'业务功能必须选择！！！'}]}]">
            <a-select-option v-for="(item,index) in selectList" :key="index" :value="item.functionid">{{item.functionSName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction,postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "oaTeamworkInstModal",
    data () {
      return {
        title:"操作",
        visible: false,
        modelList: [],
        selectList: [],
        teamworkList: [],
        teamworkSetList:[],
        busModelId:'',
        modelId:'',
        functionId:'',
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
          add: "/oaTea/oaTeamworkInst/add",
          edit: "/oaTea/oaTeamworkInst/edit",
          selectTaskType: '/oaBus/newTask/findModelPermit1',
          selectTaskDetail: '/oaBus/newTask/findFunctionPermit',
        },
      }
    },
    created() {
      this.getBusModelSelectList();
      this.getTeamWorkList();
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
          this.form.setFieldsValue(pick(this.model,'iId','iteamworkId','iteamworkSetId','iorder','ibusModelId','ibusFunctionId','iversion'))
		  //时间格式化
        });

      },
      //获取选值    所属模块value   此value值时所属业务的方法的基本参数
      getModelVal(e){
        //获取对应业务列表  所需的模块儿id*/
        // this.selectList = '';
        this.busModelId = e;
        this.getFunctionList(e);
        this.form.setFieldsValue({ibusFunctionId:''})

      },
      getBusModelSelectList(){

        getAction(this.url.selectTaskType, {}).then((res) => {
          this.modelList=res.result;
        });
      },
      // 所属业务模块数据  参数依赖于所属模块 所选id
      getFunctionList(value){
        let url = "/papertitle/docNumSet/busFunctionList?ibusModelId="+value;
        value = value.toString();
        getAction(this.url.selectTaskDetail,{modelId:value}).then((res)=>{
          this.selectList = res.result;
        })

      },
      getVal(e){
        console.log(e);
        this.getTeamWorkSetList(e);
      },
      getTeamWorkList(){
        let url = "/oateamwork/oaTeamwork/findTeamworkName";
        getAction(url, {}).then((res) => {
          this.teamworkList=res.result;
        });
      },
      getTeamWorkSetList(value){
        let url = "/oateamwork/oaTeamworkSet/findTeamworkSet?iTeamworkId="+value;
        getAction(url).then((res)=>{
          this.teamworkSetList = res.result;
        })

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