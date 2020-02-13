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
          label="步骤序号">
          <a-input :placeholder="findMax" ref="indexStep" v-decorator="['iorder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务模块">
          <a-select  v-decorator="['ibusModelId', {}]"   @change="getModelVal" placeholder="请选业务模块">
            <a-select-option v-for="(item,index) in modelList" :key="index" :value="item.modelid">{{item.modelSName}}
            </a-select-option>
          </a-select>

        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务功能">
        <!--  <a-select v-decorator="[ 'ibusFunctionId', {}]">
            <a-select-option v-for="(item,index) in selectList" :key="index" :value="item.iid">{{item.functionSName}}
            </a-select-option>
          </a-select> -->
          <a-select v-decorator="[ 'ibusFunctionId', {}]"   @change="selectTaskDetail" placeholder="请选业务详情">
            <a-select-option v-for="item2 in selectList" :value="item2.functionid">{{item2.functionSName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-input placeholder="请输入描述" v-decorator="['description', {}]" />
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
    name: "oaTeamworkSetModal",
    data () {
      return {
        title:"操作",
        visible: false,
        modelList: [],
        selectList: [],
        busModelId:'',
        modelId:'',
        findMax:'',
        functionId:'',
        num:'',
        model: {
          // iteamworkId:'',
          // steamworkName:'',
          // iversion:'',
        },
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
          add: "/oateamwork/oaTeamworkSet/add",
          edit: "/oateamwork/oaTeamworkSet/edit",
          findMax: "/oateamwork/oaTeamworkSet/findMax",
          selectTaskType: '/oaBus/newTask/findModelPermit1',
          selectTaskDetail: '/oaBus/newTask/findFunctionPermit',

        },

        //用来判断弹框是用来新增或是编辑两种状态
        isadd:false,

      }
    },
    created() {
       this.getBusModelSelectList();
    },
    methods: {
      add1(iteamworkId,steamworkName,iversion) {
        this.isadd = true;
        this.model.iteamworkId = iteamworkId;
        this.model.iversion = Number(iversion);
        this.visible = true
        this.title = steamworkName;
        this.form.resetFields();
        //this.model = Object.assign({}, record2);
        getAction(this.url.findMax,{TeamworkId:iteamworkId}).then((res)=>{
          this.num = res.result+1;
          if(res.result != null) {
            this.findMax = "不要小于" + (res.result) + "这个数.建议您填写:" + (res.result + 1);
          }else{
            //alert( res.result)
            this.findMax = "请输入序号";
          }

          console.log(this.findMax)
        })
      },
      add () {
        this.edit({});
      },
      edit1 (record) {
        console.log(record);


        //业务模块
        this.getBusModelSelectList();
        //业务功能

        getAction(this.url.selectTaskDetail,{modelId:record.ibusModelId}).then((res)=>{
          this.selectList = res.result;

        }).then(()=>{
          this.isadd = false;
          this.form.resetFields();
          this.model = Object.assign({}, record);
          this.visible = true;
          this.$nextTick(()=>{
            this.form.setFieldsValue(pick(this.model,'description','ibusModelId','ibusFunctionId','iorder'))
            this.form.setFieldsValue({ibusModelId:String(this.model.ibusModelId),ibusFunctionId:String(this.model.ibusFunctionId)})
          })
        })





      },
      selectTaskDetail(){

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

       /* let url = "/papertitle/docNumSet/busFunctionList?ibusModelId="+value;*/
        value = value.toString();
        getAction(this.url.selectTaskDetail,{modelId:value}).then((res)=>{
          this.selectList = res.result;
        })

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        if(this.$refs.indexStep.value<this.num){
          this.$message.warning(this.findMax);
          return ;
        }
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            console.log(this.isadd)
            let httpurl = '';
            let method = '';
            if (this.isadd) {
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            /*formData.dCreateTime = formData.dCreateTime?formData.dCreateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dUpdateTime = formData.dUpdateTime?formData.dUpdateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            */

      console.log(formData)
      httpAction(httpurl,formData,method).then((res)=>{
      if(res.success){
        that.$message.success(res.message);
        //告诉父级组件我已关闭  关闭后刷新父级列表
        that.$emit('submit',true);
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