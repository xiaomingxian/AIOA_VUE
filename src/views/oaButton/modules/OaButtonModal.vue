<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading" style="height: 400px; width:100%;overflow: auto">
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
          <!--label="页面按钮id">-->
          <!--<a-input placeholder="请输入页面按钮id" v-decorator="['sbtnId', {}]" />-->
        <!--</a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="按钮名称">
          <a-input  maxLength="50" placeholder="请输入按钮名称" v-decorator="['sbtnName', {rules: [{ required: true, message: '请输入按钮名称' }]}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="方法名">
          <a-input  maxLength="20" placeholder="请输入方法名" v-decorator="['sbtnValue', {rules: [{ required: true, message: '请输入方法名' }]}]" />
        </a-form-item>
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="互斥按钮">-->
          <!--<a-select placeholder="请选择互斥按钮"-->
                    <!--:disabled="disableSubmit"-->
                    <!--v-model="sexcbuttonId"-->
                    <!--@change="getButtonId">-->
            <!--<a-select-option  v-for="(oaButton,index) in buttonList" :key="index" :value="oaButton.iid" >-->
              <!--{{oaButton.sbtnName}}</a-select-option>-->
          <!--</a-select>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="关联字段">
          <a-input maxLength="16" placeholder="请输入匹配字段（状态）" v-decorator="['sexcfield', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="适用范围">
          <a-input  placeholder="请输入适用的具体业务" v-decorator="['sexcbuttonId', {rules: [{ required: true, message: '请输入使用范围' }]}] " />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否刷新页面">
          <a-radio-group @change="iisRefreshChange" v-model="iisRefresh">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="校验业务操作">
          <a-radio-group @change="iisCheckbusChange" v-model="iisCheckbus">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="多次点击">
          <a-radio-group  @change="onChange2" v-model="iisDefend">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          <!--<a-switch v-decorator="['iisDefend', {}]">-->
          <!--</a-switch>-->
          <!--<a-switch @change="onChange2" checked-children="是" v-model="iisDefend"-->
                    <!--un-checked-children="否"></a-switch>-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="基础按钮">
          <a-radio-group @change="onChange3" v-model="iisBase">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="0">否</a-radio>
          </a-radio-group>
          <!--<a-switch v-decorator="['iisDefend', {}]">-->
          <!--</a-switch>-->
          <!--<a-switch @change="onChange3" checked-children="是" v-model="iisBase"-->
                    <!--un-checked-children="否"></a-switch>-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="操作ntko控件">
          <!--<a-input placeholder="请输入是否操作ntko控件" v-decorator="['iisNtko', {}]" />-->
          <a-radio-group @change="iisNtkoChange" v-model="iisNtko" >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-show="isNtko">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko打印">
            <a-radio-group @change="iisPrintChange" v-model="iisPrint">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko打印预览">
            <a-radio-group @change="iisPrintpreviewChange" v-model="iisPrintpreview">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko另存">
            <a-radio-group @change="iisSaveasChange" v-model="iisSaveas">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko保存">
            <a-radio-group @change="iisSaveChange" v-model="iisSave">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko新建">
            <a-radio-group @change="iisNewChange" v-model="iisNew">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko禁止文件菜单的关闭项">
            <a-radio-group @change="iisCloseChange" v-model="iisClose">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko打开">
            <a-radio-group @change="iisOpenChange" v-model="iisOpen">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko编辑">
            <a-radio-group @change="iisEditChange" v-model="iisEdit">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko拷贝">
            <a-radio-group @change="iisCopyChange" v-model="iisCopy">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="ntko保存痕迹">
            <a-radio-group @change="iisSaverevisionChange" v-model="iisSaverevision">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="允许ntko显示痕迹">
            <a-radio-group @change="iisShowrevisionChange" v-model="iisShowrevision">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="ntko套打">
            <a-radio-group  @change="iisAddreadChange" v-model="iisAddread">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>

        </div>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "OaButtonModal",
    data () {
      return {
        title:"操作",
        visible: false,
        isNtko: false,
        getdata:null,
        sexcbuttonId:'',
        buttonList:[],
        //-----------开关--初始赋值-----------------
        iisDefend: false,
        iisBase:false,
        iisRefresh:0,
        iisCheckbus: 0,
        iisNtko: 0,
        iisPrint: 0,
        iisPrintpreview:0,
        iisSaveas:0,
        iisSave:0,
        iisNew:0,
        iisClose: 0,
        iisOpen:0,
        iisEdit:0,
        iisCopy:0,
        iisSaverevision:0,
        iisShowrevision:0,
        iisAddread:0,
        //-------------------------------------
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
          add: "/oabutton/oaButton/add",
          edit: "/oabutton/oaButton/edit",
          buttonList: "/oabutton/oaButton/buttonList"
        },
      }
    },
    created () {

    },
    methods: {
      add () {
        this.iisRefresh = 0;
        this.iisCheckbus = 0;
        this.iIsDefend = 0;
        this.iisNtko = 0;
        this.iisPrint = 0;
        this.iisPrintpreview = 0;
        this.iisSaveas = 0;
        this.iisSave = 0;
        this.iisNew = 0;
        this.iisClose = 0;
        this.iisOpen = 0;
        this.iisEdit = 0;
        this.iisCopy = 0;
        this.iisSaverevision = 0;
        this.iisShowrevision = 0;
        this.iisAddread = 0;

        getAction(this.url.buttonList).then(res => {
          this.buttonList = res.result ;
        }) ;
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        console.log(record);
        if (this.model.iisNtko==1){
          this.isNtko=true;
        }else {
          this.isNtko=false;
        }
        getAction(this.url.buttonList).then(res => {
          this.buttonList = res.result ;
        });
        //-------------------开关---------------
        if (this.model!=null && this.model.iid!=undefined){
          console.log("6666666666666666666");
          this.iisRefresh = this.model.iisRefresh;
          this.iisCheckbus = this.model.iisCheckbus;
          this.iIsDefend = this.model.iIsDefend;
          this.iisNtko = this.model.iisNtko;
          this.iisPrint = this.model.iisPrint;
          this.iisPrintpreview = this.model.iisPrintpreview;
          this.iisSaveas = this.model.iisSaveas;
          this.iisSave = this.model.iisSave;
          this.iisNew = this.model.iisNew;
          this.iisClose = this.model.iisClose;
          this.iisOpen = this.model.iisOpen;
          this.iisEdit = this.model.iisEdit;
          this.iisCopy = this.model.iisCopy;
          this.iisSaverevision = this.model.iisSaverevision;
          this.iisShowrevision = this.model.iisShowrevision;
          this.iisAddread = this.model.iisAddread;
        }

        // console.log(record);

        //--------------------------------------------
       // 动态展示页面字段
        //--------------------------------------------
        this.visible = true;
        if (this.model.iisDefend==true){
          this.iisDefend=1;
        } else {
          this.iisDefend=0;
        }
        if (this.model.iisBase==true){
          this.iisBase=1;
        } else {
          this.iisBase=0;
        }

        this.sexcbuttonId=this.model.sexcbuttonId;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','sbtnId','sbtnName','sbtnValue','sexcbuttonId','sexcfield','iisRefresh','iisCheckbus','iisDefend','iisNtko','iisPrint','iisPrintpreview','iisSaveas','iisSave','iisNew','iisClose','iisOpen','iisEdit','iisCopy','iisSaverevision','iisShowrevision','iisAddread','iisBase'))
		  //时间格式化
        });
        console.log(this.model);
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },

      getButtonId(){//按钮改变-赋值
        this.model.sexcbuttonId=this.sexcbuttonId;
      },
      iisCloseChange () {
          this.model.iisClose = this.iisClose;
        },
      iisRefreshChange() {
        console.log("777777777777777777777777");
        console.log(this.iisRefresh);
        this.model.iisRefresh= this.iisRefresh;
      },
      onChange2 (checked) {
        if(checked.target.value==1){
          this.model.iisDefend = true;
        }else{
          this.model.iisDefend = false;
        }},
      onChange3 (checked) {
        // console.log("777777777777777777777777");
        // console.log(checked);
        if(checked.target.value==1){
          this.model.iisBase = true;
        }else{
          this.model.iisBase = false;
        }
        },
      iisNtkoChange(){
        this.model.iisNtko=this.iisNtko;
        if (this.iisNtko==1) {
          this.isNtko=true;
        }else {
          this.isNtko=false;
        }
      },
      iisAddreadChange(){
        this.model.iisAddread=this.iisAddread;
      },
      iisShowrevisionChange(){
        this.model.iisShowrevision=this.iisShowrevision;
      },
      iisSaverevisionChange(){
        this.model.iisSaverevision=this.iisSaverevision;
      },
      iisCopyChange(){
        this.model.iisCopy=this.iisCopy;
      },
      iisEditChange(){
        this.model.iisEdit=this.iisEdit;
      },
      iisOpenChange(){
        this.model.iisOpen=this.iisOpen;
      },
      iisNewChange(){
        this.model.iisNew=this.iisNew;
      },
      iisSaveChange(){
        this.model.iisSave=this.iisSave;
      },
      iisSaveasChange(){
        this.model.iisSaveas=this.iisSaveas;
      },
      iisPrintpreviewChange(){
        this.model.iisPrintpreview=this.iisPrintpreview;
      },
      iisPrintChange(){
        this.model.iisPrint=this.iisPrint;
      },
      iisCheckbusChange(){
        this.model.iisCheckbus=this.iisCheckbus;
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
            
            // console.log(formData)
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