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
          label="主键id">
          <a-input placeholder="请输入主键id" v-decorator="['iId', validatorRules.iId ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务模块id">
          <a-input-number v-decorator="[ 'iBusModelId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务功能id">
          <a-input-number v-decorator="[ 'iBusFunctionId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程实例id">
          <a-input placeholder="请输入流程实例id" v-decorator="['procInstId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主送单位名称">
          <a-input placeholder="请输入主送单位名称" v-decorator="['sMainUnitNames', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="抄送单位名称">
          <a-input placeholder="请输入抄送单位名称" v-decorator="['sCcUnitNames', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="内部发送部门">
          <a-input placeholder="请输入内部发送部门" v-decorator="['sInsideDeptnames', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="抄报单位名称">
          <a-input placeholder="请输入抄报单位名称" v-decorator="['sReportNuitNames', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="会签部门">
          <a-input placeholder="请输入会签部门" v-decorator="['sCrcDeptnames', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标题">
          <a-input placeholder="请输入标题" v-decorator="['sTitle', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="左侧参数（页面头部）">
          <a-input placeholder="请输入左侧参数（页面头部）" v-decorator="['sLeftParameter', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否插入机构">
          <a-input placeholder="请输入是否插入机构" v-decorator="['sUnitName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否插入部门">
          <a-input placeholder="请输入是否插入部门" v-decorator="['sDeptName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="插入参数（修改文头）（页面头部）">
          <a-input placeholder="请输入插入参数（修改文头）（页面头部）" v-decorator="['sMiddleParameter', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="右侧参数（页面头部）">
          <a-input placeholder="请输入右侧参数（页面头部）" v-decorator="['sRightParameter', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="来文字号">
          <a-input placeholder="请输入来文字号" v-decorator="['sReceiveNum', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文件字号">
          <a-input placeholder="请输入文件字号" v-decorator="['sFileNum', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否发布">
          <a-input placeholder="请输入是否发布" v-decorator="['iIsRelease', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否办结">
          <a-input placeholder="请输入是否办结" v-decorator="['iIsState', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否封发日期">
          <a-input placeholder="请输入是否封发日期" v-decorator="['iIsSealdate', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否排版">
          <a-input placeholder="请输入是否排版" v-decorator="['iIsTypeset', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否保存办文单">
          <a-input placeholder="请输入是否保存办文单" v-decorator="['iIsApprove', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否归档">
          <a-input placeholder="请输入是否归档" v-decorator="['iIsArchives', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否已送全文检索">
          <a-input placeholder="请输入是否已送全文检索" v-decorator="['iIsEs', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否送公文传输">
          <a-input placeholder="请输入是否送公文传输" v-decorator="['iIsSend', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否为临时文件">
          <a-input placeholder="请输入是否为临时文件" v-decorator="['iIsDisplay', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-input placeholder="请输入备注" v-decorator="['sRemarks', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间-年">
          <a-input-number v-decorator="[ 'iCreateYear', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间-月">
          <a-input-number v-decorator="[ 'iCreateMonth', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间-日期">
          <a-input-number v-decorator="[ 'iCreateDay', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建者姓名">
          <a-input placeholder="请输入创建者姓名" v-decorator="['sCreateName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建者id">
          <a-input placeholder="请输入创建者id" v-decorator="['sCreateBy', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建部门名称">
          <a-input placeholder="请输入创建部门名称" v-decorator="['sCreateDept', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dCreateTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="修改时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dUpdateTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="iBigint1">
          <a-input placeholder="请输入iBigint1" v-decorator="['iBigint1', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="iBigint2">
          <a-input placeholder="请输入iBigint2" v-decorator="['iBigint2', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="iBigint3">
          <a-input placeholder="请输入iBigint3" v-decorator="['iBigint3', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="iBigint4">
          <a-input placeholder="请输入iBigint4" v-decorator="['iBigint4', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dDatetime1">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dDatetime1', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dDatetime2">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dDatetime2', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dDatetime3">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dDatetime3', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dDatetime4">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dDatetime4', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dDatetime5">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dDatetime5', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="dDatetime6">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dDatetime6', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar1">
          <a-input placeholder="请输入sVarchar1" v-decorator="['sVarchar1', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar2">
          <a-input placeholder="请输入sVarchar2" v-decorator="['sVarchar2', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar3">
          <a-input placeholder="请输入sVarchar3" v-decorator="['sVarchar3', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar4">
          <a-input placeholder="请输入sVarchar4" v-decorator="['sVarchar4', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar5">
          <a-input placeholder="请输入sVarchar5" v-decorator="['sVarchar5', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar6">
          <a-input placeholder="请输入sVarchar6" v-decorator="['sVarchar6', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar7">
          <a-input placeholder="请输入sVarchar7" v-decorator="['sVarchar7', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar8">
          <a-input placeholder="请输入sVarchar8" v-decorator="['sVarchar8', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar9">
          <a-input placeholder="请输入sVarchar9" v-decorator="['sVarchar9', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar10">
          <a-input placeholder="请输入sVarchar10" v-decorator="['sVarchar10', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar11">
          <a-input placeholder="请输入sVarchar11" v-decorator="['sVarchar11', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar12">
          <a-input placeholder="请输入sVarchar12" v-decorator="['sVarchar12', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar13">
          <a-input placeholder="请输入sVarchar13" v-decorator="['sVarchar13', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar14">
          <a-input placeholder="请输入sVarchar14" v-decorator="['sVarchar14', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar15">
          <a-input placeholder="请输入sVarchar15" v-decorator="['sVarchar15', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar16">
          <a-input placeholder="请输入sVarchar16" v-decorator="['sVarchar16', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar17">
          <a-input placeholder="请输入sVarchar17" v-decorator="['sVarchar17', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar18">
          <a-input placeholder="请输入sVarchar18" v-decorator="['sVarchar18', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar19">
          <a-input placeholder="请输入sVarchar19" v-decorator="['sVarchar19', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="sVarchar20">
          <a-input placeholder="请输入sVarchar20" v-decorator="['sVarchar20', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否">
          <a-input placeholder="请输入是否" v-decorator="['iIs1', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否">
          <a-input placeholder="请输入是否" v-decorator="['iIs2', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否">
          <a-input placeholder="请输入是否" v-decorator="['iIs3', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否">
          <a-input placeholder="请输入是否" v-decorator="['iIs4', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否">
          <a-input placeholder="请输入是否" v-decorator="['iIs5', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "oaBusdataModal",
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
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oaBus/oaBusdata/add",
          edit: "/oaBus/oaBusdata/edit",
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
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iId','iBusModelId','iBusFunctionId','procInstId','sMainUnitNames','sCcUnitNames','sInsideDeptnames','sReportNuitNames','sCrcDeptnames','sTitle','sLeftParameter','sUnitName','sDeptName','sMiddleParameter','sRightParameter','sReceiveNum','sFileNum','iIsRelease','iIsState','iIsSealdate','iIsTypeset','iIsApprove','iIsArchives','iIsEs','iIsSend','iIsDisplay','sRemarks','iCreateYear','iCreateMonth','iCreateDay','sCreateName','sCreateBy','sCreateDept','iBigint1','iBigint2','iBigint3','iBigint4','sVarchar1','sVarchar2','sVarchar3','sVarchar4','sVarchar5','sVarchar6','sVarchar7','sVarchar8','sVarchar9','sVarchar10','sVarchar11','sVarchar12','sVarchar13','sVarchar14','sVarchar15','sVarchar16','sVarchar17','sVarchar18','sVarchar19','sVarchar20','iIs1','iIs2','iIs3','iIs4','iIs5'))
		  //时间格式化
          this.form.setFieldsValue({dCreateTime:this.model.dCreateTime?moment(this.model.dCreateTime):null})
          this.form.setFieldsValue({dUpdateTime:this.model.dUpdateTime?moment(this.model.dUpdateTime):null})
          this.form.setFieldsValue({dDatetime1:this.model.dDatetime1?moment(this.model.dDatetime1):null})
          this.form.setFieldsValue({dDatetime2:this.model.dDatetime2?moment(this.model.dDatetime2):null})
          this.form.setFieldsValue({dDatetime3:this.model.dDatetime3?moment(this.model.dDatetime3):null})
          this.form.setFieldsValue({dDatetime4:this.model.dDatetime4?moment(this.model.dDatetime4):null})
          this.form.setFieldsValue({dDatetime5:this.model.dDatetime5?moment(this.model.dDatetime5):null})
          this.form.setFieldsValue({dDatetime6:this.model.dDatetime6?moment(this.model.dDatetime6):null})
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
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.dCreateTime = formData.dCreateTime?formData.dCreateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dUpdateTime = formData.dUpdateTime?formData.dUpdateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dDatetime1 = formData.dDatetime1?formData.dDatetime1.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dDatetime2 = formData.dDatetime2?formData.dDatetime2.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dDatetime3 = formData.dDatetime3?formData.dDatetime3.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dDatetime4 = formData.dDatetime4?formData.dDatetime4.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dDatetime5 = formData.dDatetime5?formData.dDatetime5.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dDatetime6 = formData.dDatetime6?formData.dDatetime6.format('YYYY-MM-DD HH:mm:ss'):null;
            
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