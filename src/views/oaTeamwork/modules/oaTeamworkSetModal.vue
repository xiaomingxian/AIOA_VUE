<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    style=" position: relative;"
  >
    
    <a-spin :spinning="confirmLoading">
      <div style="width: 700px;margin: 30px auto">
        <a-form :form="form">
          <div >
            <p style=" font-size: 18px;font-weight: bold;margin-left: 30px;">步骤序号：</p>
            <div style="width: 80%;margin: 0 auto">
              <a-form-item
                style="display: flex;align-items: center;justify-content: flex-start"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="步骤序号">
                <a-input style="width: 350px" :placeholder="findMax" ref="indexStep" v-decorator="['iorder', validatorRules.iorder]" />
              </a-form-item>
            </div>

          </div>


          <div>
            <p style="font-size: 18px;font-weight: bold;margin-left: 30px;">配置：</p>
            <div style="width: 80%;margin: 0 auto">
              <a-form-item
                style="display: flex;align-items: center;justify-content: flex-start"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="业务模块">
                <a-select style="width: 350px"   v-decorator="['ibusModelId', validatorRules.ibusModelId]"   @change="getModelVal" placeholder="请选业务模块">
                  <a-select-option v-for="(item,index) in modelList" :key="index" :value="item.modelid">{{item.modelSName}}
                  </a-select-option>
                </a-select>

              </a-form-item>
              <a-form-item
                style="display: flex;align-items: center;justify-content: flex-start"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="业务功能">
                <!--  <a-select v-decorator="[ 'ibusFunctionId', {}]">
                    <a-select-option v-for="(item,index) in selectList" :key="index" :value="item.iid">{{item.functionSName}}
                    </a-select-option>
                  </a-select> -->
                <a-select style="width: 350px"  v-decorator="[ 'ibusFunctionId', validatorRules.ibusFunctionId]"   @change="selectTaskDetail" placeholder="请选业务详情">
                  <a-select-option v-for="item2 in selectList" :value="item2.functionid">{{item2.functionSName}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                style="display: flex;align-items: center;justify-content: flex-start"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                label="业务描述">
                <a-input style="width: 350px"  placeholder="请输入描述" v-decorator="['description', validatorRules.description]" />
              </a-form-item>
            </div>
          </div>


        </a-form>

      </div>
    </a-spin>


    <!--loading-->
    <div class="exaple" v-show="loading">
      <a-spin></a-spin>
    </div>
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
        loading:false,// 加载状态
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
        ibusModelId:{rules: [{ required: true, message: '必须选择业务模块!' }]},
        ibusFunctionId:{rules: [{ required: true, message: '必须选择业务功能!' }]},
        iorder:{rules:[{required:true,message:'步骤序号必须输入！！！'},{ min: 0, max: 11, message: '长度在 0 到 11 个字符', trigger: 'blur' },{pattern: new RegExp(/^[1-9]\d*$/), message: '请输入数字！'},]},
        description:{rules:[{required:true,message:'描述必须输入！！！'},{ min: 0, max: 255, message: '长度在 0 到 255 个字符', trigger: 'blur' }]},
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
        this.findmax(iteamworkId);
      },
      add () {
        this.edit({});
      },
      findmax(iteamworkId)
      {
        getAction(this.url.findMax,{TeamworkId: iteamworkId}).then((res)=>{
          this.num = res.result+1;
          if(res.result != null) {
            this.findMax = "不要小于" + (res.result) + "这个数.建议您填写:" + (res.result + 1);
          }


        })
      } ,
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
        this.selectList = '';
        this.busModelId = e;
        this.getFunctionList(e);
        this.form.setFieldsValue({ibusFunctionId:''})

        this.loading = true;
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

          this.loading = false;
        })

      },
      close () {
        this.$emit('close');
        this.form.resetFields();
        this.selectList=[];
        this.visible = false;

      },
      handleOk () {
        const that = this;
        // if(this.$refs.indexStep.value<this.num){
        //   this.$message.warning(this.findMax);
        //   return ;
        // }
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
      this.form.validate();
      //this.selectList=[];
      that.close();
      })
      }
      })

      },
      handleCancel () {
        this.close()
        this.form.resetFields();
        this.selectList=[];
      },


    }
  }
</script>

<style lang="less" scoped>
  .exaple{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,.7);
    opacity: .8;
    /*text-align: center;*/
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>